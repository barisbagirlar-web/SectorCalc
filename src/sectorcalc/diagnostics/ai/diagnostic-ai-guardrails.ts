/**
 * Engineering Diagnostics AI Guardrails
 *
 * Validates AI output before it enters the report pipeline.
 * Two validation paths:
 *   1. validateAiOutput — legacy guard for AiDiagnosticOutput (existing flow)
 *   2. validateEngineeringDraft — new guard for AiEngineeringDraft (ai-draft flow)
 *
 * STRICT:
 * - AI may not override numeric deterministic values
 * - AI may not make certifying or guaranteed claims
 * - AI may not reference hallucinated standards
 * - All output must pass structural validation
 */

import type { AiDiagnosticOutput, AiDiagnosticInput } from "./diagnostic-ai-types";
import type { AiEngineeringDraft } from "./diagnostic-ai-types";
import { AiEngineeringDraftSchema } from "./diagnostic-ai-schema";
import { redactUserText } from "../report/diagnostic-report-redaction";

/* ── Forbidden claim patterns ── */

const FORBIDDEN_CLAIMS = [
  /certified/i,
  /guaranteed/i,
  /defect-free/i,
  /detects? all/i,
  /final acceptance/i,
  /RUN_OK/i,
  /RUN OK/i,
  /100%/,
  /zero defect/i,
  /legally binding/i,
  /warrant(y|ed)/i,
  /approval/i,
];

/* ── Deterministic field names that AI must not restate as value overrides ── */

const NUMERIC_DETERMINISTIC_FIELDS = [
  "risk_score",
  "total_risk_score",
  "cost_at_risk",
  "expanded_uncertainty",
];

const STATE_DETERMINISTIC_FIELDS = [
  "decision",
  "decision_state",
  "tolerance_status",
  "measurement_confidence",
];

/* ── Output shape validation (legacy) ── */

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
 * Validate AI output against guardrails (legacy path).
 * Returns cleaned output or error list.
 */
export function validateAiOutput(
  raw: unknown,
  _input: AiDiagnosticInput,
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
  const stringValues = EXPECTED_KEYS
    .filter((k) => k !== "visual_observations" && k !== "root_cause_hypotheses")
    .map((k) => String(obj[k] ?? ""));
  const allText = stringValues.join(" ").toLowerCase();

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

/* ── New guard: Engineering Draft validation ── */

export interface EngineeringDraftGuardResult {
  ok: boolean;
  draft: AiEngineeringDraft | null;
  errors: string[];
}

/**
 * Validate the richer engineering draft.
 * Uses Zod schema + additional text-level guardrails.
 */
export function validateEngineeringDraft(
  raw: unknown,
): EngineeringDraftGuardResult {
  const errors: string[] = [];

  // 1. Must be an object
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, draft: null, errors: ["AI output is not a valid object"] };
  }

  // 2. Zod structural validation
  const zodResult = AiEngineeringDraftSchema.safeParse(raw);
  if (!zodResult.success) {
    for (const issue of zodResult.error.issues) {
      errors.push(`${issue.path.join(".")}: ${issue.message}`);
    }
    return { ok: false, draft: null, errors };
  }

  const draft = zodResult.data;

  // 3. Scan all string fields for deterministic field overrides
  const allText = JSON.stringify(draft);

  // 3a. Numeric deterministic fields: field name followed within 30 chars by a digit
  for (const field of NUMERIC_DETERMINISTIC_FIELDS) {
    const pattern = new RegExp(
      `\\b${field.replace(/_/g, "[ _]")}\\b.{0,30}?\\d+`,
      "i",
    );
    if (pattern.test(allText)) {
      errors.push(`AI output contains forbidden numeric reference to deterministic field: ${field}`);
    }
  }

  // 3b. State deterministic fields: field name followed by an uppercase state value
  for (const field of STATE_DETERMINISTIC_FIELDS) {
    const pattern = new RegExp(
      `\\b${field.replace(/_/g, "[ _]")}\\b.{0,30}?[A-Z_]{3,}`,
      "s",
    );
    if (pattern.test(allText)) {
      errors.push(`AI output contains forbidden state reference to deterministic field: ${field}`);
    }
  }

  // 4. Scan for forbidden claims
  for (const pat of FORBIDDEN_CLAIMS) {
    if (pat.test(allText)) {
      errors.push(`AI output contains forbidden claim: ${pat.source}`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, draft: null, errors };
  }

  // 5. Redact secrets in all string fields
  const redacted = redactDraftSecrets(draft);

  return { ok: true, draft: redacted, errors: [] };
}

/**
 * Walk all string fields of an AiEngineeringDraft and redact secrets.
 */
function redactDraftSecrets(draft: AiEngineeringDraft): AiEngineeringDraft {
  return {
    ...draft,
    engineering_interpretation: redactUserText(draft.engineering_interpretation),
    executive_summary: redactUserText(draft.executive_summary),
    visual_observations: draft.visual_observations.map((o) => ({
      ...o,
      observation: redactUserText(o.observation),
    })),
    root_cause_hypotheses: draft.root_cause_hypotheses.map((h) => ({
      ...h,
      cause: redactUserText(h.cause),
      verification_method: redactUserText(h.verification_method),
    })),
    required_manual_checks: draft.required_manual_checks.map(redactUserText),
    containment_actions: draft.containment_actions.map(redactUserText),
    temporary_fix: draft.temporary_fix.map(redactUserText),
    permanent_corrective_action: draft.permanent_corrective_action.map(redactUserText),
    limitations: draft.limitations.map(redactUserText),
    ncr_draft: {
      nonconformity: redactUserText(draft.ncr_draft.nonconformity),
      affected_process: redactUserText(draft.ncr_draft.affected_process),
      containment: redactUserText(draft.ncr_draft.containment),
      corrective_action: redactUserText(draft.ncr_draft.corrective_action),
      verification_method: redactUserText(draft.ncr_draft.verification_method),
    },
    capa_draft: {
      root_cause_hypothesis: redactUserText(draft.capa_draft.root_cause_hypothesis),
      corrective_action: redactUserText(draft.capa_draft.corrective_action),
      preventive_action: redactUserText(draft.capa_draft.preventive_action),
      evidence_required: redactUserText(draft.capa_draft.evidence_required),
    },
  };
}
