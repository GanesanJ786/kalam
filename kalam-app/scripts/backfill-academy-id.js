/**
 * Kalam Academy - academyId Backfill Script
 * 
 * Purpose: Adds missing `academyId` to legacy documents in Firestore collections.
 * 
 * What it does:
 * 1. coachDetails: Head coaches (academyOwned === 'Y') missing academyId get "A{kalamId}"
 * 2. studentDetails: Students missing academyId get it derived from their linked coach
 * 3. studentsPerformance: Performance records missing academyId get it derived from their linked coach
 * 
 * Collections already consistently using academyId (no backfill needed):
 * - studentAttendance, coachAttendance, groundDetails, coachTasks
 * 
 * Usage:
 *   1. npm install firebase-admin (if not already)
 *   2. Download service account key from Firebase Console → Project Settings → Service Accounts
 *   3. Set GOOGLE_APPLICATION_CREDENTIALS env var or place key at ./service-account-key.json
 *   4. Run: node backfill-academy-id.js [--dry-run]
 * 
 * Options:
 *   --dry-run   Preview changes without writing to Firestore
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS 
  || './service-account-key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'kalam-in'
});

const db = admin.firestore();
const DRY_RUN = process.argv.includes('--dry-run');

if (DRY_RUN) {
  console.log('=== DRY RUN MODE — No changes will be written ===\n');
}

async function backfillCoachDetails() {
  console.log('--- Backfilling coachDetails ---');
  const snapshot = await db.collection('coachDetails').get();
  let updated = 0;
  let skipped = 0;
  const batch = db.batch();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Only backfill head coaches missing academyId
    if (data.academyOwned === 'Y' && !data.academyId && data.kalamId) {
      const academyId = `A${data.kalamId}`;
      console.log(`  [UPDATE] Coach "${data.name}" (${data.kalamId}) → academyId: ${academyId}`);
      if (!DRY_RUN) {
        batch.update(doc.ref, { academyId });
      }
      updated++;
    } else {
      skipped++;
    }
  }

  if (!DRY_RUN && updated > 0) {
    await batch.commit();
  }
  console.log(`  Updated: ${updated}, Skipped: ${skipped}\n`);
  return updated;
}

async function buildCoachAcademyMap() {
  // Build a map of coachKalamId → academyId from coachDetails
  const snapshot = await db.collection('coachDetails').get();
  const map = new Map();
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.kalamId) {
      // For head coaches: academyId = "A{kalamId}" (may have just been backfilled)
      // For sub-coaches: academyId is already set
      const academyId = data.academyId || (data.academyOwned === 'Y' ? `A${data.kalamId}` : null);
      if (academyId) {
        map.set(data.kalamId, academyId);
      }
    }
  }
  
  console.log(`  Built coach→academy map: ${map.size} entries\n`);
  return map;
}

async function backfillStudentDetails(coachMap) {
  console.log('--- Backfilling studentDetails ---');
  const snapshot = await db.collection('studentDetails').get();
  let updated = 0;
  let skipped = 0;
  let noCoach = 0;
  
  // Firestore batch limit is 500
  const BATCH_SIZE = 450;
  let batch = db.batch();
  let batchCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    if (!data.academyId && data.coachId) {
      const academyId = coachMap.get(data.coachId);
      if (academyId) {
        console.log(`  [UPDATE] Student "${data.name}" (coach: ${data.coachId}) → academyId: ${academyId}`);
        if (!DRY_RUN) {
          batch.update(doc.ref, { academyId });
          batchCount++;
          if (batchCount >= BATCH_SIZE) {
            await batch.commit();
            batch = db.batch();
            batchCount = 0;
          }
        }
        updated++;
      } else {
        console.log(`  [SKIP] Student "${data.name}" — coach ${data.coachId} not found in map`);
        noCoach++;
      }
    } else {
      skipped++;
    }
  }

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }
  console.log(`  Updated: ${updated}, Skipped (already has): ${skipped}, No coach match: ${noCoach}\n`);
  return updated;
}

async function backfillStudentsPerformance(coachMap) {
  console.log('--- Backfilling studentsPerformance ---');
  const snapshot = await db.collection('studentsPerformance').get();
  let updated = 0;
  let skipped = 0;
  let noCoach = 0;
  
  const BATCH_SIZE = 450;
  let batch = db.batch();
  let batchCount = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    if (!data.academyId && data.coachId) {
      const academyId = coachMap.get(data.coachId);
      if (academyId) {
        console.log(`  [UPDATE] Performance record (student: ${data.kalamId}, coach: ${data.coachId}) → academyId: ${academyId}`);
        if (!DRY_RUN) {
          batch.update(doc.ref, { academyId });
          batchCount++;
          if (batchCount >= BATCH_SIZE) {
            await batch.commit();
            batch = db.batch();
            batchCount = 0;
          }
        }
        updated++;
      } else {
        console.log(`  [SKIP] Performance record — coach ${data.coachId} not found`);
        noCoach++;
      }
    } else {
      skipped++;
    }
  }

  if (!DRY_RUN && batchCount > 0) {
    await batch.commit();
  }
  console.log(`  Updated: ${updated}, Skipped (already has): ${skipped}, No coach match: ${noCoach}\n`);
  return updated;
}

async function main() {
  console.log('========================================');
  console.log('  Kalam - academyId Backfill Script');
  console.log('========================================\n');

  try {
    // Step 1: Backfill head coaches first (they define the academyId)
    const coachUpdates = await backfillCoachDetails();
    
    // Step 2: Build the coach → academyId lookup map
    const coachMap = await buildCoachAcademyMap();
    
    // Step 3: Backfill students
    const studentUpdates = await backfillStudentDetails(coachMap);
    
    // Step 4: Backfill performance records
    const perfUpdates = await backfillStudentsPerformance(coachMap);

    console.log('========================================');
    console.log('  Summary');
    console.log('========================================');
    console.log(`  Coaches updated:     ${coachUpdates}`);
    console.log(`  Students updated:    ${studentUpdates}`);
    console.log(`  Performance updated: ${perfUpdates}`);
    console.log(`  Total:               ${coachUpdates + studentUpdates + perfUpdates}`);
    if (DRY_RUN) {
      console.log('\n  ⚠ DRY RUN — No actual changes were made.');
      console.log('  Remove --dry-run to apply changes.');
    } else {
      console.log('\n  ✅ All backfill operations completed successfully.');
    }
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Backfill failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();
