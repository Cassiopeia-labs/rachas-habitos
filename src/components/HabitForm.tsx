"use client";

import { useId, useState, type FormEvent } from "react";
import { createHabit } from "@/lib/habits";
import {
  DEFAULT_HABIT_EMOJI,
  HABIT_EMOJIS,
  HABIT_NAME_MAX_LENGTH,
  validateHabitEmoji,
  validateHabitName,
} from "@/lib/validation";

export function HabitForm({ uid }: { uid: string }) {
  const id = useId();
  const errorId = `${id}-error`;
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState<string>(DEFAULT_HABIT_EMOJI);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nameResult = validateHabitName(name);
    if (!nameResult.ok) return setError(nameResult.error);
    const emojiResult = validateHabitEmoji(emoji);
    if (!emojiResult.ok) return setError(emojiResult.error);

    setError(null);
    setSubmitting(true);
    const failure = await createHabit(uid, nameResult.value, emojiResult.value);
    setSubmitting(false);
    if (failure) return setError(failure);
    setName("");
    setEmoji(DEFAULT_HABIT_EMOJI);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-3xl border border-line bg-card p-4 shadow-[0_1px_0_var(--color-line)] sm:p-5"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-name`} className="text-sm font-medium text-ink">
          Nuevo hábito
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={`${id}-name`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej.: Beber 2 litros de agua"
            maxLength={HABIT_NAME_MAX_LENGTH}
            autoComplete="off"
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : `${id}-hint`}
            className="min-w-0 flex-1 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-ember focus:bg-card focus:outline-none focus:ring-3 focus:ring-ember-soft"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-ember px-5 py-2.5 font-semibold text-white transition-colors hover:bg-ember-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-60"
          >
            {submitting ? "Añadiendo…" : "Añadir"}
          </button>
        </div>
        <p id={`${id}-hint`} className="text-xs text-muted">
          Máximo {HABIT_NAME_MAX_LENGTH} caracteres.
        </p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Emoji</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {HABIT_EMOJIS.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name={`${id}-emoji`}
                value={option}
                checked={emoji === option}
                onChange={() => setEmoji(option)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="grid size-10 place-items-center rounded-xl border-2 border-transparent bg-paper text-xl transition-colors peer-checked:border-ember peer-checked:bg-ember-soft peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember hover:border-line"
              >
                {option}
              </span>
              <span className="sr-only">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p id={errorId} role="alert" className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
