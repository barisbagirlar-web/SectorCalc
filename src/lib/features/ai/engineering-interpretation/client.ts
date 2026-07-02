/**
 * Engineering interpretation client - server-only.
 * Calls DeepSeek to generate industrial-grade result commentary for premium tools.
 */

import "server-only";
import { callDeepSeekCore } from "@/lib/features/ai/deepseek/deepseek-core";
import { buildInterpretationSystemPrompt, buildInterpretationUserPrompt } from "./prompts";
import {
  buildInterpretationContext,
  type EngineeringInterpretation,
  type InterpretPremiumResultRequest,
  type InterpretPremiumResultResponse,
} from "./types";

/**
 * Parse the raw DeepSeek response into a structured EngineeringInterpretation.
 */
function parseInterpretation(raw: string): EngineeringInterpretation | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const executiveSummary =
      typeof parsed.executiveSummary === "string" ? parsed.executiveSummary.trim() : "";
    const outputAnalyses = Array.isArray(parsed.outputAnalyses)
      ? parsed.outputAnalyses.map((item: Record<string, unknown>) => ({
          outputId: String(item.outputId ?? ""),
          label: String(item.label ?? ""),
          interpretation: String(item.interpretation ?? ""),
          significance: validateSignificance(item.significance),
        }))
      : [];
    const riskAssessment = Array.isArray(parsed.riskAssessment)
      ? parsed.riskAssessment.map((item: Record<string, unknown>) => ({
          factor: String(item.factor ?? ""),
          severity: validateSeverity(item.severity),
          explanation: String(item.explanation ?? ""),
        }))
      : [];
    const recommendations = Array.isArray(parsed.recommendations)
      ? parsed.recommendations.map((item: Record<string, unknown>) => ({
          priority: validatePriority(item.priority),
          action: String(item.action ?? ""),
          expectedImpact: String(item.expectedImpact ?? ""),
        }))
      : [];
    const fieldNotes = Array.isArray(parsed.fieldNotes)
      ? parsed.fieldNotes.map(String)
      : [];
    const confidence = validateConfidence(parsed.confidence);

    if (!executiveSummary) {
      return null;
    }

    return {
      executiveSummary,
      outputAnalyses,
      riskAssessment,
      recommendations,
      fieldNotes,
      confidence,
    };
  } catch {
    return null;
  }
}

function validateSignificance(value: unknown): "critical" | "significant" | "notable" | "informational" {
  const valid = ["critical", "significant", "notable", "informational"] as const;
  const str = String(value).toLowerCase();
  return valid.includes(str as typeof valid[number])
    ? (str as "critical" | "significant" | "notable" | "informational")
    : "notable";
}

function validateSeverity(value: unknown): "high" | "medium" | "low" {
  const valid = ["high", "medium", "low"] as const;
  const str = String(value).toLowerCase();
  return valid.includes(str as typeof valid[number])
    ? (str as "high" | "medium" | "low")
    : "medium";
}

function validatePriority(value: unknown): "immediate" | "short_term" | "long_term" {
  const valid = ["immediate", "short_term", "long_term"] as const;
  const str = String(value).toLowerCase();
  return valid.includes(str as typeof valid[number])
    ? (str as "immediate" | "short_term" | "long_term")
    : "short_term";
}

function validateConfidence(value: unknown): "high" | "medium" | "low" {
  const valid = ["high", "medium", "low"] as const;
  const str = String(value).toLowerCase();
  return valid.includes(str as typeof valid[number])
    ? (str as "high" | "medium" | "low")
    : "medium";
}

/**
 * Generate engineering interpretation for a premium calculation result.
 * Server-only - call from API route or server component.
 */
export async function generateEngineeringInterpretation(
  request: InterpretPremiumResultRequest,
): Promise<InterpretPremiumResultResponse> {
  const context = buildInterpretationContext(request);

  const result = await callDeepSeekCore({
    taskType: "engineering_interpretation",
    messages: [
      { role: "system", content: buildInterpretationSystemPrompt(request.locale) },
      { role: "user", content: buildInterpretationUserPrompt(context) },
    ],
  });

  if (!result.ok) {
    return {
      ok: false,
      error: result.message || "DeepSeek API error",
      fallbackMessage: "Engineering interpretation temporarily unavailable. Please try again later.",
    };
  }

  const interpretation = parseInterpretation(result.data.content);
  if (!interpretation) {
    return {
      ok: false,
      error: "Failed to parse DeepSeek response",
      fallbackMessage: "Unable to generate full interpretation. The raw commentary is available below.",
    };
  }

  return {
    ok: true,
    interpretation,
  };
}
