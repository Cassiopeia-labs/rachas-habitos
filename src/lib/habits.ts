import { FirebaseError } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type Firestore,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase";
import type { DayKey } from "@/lib/streaks";
import { dataErrorMessage } from "@/lib/validation";
import type { Habit } from "@/types/habit";

export const getFirebaseDb = (): Firestore => getFirestore(getFirebaseApp());

const habitsCollection = (uid: string) => collection(getFirebaseDb(), "users", uid, "habits");

const habitDoc = (uid: string, habitId: string) =>
  doc(getFirebaseDb(), "users", uid, "habits", habitId);

const toHabit = (snapshot: QueryDocumentSnapshot<DocumentData>): Habit => {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: typeof data.name === "string" ? data.name : "",
    emoji: typeof data.emoji === "string" ? data.emoji : "",
    completedDates: Array.isArray(data.completedDates)
      ? data.completedDates.filter((day): day is DayKey => typeof day === "string")
      : [],
  };
};

const errorMessage = (error: unknown): string =>
  dataErrorMessage(error instanceof FirebaseError ? error.code : "");

/** Resolves to a Spanish error message, or `null` on success. */
const run = async (write: () => Promise<unknown>): Promise<string | null> => {
  try {
    await write();
    return null;
  } catch (error) {
    return errorMessage(error);
  }
};

/**
 * Listens in real time to the user's habits, oldest first. Returns the
 * unsubscribe function. `onError` receives a Spanish message.
 */
export const subscribeHabits = (
  uid: string,
  onData: (habits: Habit[]) => void,
  onError: (message: string) => void,
): (() => void) =>
  onSnapshot(
    query(habitsCollection(uid), orderBy("createdAt", "asc")),
    (snapshot) => onData(snapshot.docs.map(toHabit)),
    (error) => onError(errorMessage(error)),
  );

/** `name` and `emoji` must already be validated (see `lib/validation.ts`). */
export const createHabit = (uid: string, name: string, emoji: string): Promise<string | null> =>
  run(() =>
    addDoc(habitsCollection(uid), {
      name,
      emoji,
      completedDates: [],
      createdAt: serverTimestamp(),
    }),
  );

export const renameHabit = (uid: string, habitId: string, name: string): Promise<string | null> =>
  run(() => updateDoc(habitDoc(uid, habitId), { name }));

export const deleteHabit = (uid: string, habitId: string): Promise<string | null> =>
  run(() => deleteDoc(habitDoc(uid, habitId)));

export const toggleDay = (
  uid: string,
  habitId: string,
  dayKey: DayKey,
  done: boolean,
): Promise<string | null> =>
  run(() =>
    updateDoc(habitDoc(uid, habitId), {
      completedDates: done ? arrayUnion(dayKey) : arrayRemove(dayKey),
    }),
  );
