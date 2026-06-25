/**
 * U-Engine — Logic Layer core.
 * FormulaRepository with registry-decoupled analysis.
 * Regional Compliance overlay on financial loss.
 */

import type { RegionCode } from "@/config/regions";
import { applyRegionalFinancialLoss } from "@/lib/compliance/compliance-engine";
import {
  formulaRepository,
  type FormulaInputs,
} from "@/lib/os/core/formulas/formula-repository";
import { formatNumber } from "@/lib/os/utils/formatters";
import type { SectorRegistryKey } from "@/lib/os/registry/sectors";
import type { SmartModuleId } from "@/lib/os/registry/smart-modules";

export interface AuditMetrics {
  target: number;
  actual: number;
  unitCost: number;
  /** Örn: 0.05 (%5) */
  tolerance: number;
}

export type UEngineSeverity = "CRITICAL" | "OPTIMAL";

export interface UEngineAnalysisResult {
  severity: UEngineSeverity;
  variancePct: string;
  financialLoss: string;
  recommendation: string;
}

export interface UEngineRegistryInput extends FormulaInputs {
  tolerance: number;
  region?: RegionCode;
  features?: readonly SmartModuleId[];
}

export interface UEngineRegistryResult {
  sectorId: SectorRegistryKey;
  severity: UEngineSeverity;
  efficiencyScore: number;
  variancePct: string;
  varianceRatio: number;
  financialLoss: number;
  recommendation: string;
  region: RegionCode;
}

function analyzeMetrics(m: AuditMetrics): UEngineAnalysisResult {
  if (
    !Number.isFinite(m.target) ||
    !Number.isFinite(m.actual) ||
    !Number.isFinite(m.unitCost) ||
    !Number.isFinite(m.tolerance)
  ) {
    return {
      severity: "CRITICAL",
      variancePct: "0.00",
      financialLoss: "0.00",
      recommendation:
        "Invalid input: target, actual, unit cost and tolerance must be numeric.",
    };
  }

  const safeTolerance = m.tolerance > 0 ? m.tolerance : 0.05;
  const diff = m.actual - m.target;
  const varianceRatio =
    m.target === 0
      ? diff === 0
        ? 0
        : Math.sign(diff) || 1
      : diff / m.target;
  const loss = Math.abs(diff) * Math.max(0, m.unitCost);
  const isCritical = Math.abs(varianceRatio) > safeTolerance;
  const annualLoss = loss * 12;

  return {
    severity: isCritical ? "CRITICAL" : "OPTIMAL",
    variancePct: (varianceRatio * 100).toFixed(2),
    financialLoss: loss.toFixed(2),
    recommendation: isCritical
      ? `Operational drift may add ${formatNumber(annualLoss)} units annually at current run-rate.`
      : "Efficiency targets are holding within tolerance.",
  };
}

export const UEngine = {
  analyze(m: AuditMetrics): UEngineAnalysisResult {
    return analyzeMetrics(m);
  },

  /** Registry-driven pipeline — FormulaRepository + tolerans + regional compliance. */
  runWithRegistry(
    sectorId: SectorRegistryKey,
    input: UEngineRegistryInput,
  ): UEngineRegistryResult {
    const region = input.region ?? "EN";
    const features = input.features ?? [];

    const execution = formulaRepository.executeFull(sectorId, input);
    const analysis = analyzeMetrics({
      target: input.target,
      actual: input.actual,
      unitCost: input.cost,
      tolerance: input.tolerance,
    });

    const baseLoss = execution.financialLoss;
    const regionalLoss = applyRegionalFinancialLoss(baseLoss, region, features);

    return {
      sectorId,
      severity: analysis.severity,
      efficiencyScore: execution.efficiencyScore,
      variancePct: analysis.variancePct,
      varianceRatio: execution.varianceRatio,
      financialLoss: regionalLoss,
      recommendation: analysis.recommendation,
      region,
    };
  },
} as const;
