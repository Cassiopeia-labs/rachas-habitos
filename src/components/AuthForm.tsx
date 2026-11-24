"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { authenticate, type AuthMode } from "@/lib/auth";
import { PASSWORD_MIN_LENGTH, validateEmail, validatePassword } from "@/lib/validation";

const COPY: Record<
  AuthMode,
  { title: string; subtitle: string; submit: string; pending: string; switchText: string; switchLink: string; switchHref: string }
> = {
  login: {
    title: "Hola de nuevo",
    subtitle: "Entra para seguir con tus rachas.",
    submit: "Iniciar sesión",
    pending: "Entrando…",
    switchText: "¿Aún no tienes cuenta?",
    switchLink: "Regístrate",
    switchHref: "/register",
  },
  register: {
    title: "Empieza tu racha",
    subtitle: "Crea una cuenta para registrar tus hábitos.",
    submit: "Crear cuenta",
    pending: "Creando cuenta…",
    switchText: "¿Ya tienes cuenta?",
    switchLink: "Inicia sesión",
    switchHref: "/login",
  },
};

const inputClass =
  "w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-ember focus:bg-card focus:outline-none focus:ring-3 focus:ring-ember-soft";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const copy = COPY[mode];
  const id = useId();
  const errorId = `${id}-error`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const emailResult = validateEmail(email);
    if (!emailResult.ok) return setError(emailResult.error);
    const passwordResult = validatePassword(password);
    if (!passwordResult.ok) return setError(passwordResult.error);

    setError(null);
    setSubmitting(true);
    // On success the session changes and <GuestOnly> redirects to the panel.
    const failure = await authenticate(mode, emailResult.value, passwordResult.value);
    if (failure) {
      setError(failure);
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-line bg-card p-6 shadow-[0_1px_0_var(--color-line),0_24px_48px_-28px_rgb(122_62_20/0.35)] sm:p-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">{copy.title}</h1>
      <p className="mt-1.5 text-muted">{copy.subtitle}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-email`} className="text-sm font-medium text-ink">
            Correo electrónico
          </label>
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="tu@correo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : undefined}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-password`} className="text-sm font-medium text-ink">
            Contraseña
          </label>
          <input
            id={`${id}-password`}
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={error !== null}
            aria-describedby={error ? errorId : `${id}-hint`}
            className={inputClass}
          />
          {mode === "register" && (
            <p id={`${id}-hint`} className="text-xs text-muted">
              Mínimo {PASSWORD_MIN_LENGTH} caracteres.
            </p>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 rounded-xl bg-ember px-4 py-3 font-semibold text-white transition-colors hover:bg-ember-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-60"
        >
          {submitting ? copy.pending : copy.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {copy.switchText}{" "}
        <Link
          href={copy.switchHref}
          className="font-semibold text-ember-dark underline-offset-4 hover:underline"
        >
          {copy.switchLink}
        </Link>
      </p>
    </div>
  );
}
