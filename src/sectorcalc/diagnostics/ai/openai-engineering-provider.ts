/**
 * Engineering Diagnostics — OpenAI Engineering Reasoning Provider
 *
 * Server-side OpenAI integration for richer engineering reasoning.
 * Called after deterministic engine runs. Separated from the existing
 * provider (openai-diagnostics-provider.ts) to keep a distinct prompt
 * and output contract.
 *
 * STRICT:
 * - OpenAI NEVER computes or overrides numeric deterministic values
 * - OpenAI only drafts descriptive/narrative content
 * - API key loaded from process.env.OPENAI_API_KEY only
 * - Output passes through Zod validation + guardrails before use
 * - On failure, returns null (caller uses fallback)
 */

import "server-only";
import type { EngineeringDraftInput, AiEngineeringDraft } from "./diagnostic-ai-types";
import { AiEngineeringDraftSchema } from "./diagnostic-ai-schema";
import { redactUserText } from "../report/diagnostic-report-redaction";

const GPT_MODEL = "gpt-4o";
const MAX_RETRIES = 2;

const FORBIDDEN_DETERMINISTIC_FIELDS = [
  "risk_score",
  "total_risk_score",
  "cost_at_risk",
  "decision",
  "decision_state",
  "tolerance_status",
  "expanded_uncertainty",
  "measurement_confidence",
];

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

/**
 * Build the system prompt for the engineering reasoning provider.
 * Instructs the model to behave as an industrial field engineer writing
 * a preliminary decision-support note — never certifying, never approving.
 */
function buildEngineeringPrompt(input: EngineeringDraftInput): string {
  const imageInstruction = input.optional_image
    ? "A photo or visual reference has been provided. Incorporate visual observations from the image into your analysis."
    : "No image provided. Base observations solely on the problem context and deterministic results.";

  return `You are an experienced industrial field engineer writing a preliminary decision-support note. Your role is to help the site engineering team by providing structured reasoning and draft documentation.

CONTEXT:
- Domain: ${input.domain_label} (${input.domain_id})
- Category: ${input.report_contract.domain_section.category}
- Process: ${input.report_contract.domain_section.process_description}
- Common defect modes for this process: ${input.report_contract.domain_section.common_defect_modes.join(", ")}

PROBLEM STATEMENT:
${input.problem_context}

DETERMINISTIC RESULTS (for context only — do NOT restate numeric values, do NOT override):
- Measurement count: ${input.deterministic_result.measurement_count}
- Worst-case tolerance status: ${input.deterministic_result.worst_case_tolerance_status}
- Decision state: ${input.deterministic_result.decision}
- Total risk score range: 0–100 (deterministic engine output)
- Cost at risk: reported by deterministic engine
- Action plan items drafted: ${input.report_contract.action_plan.containment_count + input.report_contract.action_plan.temp_fix_count + input.report_contract.action_plan.permanent_action_count + input.report_contract.action_plan.manual_check_count}

${imageInstruction}

ABSOLUTE RULES:
1. NEVER output any numeric risk score, cost value, or decision — those are computed by the deterministic engine.
2. NEVER claim to certify, guarantee, approve, or accept any part or process.
3. NEVER use phrases like "defect-free", "detects all", "final acceptance", "RUN_OK", "RUN OK", "certified", "guaranteed", "approval".
4. NEVER reference specific standard clauses or coefficients you are not certain about.
5. ALWAYS recommend manual verification for critical findings.
6. ALWAYS base observations only on the provided context.
7. NEVER make up measurement values or technical specifications.
8. If a photo was provided, describe only what is visibly apparent.

OUTPUT FORMAT: Serialize valid JSON with these exact keys:
- visual_observations: array of { observation: string, confidence: number 0-1, manual_verification_required: boolean, severity_hint: "LOW"|"MEDIUM"|"HIGH" }
- engineering_interpretation: string (2-4 paragraphs)
- root_cause_hypotheses: array of { cause: string, likelihood: "LOW"|"MEDIUM"|"HIGH", verification_method: string }
- required_manual_checks: array of strings
- containment_actions: array of strings
- temporary_fix: array of strings
- permanent_corrective_action: array of strings
- ncr_draft: { nonconformity: string, affected_process: string, containment: string, corrective_action: string, verification_method: string }
- capa_draft: { root_cause_hypothesis: string, corrective_action: string, preventive_action: string, evidence_required: string }
- executive_summary: string (1-2 paragraphs for management)
- limitations: array of strings`;
}

/**
 * Validate that the AI output does not contain deterministic field overrides
 * or forbidden claims. Returns cleaned text or null.
 */
function validateDraftText(text: string): string | null {
  const lower = text.toLowerCase();

  for (const field of FORBIDDEN_DETERMINISTIC_FIELDS) {
    const pattern = new RegExp(
      `\\b${field.replace(/_/g, "[ _]")}\\b.*?:\\s*\\d+`,
      "i",
    );
    if (pattern.test(lower)) {
      return null;
    }
  }

  for (const pat of FORBIDDEN_CLAIMS) {
    if (pat.test(text)) {
      return null;
    }
  }

  return text;
}

/**
 * Serialize the entire draft object to JSON and scan for forbidden content.
 */
function validateDraftObject(draft: unknown): boolean {
  const text = JSON.stringify(draft);
  return validateDraftText(text) !== null;
}

/**
 * Call OpenAI to generate richer engineering reasoning.
 * @returns parsed + validated AiEngineeringDraft, or null on failure.
 */
export async function callEngineeringReasoningProvider(
  input: EngineeringDraftInput,
): Promise<AiEngineeringDraft | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const systemPrompt = buildEngineeringPrompt(input);

  const messages: Array<{ role: "system" | "user"; content: string }> = [
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `Generate an engineering reasoning draft for the ${input.domain_label} domain. ${input.optional_image ? "A photo has been attached for visual observation." : "No photo available."}`,
    },
  ];

  if (input.optional_image) {
    messages.push({
      role: "user",
      content: `[Image provided as base64 for visual analysis: ${input.optional_image.slice(0, 50)}...]`,
    });
  }

  let lastError: string | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GPT_MODEL,
          messages,
          response_format: { type: "json_object" },
          temperature: 0.3,
          max_tokens: 8192,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };

      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error("OpenAI returned empty response");
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        throw new Error("OpenAI response was not valid JSON");
      }

      // Guardrail: scan for forbidden deterministic fields and claims
      if (!validateDraftObject(parsed)) {
        throw new Error("Guardrail rejection: forbidden deterministic field or claim detected");
      }

      // Zod validation
      const zodResult = AiEngineeringDraftSchema.safeParse(parsed);
      if (!zodResult.success) {
        const issues = zodResult.error.issues.map(
          (i) => `${i.path.join(".")}: ${i.message}`,
        );
        throw new Error(`Zod validation failed: ${issues.join("; ")}`);
      }

      // Redact secrets in all string fields
      const redacted = redactDraftSecrets(zodResult.data);
      return redacted;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  console.error("[openai-engineering-provider] Failed after retries:", lastError);
  return null;
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
