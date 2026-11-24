"use client";

import { useEffect, useId, useRef } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Modal confirmation built on the native <dialog>: focus trap and Escape come for free. */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onCancel();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-line bg-card p-6 text-ink shadow-xl backdrop:bg-ink/40"
    >
      <h2 id={`${id}-title`} className="font-display text-xl font-semibold">
        {title}
      </h2>
      <p id={`${id}-description`} className="mt-2 text-sm text-muted">
        {description}
      </p>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          disabled={pending}
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:border-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className="rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger disabled:opacity-60"
        >
          {pending ? "Borrando…" : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
