export type ValidationResult = { ok: true; value: string } | { ok: false; error: string };

export const HABIT_NAME_MAX_LENGTH = 40;
export const PASSWORD_MIN_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Counts code points so an emoji in the name counts as one character.
const lengthOf = (text: string): number => Array.from(text).length;

export const validateHabitName = (name: string): ValidationResult => {
  const value = name.trim();
  if (value.length === 0) {
    return { ok: false, error: "Escribe un nombre para el hábito." };
  }
  if (lengthOf(value) > HABIT_NAME_MAX_LENGTH) {
    return {
      ok: false,
      error: `El nombre no puede tener más de ${HABIT_NAME_MAX_LENGTH} caracteres.`,
    };
  }
  return { ok: true, value };
};

export const validateEmail = (email: string): ValidationResult => {
  const value = email.trim();
  if (value.length === 0) {
    return { ok: false, error: "Escribe tu correo electrónico." };
  }
  if (!EMAIL_PATTERN.test(value)) {
    return { ok: false, error: "El correo electrónico no es válido." };
  }
  return { ok: true, value };
};

export const validatePassword = (password: string): ValidationResult => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      ok: false,
      error: `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
    };
  }
  return { ok: true, value: password };
};

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/missing-email": "Escribe tu correo electrónico.",
  "auth/missing-password": "Escribe tu contraseña.",
  "auth/invalid-credential": "El correo o la contraseña no son correctos.",
  "auth/wrong-password": "El correo o la contraseña no son correctos.",
  "auth/user-not-found": "El correo o la contraseña no son correctos.",
  "auth/email-already-in-use": "Ya existe una cuenta con este correo.",
  "auth/weak-password": `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`,
  "auth/user-disabled": "Esta cuenta está desactivada.",
  "auth/too-many-requests": "Demasiados intentos. Espera unos minutos y vuelve a probar.",
  "auth/network-request-failed": "No hay conexión. Comprueba tu red e inténtalo de nuevo.",
  "auth/operation-not-allowed": "El acceso con correo y contraseña no está disponible.",
};

const DEFAULT_AUTH_ERROR = "No se ha podido completar la operación. Inténtalo de nuevo.";

/** Translates a Firebase Auth error code (`auth/...`) into a Spanish message. */
export const authErrorMessage = (code: string): string =>
  AUTH_ERROR_MESSAGES[code] ?? DEFAULT_AUTH_ERROR;
