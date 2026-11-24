"use client";

import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import { logOut } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";

export function AppHeader() {
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);
    try {
      await logOut();
    } catch {
      setError("No se ha podido cerrar la sesión. Inténtalo de nuevo.");
      setSigningOut(false);
    }
  };

  return (
    <header className="border-b border-line bg-card/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <BrandMark />
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden min-w-0 truncate text-sm text-muted sm:block" title={user?.email ?? ""}>
            {user?.email}
          </span>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ember hover:text-ember-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-60"
          >
            {signingOut ? "Cerrando…" : "Cerrar sesión"}
          </button>
        </div>
      </div>
      {user?.email && (
        <p className="truncate px-4 pb-2 text-xs text-muted sm:hidden">{user.email}</p>
      )}
      {error && (
        <p role="alert" className="mx-auto max-w-3xl px-4 pb-3 text-sm text-danger sm:px-6">
          {error}
        </p>
      )}
    </header>
  );
}
