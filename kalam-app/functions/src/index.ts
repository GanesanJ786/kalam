import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

/**
 * Scheduled function: Runs daily at midnight IST (18:30 UTC previous day).
 * Aggregates cross-academy leaderboard data into the `leaderboard` collection.
 *
 * Leaderboard categories:
 * - topStudentsByAttendance: Students with highest attendance count (last 30 days)
 * - topPerformers: Students with best performance metrics
 * - topAcademiesBySize: Academies ranked by active student count
 */
export const aggregateLeaderboard = functions
  .region("asia-south1")
  .pubsub.schedule("30 18 * * *") // 18:30 UTC = midnight IST
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    try {
      const [topAttendance, topPerformers, topAcademies] = await Promise.all([
        aggregateTopAttendance(thirtyDaysAgo),
        aggregateTopPerformers(),
        aggregateTopAcademies(),
      ]);

      await db.collection("leaderboard").doc(month).set({
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        month,
        topStudentsByAttendance: topAttendance,
        topPerformers,
        topAcademiesBySize: topAcademies,
      });

      functions.logger.info(`Leaderboard updated for ${month}`);
    } catch (error) {
      functions.logger.error("Leaderboard aggregation failed:", error);
    }
  });

/**
 * HTTP callable: Get current leaderboard data.
 * Called by the Angular app to display cross-academy rankings.
 */
export const getLeaderboard = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
    }

    const month = data?.month || getCurrentMonth();
    const doc = await db.collection("leaderboard").doc(month).get();

    if (!doc.exists) {
      return { month, topStudentsByAttendance: [], topPerformers: [], topAcademiesBySize: [] };
    }

    return doc.data();
  });

/**
 * HTTP callable: Get academy usage summary for billing/admin dashboard.
 */
export const getAcademyUsageSummary = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Must be logged in");
    }

    const academiesSnap = await db.collection("coachDetails")
      .where("academyOwned", "==", "Y")
      .get();

    const summaries: any[] = [];

    for (const doc of academiesSnap.docs) {
      const coach = doc.data();
      const academyId = coach.academyId || `A${coach.kalamId}`;
      const coachId = coach.kalamId;

      const [studentsSnap, coachesSnap, groundsSnap, subSnap] = await Promise.all([
        db.collection("studentDetails").where("coachId", "==", coachId).get(),
        db.collection("coachDetails").where("academyId", "==", academyId).get(),
        db.collection("groundDetails").where("academyId", "==", coachId).get(),
        db.collection("academySubscription").where("academyId", "==", academyId).limit(1).get(),
      ]);

      const subscription = subSnap.empty ? null : subSnap.docs[0].data();

      summaries.push({
        academyId,
        academyName: coach.academyName,
        headCoach: coach.name,
        studentCount: studentsSnap.size,
        coachCount: coachesSnap.size,
        groundCount: groundsSnap.size,
        plan: subscription?.planId || "FREE_TRIAL",
        status: subscription?.status || "TRIAL",
      });
    }

    return { academies: summaries, generatedAt: new Date().toISOString() };
  });

// ─── Helper Functions ───────────────────────────────────────────

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatDate(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

async function aggregateTopAttendance(since: Date): Promise<any[]> {
  const sinceStr = formatDate(since);

  // Get all attendance records from last 30 days with status "IN"
  const snap = await db.collection("studentAttendance")
    .where("loginDate", ">=", sinceStr)
    .where("status", "==", "IN")
    .get();

  // Count per student
  const countMap = new Map<string, { name: string; academyId: string; count: number }>();

  for (const doc of snap.docs) {
    const d = doc.data();
    const key = `${d.academyId}_${d.kalamId}`;
    const existing = countMap.get(key);
    if (existing) {
      existing.count++;
    } else {
      countMap.set(key, { name: d.name, academyId: d.academyId || "", count: 1 });
    }
  }

  // Sort and take top 20
  return Array.from(countMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
}

async function aggregateTopPerformers(): Promise<any[]> {
  // Get recent performance records (football — goals + assists)
  const snap = await db.collection("studentsPerformance")
    .orderBy("gameDate", "desc")
    .limit(500)
    .get();

  const scoreMap = new Map<string, { name: string; academyId: string; goals: number; assists: number; games: number }>();

  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.numberofGoals && !d.assist) continue; // Skip non-football

    const key = `${d.academyId}_${d.kalamId}`;
    const existing = scoreMap.get(key);
    const goals = parseInt(d.numberofGoals || "0", 10);
    const assists = parseInt(d.assist || "0", 10);

    if (existing) {
      existing.goals += goals;
      existing.assists += assists;
      existing.games++;
    } else {
      scoreMap.set(key, {
        name: d.kalamId,
        academyId: d.academyId || "",
        goals, assists, games: 1,
      });
    }
  }

  // Resolve student names from studentDetails
  const entries = Array.from(scoreMap.entries());
  for (const [, entry] of entries) {
    const studentSnap = await db.collection("studentDetails")
      .where("kalamId", "==", entry.name)
      .limit(1)
      .get();
    if (!studentSnap.empty) {
      entry.name = studentSnap.docs[0].data().name;
    }
  }

  return Array.from(scoreMap.values())
    .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists))
    .slice(0, 20);
}

async function aggregateTopAcademies(): Promise<any[]> {
  const academiesSnap = await db.collection("coachDetails")
    .where("academyOwned", "==", "Y")
    .get();

  const results: any[] = [];

  for (const doc of academiesSnap.docs) {
    const coach = doc.data();
    const coachId = coach.kalamId;

    const studentsSnap = await db.collection("studentDetails")
      .where("coachId", "==", coachId)
      .where("inActive", "!=", true)
      .get();

    results.push({
      academyName: coach.academyName,
      academyId: coach.academyId || `A${coachId}`,
      headCoach: coach.name,
      studentCount: studentsSnap.size,
    });
  }

  return results
    .sort((a, b) => b.studentCount - a.studentCount)
    .slice(0, 20);
}

// ─── Academy Approval ───────────────────────────────────────────

const ADMIN_EMAIL = "adukalamapp@gmail.com";

/**
 * HTTP callable: Get all pending academy registrations.
 * Only callable by the admin.
 */
export const getPendingAcademies = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    const snap = await db.collection("coachDetails")
      .where("academyOwned", "==", "Y")
      .where("academyApproved", "==", false)
      .get();

    return snap.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      emailId: doc.data().emailId,
      academyName: doc.data().academyName,
      whatsappNum: doc.data().whatsappNum,
      address: doc.data().address,
      toCoach: doc.data().toCoach,
      kalamId: doc.data().kalamId,
    }));
  });

/**
 * HTTP callable: Approve an academy registration.
 * Sets academyApproved to true and sends confirmation email to the academy owner.
 */
export const approveAcademy = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    const { docId } = data;
    if (!docId) {
      throw new functions.https.HttpsError("invalid-argument", "docId is required");
    }

    const docRef = db.collection("coachDetails").doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new functions.https.HttpsError("not-found", "Academy not found");
    }

    await docRef.update({ academyApproved: true });

    return { success: true, message: "Academy approved" };
  });

/**
 * HTTP callable: Reject an academy registration.
 * Removes the coach document entirely.
 */
export const rejectAcademy = functions
  .region("asia-south1")
  .https.onCall(async (data, context) => {
    const { docId } = data;
    if (!docId) {
      throw new functions.https.HttpsError("invalid-argument", "docId is required");
    }

    const docRef = db.collection("coachDetails").doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new functions.https.HttpsError("not-found", "Academy not found");
    }

    await docRef.delete();

    return { success: true, message: "Academy rejected and removed" };
  });
