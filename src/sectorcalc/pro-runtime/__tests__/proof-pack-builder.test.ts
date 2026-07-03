// SectorCalc V5.3.1 — Proof Pack Builder Tests

import { describe, it, expect } from "vitest";
import { buildPublicProofPack, type ProofPackContext } from "../proof-pack-builder";
import type { ServerOutput, ServerWarning, NormalizedInputAudit, ReferenceRangeAudit, AuditSeal, DecisionInterpretation } from "@/sectorcalc/pro-form/contract-types";

const mockOutputs: ServerOutput[] = [
  { id: "result", name: "Result", value: 42, status: "OK", public_explanation: "Test result", decision_use: "Primary" },
];

const mockWarnings: ServerWarning[] = [
  { id: "w1", severity: "INFO", message: "Test warning", why_it_matters: "Test", suggested_action: "None" },
];

const mockInputAudits: NormalizedInputAudit[] = [
  { input_id: "length", normalized_id: "length_norm", base_value: 10, base_unit: "m", display_value: 10, source_status: "VERIFIED" },
];

const mockReferenceAudits: ReferenceRangeAudit[] = [
  { input_id: "length", value: 10, unit: "m", range_min: 0, range_max: 100, range_unit: "m", status: "INSIDE", source: "ISO standard", warning_message: "" },
];

const mockSeal: AuditSeal = {
  seal_status: "SEALED",
  hash_algorithm: "SHA-256",
  schema_hash: "sh-001",
  formula_version: "1.0.0",
  schema_version: "1.0.0",
  runtime_version: "1.0.0",
  input_hash: "ih-001",
  output_hash: "oh-001",
  executed_at: new Date().toISOString(),
  redaction_status: "PUBLIC_SAFE_REDACTED",
  signature_status: "UNSIGNED",
};

const mockDecision: DecisionInterpretation = {
  primary_decision: "OK",
  primary_reason: "All tests passed",
  user_profile_summary: { operator: "OK", engineer: "OK", owner_cfo: "OK", checker_auditor: "OK" },
  hidden_risk_explanations: [],
  money_impact_summary: { enabled: false, currency: null, money_at_risk_formatted: null, main_cost_driver: null, quote_or_decision_impact: "" },
  what_can_flip_the_decision: [],
  next_best_actions: [],
  premium_unlock_reason: "N/A",
};

const baseContext: ProofPackContext = {
  toolName: "Test Tool",
  outputs: mockOutputs,
  warnings: mockWarnings,
  inputAudits: mockInputAudits,
  referenceRangeAudits: mockReferenceAudits,
  sensitivityItems: [],
  fmeaSummary: null,
  decisionInterpretation: mockDecision,
  auditSeal: mockSeal,
  businessImpact: null,
  uncertaintySummary: ["Low uncertainty"],
  status: "OK",
};

describe("buildPublicProofPack", () => {
  it("returns proof pack with enabled=true", () => {
    const proofPack = buildPublicProofPack(baseContext);
    expect(proofPack.enabled).toBe(true);
    expect(proofPack.redaction_status).toBe("PUBLIC_SAFE_REDACTED");
  });

  it("includes all required public sections", () => {
    const proofPack = buildPublicProofPack(baseContext);
    const sectionIds = proofPack.sections.map((s) => s.id);
    expect(sectionIds).toContain("input_summary");
    expect(sectionIds).toContain("normalized_input_summary");
    expect(sectionIds).toContain("reference_range_review");
    expect(sectionIds).toContain("source_evidence_register");
    expect(sectionIds).toContain("output_table");
    expect(sectionIds).toContain("warning_summary");
    expect(sectionIds).toContain("decision_interpretation");
    expect(sectionIds).toContain("audit_seal");
    expect(sectionIds).toContain("assumptions_and_limitations");
    expect(sectionIds).toContain("fmea_summary");
    expect(sectionIds).toContain("business_impact_summary");
    expect(sectionIds).toContain("uncertainty_summary");
    expect(sectionIds).toContain("protected_methodology_summary");
    expect(sectionIds).toContain("calibration_trace_summary");
  });

  it("includes output values in output_table section", () => {
    const proofPack = buildPublicProofPack(baseContext);
    const outputSection = proofPack.sections.find((s) => s.id === "output_table");
    expect(outputSection).toBeDefined();
    expect(outputSection!.public_content).toContain("42");
    expect(outputSection!.public_content).toContain("OK");
  });

  it("includes warning messages", () => {
    const proofPack = buildPublicProofPack(baseContext);
    const warnSection = proofPack.sections.find((s) => s.id === "warning_summary");
    expect(warnSection).toBeDefined();
    expect(warnSection!.public_content).toContain("Test warning");
  });

  it("includes decision interpretation", () => {
    const proofPack = buildPublicProofPack(baseContext);
    const diSection = proofPack.sections.find((s) => s.id === "decision_interpretation");
    expect(diSection).toBeDefined();
    expect(diSection!.public_content).toContain("OK");
  });

  it("includes audit seal", () => {
    const proofPack = buildPublicProofPack(baseContext);
    const sealSection = proofPack.sections.find((s) => s.id === "audit_seal");
    expect(sealSection).toBeDefined();
    expect(sealSection!.public_content).toContain("SEALED");
    expect(sealSection!.public_content).toContain("sh-001");
  });

  it("includes reference range review", () => {
    const proofPack = buildPublicProofPack(baseContext);
    const rangeSection = proofPack.sections.find((s) => s.id === "reference_range_review");
    expect(rangeSection).toBeDefined();
    expect(rangeSection!.public_content).toContain("INSIDE");
  });

  it("includes FMEA summary when triggered", () => {
    const ctx: ProofPackContext = {
      ...baseContext,
      fmeaSummary: {
        triggered: true,
        items: [{ failure_mode: "Test failure", effect: "Test effect", severity: 8, occurrence: 4, detection: 3, rpn: 96, control_measure: "Test control" }],
        total_rpn: 96,
        highest_rpn: 96,
        threshold_exceeded: true,
      },
    };
    const proofPack = buildPublicProofPack(ctx);
    const fmeaSection = proofPack.sections.find((s) => s.id === "fmea_summary");
    expect(fmeaSection).toBeDefined();
    expect(fmeaSection!.public_content).toContain("FMEA triggered: true");
    expect(fmeaSection!.public_content).toContain("Test failure");
  });

  it("excludes sensitive keys from proof pack content", () => {
    const proofPack = buildPublicProofPack(baseContext);
    const allContent = proofPack.sections.map((s) => s.public_content).join(" ");
    expect(allContent).not.toContain("exact_expression");
    expect(allContent).not.toContain("INTERNAL_SERVER_ONLY");
    expect(allContent).not.toContain("private_formula_registry");
    expect(allContent).not.toContain("private_formula_nodes");
    expect(allContent).not.toContain("internal_checker_trace");
  });
});

