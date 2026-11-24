"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/lib/auth-context";

/**
 * Shows its children only without a session; signed-in users go to the panel.
 * The children are always rendered (just hidden while the session resolves) so
 * the page segment is part of the prerender and Next.js can validate instant
 * navigation for it instead of reporting a dropped segment.
 */
export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const ready = !loading && !user;

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  return (
    <>
      {!ready && <LoadingScreen />}
      <div hidden={!ready} className="flex flex-1 flex-col">
        {children}
      </div>
    </>
  );
}
