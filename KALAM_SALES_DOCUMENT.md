# KALAM
## The Football Academy Management Platform Built for India

---

> *Named after Dr. A.P.J. Abdul Kalam — India's People's President, and a symbol of nurturing the next generation.*

---

## Stop Managing Your Academy on WhatsApp

Today, most football academies in India operate the same way:

- Attendance on paper registers or shared Excel sheets
- Fee reminders on WhatsApp broadcast lists
- Performance notes in coaches' personal notebooks
- No way for the owner to know what is actually happening across their grounds

**The result:** Coaches spend hours every week on administrative work instead of coaching. Owners have no data. Students and parents get inconsistent communication. And as the academy grows, the chaos compounds.

**Kalam fixes this** — replacing scattered tools with a single, purpose-built platform that runs the full operation of a football academy.

---

## What Is Kalam?

Kalam is a **cloud-based football academy management system** that handles:

- Student registration, profiles, and roster management
- Daily student and coach attendance with GPS logging
- Match and training performance tracking
- Monthly fee collection and scholarship management
- Coach hiring, onboarding, and approval workflows
- Multi-ground, multi-coach operations from a single dashboard
- Professional Excel reports at the click of a button

**One platform. Every role. Real-time. From any device.**

---

## Who Uses Kalam

### Academy Owners
Get complete visibility across every ground, every coach, and every student — without making a single phone call. See pending approvals, payment status, and student analytics from your dashboard. Export professional reports to share with stakeholders.

### Head Coaches
Run your roster efficiently. Mark attendance digitally, record session notes, track student progress game by game, and manage scholarship and payment status — all from a smartphone on the ground.

### Assistant Coaches
No more paper forms. Register students, record performance metrics, mark attendance, and log session topics in a structured system that builds a permanent record for every student.

---

## Feature Walkthrough

---

### 🆕 Coach Task Management

**The Problem:** Academy owners and head coaches assign tasks verbally or via WhatsApp — there is no record, no accountability, and no way to track completion.

**Kalam's Solution:** A full task lifecycle built directly into the platform.

**Head Coach / Owner View — Task Manager**
- Create and assign tasks to any approved coach in the academy
- Select coach, add title and description, submit with one tap
- See all assigned tasks with real-time status: **Pending → Acknowledged → Completed**
- Delete pending tasks that are no longer needed
- Stats bar showing live counts of Pending, Acknowledged, and Completed tasks
- Desktop table view and mobile card view — responsive across devices

**Assistant Coach View — My Tasks**
- Receive task notifications in real-time via Firebase
- Active tasks (Pending + Acknowledged) remain visible until explicitly marked as Completed
- **Two-step response flow:** Acknowledge first → Complete when done
- Full task history with completed tasks archived separately
- Every response is timestamped (date + time) for accountability

**Task–Attendance Integration**
Every assigned task is automatically logged as a `TASK` entry in the coach attendance system. When a head coach views coach attendance for a date range, task entries appear alongside regular attendance — with status, response dates, and the ability to open a detailed **Task Dialog** showing all tasks in a filterable, scrollable overlay.

**Task Dialog**
- Opens from the coach attendance view with one tap
- Filterable stats bar: Total / Pending / Completed — click to filter
- Each task card shows title, description, assigned by, assigned date, response date/time
- Color-coded status: Yellow (Pending), Blue (Acknowledged), Green (Completed)
- Left accent bar and status badges for instant visual scanning
- Empty states with contextual messaging per filter
- Fully responsive — works on small phones, landscape orientation, tablets, and desktop

---

### 🆕 Quick Attendance

**The Problem:** Marking attendance one student at a time is tedious, especially when a coach has 20–40 students on the ground.

**Kalam's Solution:** A dedicated bulk attendance screen purpose-built for speed.

- Select a ground → all approved students for that ground load automatically
- Every student defaults to **Present (IN)** — tap to toggle to **Absent (OUT)**
- **Bulk actions:** Mark All Present / Mark All Absent with one button
- **Search:** Filter students by name or Kalam ID in real-time
- **Live stats bar:** Present count, Absent count, Total — updates as you toggle
- **Smart save:** Only unsaved changes are written to Firebase — already-saved records are skipped
- **Edit support:** If attendance was already marked today, existing records load with their saved status and can be updated
- Saves attendance with timestamp, session type (AM/PM), age group, ground, and coach ID
- Snackbar confirmation on save with count of records written

