import { describe, expect, test } from "vitest";
import {
  applyToolHelpfulVote,
  clearToolHelpfulVote,
  formatInteractionLikeCount,
  resolveToolHelpfulCount,
} from "@/lib/tools/tool-helpful-count";

describe("applyToolHelpfulVote", () => {
  test("increases on like and decreases on dislike from neutral", () => {
    expect(applyToolHelpfulVote(340, null, "up")).toEqual({ count: 341, vote: "up" });
    expect(applyToolHelpfulVote(340, null, "down")).toEqual({ count: 339, vote: "down" });
  });

  test("switches vote with double delta", () => {
    expect(applyToolHelpfulVote(340, "down", "up")).toEqual({ count: 342, vote: "up" });
    expect(applyToolHelpfulVote(340, "up", "down")).toEqual({ count: 338, vote: "down" });
  });

  test("ignores repeated same vote", () => {
    expect(applyToolHelpfulVote(341, "up", "up")).toEqual({ count: 341, vote: "up" });
  });
});

describe("clearToolHelpfulVote", () => {
  test("reverts active vote delta", () => {
    expect(clearToolHelpfulVote(341, "up")).toEqual({ count: 340, vote: null });
    expect(clearToolHelpfulVote(339, "down")).toEqual({ count: 340, vote: null });
  });
});

describe("resolveToolHelpfulCount", () => {
  test("free tools stay within 1890–15000", () => {
    const samples = [
      "vsm-financial-converter",
      "oee-downtime-calculator",
      "standard-deviation-calculator",
    ];

    for (const slug of samples) {
      const count = resolveToolHelpfulCount(slug, "free");
      expect(count).toBeGreaterThanOrEqual(1890);
      expect(count).toBeLessThanOrEqual(15000);
    }
  });

  test("premium tools stay within 97–4897", () => {
    const samples = [
      "vsm-financial-converter",
      "oee-downtime-calculator",
      "quote-risk-analyzer",
    ];

    for (const slug of samples) {
      const count = resolveToolHelpfulCount(slug, "premium");
      expect(count).toBeGreaterThanOrEqual(97);
      expect(count).toBeLessThanOrEqual(4897);
    }
  });

  test("same slug resolves deterministically", () => {
    const first = resolveToolHelpfulCount("machine-hour-estimator", "free");
    const second = resolveToolHelpfulCount("machine-hour-estimator", "free");
    expect(first).toBe(second);
  });

  test("slug casing does not change count", () => {
    const lower = resolveToolHelpfulCount("machine-hour-estimator", "free");
    const upper = resolveToolHelpfulCount("MACHINE-HOUR-ESTIMATOR", "free");
    expect(lower).toBe(upper);
  });
});

describe("formatInteractionLikeCount", () => {
  test("formats thousands compactly", () => {
    expect(formatInteractionLikeCount(1892)).toBe("1.9K");
    expect(formatInteractionLikeCount(15000)).toBe("15K");
    expect(formatInteractionLikeCount(489)).toBe("489");
  });
});
