import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { authErrorMessage } from "@/lib/validation";

export type AuthMode = "login" | "register";

/** Signs in or registers. Resolves to a Spanish error message, or `null` on success. */
export const authenticate = async (
  mode: AuthMode,
  email: string,
  password: string,
): Promise<string | null> => {
  const auth = getFirebaseAuth();
  try {
    if (mode === "login") {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
    return null;
  } catch (error) {
    return authErrorMessage(error instanceof FirebaseError ? error.code : "");
  }
};

export const logOut = (): Promise<void> => signOut(getFirebaseAuth());
