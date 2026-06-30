import { describe, expect, test } from "vitest";
import {
  assertLlmActionAllowed,
  isLlmActionAllowed,
  LlmBoundaryViolationError,
} from "@/lib/features/formula-governance/llm-interface/llm-boundary-policy";

describe("llm boundary policy", () => {
  test("extract_structured_inputs is allowed", () => {
    expect(isLlmActionAllowed("extract_structured_inputs")).toBe(true);
    expect(() => assertLlmActionAllowed("extract_structured_inputs")).not.toThrow();
  });

  test("normalize_units is allowed", () => {
    expect(isLlmActionAllowed("normalize_units")).toBe(true);
  });

  test("generate_missing_input_question is allowed", () => {
    expect(isLlmActionAllowed("generate_missing_input_question")).toBe(true);
  });

  test("calculate_result is forbidden", () => {
    expect(isLlmActionAllowed("calculate_result")).toBe(false);
    expect(() => assertLlmActionAllowed("calculate_result")).toThrow(LlmBoundaryViolationError);
  });

  test("choose_formula is forbidden", () => {
    expect(() => assertLlmActionAllowed("choose_formula")).toThrow(LlmBoundaryViolationError);
  });

  test("override_oracle is forbidden", () => {
    expect(() => assertLlmActionAllowed("override_oracle")).toThrow(LlmBoundaryViolationError);
  });

  test("bypass_validation is forbidden", () => {
    expect(() => assertLlmActionAllowed("bypass_validation")).toThrow(LlmBoundaryViolationError);
  });

  test("assertLlmActionAllowed throws on forbidden action", () => {
    try {
      assertLlmActionAllowed("mutate_production_output");
      expect.unreachable("Expected forbidden action to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(LlmBoundaryViolationError);
      if (error instanceof LlmBoundaryViolationError) {
        expect(error.action).toBe("mutate_production_output");
      }
    }
  });
});
