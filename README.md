# Office Hours Booking

Frontend-only web app for office-hours scheduling. Professors create courses and set their availability; students register for courses and indicate when they can attend. The app computes the best overlapping times and displays them on the professor's dashboard.

## Features

- **Professors**
  - Log in with email and password.
  - Create courses (name, term).
  - Set available office-hours time ranges per day.
  - Dashboard shows current best times per course (updates automatically as students set their availability).

- **Students**
  - Log in with email and password.
  - Register for courses via dropdown (courses appear after professors create them).
  - Indicate which times work for them via a scheduler (per course).

## Tech stack

- React + TypeScript + Vite.
- localStorage for persistence (Google Sheets planned later).
- Netlify for deployment.

## Prerequisites

- Node.js 18+ and npm.

## Local setup

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`

## Demo accounts

Use these seeded accounts to try the app:

| Role    | Email              | Password |
|---------|--------------------|----------|
| Professor | teacher@mta.ca   | password |
| Professor | teacher2@umoncton.ca | password |
| Student | student@mta.ca     | password |
| Student | student2@umoncton.ca | password |

## Production build

- `npm run build`
- Output: `dist/`

## Netlify deployment

1. Push to GitHub.
2. In Netlify: Add new site → Import from Git.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy.

**Google Sheets backend (optional):** To use the Google Apps Script backend instead of localStorage, see [backend/README.md](backend/README.md). If your network blocks `script.google.com`, use **proxy mode**: set `VITE_APPS_SCRIPT_URL` to your Netlify function URL (`https://your-site.netlify.app/.netlify/functions/sheets`) and `APPS_SCRIPT_URL` to your Apps Script URL.

## How it works

1. Professor creates a course and sets time ranges when they are willing to offer office hours (e.g. Mon 9:00–11:00, Tue 14:00–16:00).
2. Students register for the course and set their preferred times using the scheduler.
3. The app computes overlapping windows between the professor's availability and each student's preferences, per day.
4. The professor dashboard shows the best time for each day (the slot that maximizes student coverage), and refreshes automatically.

By default, data is stored in the browser's localStorage. For shared persistence, you can connect a [Google Sheets backend](backend/README.md).
