/**
 * Tests: AI Guardrails — Engineering Draft Validation
 *
 * Verifies:
 * 1. Zod validates correct AI output
 * 2. AI output with deterministic field names is rejected
 * 3. Forbidden claims are rejected
 * 4. Secret-like strings are redacted in guard output
 * 5. Invalid structure is rejected
 * 6. Empty/missing fields are rejected
 */

import { describe, it, expect } from "vitest";
import { validateEngineeringDraft } from "../ai/diagnostic-ai-guardrails";
import { AiEngineeringDraftSchema } from "../ai/diagnostic-ai-schema";
import type { AiEngineeringDraft } from "../ai/diagnostic-ai-types";

/* ── Helpers ── */

function validDraft(): AiEngineeringDraft {
  return {
    visual_observations: [
      {
        observation: "Surface crack detected on weld bead",
        confidence: 0.75,
        manual_verification_required: true,
        severity_hint: "HIGH",
      },
    ],
    engineering_interpretation:
      "The measurements indicate a deviation from nominal that may affect functional fit. Manual inspection recommended.",
    root_cause_hypotheses: [
      {
        cause: "Inadequate cooling during welding process",
        likelihood: "HIGH",
        verification_method: "Review weld parameter logs and perform macro etch test",
      },
    ],
    required_manual_checks: [
      "Visual inspection of weld bead",
      "Verify cooling parameters",
    ],
    containment_actions: [
      "Segregate affected batch for inspection",
    ],
    temporary_fix: [
      "Increase cooling time by 15% pending root cause analysis",
    ],
    permanent_corrective_action: [
      "Update weld procedure specification",
    ],
    ncr_draft: {
      nonconformity: "Weld porosity exceeds acceptable limit per AWS D1.1",
      affected_process: "Welding",
      containment: "Segregate and mark for rework",
      corrective_action: "Adjust welding parameters per engineering review",
      verification_method: "Radiographic testing after rework",
    },
    capa_draft: {
      root_cause_hypothesis: "Inadequate shielding gas flow",
      corrective_action: "Replace gas regulator and recalibrate flow meter",
      preventive_action: "Install flow monitoring alarm",
      evidence_required: "Flow meter calibration certificate, weld parameter logs",
    },
    executive_summary:
      "The welding process shows potential porosity issues. Deterministic engine indicates moderate risk. Manual verification required before release.",
    limitations: [
      "Observations are based on measurement data only",
      "Visual inspection was not performed",
    ],
  };
}

/* ── Tests ── */

describe("AiEngineeringDraftSchema (Zod)", () => {
  it("validates a correct AI output", () => {
    const result = AiEngineeringDraftSchema.safeParse(validDraft());
    expect(result.success).toBe(true);
  });

  it("rejects missing visual_observations", () => {
    const draft = validDraft();
    // @ts-expect-error - testing runtime validation
    delete draft.visual_observations;
    const result = AiEngineeringDraftSchema.safeParse(draft);
    expect(result.success).toBe(false);
  });

  it("rejects empty engineering_interpretation", () => {
    const draft = validDraft();
    draft.engineering_interpretation = "";
    const result = AiEngineeringDraftSchema.safeParse(draft);
    expect(result.success).toBe(false);
  });

  it("rejects invalid severity_hint", () => {
    const draft = validDraft();
    draft.visual_observations[0].severity_hint = "CRITICAL" as "LOW";
    const result = AiEngineeringDraftSchema.safeParse(draft);
    expect(result.success).toBe(false);
  });

  it("rejects confidence out of range", () => {
    const draft = validDraft();
    draft.visual_observations[0].confidence = 1.5;
    const result = AiEngineeringDraftSchema.safeParse(draft);
    expect(result.success).toBe(false);
  });

  it("rejects invalid likelihood", () => {
    const draft = validDraft();
    draft.root_cause_hypotheses[0].likelihood = "CERTAIN" as "LOW";
    const result = AiEngineeringDraftSchema.safeParse(draft);
    expect(result.success).toBe(false);
  });

  it("rejects missing ncr_draft fields", () => {
    const draft = validDraft();
    // @ts-expect-error - testing runtime validation
    delete draft.ncr_draft.nonconformity;
    const result = AiEngineeringDraftSchema.safeParse(draft);
    expect(result.success).toBe(false);
  });

  it("rejects missing capa_draft fields", () => {
    const draft = validDraft();
    // @ts-expect-error - testing runtime validation
    delete draft.capa_draft.corrective_action;
    const result = AiEngineeringDraftSchema.safeParse(draft);
    expect(result.success).toBe(false);
  });
});

