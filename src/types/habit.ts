import type { DayKey } from "@/lib/streaks";

/** A habit as shown in the panel (`users/{uid}/habits/{id}` in Firestore). */
export type Habit = {
  id: string;
  name: string;
  emoji: string;
  completedDates: DayKey[];
};
