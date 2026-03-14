# Office Hours Planner

Frontend-only web app for multi-teacher office-hours polling, slot booking, and class announcements, with Google Sheets as the system of record.

## Features

- Teacher-created office-hours polls (available hours, slot length, days per week).
- Student poll responses by class.
- Automatic "top two" office-hours configuration suggestions after poll close.
- Slot-based office-hours booking (students pick a concrete slot).
- Teacher announcements forwarded by email (modular notification layer; SMS-ready extension point).
- School-email auth policy (only `@mta.ca` and `@umoncton.ca` domains).

## Tech stack

- React + TypeScript + Vite frontend.
- Google Sheets as persistence.
- Optional Google Apps Script endpoint for secure read/write + email send.
- Netlify for deployment.

## Prerequisites

- Node.js 18+ and npm.
- A Google account with access to your target Google Sheet.
- Optional: Google Apps Script deployment URL if you want real Sheets + email behavior from the app.
- Netlify account for production deployment.

## Local setup

1. Install dependencies:
   - `npm install`
2. Create your env file:
   - `cp .env.example .env`
3. Set values:
   - `VITE_ALLOWED_EMAIL_DOMAINS=mta.ca,umoncton.ca`
   - `VITE_APPS_SCRIPT_URL=<your deployed Apps Script Web App URL>` (optional during UI-only prototyping)
4. Run dev server:
   - `npm run dev`

## Production build

- `npm run build`
- Output folder: `dist/`

## Netlify deployment

1. Push repo to GitHub.
2. In Netlify: "Add new site" -> "Import from Git".
3. Build settings (already mirrored in `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables:
   - `VITE_ALLOWED_EMAIL_DOMAINS`
   - `VITE_APPS_SCRIPT_URL`
5. Deploy.

## Authentication policy

- Only school emails ending in `@mta.ca` or `@umoncton.ca` are accepted.
- Domain enforcement is in frontend validation (`src/lib/domain.ts`).
- For production security, mirror this validation inside Apps Script as well.

## Data model (Google Sheets schema)

Use one workbook with one tab per entity. Suggested tab names and columns:

1. `Users`
   - `email`, `name`, `role`, `createdAt`
2. `Classes`
   - `classId`, `className`, `teacherEmail`, `createdAt`
3. `Roster`
   - `classId`, `studentEmail`, `addedAt`
4. `Polls`
   - `pollId`, `classId`, `teacherEmail`, `title`, `slotMinutes`, `daysPerWeek`, `closesAtIso`, `optionsJson`, `createdAt`
5. `PollResponses`
   - `responseId`, `pollId`, `classId`, `studentEmail`, `selectedOptionKeysJson`, `submittedAtIso`
6. `OfficeHoursConfigs`
   - `configId`, `classId`, `pollId`, `summary`, `slotMinutes`, `sessionsJson`, `chosenByTeacher`, `createdAt`
7. `Slots`
   - `slotId`, `classId`, `startsAtIso`, `endsAtIso`, `capacity`, `createdAt`
8. `Bookings`
   - `bookingId`, `classId`, `slotId`, `studentEmail`, `createdAtIso`
9. `Announcements`
   - `announcementId`, `classId`, `teacherEmail`, `subject`, `body`, `createdAtIso`

## Top-two configuration algorithm

Definition used in this project:

1. Flatten every submitted response into selected option keys (for example `Mon: 13:00-15:00`).
2. Count votes for each option key for a poll.
3. Sort descending by vote count.
4. Return first two entries as rank #1 and rank #2.

This is implemented in:
- `src/services/datastore.ts` (`LocalDataStore.suggestTopConfigs`)

When using Apps Script, implement equivalent logic in the script endpoint for `suggestTopConfigs`.

## "One week later" enforcement

This app sets `closesAtIso = now + 7 days` when a teacher creates a poll.

Production recommendation:

- Enforce close timing in Apps Script:
  - reject responses submitted after `closesAtIso`;
  - scheduled trigger (time-driven, daily/hourly) computes top-two results when poll closes;
  - send teacher email with top-two suggestion payload.

Local fallback behavior (when no Apps Script URL is set):
- poll close is timestamped and visible in app;
- top-two are generated on-demand from current local responses.

## Email announcements and modular notifications

`src/services/notifications.ts` provides `NotificationSender` with:
- `sendAnnouncement(payload)`

Current implementation:
- Apps Script sender (`action: "sendAnnouncementEmail"`) if `VITE_APPS_SCRIPT_URL` exists.
- No-op fallback when URL is missing.

Future SMS support:
- Add `SmsNotificationSender` implementing same interface.
- Choose channel strategy without changing feature-level code in `App.tsx`.

## Apps Script endpoint contract (suggested)

The frontend posts JSON:

```json
{
  "action": "listClasses",
  "email": "student@mta.ca"
}
```

Supported action strings currently used by the app:
- `listClasses`
- `listPolls`
- `createPoll`
- `savePollResponse`
- `suggestTopConfigs`
- `saveOfficeHoursConfig`
- `listSlots`
- `createBooking`
- `listBookings`
- `saveAnnouncement`
- `sendAnnouncementEmail`

## Security and operational notes

- Do not commit secrets; use Netlify env vars.
- If using Sheets API directly from browser, protect scope and sharing carefully.
- Prefer Apps Script for access control, deduping bookings, and email sends.
- Always validate class membership before returning or mutating class data.

