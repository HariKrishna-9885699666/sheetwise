import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryCards } from "@/components/SummaryCards";

describe("SummaryCards", () => {
  it("renders expense and transaction count", () => {
    render(<SummaryCards expense={1500} transactionCount={10} />);
    expect(screen.getByText("Total Expenses")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("₹1,500")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("formats expense using formatCurrency", () => {
    render(<SummaryCards expense={100000} transactionCount={5} />);
    expect(screen.getByText("₹1,00,000")).toBeInTheDocument();
  });

  it("shows current month in title when provided", () => {
    render(
      <SummaryCards
        expense={500}
        transactionCount={3}
        currentMonth="May 2024"
      />,
    );
    expect(screen.getByText("May 2024 Expenses")).toBeInTheDocument();
  });

  it("renders zero values correctly", () => {
    render(<SummaryCards expense={0} transactionCount={0} />);
    expect(screen.getByText("₹0")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
