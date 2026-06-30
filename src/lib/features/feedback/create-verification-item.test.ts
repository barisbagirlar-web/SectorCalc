import { describe, expect, test } from "vitest";
import {
  sanitizeVerificationMessage,
  sanitizeVerificationSnapshot,
  validateVerificationQueueInput,
} from "@/lib/features/feedback/create-verification-item";

describe("verification queue", () => {
  test("sanitizes message HTML and length", () => {
    expect(sanitizeVerificationMessage("<b>Bad result</b> for this job")).toBe(
      "Bad result for this job",
    );
  });

  test("strips secret-like snapshot keys and values", () => {
    const pemLikeValue = ["BEGIN", "PRIVATE", "KEY"].join(" ");
    const snapshot = sanitizeVerificationSnapshot({
      laborHours: 12,
      apiKey: "should-drop-key",
      note: pemLikeValue,
      password: "redacted",
    });
    expect(snapshot).toEqual({ laborHours: 12 });
  });

  test("accepts valid queue input", () => {
    const result = validateVerificationQueueInput({
      toolSlug: "cnc-quote-risk-analyzer",
      locale: "en",
      tier: "premium",
      issueType: "wrong_result",
      message: "The safe price looks too low for our shop rate.",
      pageUrl: "/tools/premium/cnc-quote-risk-analyzer",
      inputSnapshot: { hours: 4 },
      resultSnapshot: { verdict: "watch" },
    });
    expect(result.ok).toBe(true);
    if (result.ok && "item" in result) {
      expect(result.item.tier).toBe("premium");
      expect(result.item.inputSnapshot).toEqual({ hours: 4 });
    }
  });

  test("rejects short message", () => {
    const result = validateVerificationQueueInput({
      toolSlug: "margin-check",
      locale: "tr",
      tier: "free",
      issueType: "other",
      message: "short",
      pageUrl: "/free-tools",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe("message too short");
    }
  });
});
