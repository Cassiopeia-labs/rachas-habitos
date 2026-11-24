import { describe, expect, it } from "vitest";
import {
  authErrorMessage,
  dataErrorMessage,
  HABIT_EMOJIS,
  validateEmail,
  validateHabitEmoji,
  validateHabitName,
  validatePassword,
} from "@/lib/validation";

describe("validateHabitName", () => {
  it("accepts a normal name and trims it", () => {
    expect(validateHabitName("  Leer 20 minutos ")).toEqual({
      ok: true,
      value: "Leer 20 minutos",
    });
  });

  it("rejects an empty name", () => {
    const result = validateHabitName("");
    expect(result.ok).toBe(false);
  });

  it("rejects a name made only of spaces", () => {
    const result = validateHabitName("    ");
    expect(result).toEqual({ ok: false, error: "Escribe un nombre para el hábito." });
  });

  it("accepts exactly 40 characters", () => {
    expect(validateHabitName("a".repeat(40)).ok).toBe(true);
  });

  it("rejects more than 40 characters with a Spanish message", () => {
    expect(validateHabitName("a".repeat(41))).toEqual({
      ok: false,
      error: "El nombre no puede tener más de 40 caracteres.",
    });
  });

  it("measures length after trimming", () => {
    expect(validateHabitName(`  ${"a".repeat(40)}  `).ok).toBe(true);
  });

  it("counts an emoji as 2 characters, like the Firestore rules", () => {
    expect(validateHabitName(`${"a".repeat(38)}🔥`).ok).toBe(true);
    expect(validateHabitName(`${"a".repeat(39)}🔥`).ok).toBe(false);
  });

  it("rejects 40 code points that exceed 40 UTF-16 units", () => {
    expect(validateHabitName(`${"a".repeat(30)}${"💧".repeat(10)}`)).toEqual({
      ok: false,
      error: "El nombre no puede tener más de 40 caracteres.",
    });
    expect(validateHabitName("💧".repeat(20)).ok).toBe(true);
  });
});

describe("validateEmail", () => {
  it("accepts a valid email and trims it", () => {
    expect(validateEmail(" ana@example.com ")).toEqual({ ok: true, value: "ana@example.com" });
  });

  it("rejects an empty email", () => {
    expect(validateEmail("  ")).toEqual({ ok: false, error: "Escribe tu correo electrónico." });
  });

  it("rejects a malformed email", () => {
    expect(validateEmail("ana@example").ok).toBe(false);
    expect(validateEmail("ana example.com").ok).toBe(false);
  });
});

describe("validatePassword", () => {
  it("accepts 6 or more characters", () => {
    expect(validatePassword("123456")).toEqual({ ok: true, value: "123456" });
  });

  it("rejects fewer than 6 characters", () => {
    expect(validatePassword("12345")).toEqual({
      ok: false,
      error: "La contraseña debe tener al menos 6 caracteres.",
    });
  });
});

describe("authErrorMessage", () => {
  it("translates known Firebase codes to Spanish", () => {
    expect(authErrorMessage("auth/email-already-in-use")).toBe(
      "Ya existe una cuenta con este correo.",
    );
    expect(authErrorMessage("auth/invalid-credential")).toBe(
      "El correo o la contraseña no son correctos.",
    );
  });

  it("never returns the raw code for unknown errors", () => {
    const message = authErrorMessage("auth/something-new");
    expect(message).not.toContain("auth/");
    expect(message).toBe("No se ha podido completar la operación. Inténtalo de nuevo.");
  });
});

describe("validateHabitEmoji", () => {
  it("accepts every emoji offered in the picker", () => {
    for (const emoji of HABIT_EMOJIS) {
      expect(validateHabitEmoji(emoji)).toEqual({ ok: true, value: emoji });
    }
  });

  it("rejects empty or unknown values with a Spanish message", () => {
    expect(validateHabitEmoji("")).toEqual({ ok: false, error: "Elige un emoji de la lista." });
    expect(validateHabitEmoji("<script>")).toEqual({
      ok: false,
      error: "Elige un emoji de la lista.",
    });
  });
});

describe("dataErrorMessage", () => {
  it("translates known Firestore codes to Spanish", () => {
    expect(dataErrorMessage("permission-denied")).toBe(
      "No tienes permiso para hacer este cambio.",
    );
    expect(dataErrorMessage("unavailable")).toBe(
      "No hay conexión con el servidor. Inténtalo de nuevo en un momento.",
    );
  });

  it("falls back to a generic Spanish message for unknown codes", () => {
    const message = dataErrorMessage("something-new");
    expect(message).not.toContain("something-new");
    expect(message).toBe("No se han podido guardar los cambios. Inténtalo de nuevo.");
  });
});
