"use client";

import { HabitCard } from "@/components/HabitCard";
import { HabitForm } from "@/components/HabitForm";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/lib/auth-context";
import { useHabits } from "@/lib/use-habits";
import { useToday } from "@/lib/use-today";

/** Must render inside <RequireAuth>: habits are only loaded in the browser with a session. */
export function HabitsPanel() {
  const { user } = useAuth();
  if (!user) return null;
  return <HabitsForUser uid={user.uid} />;
}

function HabitsForUser({ uid }: { uid: string }) {
  const state = useHabits(uid);
  const today = useToday();

  return (
    <div className="flex flex-col gap-6">
      <HabitForm uid={uid} />

      {state.status === "loading" && <LoadingScreen />}

      {state.status === "error" && (
        <div role="alert" className="rounded-3xl bg-danger-soft px-5 py-6 text-center text-danger">
          <p className="font-semibold">No se han podido cargar tus hábitos.</p>
          <p className="mt-1 text-sm">{state.error}</p>
        </div>
      )}

      {state.status === "ready" && state.habits.length === 0 && (
        <section className="rounded-3xl border border-dashed border-line bg-card px-6 py-12 text-center">
          <span aria-hidden="true" className="text-4xl">
            🌱
          </span>
          <p className="mt-3 font-display text-xl font-semibold text-ink">
            Aún no tienes hábitos
          </p>
          <p className="mt-1 text-sm text-muted">
            Crea el primero arriba y márcalo cada día para empezar tu racha.
          </p>
        </section>
      )}

      {state.status === "ready" && state.habits.length > 0 && (
        <ul className="flex flex-col gap-4" aria-label="Tus hábitos">
          {state.habits.map((habit) => (
            <HabitCard key={habit.id} uid={uid} habit={habit} today={today} />
          ))}
        </ul>
      )}
    </div>
  );
}
