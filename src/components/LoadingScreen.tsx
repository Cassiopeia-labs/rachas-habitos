export function LoadingScreen() {
  return (
    <div role="status" className="flex flex-1 flex-col items-center justify-center gap-3 p-6">
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-3 border-ember-soft border-t-ember"
      />
      <span className="text-sm text-muted">Cargando…</span>
    </div>
  );
}
