export type Role = "teacher" | "student";

export interface User {
  email: string;
  password: string;
  role: Role;
  name: string;
}

export interface SessionUser {
  email: string;
  role: Role;
  name: string;
}

export interface TimeRange {
  day: string;
  startHour: string;
  endHour: string;
}

export interface Course {
  courseId: string;
  name: string;
  teacherEmail: string;
  term: string;
}

export interface ProfessorAvailability {
  courseId: string;
  timeRanges: TimeRange[];
}

export interface StudentPreference {
  studentEmail: string;
  courseId: string;
  timeRanges: TimeRange[];
}

export interface Enrollment {
  studentEmail: string;
  courseId: string;
}

export interface BestTimeResult {
  courseId: string;
  courseName: string;
  bestSlots: { day: string; startHour: string; endHour: string; studentCount?: number }[];
}
