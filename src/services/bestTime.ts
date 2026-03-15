import type { TimeRange, BestTimeResult } from "../types";

/** Convert "HH:mm" to minutes since midnight for comparison */
function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Check if two time ranges overlap; returns the overlap segment or null */
function overlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): { start: string; end: string } | null {
  const aS = toMinutes(aStart);
  const aE = toMinutes(aEnd);
  const bS = toMinutes(bStart);
  const bE = toMinutes(bEnd);
  const overlapStart = Math.max(aS, bS);
  const overlapEnd = Math.min(aE, bE);
  if (overlapStart >= overlapEnd) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    start: `${pad(Math.floor(overlapStart / 60))}:${pad(overlapStart % 60)}`,
    end: `${pad(Math.floor(overlapEnd / 60))}:${pad(overlapEnd % 60)}`
  };
}

/** For a given day, find overlapping segments between prof ranges and all student preferences; count students per segment */
function findBestOverlapForDay(
  day: string,
  profRanges: TimeRange[],
  studentRangesByStudent: TimeRange[][]
): { startHour: string; endHour: string; studentCount: number } | null {
  const dayProf = profRanges.filter((r) => r.day.toLowerCase() === day.toLowerCase());
  if (dayProf.length === 0) return null;

  const segmentCounts = new Map<string, Set<string>>(); // key = "start-end", value = set of student emails who can attend

  for (const pr of dayProf) {
    for (const studentRanges of studentRangesByStudent) {
      const dayStudent = studentRanges.filter((r) => r.day.toLowerCase() === day.toLowerCase());
      for (const sr of dayStudent) {
        const seg = overlap(pr.startHour, pr.endHour, sr.startHour, sr.endHour);
        if (seg) {
          const key = `${seg.start}~${seg.end}`;
          if (!segmentCounts.has(key)) segmentCounts.set(key, new Set());
          // Use index as proxy for student identity since we're counting distinct students
          segmentCounts.get(key)!.add(`s${studentRangesByStudent.indexOf(studentRanges)}`);
        }
      }
    }
  }

  let best: { startHour: string; endHour: string; studentCount: number } | null = null;
  const sep = "~";
  for (const [key, students] of segmentCounts) {
    const [startHour, endHour] = key.split(sep);
    const count = students.size;
    if (!best || count > best.studentCount) {
      best = { startHour: startHour ?? "", endHour: endHour ?? "", studentCount: count };
    }
  }
  return best;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Compute best overlapping time slots per day for a course.
 * Uses professor's availability and enrolled students' preferences.
 */
export function computeBestTimes(
  courseName: string,
  courseId: string,
  professorRanges: TimeRange[],
  studentPreferences: TimeRange[][] // one array per enrolled student
): BestTimeResult {
  const bestSlots: { day: string; startHour: string; endHour: string; studentCount?: number }[] = [];
  for (const day of DAYS) {
    const slot = findBestOverlapForDay(day, professorRanges, studentPreferences);
    if (slot) {
      bestSlots.push({
        day,
        startHour: slot.startHour,
        endHour: slot.endHour,
        studentCount: slot.studentCount
      });
    }
  }
  return {
    courseId,
    courseName,
    bestSlots
  };
}
