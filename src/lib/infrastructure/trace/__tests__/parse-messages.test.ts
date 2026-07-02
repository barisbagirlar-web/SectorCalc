/**
 * parse-messages.test.ts - industrial validation of message sanitisation.
 *
 * Coverage:
 * - Null/undefined/array edge cases
 * - Invalid role rejection
 * - Content pass-through (normalizeContent preserves whitespace)
 * - Maximum length enforcement (1200)
 * - Maximum message count cap (10)
 * - Type safety (structural assignability to ParsedMessage)
 */
import { describe, expect, test } from "vitest";
import { parseConversationMessages } from "@/lib/infrastructure/trace/parse-messages";
import type { ParsedMessage } from "@/lib/infrastructure/trace/parse-messages";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function msg(role: string, content: string): Record<string, unknown> {
  return { role, content };
}

function expectValidMessage(
  entry: ParsedMessage,
  expectedRole: "user" | "assistant",
  expectedContent: string,
): void {
  expect(entry.role).toBe(expectedRole);
  expect(entry.content).toBe(expectedContent);
  // Ensure content length is bounded
  expect(entry.content.length).toBeLessThanOrEqual(1200);
}

/* ------------------------------------------------------------------ */
/*  Tests - edge cases                                                */
/* ------------------------------------------------------------------ */
describe("parseConversationMessages – edge cases", () => {
  test("returns empty array for null / undefined", () => {
    expect(parseConversationMessages(null)).toEqual([]);
    expect(parseConversationMessages(undefined)).toEqual([]);
  });

  test("returns empty array for non-array input", () => {
    expect(parseConversationMessages("string")).toEqual([]);
    expect(parseConversationMessages(123)).toEqual([]);
    expect(parseConversationMessages({})).toEqual([]);
  });

  test("returns empty array for empty array", () => {
    expect(parseConversationMessages([])).toEqual([]);
  });

  test("filters out null entries", () => {
    const result = parseConversationMessages([null, undefined, msg("user", "hello")]);
    expect(result).toHaveLength(1);
    expectValidMessage(result[0], "user", "hello");
  });

  test("filters out entries with invalid role", () => {
    const result = parseConversationMessages([
      msg("system", "beep"),
      msg("admin", "override"),
      msg("user", "valid"),
    ]);
    expect(result).toHaveLength(1);
    expectValidMessage(result[0], "user", "valid");
  });

  test("filters out empty-string content (falsy after normalizeContent)", () => {
    // normalizeContent returns "" for "" input, but !"" is true → filtered out
    const result = parseConversationMessages([
      msg("user", ""),
      msg("assistant", "  "),
      msg("user", "ok"),
    ]);
    // "" is filtered (falsy), "  " and "ok" pass (truthy)
    expect(result).toHaveLength(2);
    expect(result[0].content).toBe("  ");
    expect(result[1].content).toBe("ok");
  });

  test("filters out non-object array entries", () => {
    const result = parseConversationMessages(["string", 42, msg("user", "real")]);
    expect(result).toHaveLength(1);
    expectValidMessage(result[0], "user", "real");
  });

  test("preserves whitespace through normalizeContent", () => {
    // normalizeContent does NOT trim
    const result = parseConversationMessages([msg("user", "  hello world  ")]);
    expect(result).toHaveLength(1);
    expect(result[0].content).toBe("  hello world  ");
  });
});

/* ------------------------------------------------------------------ */
/*  Tests - valid messages                                            */
/* ------------------------------------------------------------------ */
describe("parseConversationMessages – valid messages", () => {
  test("parses a single user message", () => {
    const result = parseConversationMessages([msg("user", "calculate margin")]);
    expect(result).toHaveLength(1);
    expectValidMessage(result[0], "user", "calculate margin");
  });

  test("parses user and assistant messages", () => {
    const result = parseConversationMessages([
      msg("user", "What is my margin?"),
      msg("assistant", "Let me find the right tool."),
    ]);
    expect(result).toHaveLength(2);
    expectValidMessage(result[0], "user", "What is my margin?");
    expectValidMessage(result[1], "assistant", "Let me find the right tool.");
  });

  test("trims long content to 1200 characters", () => {
    const long = "x".repeat(2000);
    const result = parseConversationMessages([msg("user", long)]);
    expect(result).toHaveLength(1);
    expect(result[0].content.length).toBe(1200);
  });
});

/* ------------------------------------------------------------------ */
/*  Tests - message count cap                                         */
/* ------------------------------------------------------------------ */
describe("parseConversationMessages – message count cap", () => {
  test("keeps only last 10 messages when more provided", () => {
    const messages = Array.from({ length: 15 }, (_, i) => msg("user", `message-${i}`));
    const result = parseConversationMessages(messages);
    expect(result).toHaveLength(10);
    expect(result[0].content).toBe("message-5");
    expect(result[9].content).toBe("message-14");
  });

  test("keeps all messages when fewer than 10", () => {
    const messages = Array.from({ length: 5 }, (_, i) => msg("user", `msg-${i}`));
    const result = parseConversationMessages(messages);
    expect(result).toHaveLength(5);
  });
});

/* ------------------------------------------------------------------ */
/*  Tests - structural type safety                                    */
/* ------------------------------------------------------------------ */
describe("parseConversationMessages – type safety", () => {
  test("returned messages are structurally assignable to ParsedMessage", () => {
    const result = parseConversationMessages([msg("user", "hi")]);
    const typed: ParsedMessage[] = result;
    expect(typed).toHaveLength(1);
    expect(typed[0].role).toBe("user");
    expect(typed[0].content).toBe("hi");
  });
});
