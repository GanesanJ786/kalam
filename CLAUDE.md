# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kalam** is an Angular 13 SPA for managing a football/soccer academy — coaches, students, attendance, performance, scholarships, and payments. Backend is Firebase (Realtime Database + Firestore).

## Commands

All commands run from `kalam-app/`:

```bash
npm start          # Dev server at http://localhost:4200
npm run build      # Production build → dist/kalam-app/
npm run watch      # Dev build with file watching
npm test           # Karma/Jasmine unit tests (Chrome)
ng generate component <name>   # New component (SCSS by default)
```

Deploy to Firebase:
```bash
ng deploy          # Deploys to production (kalam-in)
# For staging: firebase deploy --only hosting:kalam-stage
```

## Architecture

### Tech Stack
- **Angular 13** + Angular Material 13 + RxJS 7
- **Firebase**: Firestore (`coachDetails`, `studentDetails`, `studentsPerformance`), Realtime Database, Firebase Auth, Cloud Functions
- **AngularFire 7** for Firebase integration
- **exceljs** + **file-saver** for Excel export; **moment** for dates; **@ng-idle** for session timeout

### Core Service: `kalam.service.ts`
Central service for all Firebase operations — CRUD for students, coaches, attendance, performance, payments. Components inject this service rather than accessing Firebase directly.

### Authentication & Guards
- `auth-guard.service.ts` protects all routes except `/login` and `/sign-up`
- Logged-in coach stored in `sessionStorage`
- Auto-logout after 2-hour idle (configured in `app.component.ts`)

### Routing (`app-routing.module.ts`)
Public: `/login`, `/sign-up`. All other routes require `AuthGuardService`. Wildcard `**` redirects to `/login`.

### Constants & Enums (`constant.ts`)
Defines competency levels (Beginner/Intermediate/Advanced), age categories (U-5 through U-21, Open), scholarship tiers (0–100%), football positions, and other domain enums. Reference this file before hardcoding values.

### Firebase Project
- **Project ID**: `kalam-in`
- **Realtime DB**: `https://kalam-in-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Cloud Functions endpoint**: `https://us-central1-kalam-in.cloudfunctions.net/` (email: `sendMailOverHTTP`, `sendMailOverHTTPAttachment`)
- **Staging target**: `kalam-stage` (same Firebase project)

### Key Feature Areas
| Feature | Component(s) |
|---|---|
| Student CRUD | `student-form/`, `view-student-data/`, `new-students/` |
| Attendance | `view-student-attendance-date-wise/`, `view-student-attendance-range/`, `view-coach-attendance/` |
| Performance | `student-performance/`, `student-analytics/` |
| Payments/Scholarships | `approve-payment/`, `studentscholarship/` |
| Coach management | `new-coach-approve/`, `my-profile/`, `my-teams/` |
| Facilities | `add-ground/`, `all-students-by-ground/` |

### Loader Pattern
`loader.service.ts` + `loader.interceptor.ts` handle global loading state. The interceptor auto-shows/hides the loader component for HTTP calls.

### Excel Export
`export-to-excel.service.ts` wraps exceljs for attendance and coach detail reports.
