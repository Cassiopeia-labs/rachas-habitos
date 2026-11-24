"use client";

import { useEffect, useState } from "react";
import { subscribeHabits } from "@/lib/habits";
import type { Habit } from "@/types/habit";

export type HabitsState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; habits: Habit[] };

type Snapshot = { uid: string } & ({ habits: Habit[]; error: null } | { habits: null; error: string });

/** Real-time habits of `uid`. Only subscribes in the browser, once there is a user. */
export const useHabits = (uid: string): HabitsState => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);

  useEffect(
    () =>
      subscribeHabits(
        uid,
        (habits) => setSnapshot({ uid, habits, error: null }),
        (error) => setSnapshot({ uid, habits: null, error }),
      ),
    [uid],
  );

  // A snapshot from a previous user is never shown while the new one loads.
  if (snapshot === null || snapshot.uid !== uid) return { status: "loading" };
  if (snapshot.error !== null) return { status: "error", error: snapshot.error };
  return { status: "ready", habits: snapshot.habits };
};
