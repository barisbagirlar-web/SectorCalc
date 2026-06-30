/**
 * Trust trace report types — Phase 5H-I read-only governance layer.
 */

import type { ToolInputDesignAuditStatus } from "@/lib/features/formula-governance/input-design-audit/input-design-audit-types";
import type { BatchAlignmentStatus } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";
import type { FormulaToolTier, RiskLevel } from "@/lib/features/formula-governance/types";

export type TrustTraceStatus = "trust_trace_ready" | "needs_review" | "blocked";

export type TrustTraceInputClassification = "required" | "optional" | "advanced" | "derived" | "defaulted";

export type TrustTraceInputEntry = {
  readonly key: string;
  readonly classification: TrustTraceInputClassification;
  readonly source: "contract" | "controlled_patch" | "requirement_engine";
  readonly readonly: boolean;
};

export type TrustTraceCoverageStatus = "pass" | "needs_review" | "fail" | "not_wired" | "not_required";

export type TrustTraceCoverageTrace = {
  readonly status: TrustTraceCoverageStatus;
  readonly wired: boolean;
  readonly detail: string;
};

export type TrustTraceReportExportReadiness = {
  readonly pdfReady: boolean;
  readonly excelReady: boolean;
  readonly wordReady: boolean;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type TrustTraceSmartFormMetadata = {
  readonly architectureReady: boolean;
  readonly renderingReady: boolean;
  readonly uiBridgeReady: boolean;
  readonly pilotLive: boolean;
};

export type TrustTraceReport = {
  readonly slug: string;
  readonly title: string;
  readonly tier: FormulaToolTier;
  readonly riskLevel: RiskLevel;
  readonly inputTrace: readonly TrustTraceInputEntry[];
  readonly requiredInputs: readonly string[];
  readonly optionalInputs: readonly string[];
  readonly advancedInputs: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly derivedFields: readonly string[];
  readonly validationTrace: readonly string[];
  readonly formulaContractTrace: readonly string[];
  readonly ontologyTrace: readonly string[];
  readonly requirementEngineTrace: readonly string[];
  readonly oracleCoverage: TrustTraceCoverageTrace;
  readonly scenarioCoverage: TrustTraceCoverageTrace;
  readonly propertyCoverage: TrustTraceCoverageTrace;
  readonly warningTrace: readonly string[];
  readonly limitationTrace: readonly string[];
  readonly reportExportReadiness: TrustTraceReportExportReadiness;
  readonly trustScore: number;
  readonly status: TrustTraceStatus;
  readonly inputDesignStatus?: ToolInputDesignAuditStatus;
  readonly alignmentStatus?: BatchAlignmentStatus;
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export type BuildTrustTraceReportInput = {
  readonly slug: string;
  readonly title: string;
  readonly tier: FormulaToolTier;
  readonly riskLevel: RiskLevel;
  readonly requiredInputs: readonly string[];
  readonly criticalInputs: readonly string[];
  readonly optionalInputs?: readonly string[];
  readonly advancedInputs?: readonly string[];
  readonly defaultedInputs?: readonly string[];
  readonly acceptedAssumptions?: readonly string[];
  readonly derivedFields?: readonly string[];
  readonly validationRules?: readonly string[];
  readonly formulaContractLines?: readonly string[];
  readonly ontologyLines?: readonly string[];
  readonly requirementEngineLines?: readonly string[];
  readonly oracleCoverage: TrustTraceCoverageTrace;
  readonly scenarioCoverage: TrustTraceCoverageTrace;
  readonly propertyCoverage: TrustTraceCoverageTrace;
  readonly warningTrace?: readonly string[];
  readonly limitationTrace?: readonly string[];
  readonly hasProductionLocator: boolean;
  readonly hasProductionAssumptionLine: boolean;
  readonly inputDesignStatus?: ToolInputDesignAuditStatus;
  readonly alignmentStatus?: BatchAlignmentStatus;
  readonly smartFormMetadata?: TrustTraceSmartFormMetadata;
  readonly blockers?: readonly string[];
  readonly warnings?: readonly string[];
};

export type BatchTrustTraceAuditResult = {
  readonly totalContracts: number;
  readonly trustTraceReady: number;
  readonly needsReview: number;
  readonly blocked: number;
  readonly reportExportReady: number;
  readonly averageTrustScore: number;
  readonly topRisks: readonly string[];
  readonly recommendedNextActions: readonly string[];
  readonly reports: readonly TrustTraceReport[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};
