import { describe, expect, it } from "vitest";
import { extractFileIdFromUrl } from "@/lib/google-drive";

describe("google-drive", () => {
  it("extractFileIdFromUrl returns null for empty input", () => {
    expect(extractFileIdFromUrl("")).toBeNull();
  });

  it("extractFileIdFromUrl supports common drive url patterns", () => {
    expect(
      extractFileIdFromUrl(
        "https://drive.google.com/uc?export=view&id=FILE123",
      ),
    ).toBe("FILE123");

    expect(
      extractFileIdFromUrl(
        "https://drive.google.com/thumbnail?id=FILE456&foo=bar",
      ),
    ).toBe("FILE456");

    expect(
      extractFileIdFromUrl("https://drive.google.com/file/d/FILE789/view"),
    ).toBe("FILE789");

    expect(
      extractFileIdFromUrl("https://drive.google.com/open?id=FILEABC"),
    ).toBe("FILEABC");
  });

  it("returns null for unknown patterns", () => {
    expect(
      extractFileIdFromUrl("https://example.com/not-a-drive-url"),
    ).toBeNull();
  });
});
