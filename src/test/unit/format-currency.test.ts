import { describe, expect, it } from "vitest";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format-currency";

describe("formatCurrency", () => {
  it("returns em dash for null/undefined", () => {
    expect(formatCurrency(null)).toBe("—");
    expect(formatCurrency(undefined)).toBe("—");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("₹0");
  });

  it("formats positive integers", () => {
    expect(formatCurrency(100)).toBe("₹100");
    expect(formatCurrency(1500)).toBe("₹1,500");
    expect(formatCurrency(100000)).toBe("₹1,00,000");
  });

  it("formats decimal values", () => {
    expect(formatCurrency(99.99)).toBe("₹99.99");
    expect(formatCurrency(1000.5)).toBe("₹1,000.5");
  });

  it("formats negative values", () => {
    expect(formatCurrency(-500)).toBe("-₹500");
    expect(formatCurrency(-99.99)).toBe("-₹99.99");
  });

  it("formats large numbers", () => {
    expect(formatCurrency(10000000)).toBe("₹1,00,00,000");
  });
});

describe("formatCurrencyCompact", () => {
  it("formats values less than 1000 with full format", () => {
    expect(formatCurrencyCompact(0)).toBe("₹0");
    expect(formatCurrencyCompact(500)).toBe("₹500");
    expect(formatCurrencyCompact(999)).toContain("₹");
  });

  it("uses K suffix for thousands", () => {
    expect(formatCurrencyCompact(1000)).toBe("₹1.0K");
    expect(formatCurrencyCompact(1500)).toBe("₹1.5K");
    expect(formatCurrencyCompact(99900)).toBe("₹99.9K");
  });

  it("uses L suffix for lakhs", () => {
    expect(formatCurrencyCompact(100000)).toBe("₹1.0L");
    expect(formatCurrencyCompact(250000)).toBe("₹2.5L");
    expect(formatCurrencyCompact(9990000)).toBe("₹99.9L");
  });

  it("uses Cr suffix for crores", () => {
    expect(formatCurrencyCompact(10000000)).toBe("₹1.0Cr");
    expect(formatCurrencyCompact(150000000)).toBe("₹15.0Cr");
  });

  it("handles negative compact values", () => {
    expect(formatCurrencyCompact(-1000)).toBe("₹-1.0K");
    expect(formatCurrencyCompact(-100000)).toBe("₹-1.0L");
  });
});
