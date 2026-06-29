/**
 * Input sufficiency scorer — Mind 2 readiness vs contract metadata (Phase 5H-C).
 */

import type { InputReadinessAlignmentSummary } from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
import type { InputReadinessAudit } from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
import type { RequirementSolveResult } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";
import type { FormulaContract } from "@/lib/formula-governance/types";
import {
  clampScore,
  collectDeclaredInputIds,
  identifyCostDrivers,
  identifyRiskDrivers,
} from "@/lib/formula-governance/input-design-audit/input-design-helpers";

export type ScoreInputSufficiencyParams = {
  readonly requirementResult: RequirementSolveResult;
  readonly readinessAudit: InputReadinessAudit;
  readonly alignmentSummary?: InputReadinessAlignmentSummary;
  readonly contract: FormulaContract;
};

export type InputSufficiencyScoreResult = {
  readonly score: number;
  readonly missingRequiredInputs: readonly string[];
  readonly missingRiskDrivers: readonly string[];
  readonly missingAdvancedInputs: readonly string[];
  readonly derivedInputMisuse: readonly string[];
  readonly defaultAssumptionGaps: readonly string[];
  readonly validationGaps: readonly string[];
  readonly dimensionGaps: readonly string[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
  readonly alignmentBlocked: boolean;
};

const WEIGHTS = {
  requiredCompleteness: 35,
  costDriverCoverage: 20,
  riskDriverCoverage: 15,
  validationDimensionReadiness: 15,
  defaultAssumptionTransparency: 10,
  derivedInputCorrectness: 5,
} as const;

function scoreRequiredCompleteness(
  contract: FormulaContract,
  requirementResult: RequirementSolveResult,
  readinessAudit: InputReadinessAudit,
): { score: number; missingRequiredInputs: string[] } {
  const declared = collectDeclaredInputIds(contract);
  const needed = new Set(requirementResult.requiredMissingInputs);
  const missingRequiredInputs: string[] = [];

  for (const input of needed) {
    if (!declared.has(input)) {
      missingRequiredInputs.push(input);
    }
  }

  let deductions = missingRequiredInputs.length * 8;
  deductions += readinessAudit.missingInputMetadata.length * 6;

  for (const critical of contract.criticalInputs) {
    if (readinessAudit.missingInputMetadata.some((gap) => gap.includes(`"${critical}"`))) {
      deductions += 4;
    }
  }

  return {
    score: clampScore(WEIGHTS.requiredCompleteness - deductions, WEIGHTS.requiredCompleteness),
    missingRequiredInputs,
  };
}

function scoreCostDriverCoverage(
  contract: FormulaContract,
  requirementResult: RequirementSolveResult,
): { score: number; gaps: string[] } {
  const costDrivers = identifyCostDrivers(contract);
  if (costDrivers.length === 0) {
    return { score: WEIGHTS.costDriverCoverage, gaps: [] };
  }

  const declared = collectDeclaredInputIds(contract);
  const gaps = costDrivers.filter((id) => !declared.has(id));
  const notSurfacedByEngine = costDrivers.filter(
    (id) =>
      declared.has(id) &&
      !requirementResult.requiredMissingInputs.includes(id) &&
      requirementResult.status === "need_more_data",
  );

  const deduction = gaps.length * 7 + notSurfacedByEngine.length * 5;
  return {
    score: clampScore(WEIGHTS.costDriverCoverage - deduction, WEIGHTS.costDriverCoverage),
    gaps,
  };
}

function scoreRiskDriverCoverage(
  contract: FormulaContract,
  requirementResult: RequirementSolveResult,
): { score: number; gaps: string[] } {
  const riskDrivers = identifyRiskDrivers(contract);
  if (riskDrivers.length === 0) {
    return { score: WEIGHTS.riskDriverCoverage, gaps: [] };
  }

  const declared = collectDeclaredInputIds(contract);
  const gaps = riskDrivers.filter((id) => !declared.has(id));
  const notSurfacedByEngine = riskDrivers.filter(
    (id) =>
      declared.has(id) &&
      !requirementResult.requiredMissingInputs.includes(id) &&
      requirementResult.status === "need_more_data",
  );

  const deduction = gaps.length * 6 + notSurfacedByEngine.length * 5;
  return {
    score: clampScore(WEIGHTS.riskDriverCoverage - deduction, WEIGHTS.riskDriverCoverage),
    gaps,
  };
}

function scoreValidationDimensionReadiness(readinessAudit: InputReadinessAudit): {
  score: number;
  validationGaps: string[];
  dimensionGaps: string[];
} {
  const validationGaps = readinessAudit.missingInputMetadata.filter((gap) =>
    gap.toLowerCase().includes("validation"),
  );
  const dimensionGaps = [...readinessAudit.missingDimensionRules];
  const deduction = dimensionGaps.length * 5 + validationGaps.length * 4;
  return {
    score: clampScore(
      WEIGHTS.validationDimensionReadiness - deduction,
      WEIGHTS.validationDimensionReadiness,
    ),
    validationGaps,
    dimensionGaps,
  };
}

function scoreDefaultAssumptionTransparency(
  readinessAudit: InputReadinessAudit,
): { score: number; gaps: string[] } {
  const gaps = [...readinessAudit.defaultAssumptionGaps];
  const deduction = gaps.length * 4;
  return {
    score: clampScore(
      WEIGHTS.defaultAssumptionTransparency - deduction,
      WEIGHTS.defaultAssumptionTransparency,
    ),
    gaps,
  };
}

function scoreDerivedInputCorrectness(readinessAudit: InputReadinessAudit): {
  score: number;
  misuse: string[];
  warnings: string[];
  blockers: string[];
} {
  const misuse = [...readinessAudit.derivedInputRisks];
  const warnings: string[] = [];
  const blockers: string[] = [];
  let deduction = 0;

  for (const risk of misuse) {
    deduction += 2;
    if (risk.includes("incorrectly requested")) {
      blockers.push(risk);
    } else {
      warnings.push(risk);
    }
  }

  return {
    score: clampScore(WEIGHTS.derivedInputCorrectness - deduction, WEIGHTS.derivedInputCorrectness),
    misuse,
    warnings,
    blockers,
  };
}

export function scoreInputSufficiency(
  params: ScoreInputSufficiencyParams,
): InputSufficiencyScoreResult {
  const { requirementResult, readinessAudit, alignmentSummary, contract } = params;
  const warnings: string[] = [...readinessAudit.warnings];
  const blockers: string[] = [...readinessAudit.blockers, ...requirementResult.blockers];

  const alignmentBlocked =
    alignmentSummary?.alignmentStatus === "blocked" ||
    alignmentSummary?.driftGateStatus === "blocked";

  if (alignmentBlocked) {
    blockers.push(
      `Alignment blocked for "${contract.slug}" — input design audit cannot certify sufficiency.`,
    );
  }

  const required = scoreRequiredCompleteness(contract, requirementResult, readinessAudit);
  const cost = scoreCostDriverCoverage(contract, requirementResult);
  const risk = scoreRiskDriverCoverage(contract, requirementResult);
  const validation = scoreValidationDimensionReadiness(readinessAudit);
  const defaults = scoreDefaultAssumptionTransparency(readinessAudit);
  const derived = scoreDerivedInputCorrectness(readinessAudit);

  warnings.push(...derived.warnings);
  blockers.push(...derived.blockers);

  const missingAdvancedInputs = [...readinessAudit.professionalUpgradeGaps].map((gap) => {
    const match = gap.match(/"([^"]+)"/);
    return match?.[1] ?? gap;
  });

  let score =
    required.score +
    cost.score +
    risk.score +
    validation.score +
    defaults.score +
    derived.score;

  if (alignmentBlocked) {
    score = Math.min(score, 45);
  }

  if (readinessAudit.status === "blocked" || requirementResult.status === "blocked") {
    score = Math.min(score, 40);
  }

  return {
    score: clampScore(score),
    missingRequiredInputs: required.missingRequiredInputs,
    missingRiskDrivers: risk.gaps,
    missingAdvancedInputs,
    derivedInputMisuse: derived.misuse,
    defaultAssumptionGaps: defaults.gaps,
    validationGaps: validation.validationGaps,
    dimensionGaps: validation.dimensionGaps,
    warnings,
    blockers,
    alignmentBlocked,
  };
}
