import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

describe("DeleteConfirmDialog", () => {
  it("renders when open is true", () => {
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );
    expect(screen.getByText("Delete Transaction")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete this transaction/),
    ).toBeInTheDocument();
  });

  it("calls onConfirm when Delete button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={vi.fn()}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onOpenChange with false when Cancel is clicked", () => {
    const onOpenChange = vi.fn();
    render(
      <DeleteConfirmDialog
        open={true}
        onOpenChange={onOpenChange}
        onConfirm={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onOpenChange).toHaveBeenCalled();
  });
});
