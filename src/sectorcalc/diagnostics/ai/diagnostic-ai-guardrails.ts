/**
 * Engineering Diagnostics AI Guardrails
 *
 * Validates AI output before it enters the report pipeline.
 *
 * STRICT:
 * - AI may not override numeric deterministic values
 * - AI may not make certifying or guaranteed claims
 * - AI may not reference hallucinated standards
 * - All output must pass structural validation
 */

import type { AiDiagnosticOutput, AiDiagnosticInput } from "./diagnostic-ai-types";

/* ── Forbidden claim patterns ── */

const FORBIDDEN_CLAIMS = [
  /certified/i,
  /guaranteed/i,
  /defect-free/i,
  /detects? all/i,
  /final acceptance/i,
  /100%/, 
  /zero defect/i,
  /legally binding/i,
  /warrant(y|ed)/i,
];

/* ── Output shape validation ── */

interface GuardrailResult {
  ok: boolean;
  output: AiDiagnosticOutput | null;
  errors: string[];
}

const EXPECTED_KEYS: (keyof AiDiagnosticOutput)[] = [
  "visual_observations",
  "engineering_interpretation",
  "root_cause_hypotheses",
  "ncr_statement",
  "capa_statement",
  "executive_summary",
  "action_narrative",
];

const ALLOWED_SEVERITY = ["LOW", "MEDIUM", "HIGH"];

/**
 * Validate AI output against guardrails.
 * Returns cleaned output or error list.
 */
export function validateAiOutput(
  raw: unknown,
  input: AiDiagnosticInput,
): GuardrailResult {
  const errors: string[] = [];

  // 1. Must be an object
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, output: null, errors: ["AI output is not a valid object"] };
  }

  const obj = raw as Record<string, unknown>;

  // 2. Check all expected keys exist and are correct types
  for (const key of EXPECTED_KEYS) {
    if (!(key in obj)) {
      errors.push(`Missing field: ${key}`);
      continue;
    }
    const val = obj[key];
    switch (key) {
      case "visual_observations":
        if (!Array.isArray(val)) errors.push("visual_observations must be an array");
        else {
          for (let i = 0; i < val.length; i++) {
            const v = val[i];
            if (!v || typeof v !== "object") {
              errors.push(`visual_observations[${i}] must be an object`);
              continue;
            }
            const vo = v as Record<string, unknown>;
            if (typeof vo.description !== "string") errors.push(`visual_observations[${i}].description must be a string`);
            if (typeof vo.confidence !== "number" || vo.confidence < 0 || vo.confidence > 1) {
              errors.push(`visual_observations[${i}].confidence must be a number 0-1`);
            }
            if (typeof vo.manual_verification_required !== "boolean") {
              errors.push(`visual_observations[${i}].manual_verification_required must be boolean`);
            }
            if (!ALLOWED_SEVERITY.includes(String(vo.severity_hint))) {
              errors.push(`visual_observations[${i}].severity_hint must be LOW/MEDIUM/HIGH`);
            }
          }
        }
        break;
      case "engineering_interpretation":
      case "ncr_statement":
      case "capa_statement":
      case "executive_summary":
      case "action_narrative":
        if (typeof val !== "string") errors.push(`${key} must be a string`);
        break;
      case "root_cause_hypotheses":
        if (!Array.isArray(val)) errors.push("root_cause_hypotheses must be an array");
        else {
          for (let i = 0; i < val.length; i++) {
            if (typeof val[i] !== "string") errors.push(`root_cause_hypotheses[${i}] must be a string`);
          }
        }
        break;
    }
  }

  // 3. Check for numeric override attempts
  // Scan all string values for numeric patterns near decision/risk keywords
  const stringValues = EXPECTED_KEYS
    .filter((k) => k !== "visual_observations" && k !== "root_cause_hypotheses")
    .map((k) => String(obj[k] ?? ""));
  const allText = stringValues.join(" ").toLowerCase();

  // Detect attempts to restate risk score as if AI computed it
  const numericRiskPatterns = [
    /risk score[:\s]*\d+/i,
    /risk.?score[:\s]*\d+/i,
    /total risk[:\s]*\d+/i,
  ];
  for (const pat of numericRiskPatterns) {
    if (pat.test(allText)) {
      errors.push("AI output contains numeric risk score — forbidden");
    }
  }

  // 4. Check forbidden claims
  for (const pat of FORBIDDEN_CLAIMS) {
    if (pat.test(allText)) {
      errors.push(`AI output contains forbidden claim: ${pat.source}`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, output: null, errors };
  }

  // 5. Build typed output
  const output: AiDiagnosticOutput = {
    visual_observations: (obj.visual_observations as Array<Record<string, unknown>>).map((v) => ({
      description: String(v.description ?? ""),
      severity_hint: (String(v.severity_hint ?? "LOW")) as "LOW" | "MEDIUM" | "HIGH",
      confidence: Number(v.confidence ?? 0),
      manual_verification_required: Boolean(v.manual_verification_required),
    })),
    engineering_interpretation: String(obj.engineering_interpretation ?? ""),
    root_cause_hypotheses: Array.isArray(obj.root_cause_hypotheses)
      ? (obj.root_cause_hypotheses as string[]).map(String)
      : [],
    ncr_statement: String(obj.ncr_statement ?? ""),
    capa_statement: String(obj.capa_statement ?? ""),
    executive_summary: String(obj.executive_summary ?? ""),
    action_narrative: String(obj.action_narrative ?? ""),
  };

  return { ok: true, output, errors: [] };
}
