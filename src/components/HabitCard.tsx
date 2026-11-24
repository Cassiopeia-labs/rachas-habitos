"use client";

import { useId, useState, type FormEvent } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { HabitStats } from "@/components/HabitStats";
import { WeekGrid } from "@/components/WeekGrid";
import { deleteHabit, renameHabit, toggleDay } from "@/lib/habits";
import type { DayKey } from "@/lib/streaks";
import { HABIT_NAME_MAX_LENGTH, validateHabitName } from "@/lib/validation";
import type { Habit } from "@/types/habit";

type HabitCardProps = {
  uid: string;
  habit: Habit;
  today: Date;
};

const iconButtonClass =
  "grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember";

export function HabitCard({ uid, habit, today }: HabitCardProps) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.name);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setDraft(habit.name);
    setError(null);
    setEditing(true);
  };

  const handleRename = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateHabitName(draft);
    if (!result.ok) return setError(result.error);
    if (result.value === habit.name) return setEditing(false);
    setSaving(true);
    const failure = await renameHabit(uid, habit.id, result.value);
    setSaving(false);
    setError(failure);
    if (!failure) setEditing(false);
  };

  const handleToggle = async (day: DayKey, done: boolean) => {
    setError(null);
    const failure = await toggleDay(uid, habit.id, day, done);
    if (failure) setError(failure);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const failure = await deleteHabit(uid, habit.id);
    // On success the card unmounts when the snapshot drops the habit.
    if (failure) {
      setDeleting(false);
      setConfirmingDelete(false);
      setError(failure);
    }
  };

  return (
    <li className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-4 shadow-[0_1px_0_var(--color-line)] sm:p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ember-soft text-2xl"
        >
          {habit.emoji}
        </span>

        {editing ? (
          <form onSubmit={handleRename} noValidate className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <label htmlFor={`${id}-name`} className="sr-only">
              Nuevo nombre del hábito
            </label>
            <input
              id={`${id}-name`}
              autoFocus
              value={draft}
              maxLength={HABIT_NAME_MAX_LENGTH}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setEditing(false);
              }}
              aria-invalid={error !== null}
              aria-describedby={error ? `${id}-error` : undefined}
              className="min-w-0 flex-1 basis-40 rounded-xl border border-line bg-paper px-3 py-2 text-base text-ink focus:border-ember focus:bg-card focus:outline-none focus:ring-3 focus:ring-ember-soft"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-ember px-3 py-2 text-sm font-semibold text-white hover:bg-ember-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-60"
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink hover:border-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="min-w-0 flex-1 break-words font-display text-lg font-semibold text-ink">
              {habit.name}
            </h2>
            <button
              type="button"
              onClick={startEditing}
              aria-label={`Renombrar «${habit.name}»`}
              className={iconButtonClass}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M13.5 3.5a2.1 2.1 0 0 1 3 3L7 16l-4 1 1-4 9.5-9.5Z" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Borrar «${habit.name}»`}
              className={`${iconButtonClass} hover:text-danger`}
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M3.5 5.5h13M8 5.5V4h4v1.5M5.5 5.5l.8 11h7.4l.8-11M8.5 8.5v5M11.5 8.5v5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <WeekGrid completedDates={habit.completedDates} today={today} onToggle={handleToggle} />
      <HabitStats completedDates={habit.completedDates} today={today} />

      <ConfirmDialog
        open={confirmingDelete}
        title="¿Borrar este hábito?"
        description={`Se borrará «${habit.name}» junto con todo su historial. Esta acción no se puede deshacer.`}
        confirmLabel="Borrar"
        pending={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </li>
  );
}
