"use client";

import { useEffect, useState } from "react";
import { toDayKey } from "@/lib/streaks";

const CHECK_INTERVAL_MS = 60_000;

/** The current local date, refreshed when the day changes while the page stays open. */
export const useToday = (): Date => {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => {
      const now = new Date();
      setToday((previous) => (toDayKey(previous) === toDayKey(now) ? previous : now));
    };
    const interval = window.setInterval(refresh, CHECK_INTERVAL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  return today;
};
