/**
 * Compliance Engine — region-aware coefficient selection for U-Engine & MarginCore.
 *
 * TR: local inflation, tax, energy tariff (peak/off-peak)
 * DE: CBAM + EU industrial efficiency factors
 * EN: Global fallback
 */

import {
  getRegionProfile,
  regionalFormatLocale,
  type RegionCode,
  type RegionalComplianceProfile,
} from "@/config/regions";
import type { MarginCoreRiskProfile } from "@/lib/core/types/margincore-engine";
import type { SmartModuleId } from "@/lib/os/registry/smart-modules";

export interface RegionalEngineContext {
  readonly region: RegionCode;
  readonly profile: RegionalComplianceProfile;
}

export function buildRegionalContext(region: RegionCode): RegionalEngineContext {
  return { region, profile: getRegionProfile(region) };
}

/** Overlay sector risk profile with jurisdiction-specific coefficients. */
export function applyRegionalRiskProfileOverlay(
  base: MarginCoreRiskProfile,
  region: RegionCode,
): MarginCoreRiskProfile {
  const { profile } = buildRegionalContext(region);

  const inflationMultiplier = profile.inflationCoefficient;
  const fiscalMultiplier = profile.taxCoefficient;

  const sectorRiskMultipliers: Record<string, number> = {
    ...base.sectorRiskMultipliers,
  };

  if (region === "TR") {
    sectorRiskMultipliers.energyTariff = profile.energyPeakMultiplier;
    sectorRiskMultipliers.localInflation = inflationMultiplier;
    sectorRiskMultipliers.payrollTax = fiscalMultiplier;
  }

  if (region === "DE") {
    sectorRiskMultipliers.euEfficiency = profile.euIndustrialEfficiencyFactor;
    sectorRiskMultipliers.industrialElectricity = profile.electricityCostPerKwh / 0.15;
  }

  let cbamExposureIndex = base.cbamExposureIndex;
  if (profile.cbamEnabled) {
    cbamExposureIndex = Math.min(1, base.cbamExposureIndex + profile.cbamExposureBoost);
  }

  let baseVolatility = base.baseVolatility;
  if (region === "TR") {
    baseVolatility *= 1 + (inflationMultiplier - 1) * 0.15;
  }

  return {
    baseVolatility,
    sectorRiskMultipliers,
    cbamExposureIndex,
    macroShockVectors: base.macroShockVectors,
  };
}

/** Adjust U-Engine financial loss for regional hidden-loss & fiscal rules. */
export function applyRegionalFinancialLoss(
  baseLoss: number,
  region: RegionCode,
  features: readonly SmartModuleId[],
): number {
  if (!Number.isFinite(baseLoss) || baseLoss <= 0) {
    return 0;
  }

  const { profile } = buildRegionalContext(region);
  let adjusted = baseLoss;

  const hasEnergy = features.includes("energy_opt") || features.includes("hidden_loss");
  const hasCbam = features.includes("carbon_cbam");
  const hasFiscal = features.includes("fiscal_multi");

  if (region === "TR") {
    if (hasEnergy) {
      const peakBlend = (profile.energyPeakMultiplier + profile.energyOffPeakMultiplier) / 2;
      const energyFactor = peakBlend * profile.hiddenLossEnergyWeight;
      adjusted *= 1 + (energyFactor - 1) * 0.35;
    }
    if (hasFiscal) {
      adjusted *= 1 + (profile.taxCoefficient - 1) * 0.45;
    }
    adjusted *= 1 + (profile.inflationCoefficient - 1) * 0.2;
  }

  if (region === "DE" && hasCbam && profile.cbamEnabled) {
    adjusted *= 1 + profile.cbamExposureBoost * 0.5;
  }

  if (region === "DE") {
    adjusted *= 1 + (profile.euIndustrialEfficiencyFactor - 1) * 0.15;
  }

  return adjusted;
}

/** Regional CBAM carbon price for MarginCore / stochastic engine. */
export function getRegionalCarbonPriceEur(region: RegionCode): number {
  return getRegionProfile(region).cbamCarbonPriceEur;
}

/** Format currency for audit output using regional profile. */
export function formatRegionalCurrency(
  value: number,
  region: RegionCode,
  locale: string,
): string {
  const { currency } = getRegionProfile(region);
  const formatLocale = regionalFormatLocale(region, locale);
  return value.toLocaleString(formatLocale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

/** Region-specific prescription suffix for Intelligence Layer output. */
export function enrichRecommendationForRegion(
  baseRecommendation: string,
  region: RegionCode,
  features: readonly SmartModuleId[],
): string {
  const { profile, region: code } = buildRegionalContext(region);

  if (code === "TR" && features.includes("hidden_loss")) {
    return `${baseRecommendation} [TR] Energy tariff (peak load ×${profile.energyPeakMultiplier.toFixed(2)}) and VAT %${(profile.vatRate * 100).toFixed(0)} included in hidden loss projection applied.`;
  }

  if (code === "DE" && features.includes("carbon_cbam") && profile.cbamEnabled) {
    return `${baseRecommendation} [DE] CBAM exposure index boosted; EU industrial efficiency factor ×${profile.euIndustrialEfficiencyFactor.toFixed(2)} applied.`;
  }

  if (code === "EN") {
    return `${baseRecommendation} [Global] Default coefficients — no regional compliance overlay.`;
  }

  return baseRecommendation;
}