describe("validateEngineeringDraft (guardrails)", () => {
  it("passes valid output", () => {
    const result = validateEngineeringDraft(validDraft());
    expect(result.ok).toBe(true);
    expect(result.draft).not.toBeNull();
    expect(result.errors).toHaveLength(0);
  });

  it("rejects non-object input", () => {
    const result = validateEngineeringDraft("not an object");
    expect(result.ok).toBe(false);
    expect(result.draft).toBeNull();
  });

  it("rejects null input", () => {
    const result = validateEngineeringDraft(null);
    expect(result.ok).toBe(false);
    expect(result.draft).toBeNull();
  });

  it("rejects array input", () => {
    const result = validateEngineeringDraft([]);
    expect(result.ok).toBe(false);
    expect(result.draft).toBeNull();
  });

  /* ── Deterministic field rejection ── */

  it("rejects AI output with numeric risk_score override", () => {
    const draft = validDraft();
    draft.engineering_interpretation =
      "The risk_score: 85 indicates high risk according to my analysis.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("risk_score"))).toBe(true);
  });

  it("rejects AI output with total_risk_score override", () => {
    const draft = validDraft();
    draft.engineering_interpretation =
      "My calculated total_risk_score is 72.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("total_risk_score"))).toBe(true);
  });

  it("rejects AI output with cost_at_risk override", () => {
    const draft = validDraft();
    draft.engineering_interpretation =
      "The estimated cost_at_risk: 15000 is concerning.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("cost_at_risk"))).toBe(true);
  });

  it("rejects AI output with decision state override", () => {
    const draft = validDraft();
    draft.engineering_interpretation =
      "My decision: STOP_AND_INSPECT is based on visual analysis.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("decision"))).toBe(true);
  });

  it("rejects AI output with tolerance_status override", () => {
    const draft = validDraft();
    draft.engineering_interpretation =
      "The tolerance_status is BREACH based on my assessment.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("tolerance_status"))).toBe(true);
  });

  it("rejects AI output with expanded_uncertainty override", () => {
    const draft = validDraft();
    draft.engineering_interpretation =
      "expanded_uncertainty: 0.05 exceeds acceptable limit.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("expanded_uncertainty"))).toBe(true);
  });

  it("rejects AI output with measurement_confidence override", () => {
    const draft = validDraft();
    draft.executive_summary =
      "measurement_confidence: LOW due to calibration drift.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("measurement_confidence"))).toBe(true);
  });

  /* ── Forbidden claims ── */

  it("rejects 'certified' claim", () => {
    const draft = validDraft();
    draft.executive_summary = "This part is certified for release.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("certified"))).toBe(true);
  });

  it("rejects 'guaranteed' claim", () => {
    const draft = validDraft();
    draft.executive_summary = "This process is guaranteed defect-free.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("guaranteed"))).toBe(true);
  });

  it("rejects 'defect-free' claim", () => {
    const draft = validDraft();
    draft.engineering_interpretation = "The part appears defect-free.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("defect-free"))).toBe(true);
  });

  it("rejects 'detects all' claim", () => {
    const draft = validDraft();
    draft.engineering_interpretation = "This inspection detects all defects.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("detects? all")) || result.errors.some((e) => e.includes("detects all"))).toBe(true);
  });

  it("rejects 'final acceptance' claim", () => {
    const draft = validDraft();
    draft.executive_summary = "This is final acceptance of the batch.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("final acceptance"))).toBe(true);
  });

  it("rejects 'RUN_OK' claim", () => {
    const draft = validDraft();
    draft.engineering_interpretation = "RUN_OK — machine is safe to operate.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("RUN_OK"))).toBe(true);
  });

  it("rejects 'RUN OK' claim", () => {
    const draft = validDraft();
    draft.engineering_interpretation = "RUN OK — proceed with operation.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("RUN OK")) || result.errors.some((e) => e.includes("RUN_OK"))).toBe(true);
  });

  it("rejects '100%' claim", () => {
    const draft = validDraft();
    draft.executive_summary = "100% of defects are detected.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("100%"))).toBe(true);
  });

  it("rejects 'zero defect' claim", () => {
    const draft = validDraft();
    draft.engineering_interpretation = "We guarantee zero defect output.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("zero defect"))).toBe(true);
  });

  it("rejects 'approval' claim", () => {
    const draft = validDraft();
    draft.executive_summary = "This constitutes my approval for release.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.includes("approval"))).toBe(true);
  });

  /* ── Redaction ── */

  it("redacts API keys from output", () => {
    const draft = validDraft();
    draft.engineering_interpretation =
      "Using key sk-abcdefghijklmnopqrstuvwxyz1234567890 for reference.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(true);
    expect(result.draft!.engineering_interpretation).not.toContain("sk-abcdefghijklmnopqrstuvwxyz1234567890");
    expect(result.draft!.engineering_interpretation).toContain("[REDACTED]");
  });

  it("redacts bearer tokens from output", () => {
    const draft = validDraft();
    draft.executive_summary =
      "Authorization: bearer eyJhbGciOiJIUzI1NiJ9.token.payload";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(true);
    expect(result.draft!.executive_summary).toContain("[REDACTED]");
  });

  it("redacts secrets in observation fields", () => {
    const draft = validDraft();
    draft.visual_observations[0].observation =
      "Found key sk-abcdefghijklmnopqrstuvwxyz123456 in the report.";
    const result = validateEngineeringDraft(draft);
    expect(result.ok).toBe(true);
    expect(result.draft!.visual_observations[0].observation).toContain("[REDACTED]");
  });
});
