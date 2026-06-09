import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { ApiStatusBanner } from "@/components/ApiStatusBanner";

vi.mock("@/lib/google-sheets", () => ({
  isApiConfigured: true,
  isSignedIn: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getUserEmail: vi.fn(),
  initializeGapi: vi.fn().mockResolvedValue(undefined),
  initializeGis: vi.fn(),
}));

const mockSheets = await import("@/lib/google-sheets");

describe("ApiStatusBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    vi.mocked(mockSheets.isSignedIn).mockReturnValue(false);
    vi.mocked(mockSheets.getUserEmail).mockResolvedValue(null);

    const { container } = render(<ApiStatusBanner />);
    expect(container.innerHTML).toBe("");
  });

  it("shows sign-in required when not signed in", async () => {
    vi.mocked(mockSheets.isSignedIn).mockReturnValue(false);
    vi.mocked(mockSheets.getUserEmail).mockResolvedValue(null);

    render(<ApiStatusBanner />);

    await vi.waitFor(() => {
      expect(screen.getByText("Sign in Required")).toBeInTheDocument();
    });
  });

  it("shows connected status when signed in", async () => {
    vi.mocked(mockSheets.isSignedIn).mockReturnValue(true);
    vi.mocked(mockSheets.getUserEmail).mockResolvedValue("user@example.com");

    render(<ApiStatusBanner />);

    await vi.waitFor(() => {
      expect(
        screen.getByText("Connected to Google Sheets"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });
});
