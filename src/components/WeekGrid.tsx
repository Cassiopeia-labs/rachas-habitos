"use client";

import { describeDay, lastNDays, toDayKey, type DayKey } from "@/lib/streaks";

type WeekGridProps = {
  completedDates: DayKey[];
  today: Date;
  onToggle: (day: DayKey, done: boolean) => void;
};

/** The last 7 days as toggle buttons, oldest first and today last. */
export function WeekGrid({ completedDates, today, onToggle }: WeekGridProps) {
  const completed = new Set(completedDates);
  const todayKey = toDayKey(today);

  return (
    <ul className="grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Últimos 7 días">
      {lastNDays(7, today).map((day) => {
        const { weekday, initial, dayOfMonth } = describeDay(day);
        const done = completed.has(day);
        const isToday = day === todayKey;
        return (
          <li key={day} className="flex flex-col items-center gap-1">
            <span
              aria-hidden="true"
              className={`text-xs font-medium ${isToday ? "text-ember-dark" : "text-muted"}`}
            >
              {isToday ? "Hoy" : initial}
            </span>
            <button
              type="button"
              aria-pressed={done}
              aria-label={`${weekday} ${dayOfMonth}${isToday ? " (hoy)" : ""}: ${done ? "hecho" : "sin hacer"}`}
              onClick={() => onToggle(day, !done)}
              className={`grid aspect-square w-full max-w-11 place-items-center rounded-xl border-2 text-sm font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${
                done
                  ? "border-ember bg-ember text-white hover:bg-ember-dark"
                  : "border-line bg-paper text-ink hover:border-ember"
              } ${isToday ? "ring-3 ring-ember-soft" : ""}`}
            >
              {done ? (
                <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path d="m4.5 10.5 3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span aria-hidden="true">{dayOfMonth}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