**Result:** A coach can mark attendance for an entire ground of 30 students in under 60 seconds.

---

### Student Management

**Complete Student Profiles**
Every student is registered with a comprehensive profile — personal details, Aadhar ID, emergency contacts, medical conditions, height/weight/jersey size, education information, previous academy experience, and football-specific data (playing position, age group, competency level).

**Age Group Classification**
Students are automatically classified into age categories: U-5, U-8, U-10, U-12, U-14, U-16, U-18, U-21, or Open — keeping rosters organized without manual sorting.

**Competency Levels**
Track development stage per student: Beginner → Intermediate → Advanced.

**Kalam ID**
Every student and coach is assigned a unique system-wide **KalamID** on registration — a permanent identifier that ties their attendance, performance, payments, and profile together across grounds, coaches, and time.

**Approval Workflow**
New student registrations sit in a pending queue until a coach approves them. No student enters the active roster without authorization.

---

### Attendance Management

**Student Attendance**
Mark attendance daily with timestamp and GPS address capture. Filter by age group, ground, or date range. View monthly summaries. Export to color-coded Excel (green = present, red = absent) in one click.

**Quick Attendance Mode**
Bulk-mark attendance for an entire ground in under a minute — select ground, toggle present/absent per student, save all at once. Smart detection of already-saved records prevents duplicates.

**Coach Attendance**
Every coaching session is logged — login/logout times, ground, topics covered, session notes. Coaches can log leave with reasons. Date-range queries and per-coach reports are built in. **Task entries are now integrated** — assigned tasks appear inline in the coach attendance view with status tracking.

**Excel Reports**
Formatted, professional .xlsx reports with blue headers, conditional color formatting, and per-coach worksheets — ready to share with parents, administrators, or federations without additional formatting work.

---

### Performance Tracking

Kalam captures **football-specific performance data** per match or training session — not generic fields, but metrics that actually matter on the pitch:

| Category | What Kalam Records |
|---|---|
| **Attacking** | Goals, Assists, Shots on target, Shots off target, Chances created, Accurate crosses |
| **Passing** | Accurate passes, Long ball passes |
| **Defending** | Tackles won (1v1), Clearances, Heading efficiency, Recovery stats |
| **Discipline** | Fouls committed, Fouls suffered |
| **Overall** | Game sense rating (1–10) |

Every entry is dated and tied to a game title. Over time, each student builds a full performance history that coaches can use for development decisions.

---

### Financial Management

**Monthly Fee Tracking**
Every student's fee status is tracked month by month — paid or unpaid, with date, amount, and collector recorded.

**Payment Approval Workflow**
Payments enter a pending queue and require approval from an authorized coach or owner. Approval timestamps create an automatic audit trail.

**Scholarship Tiers**
Assign one of six scholarship levels to any student:

| Tier | Fee Reduction |
|---|---|
| No scholarship | 0% |
| Tier 1 | 10% |
| Tier 2 | 15% |
| Tier 3 | 25% |
| Tier 4 | 50% |
| Full scholarship | 100% (free access) |

Scholarship status is visible alongside payment status in the owner's consolidated student view.

---

### Coach & Staff Management

- Coach self-registration with complete personal and professional profile
- Academy owner approves or rejects each coach before they gain access
- Role hierarchy: **Academy Owner → Head Coach → Assistant Coach**
- Each coach is assigned to one or more grounds
- Academy branding with logo upload
- Coach roster visible to the owner across the entire academy
- **Task assignment and tracking** — head coaches assign tasks to assistant coaches with full lifecycle management (Pending → Acknowledged → Completed)
- **Task–attendance integration** — every task appears in the coach attendance view for unified operational oversight

---

### Facility Management

- Add multiple training grounds per academy
- Assign coaches and student groups to specific grounds
- Ground-wise attendance tracking and student grouping
- Session notes logged per ground per session
- Location data captured on login/logout for each ground visit

---

### Notifications & Communication

- Automated email notifications via Firebase Cloud Functions
- Triggered on key events (approvals, registrations, payment confirmations)
- **Real-time coach task notifications** — assigned tasks appear instantly for sub-coaches with acknowledge and complete actions
- **Task notification badges** — active task count visible in the task management screen
- WhatsApp numbers captured for every student and coach — ready for direct outreach without hunting through contacts
- Session notes and topics logged per training, creating a communication record between coaches and academy management

