// SectorCalc SuperV4 V5.3.1 — Public Proof Pack Builder
// Server-side only. Builds public-safe sections from execution context.
// Must exclude: expression, INTERNAL_SERVER_ONLY, private_formula_registry,
// private_formula_nodes, internal_checker_trace, restricted values, proprietary coefficients.

import type {
  PublicProofPack,
  ServerOutput,
  ServerWarning,
  NormalizedInputAudit,
  ReferenceRangeAudit,
  SensitivityItem,
  FmeaSummary,
  AuditSeal,
  DecisionInterpretation,
  RedactionStatus,
} from "@/sectorcalc/pro-form/contract-types";

export interface ProofPackContext {
  toolName: string;
  outputs: ServerOutput[];
  warnings: ServerWarning[];
  inputAudits: NormalizedInputAudit[];
  referenceRangeAudits: ReferenceRangeAudit[];
  sensitivityItems: SensitivityItem[];
  fmeaSummary: FmeaSummary | null;
  decisionInterpretation: DecisionInterpretation | null;
  auditSeal: AuditSeal | null;
  businessImpact?: Record<string, unknown> | null;
  uncertaintySummary?: string[];
  status: "OK" | "REVIEW" | "BLOCKED";
}

function section(id: string, title: string, content: string): { id: string; title: string; public_content: string } {
  return { id, title, public_content: content };
}

function buildInputSummarySection(audits: NormalizedInputAudit[]): string {
  return audits
    .map((a) => `${a.input_id}: source=${a.source_status}, value=${JSON.stringify(a.base_value)} ${a.base_unit ?? ""}`)
    .join("\n");
}

function buildNormalizedSummarySection(audits: NormalizedInputAudit[]): string {
  return audits
    .map((a) => `${a.input_id} → ${a.normalized_id}: ${JSON.stringify(a.base_value)} ${a.base_unit ?? ""}`)
    .join("\n");
}

function buildReferenceRangeSection(audits: ReferenceRangeAudit[]): string {
  if (audits.length === 0) return "No reference range checks performed.";
  return audits
    .map((a) => `${a.input_id}: ${a.value} ${a.unit} — ${a.status} (range: ${a.range_min ?? "-∞"} – ${a.range_max ?? "∞"} ${a.range_unit})`)
    .join("\n");
}

function buildSourceEvidenceSection(audits: NormalizedInputAudit[]): string {
  return audits
    .map((a) => `${a.input_id}: source_status=${a.source_status}`)
    .join("\n");
}

function buildOutputTable(outputs: ServerOutput[]): string {
  return outputs
    .map((o) => `${o.name ?? o.id}: ${JSON.stringify(o.value)} [${o.status}]`)
    .join("\n");
}

function buildWarningSummary(warnings: ServerWarning[]): string {
  if (warnings.length === 0) return "No warnings.";
  return warnings.map((w) => `[${w.severity}] ${w.message}`).join("\n");
}

function buildDecisionSection(di: DecisionInterpretation | null): string {
  if (!di) return "Decision: NOT COMPUTED";
  return [
    `Decision: ${di.primary_decision}`,
    `Reason: ${di.primary_reason}`,
    `Hidden risks: ${di.hidden_risk_explanations.length}`,
  ].join("\n");
}

function buildAuditSealSection(seal: AuditSeal | null): string {
  if (!seal) return "No audit seal generated.";
  return [
    `Status: ${seal.seal_status}`,
    `Algorithm: ${seal.hash_algorithm}`,
    `Schema hash: ${seal.schema_hash}`,
    `Output hash: ${seal.output_hash}`,
    `Signature: ${seal.signature_status}`,
  ].join("\n");
}

function buildFmeaSection(summary: FmeaSummary | null): string {
  if (!summary || !summary.triggered) return "FMEA: Not triggered.";
  return [
    `FMEA triggered: true`,
    `Total RPN: ${summary.total_rpn}`,
    `Highest RPN: ${summary.highest_rpn}`,
    `Threshold exceeded: ${summary.threshold_exceeded}`,
    ...summary.items.map((i) => `  ${i.failure_mode}: S=${i.severity} O=${i.occurrence} D=${i.detection} RPN=${i.rpn}`),
  ].join("\n");
}

function buildBusinessImpactSection(impact: Record<string, unknown> | null | undefined): string {
  if (!impact) return "Business impact analysis not performed.";
  return JSON.stringify(impact, null, 2);
}

function buildUncertaintySummary(summary?: string[]): string {
  if (!summary || summary.length === 0) return "Uncertainty analysis not performed.";
  return summary.join("\n");
}

export function buildPublicProofPack(context: ProofPackContext): PublicProofPack {
  const {
    inputAudits,
    referenceRangeAudits,
    outputs,
    warnings,
    decisionInterpretation,
    auditSeal,
    fmeaSummary,
    businessImpact,
    uncertaintySummary,
    toolName,
  } = context;

  const sections: Array<{ id: string; title: string; public_content: string }> = [
    section("input_summary", "Input Summary", buildInputSummarySection(inputAudits)),
    section("normalized_input_summary", "Normalized Input Summary", buildNormalizedSummarySection(inputAudits)),
    section("reference_range_review", "Reference Range Review", buildReferenceRangeSection(referenceRangeAudits)),
    section("source_evidence_register", "Source Evidence Register", buildSourceEvidenceSection(inputAudits)),
    section("calibration_trace_summary", "Calibration Trace", "Calibration trace data not available for this calculation."),
    section("protected_methodology_summary", "Protected Methodology", "Proprietary methodology applied per SectorCalc V5.3.1 standards."),
    section("assumptions_and_limitations", "Assumptions & Limitations", [
      "All inputs are assumed accurate as provided.",
      "Results are for informational purposes only. Verify before business decisions.",
      "This is a technical simulation — not financial, legal, or engineering advice.",
      `Calculation performed using SectorCalc ${toolName}.`,
    ].join("\n")),
    section("output_table", "Output Table", buildOutputTable(outputs)),
    section("uncertainty_summary", "Uncertainty Summary", buildUncertaintySummary(uncertaintySummary)),
    section("warning_summary", "Warning Summary", buildWarningSummary(warnings)),
    section("fmea_summary", "FMEA Summary", buildFmeaSection(fmeaSummary)),
    section("business_impact_summary", "Business Impact", buildBusinessImpactSection(businessImpact)),
    section("decision_interpretation", "Decision Interpretation", buildDecisionSection(decisionInterpretation)),
    section("audit_seal", "Audit Seal", buildAuditSealSection(auditSeal)),
  ];

  return {
    enabled: true,
    redaction_status: "PUBLIC_SAFE_REDACTED" as RedactionStatus,
    sections,
  };
}
