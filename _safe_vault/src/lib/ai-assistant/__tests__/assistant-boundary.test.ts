/**
 * AI assistant boundary tests — ADIM 6 (contract only; no LLM calls).
 */

import { describe, expect, test } from "vitest";
import { ASSISTANT_ALLOWED_ACTIONS } from "@/lib/ai-assistant/assistant-actions";
import {
  assertAssistantActionAllowed,
  ASSISTANT_FORBIDDEN_ACTIONS,
  AssistantBoundaryViolationError,
  isAssistantActionAllowed,
  isAssistantActionForbidden,
} from "@/lib/ai-assistant/assistant-boundary";
import {
  assertAssistantPromptBoundaryContract,
  ASSISTANT_FORBIDDEN_SCOPE,
  ASSISTANT_PROMPT_BOUNDARY_CONTRACT,
  ASSISTANT_PROMPT_BOUNDARY_VERSION,
  buildAssistantSystemPromptBoundary,
} from "@/lib/ai-assistant/assistant-prompts";

describe("assistant allowed actions", () => {
  test.each(ASSISTANT_ALLOWED_ACTIONS)("%s is allowed", (action) => {
    expect(isAssistantActionAllowed(action)).toBe(true);
    expect(isAssistantActionForbidden(action)).toBe(false);
    expect(() => assertAssistantActionAllowed(action)).not.toThrow();
  });
});

describe("assistant forbidden actions", () => {
  test.each(ASSISTANT_FORBIDDEN_ACTIONS)("%s is forbidden", (action) => {
    expect(isAssistantActionAllowed(action)).toBe(false);
    expect(isAssistantActionForbidden(action)).toBe(true);
    expect(() => assertAssistantActionAllowed(action)).toThrow(
      AssistantBoundaryViolationError,
    );
  });

  test("AssistantBoundaryViolationError carries forbidden action", () => {
    try {
      assertAssistantActionAllowed("calculate_result");
      expect.unreachable("Expected forbidden action to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(AssistantBoundaryViolationError);
      if (error instanceof AssistantBoundaryViolationError) {
        expect(error.action).toBe("calculate_result");
      }
    }
  });

  test("unknown action is rejected", () => {
    expect(isAssistantActionAllowed("invent_numbers")).toBe(false);
    expect(() => assertAssistantActionAllowed("invent_numbers")).toThrow(
      /Unknown assistant action/,
    );
  });
});

describe("assistant prompt boundaries", () => {
  test("prompt contract lists allowed and forbidden actions", () => {
    expect(ASSISTANT_PROMPT_BOUNDARY_CONTRACT.version).toBe(
      ASSISTANT_PROMPT_BOUNDARY_VERSION,
    );
    expect(ASSISTANT_PROMPT_BOUNDARY_CONTRACT.allowedActions).toEqual(
      ASSISTANT_ALLOWED_ACTIONS,
    );
    expect(ASSISTANT_PROMPT_BOUNDARY_CONTRACT.forbiddenActions).toEqual(
      ASSISTANT_FORBIDDEN_ACTIONS,
    );
  });

  test("system prompt includes dual-core boundary language", () => {
    const prompt = buildAssistantSystemPromptBoundary();

    expect(prompt).toContain("not a calculation engine");
    expect(prompt).toContain("calculate_result");
    expect(prompt).toContain("final_decision");
    expect(prompt).toContain(ASSISTANT_PROMPT_BOUNDARY_VERSION);
  });

  test("forbidden scope blocks calculation and decision authority", () => {
    expect(ASSISTANT_FORBIDDEN_SCOPE.some((line) => line.includes("compute"))).toBe(
      true,
    );
    expect(
      ASSISTANT_FORBIDDEN_SCOPE.some((line) => line.includes("final")),
    ).toBe(true);
  });

  test("assertAssistantPromptBoundaryContract passes", () => {
    expect(() => assertAssistantPromptBoundaryContract()).not.toThrow();
  });
});
