import { describe, expect, test } from "vitest";
import {
  buildFeedbackPayload,
  getFeedbackSeverity,
  normalizeFeedbackKind,
  sanitizeFeedbackText,
  validateFeedbackPayload,
} from "@/lib/feedback/validation";
import type { ToolFeedbackSubmitInput } from "@/lib/feedback/types";

const baseInput: ToolFeedbackSubmitInput = {
  kind: "formula_objection",
  message: "This formula does not match our shop floor reality for setup time.",
  toolSlug: "cnc-quote-risk-analyzer",
  toolType: "premium",
  locale: "en",
  routePath: "/tools/premium/cnc-quote-risk-analyzer",
  source: "smart_form",
  companyWebsiteHidden: "",
};

describe("feedback validation", () => {
  test("accepts valid payload", () => {
    const errors = validateFeedbackPayload(baseInput);
    expect(Object.keys(errors)).toHaveLength(0);
    const built = buildFeedbackPayload(baseInput);
    expect(built?.kind).toBe("formula_objection");
  });

  test("rejects short message", () => {
    const errors = validateFeedbackPayload({ ...baseInput, message: "short" });
    expect(errors.message).toBe("tooShort");
  });

  test("rejects long message", () => {
    const errors = validateFeedbackPayload({
      ...baseInput,
      message: "x".repeat(2001),
    });
    expect(errors.message).toBe("tooLong");
  });

  test("rejects invalid kind", () => {
    const errors = validateFeedbackPayload({ ...baseInput, kind: "invalid_kind" as never });
    expect(errors.kind).toBe("required");
  });

  test("rejects invalid URL", () => {
    const errors = validateFeedbackPayload({
      ...baseInput,
      dataSourceUrl: "not-a-url",
    });
    expect(errors.dataSourceUrl).toBe("invalidUrl");
  });

  test("blocks honeypot payload", () => {
    const errors = validateFeedbackPayload({
      ...baseInput,
      companyWebsiteHidden: "spam-bot",
    });
    expect(errors.form).toBe("honeypot");
  });

  test("sanitizer strips HTML tags", () => {
    expect(sanitizeFeedbackText("<script>alert(1)</script>Field note")).toBe(
      "alert(1)Field note",
    );
  });

  test("severity mapping for formula objection", () => {
    expect(getFeedbackSeverity("formula_objection")).toBe("high");
    expect(getFeedbackSeverity("usability_issue")).toBe("low");
  });

  test("normalizeFeedbackKind returns null for unknown", () => {
    expect(normalizeFeedbackKind("bad")).toBeNull();
    expect(normalizeFeedbackKind("missing_input")).toBe("missing_input");
  });
});
