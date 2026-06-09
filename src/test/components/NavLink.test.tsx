import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavLink } from "@/components/NavLink";

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("NavLink", () => {
  it("renders as an anchor element", () => {
    renderWithRouter(<NavLink to="/test">Go to Test</NavLink>);
    const link = screen.getByRole("link", { name: "Go to Test" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("applies custom className", () => {
    renderWithRouter(
      <NavLink to="/" className="custom-class">
        Home
      </NavLink>,
    );
    const link = screen.getByRole("link", { name: "Home" });
    expect(link.className).toContain("custom-class");
  });
});
