/**
 * Trust trace export payload types — ADIM 3 (data layer only; no file render).
 */

import type { ContractLoopStatus } from "@/lib/formula-governance/runtime-validation/contract-runtime-loop";
import type { RuntimeTrustTraceView } from "@/lib/formula-governance/runtime-validation/full-loop-bridge-shared";
import type { TrustTraceExportFormat } from "@/lib/formula-governance/trust-trace-report/export-contract/trust-trace-export-types";
import type { TrustTraceCoverageTrace } from "@/lib/formula-governance/trust-trace-report/trust-trace-types";
import type { RiskLevel } from "@/lib/formula-governance/types";
import type { FreeFullLoopResult } from "@/lib/formula-governance/runtime-validation/free-full-loop-bridge";
import type { PremiumFullLoopResult } from "@/lib/formula-governance/runtime-validation/premium-full-loop-bridge";

export type TrustTraceReportTier = "free" | "premium";

export type TrustTraceReportCalculationStatus = "success" | "blocked";

export type TrustTraceReportExportStatus = "export_ready" | "needs_review" | "blocked";

export type TrustTraceCanonicalInputClassification =
  | "required"
  | "optional"
  | "defaulted"
  | "derived"
  | "rejected";

export type TrustTraceCanonicalInputEntry = {
  readonly key: string;
  readonly value: string;
  readonly classification: TrustTraceCanonicalInputClassification;
};

export type TrustTraceFormulaContractRef = {
  readonly slug: string;
  readonly toolId: string;
  readonly version: string;
  readonly title: string;
  readonly riskLevel: RiskLevel;
};

export type TrustTraceDerivedResolutionStep = {
  readonly variableId: string;
  readonly formulaNodeId: string;
  readonly requiredInputs: readonly string[];
};

export type TrustTraceMind2PrecalcTrace = {
  readonly requirementStatus: string;
  readonly requiredMissingInputs: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly formulaPath: readonly string[];
  readonly derivedResolutionPlan: readonly TrustTraceDerivedResolutionStep[];
  readonly readinessStatus: string;
  readonly readinessWarnings: readonly string[];
};

export type TrustTraceMind1PostcalcTrace = {
  readonly validationPassed: boolean;
  readonly validationErrors: readonly string[];
  readonly validationWarnings: readonly string[];
  readonly validationSources: readonly string[];
  readonly invariantViolations: readonly string[];
  readonly dimensionErrors: readonly string[];
};

export type TrustTraceCoverageSummaryRefs = {
  readonly oracle: TrustTraceCoverageTrace;
  readonly scenario: TrustTraceCoverageTrace;
  readonly property: TrustTraceCoverageTrace;
};

export type TrustTraceReportPayload = {
  readonly slug: string;
  readonly toolTitle: string;
  readonly tier: TrustTraceReportTier;
  readonly loopStatus: ContractLoopStatus;
  readonly calculationStatus: TrustTraceReportCalculationStatus;
  readonly locale: string;
  readonly generatedAt: string;
  readonly disclaimer: string;
  readonly formulaContract: TrustTraceFormulaContractRef;
  readonly canonicalInputs: readonly TrustTraceCanonicalInputEntry[];
  readonly rejectedKeys: readonly string[];
  readonly assumptions: readonly string[];
  readonly limitations: readonly string[];
  readonly mind2Precalc: TrustTraceMind2PrecalcTrace;
  readonly mind1Postcalc: TrustTraceMind1PostcalcTrace;
  readonly trustTrace: RuntimeTrustTraceView;
  readonly coverageSummary: TrustTraceCoverageSummaryRefs;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
  readonly exportFormats: readonly TrustTraceExportFormat[];
  readonly exportStatus: TrustTraceReportExportStatus;
  readonly fileOutputGenerated: false;
  readonly usageAgreement: readonly string[];
};

export type BuildTrustTraceReportPayloadInput = {
  readonly toolSlug: string;
  readonly toolTitle: string;
  readonly tier: TrustTraceReportTier;
  readonly fullLoopResult: FreeFullLoopResult | PremiumFullLoopResult;
  readonly canonicalInputValues?: Readonly<Record<string, number>>;
  readonly locale?: string;
  readonly generatedAt?: string;
};
