import { bestStreak, completionRate, currentStreak, type DayKey } from "@/lib/streaks";

type HabitStatsProps = {
  completedDates: DayKey[];
  today: Date;
};

const days = (count: number): string => `${count} ${count === 1 ? "día" : "días"}`;

export function HabitStats({ completedDates, today }: HabitStatsProps) {
  const current = currentStreak(completedDates, today);
  const stats = [
    { label: "Racha actual", value: days(current), icon: "🔥", highlight: current > 0 },
    { label: "Mejor racha", value: days(bestStreak(completedDates)), icon: "🏆", highlight: false },
    { label: "Últimos 30 días", value: `${completionRate(completedDates, 30, today)} %`, icon: "📅", highlight: false },
  ];

  return (
    <dl className="grid grid-cols-3 gap-2 text-center">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl px-1.5 py-2 ${stat.highlight ? "bg-ember-soft" : "bg-paper"}`}
        >
          <dt className="text-[0.7rem] leading-tight text-muted sm:text-xs">{stat.label}</dt>
          <dd className="mt-0.5 text-sm font-semibold text-ink sm:text-base">
            <span aria-hidden="true">{stat.icon} </span>
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
