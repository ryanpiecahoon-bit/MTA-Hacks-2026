import { isAllowedSchoolEmail } from "../lib/domain";
import type { SessionUser } from "../types";

const SESSION_KEY = "office-hours-session-v1";

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as SessionUser;
}

export function signOut(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function signInWithEmail(email: string, role: "teacher" | "student", name: string): SessionUser {
  if (!isAllowedSchoolEmail(email)) {
    throw new Error("Only @mta.ca and @umoncton.ca emails are allowed.");
  }
  const user: SessionUser = {
    email: email.trim().toLowerCase(),
    role,
    name: name.trim() || email.split("@")[0]
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}
