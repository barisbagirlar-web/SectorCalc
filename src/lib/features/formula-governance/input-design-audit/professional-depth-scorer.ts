/**
 * Professional depth scorer — decision-tool input design quality (Phase 5H-C).
 */

import type { InputReadinessAlignmentSummary } from "@/lib/features/formula-governance/requirement-engine/contract-requirement-bridge";
import type { ToolInputDesign } from "@/lib/features/formula-governance/requirement-engine/input-design-bridge";
import type { FormulaContract } from "@/lib/features/formula-governance/types";
import {
  clampScore,
  identifyCostDrivers,
  identifyRiskDrivers,
  isFreeQuickCheckContract,
  isPremiumContract,
} from "@/lib/features/formula-governance/input-design-audit/input-design-helpers";

export type ScoreProfessionalDepthParams = {
  readonly contract: FormulaContract;
  readonly inputDesign?: ToolInputDesign;
  readonly alignmentSummary?: InputReadinessAlignmentSummary;
};

export type ProfessionalDepthScoreResult = {
  readonly score: number;
  readonly warnings: readonly string[];
};

const WEIGHTS = {
  decisionGoalClarity: 15,
  costDriverDepth: 20,
  riskDriverDepth: 20,
  advancedInputAvailability: 15,
  assumptionsLimitationsTransparency: 10,
  scenarioPropertyOracleReadiness: 10,
  reportabilityTrustTrace: 10,
} as const;

const FREE_TOOL_REQUIRED_INPUT_WARNING_THRESHOLD = 6;

function scoreDecisionGoalClarity(contract: FormulaContract): number {
  let score = WEIGHTS.decisionGoalClarity;
  if (!contract.purpose || contract.purpose.length < 20) {
    score -= 6;
  }
  if (!contract.userDecision || contract.userDecision.length < 15) {
    score -= 5;
  }
  if (!contract.formulaSummary || contract.formulaSummary.length < 10) {
    score -= 4;
  }
  return clampScore(score, WEIGHTS.decisionGoalClarity);
}

function scoreCostDriverDepth(contract: FormulaContract, inputDesign?: ToolInputDesign): number {
  const costDrivers = identifyCostDrivers(contract);
  if (costDrivers.length === 0) {
    return WEIGHTS.costDriverDepth - 4;
  }

  const advancedCostFields =
    inputDesign?.advancedFields.filter((field) =>
      identifyCostDrivers({ ...contract, criticalInputs: [field.variableId], requiredInputs: [] }).length >
      0,
    ).length ?? 0;

  const optionalCostFields =
    inputDesign?.optionalFields.filter((field) =>
      identifyCostDrivers({ ...contract, criticalInputs: [field.variableId], requiredInputs: [] }).length >
      0,
    ).length ?? 0;

  const depthBonus = Math.min(6, advancedCostFields * 3 + optionalCostFields * 2);
  const base = Math.min(WEIGHTS.costDriverDepth, 12 + costDrivers.length * 2 + depthBonus);
  return clampScore(base, WEIGHTS.costDriverDepth);
}

function scoreRiskDriverDepth(
  contract: FormulaContract,
  inputDesign?: ToolInputDesign,
): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  const riskDrivers = identifyRiskDrivers(contract);
  let score: number = WEIGHTS.riskDriverDepth;

  if (riskDrivers.length === 0) {
    score -= isPremiumContract(contract) ? 16 : 4;
    if (isPremiumContract(contract)) {
      warnings.push(
        `Premium tool "${contract.slug}" has no declared risk-driver inputs in contract metadata.`,
      );
    }
  } else {
    const advancedRisk =
      inputDesign?.advancedFields.filter((field) => RISK_PATTERN.test(field.variableId)).length ?? 0;
    score = clampScore(10 + riskDrivers.length * 3 + advancedRisk * 2, WEIGHTS.riskDriverDepth);
  }

  return { score, warnings };
}

const RISK_PATTERN =
  /risk|buffer|delay|scrap|waste|margin|weather|contingency|uncertainty|volatility/i;

