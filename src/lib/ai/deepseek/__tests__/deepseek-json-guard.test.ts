import { describe, expect, test } from "vitest";
import {
  assertFinishReasonAllowsJson,
  parseExpectedJson,
  parseJsonText,
  stripMarkdownJsonFence,
  validateSuggestionEnvelope,
} from "@/lib/ai/deepseek/deepseek-json-guard";

describe("deepseek-json-guard", () => {
  test("parses valid JSON", () => {
    const result = parseJsonText('{"ok":true}');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({ ok: true });
    }
  });

  test("parses markdown fenced JSON", () => {
    const fenced = "```json\n{\"taskType\":\"formula_audit\"}\n```";
    expect(stripMarkdownJsonFence(fenced)).toBe('{"taskType":"formula_audit"}');
    const result = parseJsonText(fenced);
    expect(result.ok).toBe(true);
  });

  test("rejects invalid JSON", () => {
    const result = parseJsonText("{not-json");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("invalid_json");
    }
  });

  test("rejects missing top-level keys", () => {
    const envelope = validateSuggestionEnvelope({
      taskType: "formula_audit",
      generatedAt: "2026-01-01T00:00:00.000Z",
      mustNotAutoApply: true,
    });
    expect(envelope.ok).toBe(false);
    if (!envelope.ok) {
      expect(envelope.reason).toBe("missing_keys");
    }
  });

  test("rejects mustNotAutoApply when missing", () => {
    const envelope = validateSuggestionEnvelope({
      taskType: "formula_audit",
      generatedAt: "2026-01-01T00:00:00.000Z",
      items: [],
    });
    expect(envelope.ok).toBe(false);
    if (!envelope.ok) {
      expect(envelope.reason).toBe("must_not_auto_apply");
    }
  });

  test("rejects mustNotAutoApply when false", () => {
    const envelope = validateSuggestionEnvelope({
      taskType: "formula_audit",
      generatedAt: "2026-01-01T00:00:00.000Z",
      mustNotAutoApply: false,
      items: [],
    });
    expect(envelope.ok).toBe(false);
    if (!envelope.ok) {
      expect(envelope.reason).toBe("must_not_auto_apply");
    }
  });

  test("accepts valid suggestion envelope", () => {
    const envelope = validateSuggestionEnvelope({
      taskType: "formula_audit",
      generatedAt: "2026-01-01T00:00:00.000Z",
      mustNotAutoApply: true,
      items: [
        {
          slug: "demo-slug",
          riskLevel: "high",
          rootCause: "label mismatch",
          findings: ["missing validation"],
          suggestedFiles: ["src/example.ts"],
          suggestedChanges: [
            {
              type: "validation_rule",
              description: "Add min/max guard",
              confidence: "high",
            },
          ],
        },
      ],
      extraField: "ignored-for-patch",
    });

    expect(envelope.ok).toBe(true);
    if (envelope.ok) {
      expect(envelope.unknownFields).toEqual({ extraField: "ignored-for-patch" });
    }
  });

  test("rejects truncated finish_reason length", () => {
    const result = parseExpectedJson('{"ok":true}', "length", (parsed) => ({
      ok: true,
      data: parsed,
    }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("truncated");
    }
  });

  test("assertFinishReasonAllowsJson rejects length", () => {
    expect(assertFinishReasonAllowsJson("length").ok).toBe(false);
    expect(assertFinishReasonAllowsJson("stop").ok).toBe(true);
  });
});
