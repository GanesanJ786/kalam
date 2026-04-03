# Kalam Demo Video — Production Guide & Script

## Free Tools You Need

| Step | Tool | Link | What For |
|------|------|------|----------|
| Screen Record | **OBS Studio** | https://obsproject.com | Record app flows (free, open source) |
| AI Voiceover | **ElevenLabs** | https://elevenlabs.io | 10 min free/month, professional voices |
| Video Editing | **CapCut Desktop** | https://capcut.com | Free AI editing, captions, transitions |
| Background Music | **Pixabay Music** | https://pixabay.com/music | Royalty-free music, no attribution needed |
| Thumbnails | **Canva** | https://canva.com | Free tier, great templates |

---

## Pre-Recording Setup

### 1. Prepare Demo Data
Before recording, populate your app with realistic sample data:
- Academy name: "Fitness Center" (or any real-sounding name)
- Add 2-3 training grounds (e.g., "Main Ground", "Evening Ground")
- Register 8-10 students with real-sounding names, photos
- Add 1-2 coaches
- Mark some attendance and performance data for past dates

### 2. Recording Settings (OBS Studio)
- **Resolution**: 1080x1920 (vertical/mobile) OR 1920x1080 (horizontal/desktop)
- **FPS**: 30
- **Format**: MP4
- For mobile view: Use Chrome DevTools → Toggle Device Toolbar (Cmd+Shift+M) → Select "iPhone 12 Pro" or similar
- Keep mouse movements smooth and deliberate

### 3. Chrome Setup
- Hide bookmarks bar (Cmd+Shift+B)
- Use full screen (Cmd+Shift+F)
- Clear any popup notifications
- Use a clean Chrome profile (no extensions showing)

---

## Video Structure (Total: ~3-4 minutes)

---

## SCENE 1: OPENING (0:00 – 0:15)

**[Screen: Black screen with Kalam logo fade-in]**

**Voiceover:**
> "Running a sports academy shouldn't mean juggling WhatsApp groups, paper registers, and Excel sheets. Meet Kalam — the all-in-one platform built for sports academies in India."

**Recording Notes:**
- Use a static Kalam logo image (from `assets/logo/`)
- Add in CapCut with a zoom-in animation

---

## SCENE 2: LOGIN & HOME DASHBOARD (0:15 – 0:40)

**[Screen: Login page → Home dashboard]**

**Voiceover:**
> "Every coach starts their day here — the home dashboard. At a glance, you see your academy name, active training venues, and quick action buttons. Need to mark attendance? Add a ground? Check coach details? Everything is one tap away."

**Recording Steps:**
1. Show the login screen briefly → enter credentials → tap Login
2. Home screen loads — pause 2 seconds on the profile strip (academy name, sport icons, location)
3. Slowly scroll to show quick action chips: Add Venue, Coach Details, Quick Attendance, Tasks
4. Show the Training Venues section with ground cards

---

## SCENE 3: ADDING A TRAINING GROUND (0:40 – 1:00)

**[Screen: Home → Add Ground form]**

**Voiceover:**
> "Setting up is simple. Tap 'Add Venue', enter the ground name, assign coaches, and you're ready to track attendance for that location. Add as many grounds as your academy needs."

**Recording Steps:**
1. Tap "Add Venue" button
2. Fill in ground name (e.g., "Saturday Training Ground")
3. Save → return to home showing the new ground card

---

## SCENE 4: STUDENT REGISTRATION (1:00 – 1:30)

**[Screen: Student Form — Step 1 and Step 2]**

**Voiceover:**
> "Registering students is a guided two-step process. Step one captures personal details — name, date of birth, gender, parent contacts, and a profile photo. Step two covers the sport — select football, cricket, hockey, or any of seven supported sports. Choose a playing position, assign a training ground, and submit. Every student gets a unique Kalam ID for lifetime tracking."

**Recording Steps:**
1. Navigate to student form
2. Show Step 1: tap the profile photo upload area, fill in name, date of birth (show age auto-calculating), gender selection tiles
3. Scroll to show parent info, emergency contact, Aadhar ID fields
4. Tap Next → Step 2 appears
5. Show sport selection, position dropdown, ground assignment
6. Tap Submit

---

## SCENE 5: QUICK ATTENDANCE (1:30 – 2:00)

**[Screen: Quick Attendance page]**

**Voiceover:**
> "This is where Kalam saves coaches real time every single day. Open Quick Attendance, select a ground, and your entire student roster loads instantly. Every student defaults to present — just tap to toggle anyone absent. Need to mark all present? One button. Search by name or ID. The live stats bar updates in real time. Save — and thirty students are marked in under sixty seconds."

**Recording Steps:**
1. Tap Quick Attendance from home
2. Select a ground from dropdown
3. Show students loading with the stats bar (Total / Present / Absent)
4. Toggle 2-3 students to absent — show the count changing
5. Tap "All Present" to reset
6. Use the search bar to find a student by name
7. Tap Save → show snackbar confirmation

