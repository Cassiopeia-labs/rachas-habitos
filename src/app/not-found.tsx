import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        <BrandMark size="lg" />
        <div className="w-full rounded-3xl border border-line bg-card p-6 shadow-[0_1px_0_var(--color-line),0_24px_48px_-28px_rgb(122_62_20/0.35)] sm:p-8">
          <p className="font-display text-5xl font-semibold text-ember">404</p>
          <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
            Esta página no existe
          </h1>
          <p className="mt-1.5 text-muted">
            Puede que el enlace esté mal escrito o que la página se haya movido.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-ember px-5 py-3 font-semibold text-white transition-colors hover:bg-ember-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
          >
            Volver a tus hábitos
          </Link>
        </div>
      </div>
    </main>
  );
}