function scoreAdvancedInputAvailability(
  contract: FormulaContract,
  inputDesign?: ToolInputDesign,
): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  const advancedCount = inputDesign?.advancedFields.length ?? 0;
  const optionalCount = inputDesign?.optionalFields.length ?? 0;
  let score: number = WEIGHTS.advancedInputAvailability;

  if (isPremiumContract(contract)) {
    if (advancedCount === 0 && optionalCount < 2) {
      score -= 12;
      warnings.push(
        `Premium tool "${contract.slug}" lacks advanced/professional input fields in input design.`,
      );
    } else {
      score = clampScore(8 + advancedCount * 3 + optionalCount, WEIGHTS.advancedInputAvailability);
    }
  } else {
    score = clampScore(10 + advancedCount * 2 + optionalCount, WEIGHTS.advancedInputAvailability);
  }

  return { score, warnings };
}

function scoreAssumptionsLimitationsTransparency(contract: FormulaContract): number {
  const assumptions = [
    ...contract.assumptions,
    ...(contract.warningPolicy?.acceptedAssumptions ?? []),
    ...(contract.warningPolicy?.modelLimitations ?? []),
  ];
  let score: number = WEIGHTS.assumptionsLimitationsTransparency;
  if (assumptions.length === 0) {
    score -= 8;
  } else if (assumptions.length < 2) {
    score -= 4;
  } else {
    score = clampScore(6 + Math.min(4, assumptions.length), WEIGHTS.assumptionsLimitationsTransparency);
  }
  return score;
}

function scoreScenarioPropertyOracleReadiness(contract: FormulaContract): number {
  let score = 0;
  if (contract.scenarioTests.some((test) => test.present)) {
    score += 4;
  }
  if (contract.propertyTestsRegistered) {
    score += 3;
  }
  if (contract.oracleRequired) {
    score += 3;
  }
  if (contract.validationRules.length > 0) {
    score += 2;
  }
  return clampScore(score, WEIGHTS.scenarioPropertyOracleReadiness);
}

function scoreReportabilityTrustTrace(
  contract: FormulaContract,
  alignmentSummary?: InputReadinessAlignmentSummary,
): number {
  let score = WEIGHTS.reportabilityTrustTrace;
  if (contract.mustNotClaim.length === 0) {
    score -= 3;
  }
  if (contract.decisionLanguageRules.length === 0) {
    score -= 3;
  }
  if (alignmentSummary?.safeToUseContractOntologyForRequirementEngine === false) {
    score -= 5;
  }
  if (alignmentSummary?.manualReviewRequired) {
    score -= 2;
  }
  return clampScore(score, WEIGHTS.reportabilityTrustTrace);
}

function checkFreeToolRequiredInputWarning(
  contract: FormulaContract,
  inputDesign?: ToolInputDesign,
): string[] {
  if (!isFreeQuickCheckContract(contract)) {
    return [];
  }
  const requiredCount = inputDesign?.requiredFields.length ?? contract.criticalInputs.length;
  if (requiredCount > FREE_TOOL_REQUIRED_INPUT_WARNING_THRESHOLD) {
    return [
      `Free quick-check tool "${contract.slug}" exposes ${requiredCount} required inputs — may be too deep for free tier.`,
    ];
  }
  return [];
}

export function scoreProfessionalDepth(
  params: ScoreProfessionalDepthParams,
): ProfessionalDepthScoreResult {
  const { contract, inputDesign, alignmentSummary } = params;
  const warnings: string[] = [];

  const risk = scoreRiskDriverDepth(contract, inputDesign);
  const advanced = scoreAdvancedInputAvailability(contract, inputDesign);
  warnings.push(...risk.warnings, ...advanced.warnings, ...checkFreeToolRequiredInputWarning(contract, inputDesign));

  const score = clampScore(
    scoreDecisionGoalClarity(contract) +
      scoreCostDriverDepth(contract, inputDesign) +
      risk.score +
      advanced.score +
      scoreAssumptionsLimitationsTransparency(contract) +
      scoreScenarioPropertyOracleReadiness(contract) +
      scoreReportabilityTrustTrace(contract, alignmentSummary),
  );

  return { score, warnings };
}
