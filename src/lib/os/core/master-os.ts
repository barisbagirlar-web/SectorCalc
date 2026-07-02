/**
 * MasterOS - single entry dispatcher.
 * Data (Registry) → Logic (U-Engine) → Intelligence (Benchmark & Prescription).
 * Regional Compliance overlay via region parameter.
 */

import type { RegionCode } from "@/config/regions";
import {
  applyRegionalFinancialLoss,
  enrichRecommendationForRegion,
  formatRegionalCurrency,
} from "@/lib/features/compliance/compliance-engine";
import { UEngine } from "@/lib/os/core/u-engine";
import { buildBenchmarkFromAudit } from "@/lib/os/core/intel-engine";
import {
  IntelligenceLayer,
  type ActionPlanResult,
  type AnonymizedBenchmarkRecord,
  type SectorIntelligenceResult,
} from "@/lib/os/core/intelligence-layer";
import type { FormulaInputs } from "@/lib/os/core/formulas";
import { OfflineStore } from "@/lib/os/core/offline-store";
import {
  getSectorDisplayName,
  getSectorEntry,
  hasSectorSmartModule,
  isSectorRegistryKey,
  type SectorRegistryKey,
} from "@/lib/os/registry/sectors";
import { SmartModuleIds, type SmartModuleId } from "@/lib/os/registry/smart-modules";

export type IndustrialAuditStatus = "OPTIMAL" | "CRITICAL";

/** Efficiency score threshold - below is CRITICAL. */
export const OPTIMAL_SCORE_THRESHOLD = 80;

export interface IndustrialAuditResult {
  status: IndustrialAuditStatus;
  metric: number;
  variancePct: string;
  financialLoss: string;
  prescription: ActionPlanResult;
  benchmark: AnonymizedBenchmarkRecord;
  intelligence: SectorIntelligenceResult;
  sectorId: SectorRegistryKey;
  sectorName: string;
  features: readonly SmartModuleId[];
  recommendation: string;
  region: RegionCode;
}

function assertValidInputs(inputs: FormulaInputs): void {
  if (
    !Number.isFinite(inputs.target) ||
    !Number.isFinite(inputs.actual) ||
    !Number.isFinite(inputs.cost)
  ) {
    throw new Error("INVALID_INPUTS: target, actual and cost must be finite numbers.");
  }
}

/**
 * Master Dispatcher - Industrial OS audit pipeline.
 * 1. Registry guardrail · 2. U-Engine + region · 3. Benchmark · 4. Prescription
 */
export function runIndustrialAudit(
  sectorId: SectorRegistryKey,
  inputs: FormulaInputs,
  locale: string = "en-US",
  region: RegionCode = "EN",
): IndustrialAuditResult {
  if (!isSectorRegistryKey(sectorId)) {
    throw new Error("SECTOR_NOT_FOUND: Registry mismatch.");
  }

  const sector = getSectorEntry(sectorId);
  assertValidInputs(inputs);

  const logic = UEngine.runWithRegistry(sectorId, {
    ...inputs,
    tolerance: sector.defaultTolerance,
    region,
    features: sector.features,
  });

  const benchmark = IntelligenceLayer.processBenchmarking(
    buildBenchmarkFromAudit(sectorId, inputs),
  );

  const intelligence = IntelligenceLayer.buildSectorIntelligence(
    sectorId,
    inputs.target,
    inputs.actual,
    inputs.cost,
  );

  if (hasSectorSmartModule(sector, SmartModuleIds.offline_mode)) {
    OfflineStore.enqueue({ sectorId, inputs });
  }

  const recommendation = enrichRecommendationForRegion(
    logic.recommendation,
    region,
    sector.features,
  );

  return {
    status: logic.efficiencyScore > OPTIMAL_SCORE_THRESHOLD ? "OPTIMAL" : "CRITICAL",
    metric: logic.efficiencyScore,
    variancePct: logic.variancePct,
    financialLoss: formatRegionalCurrency(logic.financialLoss, region, locale),
    prescription: intelligence.actionPlan,
    benchmark,
    intelligence,
    sectorId,
    sectorName: getSectorDisplayName(sector, locale.split("-")[0] ?? "en"),
    features: sector.features,
    recommendation,
    region,
  };
}

export const MasterOS = {
  runIndustrialAudit,
  OPTIMAL_SCORE_THRESHOLD,
} as const;
