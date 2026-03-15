# AI Agent Overview Document for Office Hours Booking App

## Purpose

Create one project document that an AI agent (or human) will use as the single source of truth when implementing the app. The document drives architecture, implementation order, and what must be produced for GitHub and Netlify.

---

## 1. Agent role and goal

- **Role:** Sole developer for a frontend-only office-hours booking app; owner of architecture, implementation, and deployment. No custom backend; persistence is localStorage for now, with Google Sheets planned later.
- **Goal:** Ship a working web app where:
  1. Professors log in with email + password, create courses, set available office-hours time ranges, and see the current best overlapping times per course on their dashboard.
  2. Students log in with email + password, register for courses (dropdown of professor-created courses), and indicate when they are available via a scheduler.
  3. The app computes the best overlapping time ranges per day (professor availability ∩ student preferences) and displays them on the professor's front page, updating continually for demo.
- **Success criteria:** A reader can clone, run locally, and use all features with the seeded professor and student accounts. Frontend-only; no backend required.

## 2. Explicit constraints (locked in)

- **Auth:** Email + password for both professors and students. No domain restriction for now (valid email); optional domain config for future.
- **Scope:** Multiple professors; students register into courses created by professors; multi-tenant by course.
- **Stack:** Frontend only; React + TypeScript + Vite. localStorage for persistence; Google Sheets integration planned later.
- **Algorithm:** Best time = overlapping windows between professor availability and enrolled students' preferences, per day, ranked by student coverage.

## 3. Data model

- **User:** email, password, role (teacher | student), name. Stored in app state (localStorage).
- **Course:** courseId, name, teacherEmail, term. Created by professor.
- **ProfessorAvailability:** courseId, timeRanges (day, startHour, endHour). One per course.
- **StudentPreference:** studentEmail, courseId, timeRanges. One per student per course.
- **Enrollment:** studentEmail, courseId. Links student to course.

## 4. Key files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root UI; sign-in (email+password); professor: create course, set availability, dashboard; student: register, scheduler |
| `src/types.ts` | User, SessionUser, Course, TimeRange, ProfessorAvailability, StudentPreference, Enrollment, BestTimeResult |
| `src/services/auth.ts` | getSessionUser, signIn(session), signOut; session in localStorage |
| `src/services/datastore.ts` | LocalDataStore; validateLogin, createCourse, setAvailability, enroll, setPreferences, computeBestTimes |
| `src/services/bestTime.ts` | computeBestTimes algorithm: overlap professor + student ranges, pick best per day |
| `src/config.ts` | appName, allowedDomains (optional) |

## 5. Implementation flow

1. Auth: signIn(email, password) validates against stored users; session holds email, role, name.
2. Professor: create course → set availability (time ranges per day) → dashboard shows best times per course (auto-refresh).
3. Student: register for courses (dropdown) → set availability per course (scheduler).
4. Best-time: computed from professor availability + all enrolled students' preferences; displayed on professor dashboard.

## 6. One-paragraph project summary

Frontend-only office-hours booking app. Professors and students log in with email and password. Professors create courses and set when they are available for office hours; students register for courses and indicate when they can attend. The app computes the best overlapping time ranges per day and displays them on the professor dashboard, updating automatically. Data is stored in localStorage for now; Google Sheets integration is planned. Netlify deployment supported.
