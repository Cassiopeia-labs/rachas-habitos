import { describe, expect, it } from "vitest";
import {
  bestStreak,
  completionRate,
  currentStreak,
  lastNDays,
  toDayKey,
} from "@/lib/streaks";

// Months are 0-based in the Date constructor.
const day = (year: number, month: number, date: number, hour = 12) =>
  new Date(year, month - 1, date, hour);

describe("toDayKey", () => {
  it("formats a local date as YYYY-MM-DD with zero padding", () => {
    expect(toDayKey(day(2026, 3, 7))).toBe("2026-03-07");
  });

  it("uses the local day even right before and after midnight", () => {
    expect(toDayKey(new Date(2026, 0, 1, 0, 0, 1))).toBe("2026-01-01");
    expect(toDayKey(new Date(2025, 11, 31, 23, 59, 59))).toBe("2025-12-31");
  });
});

describe("lastNDays", () => {
  it("returns n days ending today, oldest first", () => {
    expect(lastNDays(3, day(2026, 5, 10))).toEqual([
      "2026-05-08",
      "2026-05-09",
      "2026-05-10",
    ]);
  });

  it("crosses month and year boundaries", () => {
    expect(lastNDays(3, day(2026, 1, 1))).toEqual([
      "2025-12-30",
      "2025-12-31",
      "2026-01-01",
    ]);
    expect(lastNDays(2, day(2026, 3, 1))).toEqual(["2026-02-28", "2026-03-01"]);
  });

  it("returns an empty list for zero or negative n", () => {
    expect(lastNDays(0, day(2026, 5, 10))).toEqual([]);
    expect(lastNDays(-2, day(2026, 5, 10))).toEqual([]);
  });

  it("returns 30 distinct days for a 30-day window", () => {
    const days = lastNDays(30, day(2026, 3, 15));
    expect(days).toHaveLength(30);
    expect(new Set(days).size).toBe(30);
    expect(days[0]).toBe("2026-02-14");
  });
});

describe("currentStreak", () => {
  const today = day(2026, 5, 10);

  it("is 0 without records", () => {
    expect(currentStreak([], today)).toBe(0);
  });

  it("is 1 when only today is completed", () => {
    expect(currentStreak(["2026-05-10"], today)).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    expect(currentStreak(["2026-05-08", "2026-05-09", "2026-05-10"], today)).toBe(3);
  });

  it("stays alive when the streak ends yesterday", () => {
    expect(currentStreak(["2026-05-07", "2026-05-08", "2026-05-09"], today)).toBe(3);
  });

  it("is 0 when the last completion was two days ago", () => {
    expect(currentStreak(["2026-05-07", "2026-05-08"], today)).toBe(0);
  });

  it("breaks on a one-day gap", () => {
    expect(currentStreak(["2026-05-06", "2026-05-07", "2026-05-09", "2026-05-10"], today)).toBe(
      2,
    );
  });

  it("continues across a month change", () => {
    expect(currentStreak(["2026-04-29", "2026-04-30", "2026-05-01"], day(2026, 5, 1))).toBe(3);
  });

  it("continues across a year change", () => {
    expect(currentStreak(["2025-12-30", "2025-12-31", "2026-01-01"], day(2026, 1, 1))).toBe(3);
  });

  it("ignores duplicates and order", () => {
    expect(
      currentStreak(["2026-05-10", "2026-05-08", "2026-05-09", "2026-05-10", "2026-05-08"], today),
    ).toBe(3);
  });

  it("ignores completions after today", () => {
    expect(currentStreak(["2026-05-11", "2026-05-12"], today)).toBe(0);
  });
});

describe("bestStreak", () => {
  it("is 0 without records", () => {
    expect(bestStreak([])).toBe(0);
  });

  it("is 1 for a single day", () => {
    expect(bestStreak(["2026-05-10"])).toBe(1);
  });

  it("returns the longest run among several", () => {
    expect(
      bestStreak([
        "2026-05-01",
        "2026-05-02",
        "2026-05-04",
        "2026-05-05",
        "2026-05-06",
        "2026-05-08",
      ]),
    ).toBe(3);
  });

  it("breaks runs on a one-day gap", () => {
    expect(bestStreak(["2026-05-01", "2026-05-03"])).toBe(1);
  });

  it("joins runs across month and year changes", () => {
    expect(bestStreak(["2026-02-27", "2026-02-28", "2026-03-01"])).toBe(3);
    expect(bestStreak(["2025-12-31", "2026-01-01", "2026-01-02"])).toBe(3);
  });

  it("ignores duplicates and order", () => {
    expect(bestStreak(["2026-05-03", "2026-05-01", "2026-05-02", "2026-05-02", "2026-05-01"])).toBe(
      3,
    );
  });
});

describe("completionRate", () => {
  const today = day(2026, 5, 10);

  it("is 0 without records", () => {
    expect(completionRate([], 30, today)).toBe(0);
  });

  it("is 0 for a zero or negative window", () => {
    expect(completionRate(["2026-05-10"], 0, today)).toBe(0);
    expect(completionRate(["2026-05-10"], -5, today)).toBe(0);
  });

  it("returns a rounded percentage of completed days in the window", () => {
    expect(completionRate(["2026-05-10"], 30, today)).toBe(3);
    expect(completionRate(["2026-05-09", "2026-05-10"], 3, today)).toBe(67);
    expect(completionRate(lastNDays(30, today), 30, today)).toBe(100);
  });

  it("ignores days outside the window and in the future", () => {
    expect(completionRate(["2026-04-10", "2026-05-11", "2026-05-10"], 7, today)).toBe(14);
  });

  it("counts duplicated dates once", () => {
    expect(completionRate(["2026-05-10", "2026-05-10"], 2, today)).toBe(50);
  });

  it("includes days across a month change", () => {
    expect(completionRate(["2026-04-30", "2026-05-01"], 2, day(2026, 5, 1))).toBe(100);
  });
});