---

### Analytics Dashboard

- Student cohort breakdown by year of birth
- Gender-wise demographic distribution
- Ground-wise student counts
- Scholarship tier distribution across the academy
- Sortable, paginated data tables
- Combined scholarship and payment status view for quick financial oversight

---

### Home Dashboard — The Daily Hub

Every coach and owner starts their day on the Kalam home dashboard — a single screen organized into four tabs:

| Tab | Who Sees It | What It Shows |
|---|---|---|
| **My Profile** | All users | Personal info, attendance status, pending approvals |
| **My Teams** | Coaches | Full student roster with quick actions |
| **Scholarships** | Academy Owners | All students with scholarship and payment status combined |
| **Analytics** | Academy Owners | Cohort demographics, ground distribution, year-of-birth breakdowns |

Quick-action buttons for marking in/out, logging evening sessions, and checking pending items are always visible — no navigation required for daily operations.

**Quick-access navigation** from the header to Quick Attendance and Coach Tasks — the two most time-sensitive daily operations.

---

## Platform Strengths

### 🆕 Black & Orange Sports Theme
A complete **UI overhaul** across every screen — dark-mode-first design with a black and orange sports aesthetic. Every component has been redesigned with:
- Gradient backgrounds, accent bars, and status color-coding
- Card-based layouts optimized for mobile-first coaching workflows
- Responsive breakpoints for small phones (< 360px), standard mobile, tablet, and desktop
- Landscape-mode optimization for coaches using phones sideways on the bench
- Custom scrollbars, hover states, and micro-interactions throughout
- Professional, modern look that reflects the intensity of sports

### Real-Time, Cloud-Native
Built on **Google Firebase** — data updates live across all devices. A coach marking attendance on a phone reflects instantly on the owner's desktop. No sync delays, no version conflicts, no lost data.

### Works on Any Device
Angular Material responsive UI — equally usable on a smartphone at the training ground or a desktop in the office.

### Secure
- Firebase Authentication (email/password)
- Role-based access control — coaches see only what they are authorized to see
- Automatic idle logout after 2 hours prevents unauthorized access on shared devices
- Session keepalive with warning countdown before logout

### Built for India
- Aadhar ID support in student and coach profiles
- Asia-Southeast1 Firebase region for low latency within India
- Scholarship tiers aligned with grassroots academy economics
- Designed for the realities of multi-ground, distributed coaching setups

### Scalable Without Limits
The same platform handles a single-ground startup and a multi-city academy network. Add grounds, coaches, and students without rebuilding anything.

---

## How Kalam Compares

| | Excel / Sheets | Generic Sports ERP | **Kalam** |
|---|---|---|---|
| Football-specific metrics | No | Rarely | **Yes** |
| Multi-user, real-time access | No | Yes | **Yes** |
| India-ready (Aadhar, INR) | Manual | Usually not | **Yes** |
| Scholarship workflows | Manual | Generic | **Built-in** |
| Coach attendance tracking | No | No | **Yes** |
| Coach task management | No | No | **Yes — full lifecycle** |
| Bulk quick attendance | No | Varies | **Yes — under 60 seconds** |
| Excel export with formatting | Basic | Varies | **Professional, one-click** |
| Implementation time | Immediate | 3–6 months | **Under 1 hour** |
| Cost | Free but inefficient | High licensing fees | **Affordable SaaS** |

---

## How Three Roles Experience Kalam in a Day

**Owner — Morning**
Opens the dashboard. Sees 3 students pending approval, 2 coach payments awaiting sign-off, and last month's attendance summary. Approves from the dashboard. Exports a scholarship report for the management meeting. **Assigns a task to the assistant coach to prepare for Saturday's match** — title, description, one tap. Done in 10 minutes.

**Head Coach — Training Day**
Arrives at the ground. Marks login. Runs the session. Records topics and notes. **Opens Quick Attendance — selects the ground, toggles two absent students, saves. 30 students marked in 45 seconds.** After training, opens a student's profile to enter performance data from the match yesterday. **Checks the Task Manager — sees the assistant coach acknowledged yesterday's equipment task.** Logs out. All data is in the system.

