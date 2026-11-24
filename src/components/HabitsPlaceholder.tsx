export function HabitsPlaceholder() {
  return (
    <section className="rounded-3xl border border-dashed border-line bg-card px-6 py-14 text-center">
      <span aria-hidden="true" className="text-4xl">
        🌱
      </span>
      <p className="mt-3 font-display text-xl font-semibold text-ink">
        Tus hábitos aparecerán aquí
      </p>
      <p className="mt-1 text-sm text-muted">Muy pronto podrás crearlos y marcarlos cada día.</p>
    </section>
  );
}
