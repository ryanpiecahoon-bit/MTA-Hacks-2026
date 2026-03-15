import type { SessionUser } from "../types";

const SESSION_KEY = "office-hours-booking-session-v1";

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function signIn(session: SessionUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
