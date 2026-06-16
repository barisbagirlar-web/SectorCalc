import { describe, expect, test } from "vitest";
import {
  buildShareUrl,
  isExternalSharePlatform,
} from "@/components/tools/interaction-action-bar-utils";

describe("buildShareUrl", () => {
  const pageUrl = "https://www.sectorcalc.com/en/tools/generated/absenteeism-cost-calculator";
  const title = "Absenteeism Cost Calculator";

  test("builds LinkedIn, X, and Reddit share URLs", () => {
    expect(buildShareUrl("linkedin", pageUrl, title)).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    );
    expect(buildShareUrl("x", pageUrl, title)).toContain("https://x.com/intent/tweet?");
    expect(buildShareUrl("reddit", pageUrl, title)).toContain(
      "https://www.reddit.com/submit?",
    );
  });

  test("returns null for empty page URL", () => {
    expect(buildShareUrl("linkedin", "", title)).toBeNull();
    expect(buildShareUrl("x", "   ", title)).toBeNull();
  });

  test("flags external share platforms", () => {
    expect(isExternalSharePlatform("linkedin")).toBe(true);
    expect(isExternalSharePlatform("x")).toBe(true);
    expect(isExternalSharePlatform("reddit")).toBe(true);
    expect(isExternalSharePlatform("copy")).toBe(false);
  });
});