**Assistant Coach — Registration Day**
A new student arrives. Fills in the multi-step digital registration form including position, age group, and medical information. Uploads a profile photo. Submits. The student sits in the approval queue. No paper form changes hands. **Opens My Tasks — sees a new task from the head coach. Taps Acknowledge, then completes it after the session. The head coach sees the update instantly.**

---

## Key Workflows

```
STUDENT LIFECYCLE
Registration → Coach Approval → Ground Assignment →
Daily Attendance → Performance Tracking → Monthly Fee → Scholarship Review

COACH ONBOARDING
Self-Registration → Owner Approval → Ground Assignment →
Session Logging → Student & Payment Approvals

TASK LIFECYCLE
Head Coach Assigns Task → Sub-Coach Receives Notification →
Acknowledge → Complete → Logged in Coach Attendance

QUICK ATTENDANCE
Select Ground → Students Load → Toggle Present/Absent →
Bulk Save → Timestamped Records in Firebase

OWNER OVERSIGHT
Academy Setup → Ground Configuration → Coach Approval →
Dashboard Monitoring → Task Assignment → Scholarship Management → Report Export
```

---

## Technical Foundation

| | |
|---|---|
| **Frontend** | Angular 19, Angular Material 19, RxJS 7 |
| **UI Theme** | Custom Black & Orange sports theme, mobile-first responsive design |
| **Database** | Firebase Firestore + Firebase Realtime Database |
| **Authentication** | Firebase Auth |
| **Cloud Functions** | Email notifications via HTTP-triggered functions |
| **File Export** | ExcelJS (.xlsx generation with full formatting) |
| **Location** | OpenCage Geocoding API |
| **Hosting** | Firebase Hosting (Production + Staging) |
| **Cloud Region** | Asia-Southeast1 |

Production-deployed. Staging environment available for customer validation and UAT.

---

## Getting Started

| Step | What Happens |
|---|---|
| **1. Academy Setup** | Owner registers, sets up academy profile and logo |
| **2. Add Grounds** | Configure training locations |
| **3. Invite Coaches** | Coaches self-register; owner approves |
| **4. Enrol Students** | Coaches register students; approval workflow activates them |
| **5. Go Live** | Daily operations begin — attendance, sessions, performance, fees |

**Time to go live: under 1 hour for a typical academy setup.**

---

## Pricing

Kalam is offered as a **monthly SaaS subscription**, priced by academy size:

- Number of active students
- Number of coaching staff
- Number of training grounds

Volume discounts available for academy networks and federations. Custom onboarding support available for larger setups.

**Contact us for a tailored quote.**

---

## What's Coming

**AI Copilot** — currently in active development. The next version of Kalam will embed an AI assistant directly into the platform — helping coaches surface insights from performance data, flag attendance patterns, and reduce the time spent on routine decisions.

---

## Recent Release — March 2025

| Feature | Description |
|---|---|
| **Angular 19 Upgrade** | Full framework upgrade from Angular 13 → 19 with modern build tooling |
| **Black & Orange Sports Theme** | Complete UI overhaul — dark-mode-first, responsive, card-based design across all screens |
| **Coach Task Management** | Full task lifecycle: assign, acknowledge, complete — with attendance integration |
| **Coach Task Dialog** | Filterable task overlay in coach attendance view with status badges and stats |
| **Quick Attendance** | Bulk attendance marking per ground — toggle present/absent, save all at once |
| **Quick Attendance Smart Save** | Detects existing records, prevents duplicates, supports same-day edits |
| **Task–Attendance Integration** | Assigned tasks logged as entries in coach attendance for unified oversight |
| **Sign-Up Redesign** | Coach registration form rebuilt with the new sports theme |
| **Login Redesign** | Login page rebuilt with branded dark theme |
| **Responsive Overhaul** | Every screen optimized for small phones, landscape, tablets, and desktop |

---

## Next Steps

**Request a live demo** — see Kalam running with real data from a sample academy.

**Start a pilot** — onboard your academy at no cost for the first 30 days.

**Talk to us** — bring your specific workflows and we will show you how Kalam handles them.

---

*Kalam — Football Academy Management Platform*
*Serving academies across India | Built on Firebase | Production-ready*
*Document prepared: March 2026*
