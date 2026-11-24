type BrandMarkProps = {
  size?: "sm" | "lg";
};

export function BrandMark({ size = "sm" }: BrandMarkProps) {
  const large = size === "lg";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`grid place-items-center rounded-xl bg-ember text-paper ${large ? "size-11" : "size-8"}`}
      >
        <svg viewBox="0 0 24 24" className={large ? "size-6" : "size-4.5"} fill="currentColor">
          <path d="M12 2c.8 3.2 5 4.8 5 9.6a5 5 0 0 1-10 0c0-2.4 1.6-4 2.4-4.8 0 1.6.8 2.4 1.6 2.4 0-2.4-.8-4.8 1-7.2z" />
        </svg>
      </span>
      <span
        className={`font-display font-semibold tracking-tight text-ink ${large ? "text-3xl" : "text-xl"}`}
      >
        Rachas
      </span>
    </span>
  );
}