---

## SCENE 6: COACH CHECK-IN / CHECK-OUT (2:00 – 2:15)

**[Screen: Home dashboard — ground cards]**

**Voiceover:**
> "Coaches check in and check out of each training venue with a single tap. The session status shows live on the dashboard — green when active, ready for the next session when not."

**Recording Steps:**
1. On home screen, tap "IN" on a ground card
2. Show status change to "Session Active" with green indicator
3. Tap "OUT" to end the session

---

## SCENE 7: PERFORMANCE TRACKING & SMART FILL (2:15 – 2:45)

**[Screen: Student Performance form]**

**Voiceover:**
> "After every training session, coaches record sport-specific performance data. For football — goals, assists, tackles, passing accuracy, and game sense. For chess — accuracy and blunders. For fitness — endurance, strength, and flexibility. But here's the game-changer: tap 'Smart Fill' and Kalam auto-populates every field using the student's historical averages. Adjust one or two values, save — and a full performance entry takes thirty seconds."

**Recording Steps:**
1. Open a student's performance entry
2. Show the sport-specific fields (for football: attacking, passing, defending sections)
3. Tap "Smart Fill" button → show all dropdowns auto-filling
4. Adjust one rating manually
5. Save

---

## SCENE 8: COACH TASK MANAGEMENT (2:45 – 3:05)

**[Screen: Tasks page]**

**Voiceover:**
> "Academy owners assign tasks directly to coaches — no more WhatsApp messages that get buried. Create a task, assign it, and track it from Pending to Acknowledged to Completed. Every response is timestamped. Tasks even appear in the coach attendance report for complete accountability."

**Recording Steps:**
1. Open Tasks from home
2. Show the task creation form — select coach, add title, description
3. Show existing tasks with status badges (Pending → Acknowledged → Completed)
4. Show the stats bar with counts

---

## Post-Production in CapCut (Free)

### Step-by-step:
1. **Import** all screen recordings into CapCut Desktop
2. **Trim** each clip to match the script timing above
3. **Add AI voiceover**: Go to Text → select voiceover text → use CapCut's built-in TTS, OR import ElevenLabs audio files
4. **Add captions**: CapCut auto-generates captions from audio — select a sporty font style
5. **Transitions**: Use "Fade" or "Slide" between scenes — avoid flashy transitions
6. **Background music**: Import a royalty-free track from Pixabay. Keep volume at 15-20% under the voiceover
7. **Lower thirds**: Add text overlays like "Quick Attendance", "Smart Fill", "Task Management" as section headers
8. **Export**: 1080p, 30fps, MP4

### Recommended CapCut features (all free):
- **Auto Captions** → generates subtitles from your voiceover
- **Text Templates** → sporty/modern title styles
- **Speed Curves** → slight speed-up on repetitive form-filling parts
- **Keyframe Zoom** → zoom into specific buttons/areas while narrating

---

## Alternative: Fully AI-Generated Video (Fastest Method)

If you want to skip manual editing entirely:

1. **Record all screens** with OBS (no audio needed)
2. **Upload to InVideo AI** (https://invideo.io) — free tier gives 10 min/week
3. Paste this script as the prompt
4. InVideo will auto-cut, add voiceover, music, and transitions
5. Export and download

---

## ElevenLabs Voiceover Guide (Free Tier)

1. Go to https://elevenlabs.io → Sign up free
2. Choose a voice: Recommended **"Daniel"** (British, professional) or **"Josh"** (American, confident)
3. Paste each scene's voiceover text separately
4. Generate → Download MP3
5. Import into CapCut and align with each clip
6. Free tier gives ~10 minutes/month — enough for one demo video

---

## Video Specs for Different Platforms

| Platform | Resolution | Aspect Ratio | Max Length |
|----------|-----------|--------------|------------|
| YouTube | 1920x1080 | 16:9 | No limit |
| Instagram Reels | 1080x1920 | 9:16 | 90 sec |
| LinkedIn | 1920x1080 | 16:9 | 10 min |
| WhatsApp Status | 1080x1920 | 9:16 | 30 sec |

For Instagram/WhatsApp, create a **60-second cut** using only Scenes 1, 5 (Quick Attendance), 7 (Smart Fill), and 11 (Closing).

---

## Checklist Before Recording

- [ ] Demo data populated (students, coaches, grounds, attendance, performance)
- [ ] OBS installed and configured (1080p, 30fps)
- [ ] Chrome in mobile view (DevTools → device toolbar)
- [ ] Bookmarks bar hidden, clean browser
- [ ] Script printed or on second screen
- [ ] Practice each flow 2-3 times before recording
- [ ] ElevenLabs account created
- [ ] CapCut Desktop installed
- [ ] Background music downloaded from Pixabay
