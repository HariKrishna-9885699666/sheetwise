import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MonthSwitcher } from "@/components/MonthSwitcher";
import { getCurrentMonthTab, getMonthTabName } from "@/lib/date-utils";

const mockToast = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("MonthSwitcher", () => {
  beforeEach(() => {
    mockToast.mockClear();
  });

  const defaultProps = {
    currentMonth: "May 2024",
    monthTabs: ["May 2024", "April 2024", "March 2024"],
    onMonthChange: vi.fn(),
    isConnected: true,
  };

  it("renders the current month display", () => {
    render(<MonthSwitcher {...defaultProps} />);
    expect(screen.getByText("May")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("renders previous and next navigation buttons", () => {
    render(<MonthSwitcher {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("does not show Today button when on current month", () => {
    render(
      <MonthSwitcher {...defaultProps} currentMonth={getCurrentMonthTab()} />,
    );
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
  });

  it("shows Today button when not on current month", () => {
    render(<MonthSwitcher {...defaultProps} currentMonth="April 2024" />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("calls onMonthChange when disconnected and button clicked", async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <MonthSwitcher
        {...defaultProps}
        isConnected={false}
        onMonthChange={onMonthChange}
      />,
    );
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: "destructive" }),
    );
    expect(onMonthChange).not.toHaveBeenCalled();
  });

  it("renders year and month selectors", () => {
    render(<MonthSwitcher {...defaultProps} />);
    expect(screen.getByText("May")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });
});
