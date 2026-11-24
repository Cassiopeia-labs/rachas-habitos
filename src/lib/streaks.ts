/** A calendar day in local time, formatted as `YYYY-MM-DD`. */
export type DayKey = string;

const pad = (value: number): string => String(value).padStart(2, "0");

export const toDayKey = (date: Date): DayKey =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Anchored at noon so adding days never lands on a DST gap at midnight.
const fromDayKey = (key: DayKey): Date => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
};

const addDays = (key: DayKey, amount: number): DayKey => {
  const date = fromDayKey(key);
  date.setDate(date.getDate() + amount);
  return toDayKey(date);
};

/** The last `n` days ending at `today` (included), oldest first. */
export const lastNDays = (n: number, today: Date): DayKey[] => {
  const end = toDayKey(today);
  const days: DayKey[] = [];
  for (let offset = n - 1; offset >= 0; offset--) {
    days.push(addDays(end, -offset));
  }
  return days;
};

/**
 * Consecutive completed days ending today. If today is not completed yet, a
 * streak ending yesterday is still alive and counts.
 */
export const currentStreak = (dates: DayKey[], today: Date): number => {
  const completed = new Set(dates);
  const todayKey = toDayKey(today);
  let cursor = completed.has(todayKey) ? todayKey : addDays(todayKey, -1);
  let streak = 0;
  while (completed.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
};

/** Longest run of consecutive completed days, regardless of order or duplicates. */
export const bestStreak = (dates: DayKey[]): number => {
  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let run = 0;
  let previous: DayKey | null = null;
  for (const day of sorted) {
    run = previous !== null && addDays(previous, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    previous = day;
  }
  return best;
};

/** Percentage (0–100, rounded) of the last `days` days, today included, that are completed. */
export const completionRate = (dates: DayKey[], days: number, today: Date): number => {
  if (days <= 0) return 0;
  const completed = new Set(dates);
  const done = lastNDays(days, today).filter((day) => completed.has(day)).length;
  return Math.round((done / days) * 100);
};

const WEEKDAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
// Spanish calendar initials: "X" for miércoles avoids clashing with "M" for martes.
const WEEKDAY_INITIALS = ["D", "L", "M", "X", "J", "V", "S"];

export type DayInfo = {
  /** Full Spanish weekday name, e.g. "Lunes". */
  weekday: string;
  /** One-letter Spanish weekday initial, e.g. "X" for miércoles. */
  initial: string;
  dayOfMonth: number;
};

export const describeDay = (key: DayKey): DayInfo => {
  const date = fromDayKey(key);
  return {
    weekday: WEEKDAYS[date.getDay()],
    initial: WEEKDAY_INITIALS[date.getDay()],
    dayOfMonth: date.getDate(),
  };
};
