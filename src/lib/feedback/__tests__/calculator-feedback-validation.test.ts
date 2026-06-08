import { describe, expect, test, vi } from "vitest";
import {
  CALCULATOR_FEEDBACK_CATEGORIES,
  CALCULATOR_FEEDBACK_COMMENT_MAX_LENGTH,
} from "@/lib/feedback/calculator-feedback-types";
import {
  checkCalculatorFeedbackRateLimit,
  recordCalculatorFeedbackSubmission,
  validateCalculatorFeedbackInput,
} from "@/lib/feedback/calculator-feedback-validation";

const baseInput = {
  toolSlug: "cnc-oee-loss",
  tier: "free" as const,
  category: "wrong_unit" as const,
  comment: "",
  pagePath: "/tools/free/cnc-oee-loss",
};

describe("calculator-feedback-validation", () => {
  test("accepts valid minimal input", () => {
    const errors = validateCalculatorFeedbackInput(baseInput);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  test("requires tool slug", () => {
    const errors = validateCalculatorFeedbackInput({
      ...baseInput,
      toolSlug: " ",
    });
    expect(errors.toolSlug).toBeTruthy();
  });

  test("requires valid category", () => {
    const errors = validateCalculatorFeedbackInput({
      ...baseInput,
      category: "",
    });
    expect(errors.category).toBeTruthy();
  });

  test("rejects unknown category", () => {
    const errors = validateCalculatorFeedbackInput({
      ...baseInput,
      category: "invalid_category" as typeof baseInput.category,
    });
    expect(errors.category).toBeTruthy();
  });

  test("requires comment for other category", () => {
    const errors = validateCalculatorFeedbackInput({
      ...baseInput,
      category: "other",
      comment: "bad",
    });
    expect(errors.comment).toBeTruthy();
  });

  test("accepts other category with sufficient comment", () => {
    const errors = validateCalculatorFeedbackInput({
      ...baseInput,
      category: "other",
      comment: "Shift length assumption is wrong for our plant.",
    });
    expect(errors.comment).toBeUndefined();
  });

  test("enforces comment max length", () => {
    const errors = validateCalculatorFeedbackInput({
      ...baseInput,
      comment: "x".repeat(CALCULATOR_FEEDBACK_COMMENT_MAX_LENGTH + 1),
    });
    expect(errors.comment).toBeTruthy();
  });

  test("validates snapshot value types", () => {
    const errors = validateCalculatorFeedbackInput({
      ...baseInput,
      inputSnapshot: { availability: 72, nested: { bad: true } as unknown as number },
    });
    expect(errors.inputSnapshot).toBeTruthy();
  });

  test("all category values are accepted", () => {
    for (const category of CALCULATOR_FEEDBACK_CATEGORIES) {
      const errors = validateCalculatorFeedbackInput({
        ...baseInput,
        category,
        comment: category === "other" ? "Detailed issue description." : "",
      });
      expect(errors.category).toBeUndefined();
    }
  });

  test("rate limit blocks repeat submission for same tool in browser", () => {
    const storage = new Map<string, string>();
    const localStorageMock = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
    };

    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", localStorageMock);

    expect(checkCalculatorFeedbackRateLimit("cnc-oee-loss").allowed).toBe(true);
    recordCalculatorFeedbackSubmission("cnc-oee-loss");
    expect(checkCalculatorFeedbackRateLimit("cnc-oee-loss").allowed).toBe(false);
    expect(checkCalculatorFeedbackRateLimit("other-tool").allowed).toBe(true);

    vi.unstubAllGlobals();
  });
});
