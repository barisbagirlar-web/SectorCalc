/**
 * Expert Calculation Spec - decoupled logic layer.
 *
 * Pipeline: Input → Physics → Hidden Variables → Expert Logic (A–E) → Verdict
 * Region coefficients from RegionProvider profile + sector-registry feature flags.
 */

import type { RegionCode } from "@/config/regions";
import {
  applyRegionalFinancialLoss,
  formatRegionalCurrency,
  getRegionalCarbonPriceEur,
} from "@/lib/features/compliance/compliance-engine";
import { getRegionProfile } from "@/config/regions";
import {
  calculateHiddenLoss,
  computeVarianceRatio,
} from "@/lib/os/core/intelligence-layer";
import { computeEfficiencyScore } from "@/lib/os/core/intel-engine";
import { formulaRepository } from "@/lib/os/core/formulas/formula-repository";
import {
  getSectorEntry,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import { hasSmartModule, SmartModuleIds, type SmartModuleId } from "@/lib/os/registry/smart-modules";
import type { VerdictSeverity } from "@/lib/core/types/margincore-engine";

export type ExpertCalcTier = "free" | "premium";

export interface ExpertPhysicsCheck {
  readonly passed: boolean;
  readonly violations: readonly string[];
}

export interface ExpertHiddenVariable {
  readonly id: string;
  readonly label: string;
  readonly amount: number;
  readonly coefficient: number;
  readonly source: "tolerance" | "energy" | "fiscal" | "carbon" | "hidden_loss" | "setup";
}

export interface ExpertLogicTerm {
  readonly id: "A" | "B" | "C" | "D" | "E";
  readonly label: string;
  readonly amount: number;
}

export interface ExpertCalcVerdict {
  readonly severity: VerdictSeverity;
  readonly label: string;
  readonly action: string;
}

export interface ExpertCalcPremiumLayer {
  readonly hiddenLossTotal: number;
  readonly carbonKg: number;
  readonly sensitivityNote: string;
  readonly logicTerms: readonly ExpertLogicTerm[];
  readonly hiddenVariables: readonly ExpertHiddenVariable[];
}

export interface ExpertCalcResult {
  readonly sectorId: SectorRegistryKey;
  readonly region: RegionCode;
  readonly tier: ExpertCalcTier;
  readonly varianceRatio: number;
  readonly variancePct: string;
  readonly efficiencyScore: number;
  readonly physics: ExpertPhysicsCheck;
  readonly baseImpact: number;
  readonly totalImpact: number;
  readonly totalImpactFormatted: string;
  readonly verdict: ExpertCalcVerdict;
  readonly premium: ExpertCalcPremiumLayer | null;
}

export interface ExpertCalcInputValues {
  readonly target: number;
  readonly actual: number;
  readonly rate: number;
}

const VERDICT_LABELS: Record<VerdictSeverity, string> = {
  accept: "ACCEPT",
  caution: "CAUTION",
  reject: "REJECT",
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function runPhysicsCheck(
  target: number,
  actual: number,
  rate: number,
): ExpertPhysicsCheck {
  const violations: string[] = [];

  if (!Number.isFinite(target)) {
    violations.push("Target must be a finite number.");
  }
  if (!Number.isFinite(actual)) {
    violations.push("Actual must be a finite number.");
  }
  if (!Number.isFinite(rate) || rate <= 0) {
    violations.push("Rate must be greater than zero.");
  }
  if (Number.isFinite(actual) && actual < 0) {
    violations.push("Actual cannot be negative.");
  }

  return { passed: violations.length === 0, violations };
}

function resolveVerdict(
  varianceRatio: number,
  tolerance: number,
  efficiencyScore: number,
): ExpertCalcVerdict {
  const absVar = Math.abs(varianceRatio);
  const safeTol = tolerance > 0 ? tolerance : 0.05;

  if (absVar > safeTol * 1.25 || efficiencyScore < 60) {
    return {
      severity: "reject",
      label: VERDICT_LABELS.reject,
      action: "Recalibrate process or reprice before next run.",
    };
  }

  if (absVar > safeTol || efficiencyScore < 80) {
    return {
      severity: "caution",
      label: VERDICT_LABELS.caution,
      action: "Monitor drift; adjust tolerance buffer or scope.",
    };
  }

  return {
    severity: "accept",
    label: VERDICT_LABELS.accept,
    action: "Parameters within expert tolerance band.",
  };
}

function buildHiddenVariables(
  sectorId: SectorRegistryKey,
  features: readonly SmartModuleId[],
  region: RegionCode,
  baseLoss: number,
  varianceRatio: number,
  tolerance: number,
): ExpertHiddenVariable[] {
  const profile = getRegionProfile(region);
  const items: ExpertHiddenVariable[] = [];
  const absVar = Math.abs(varianceRatio);

  if (hasSmartModule(features, SmartModuleIds.tolerance_opt) && absVar > tolerance) {
    const coeff = 1 + (absVar - tolerance) * 2;
    items.push({
      id: "tolerance_drift",
      label: "Tolerance drift penalty",
      amount: baseLoss * (coeff - 1),
      coefficient: coeff,
      source: "tolerance",
    });
  }

  if (hasSmartModule(features, SmartModuleIds.hidden_loss)) {
    const hiddenBase = calculateHiddenLoss(sectorId, baseLoss);
    items.push({
      id: "hidden_loss",
      label: "Hidden operational loss",
      amount: hiddenBase,
      coefficient: hiddenBase / Math.max(baseLoss, 1),
      source: "hidden_loss",
    });
  }

  if (hasSmartModule(features, SmartModuleIds.energy_opt)) {
    const peakBlend = (profile.energyPeakMultiplier + profile.energyOffPeakMultiplier) / 2;
    const energyCoeff = peakBlend * profile.hiddenLossEnergyWeight;
    items.push({
      id: "energy_tariff",
      label: "Energy tariff overlay",
      amount: baseLoss * (energyCoeff - 1) * 0.35,
      coefficient: energyCoeff,
      source: "energy",
    });
  }

  if (hasSmartModule(features, SmartModuleIds.fiscal_multi)) {
    items.push({
      id: "fiscal",
      label: "Fiscal / VAT overlay",
      amount: baseLoss * (profile.taxCoefficient - 1) * 0.45,
      coefficient: profile.taxCoefficient,
      source: "fiscal",
    });
  }

  if (hasSmartModule(features, SmartModuleIds.carbon_cbam) && profile.cbamEnabled) {
    const carbonPrice = getRegionalCarbonPriceEur(region);
    const carbonAmount = (baseLoss * 0.02 * carbonPrice) / 100;
    items.push({
      id: "carbon_cbam",
      label: "Carbon / CBAM exposure",
      amount: carbonAmount,
      coefficient: profile.cbamExposureBoost + 1,
      source: "carbon",
    });
  }

  if (absVar > tolerance * 0.5) {
    items.push({
      id: "setup_scrap",
      label: "Setup / scrap allowance",
      amount: baseLoss * 0.08 * (absVar / Math.max(tolerance, 0.01)),
      coefficient: 1.08,
      source: "setup",
    });
  }

  return items;
}

function buildLogicTerms(
  baseLoss: number,
  regionalLoss: number,
  hidden: readonly ExpertHiddenVariable[],
): ExpertLogicTerm[] {
  const hiddenSum = hidden.reduce((sum, item) => sum + item.amount, 0);
  const regionalDelta = regionalLoss - baseLoss;

  return [
    { id: "A", label: "Base delta loss (|actual−target| × rate)", amount: baseLoss },
    { id: "B", label: "Hidden variables (scrap, setup, drift)", amount: hiddenSum },
    { id: "C", label: "Regional energy overlay", amount: Math.max(0, regionalDelta * 0.4) },
    { id: "D", label: "Regional fiscal overlay", amount: Math.max(0, regionalDelta * 0.35) },
    {
      id: "E",
      label: "Expert composite (A+B+C+D)",
      amount: baseLoss + hiddenSum + regionalDelta,
    },
  ];
}

/** Map sector param triple + raw field map → normalized inputs. */
export function resolveExpertInputs(
  sectorId: SectorRegistryKey,
  values: Record<string, number>,
): ExpertCalcInputValues {
  const sector = getSectorEntry(sectorId);
  const [targetKey, actualKey, rateKey] = sector.params;

  return {
    target: values[targetKey] ?? 0,
    actual: values[actualKey] ?? 0,
    rate: values[rateKey] ?? 0,
  };
}

/**
 * Run Expert Calculation Spec for any OS registry sector.
 * UI-agnostic - consume via TerminalPanel or server actions.
 */
export function runExpertCalculation(params: {
  sectorId: SectorRegistryKey;
  values: Record<string, number>;
  region: RegionCode;
  locale: string;
  tier?: ExpertCalcTier;
}): ExpertCalcResult {
  const { sectorId, values, region, locale, tier = "premium" } = params;
  const sector = getSectorEntry(sectorId);
  const { target, actual, rate } = resolveExpertInputs(sectorId, values);

  const physics = runPhysicsCheck(target, actual, rate);
  if (!physics.passed) {
    return {
      sectorId,
      region,
      tier,
      varianceRatio: 0,
      variancePct: "0.00",
      efficiencyScore: 0,
      physics,
      baseImpact: 0,
      totalImpact: 0,
      totalImpactFormatted: formatRegionalCurrency(0, region, locale),
      verdict: {
        severity: "reject",
        label: VERDICT_LABELS.reject,
        action: physics.violations.join(" "),
      },
      premium: null,
    };
  }

  const execution = formulaRepository.executeFull(sectorId, {
    target,
    actual,
    cost: rate,
  });

  const varianceRatio = computeVarianceRatio(target, actual);
  const variancePct = (varianceRatio * 100).toFixed(2);
  const efficiencyScore = clamp(
    computeEfficiencyScore(target, actual),
    0,
    100,
  );

  const baseLoss = execution.financialLoss;
  const regionalLoss = applyRegionalFinancialLoss(
    baseLoss,
    region,
    sector.features,
  );

  const hiddenVariables = buildHiddenVariables(
    sectorId,
    sector.features,
    region,
    baseLoss,
    varianceRatio,
    sector.defaultTolerance,
  );

  const hiddenTotal = hiddenVariables.reduce((sum, item) => sum + item.amount, 0);
  const totalImpact = regionalLoss + (tier === "premium" ? hiddenTotal * 0.85 : 0);

  const logicTerms = buildLogicTerms(baseLoss, regionalLoss, hiddenVariables);
  const verdict = resolveVerdict(
    varianceRatio,
    sector.defaultTolerance,
    efficiencyScore,
  );

  const carbonKg =
    hasSmartModule(sector.features, SmartModuleIds.carbon_cbam)
      ? Math.abs(varianceRatio) * rate * 0.12
      : 0;

  return {
    sectorId,
    region,
    tier,
    varianceRatio,
    variancePct,
    efficiencyScore,
    physics,
    baseImpact: baseLoss,
    totalImpact,
    totalImpactFormatted: formatRegionalCurrency(totalImpact, region, locale),
    verdict,
    premium:
      tier === "premium"
        ? {
            hiddenLossTotal: hiddenTotal,
            carbonKg,
            sensitivityNote:
              "Material +5%, labor +10%, delay +3d scenarios available in full MarginCore report.",
            logicTerms,
            hiddenVariables,
          }
        : null,
  };
}

export interface ExpertFieldSpec {
  readonly key: string;
  readonly label: string;
  readonly kind: "target" | "actual" | "rate";
}

/** Field specs for TerminalPanel - derived from registry param triple. */
export function buildExpertFieldSpecs(sectorId: SectorRegistryKey): readonly ExpertFieldSpec[] {
  const sector = getSectorEntry(sectorId);
  const [targetKey, actualKey, rateKey] = sector.params;
  const humanize = (key: string): string => key.replace(/_/g, " ");

  return [
    { key: targetKey, label: humanize(targetKey), kind: "target" as const },
    { key: actualKey, label: humanize(actualKey), kind: "actual" as const },
    { key: rateKey, label: humanize(rateKey), kind: "rate" as const },
  ];
}
