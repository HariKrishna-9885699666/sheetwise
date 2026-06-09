import { describe, expect, it } from "vitest";
import {
  getMonthTabName,
  getMonthDisplayName,
  parseMonthTabName,
  isValidMonthTab,
  getMonthFromTabName,
  getCurrentMonthTab,
  getNextMonth,
  getPreviousMonth,
  formatDate,
  formatDateShort,
} from "@/lib/date-utils";

describe("getMonthTabName", () => {
  it('formats as "MMMM yyyy"', () => {
    const d = new Date("2024-05-15T12:00:00Z");
    expect(getMonthTabName(d)).toBe("May 2024");
  });

  it("handles December correctly", () => {
    const d = new Date("2024-12-01");
    expect(getMonthTabName(d)).toBe("December 2024");
  });
});

describe("getMonthDisplayName", () => {
  it("returns formatted name for valid date", () => {
    const d = new Date("2024-06-01");
    expect(getMonthDisplayName(d)).toBe("June 2024");
  });

  it('returns "Invalid Date" for NaN date', () => {
    const d = new Date("not-a-date");
    expect(getMonthDisplayName(d)).toBe("Invalid Date");
  });
});

describe("isValidMonthTab", () => {
  it("returns true for correct format", () => {
    expect(isValidMonthTab("May 2024")).toBe(true);
    expect(isValidMonthTab("January 2023")).toBe(true);
    expect(isValidMonthTab("December 2025")).toBe(true);
  });

  it("returns false for invalid format", () => {
    expect(isValidMonthTab("2024-05")).toBe(false);
    expect(isValidMonthTab("Not a date")).toBe(false);
    expect(isValidMonthTab("")).toBe(false);
    expect(isValidMonthTab("05 2024")).toBe(false);
  });
});

describe("parseMonthTabName", () => {
  it("returns a Date for valid inputs", () => {
    const parsed = parseMonthTabName("May 2024");
    expect(Number.isNaN(parsed.getTime())).toBe(false);
    expect(parsed.getFullYear()).toBe(2024);
    expect(parsed.getMonth()).toBe(4);
  });

  it("returns current date fallback for invalid input", () => {
    const result = parseMonthTabName("");
    expect(Number.isNaN(result.getTime())).toBe(false);
  });
});

describe("getMonthFromTabName", () => {
  it("returns start and end dates for a month", () => {
    const { start, end } = getMonthFromTabName("May 2024");
    expect(start.getMonth()).toBe(4);
    expect(start.getFullYear()).toBe(2024);
    expect(end.getMonth()).toBe(4);
    expect(end.getFullYear()).toBe(2024);
  });
});

describe("getCurrentMonthTab", () => {
  it('returns the current month in "MMMM yyyy" format', () => {
    const now = new Date();
    const expected = getMonthTabName(now);
    expect(getCurrentMonthTab()).toBe(expected);
  });
});

describe("getNextMonth", () => {
  it("returns next month", () => {
    expect(getNextMonth("May 2024")).toBe("June 2024");
  });

  it("handles year rollover", () => {
    expect(getNextMonth("December 2024")).toBe("January 2025");
  });
});

describe("getPreviousMonth", () => {
  it("returns previous month", () => {
    expect(getPreviousMonth("May 2024")).toBe("April 2024");
  });

  it("handles year rollover", () => {
    expect(getPreviousMonth("January 2024")).toBe("December 2023");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const d = new Date("2024-05-15");
    expect(formatDate(d)).toBe("May 15, 2024");
  });

  it("formats an ISO string", () => {
    expect(formatDate("2024-05-15")).toBe("May 15, 2024");
  });

  it("returns Invalid Date for invalid date", () => {
    expect(formatDate("invalid-date")).toBe("Invalid Date");
  });
});

describe("formatDateShort", () => {
  it("formats a Date object", () => {
    const d = new Date("2024-05-15");
    expect(formatDateShort(d)).toBe("May 15");
  });

  it("formats an ISO string", () => {
    expect(formatDateShort("2024-05-15")).toBe("May 15");
  });

  it("returns Invalid Date for invalid date", () => {
    expect(formatDateShort("invalid-date")).toBe("Invalid Date");
  });
});
