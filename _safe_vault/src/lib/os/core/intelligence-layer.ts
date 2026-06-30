/**
 * Intelligence Layer — sector expertise modules and decision support.
 * Hidden loss, prescription engine and CBAM/carbon impact.
 */

import {
  processBenchmarking,
  type AnonymizedBenchmarkRecord,
  type BenchmarkData,
} from "@/lib/os/core/intel-engine";
import type { SectorRegistryKey } from "@/lib/os/registry/sectors";

const HIDDEN_LOSS_MULTIPLIERS: Partial<Record<SectorRegistryKey, number>> = {
  cnc: 0.15,
  logistics: 0.25,
  construction: 0.2,
};

const DEFAULT_HIDDEN_LOSS_MULTIPLIER = 0.1;

const CARBON_FACTORS: Partial<Record<SectorRegistryKey, number>> = {
  metalworking: 2.2,
  textile: 0.8,
};

const DEFAULT_CARBON_FACTOR = 1.0;

/** Deviation ratio threshold (0.10 = 10%). */
export const ACTION_PLAN_VARIANCE_THRESHOLD = 0.1;

export type ActionPlanCode = "IMMEDIATE_CALIBRATION" | "MONITOR_OPTIMAL";

export interface ActionPlanResult {
  code: ActionPlanCode;
  message: string;
}

export interface SectorIntelligenceResult {
  hiddenLoss: number;
  actionPlan: ActionPlanResult;
  carbonImpact: number;
  varianceRatio: number;
}

function safeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return value;
}

/** Target-actual deviation ratio (decimal; 0.10 = 10%). */
export function computeVarianceRatio(target: number, actual: number): number {
  const safeTarget = safeNumber(target);
  const safeActual = safeNumber(actual);

  if (safeTarget === 0) {
    return safeActual === 0 ? 0 : Math.sign(safeActual) || 1;
  }

  return (safeActual - safeTarget) / safeTarget;
}

/** Hidden operational loss (coolant, deadhead, weather delay etc.). */
export function calculateHiddenLoss(sectorId: SectorRegistryKey, baseCost: number): number {
  const multiplier = HIDDEN_LOSS_MULTIPLIERS[sectorId] ?? DEFAULT_HIDDEN_LOSS_MULTIPLIER;
  return safeNumber(baseCost) * multiplier;
}

/** Decision support — operational prescription based on tolerance drift. */
export function generateActionPlan(varianceRatio: number): ActionPlanResult {
  if (Math.abs(safeNumber(varianceRatio)) > ACTION_PLAN_VARIANCE_THRESHOLD) {
    return {
      code: "IMMEDIATE_CALIBRATION",
      message: "ACTION: Immediate calibration required. Tolerance drift detected.",
    };
  }

  return {
    code: "MONITOR_OPTIMAL",
    message: "STATUS: Monitor operational parameters. Efficiency optimal.",
  };
}

/** CBAM / carbon impact (kg CO₂e proxy; usage = operational unit). */
export function calculateCarbonImpact(sectorId: SectorRegistryKey, usage: number): number {
  const factor = CARBON_FACTORS[sectorId] ?? DEFAULT_CARBON_FACTOR;
  return safeNumber(usage) * factor;
}

/** Full intelligence summary from audit inputs. */
export function buildSectorIntelligence(
  sectorId: SectorRegistryKey,
  target: number,
  actual: number,
  baseCost: number,
): SectorIntelligenceResult {
  const varianceRatio = computeVarianceRatio(target, actual);

  return {
    hiddenLoss: calculateHiddenLoss(sectorId, baseCost),
    actionPlan: generateActionPlan(varianceRatio),
    carbonImpact: calculateCarbonImpact(sectorId, actual),
    varianceRatio,
  };
}

export const IntelligenceLayer = {
  calculateHiddenLoss,
  generateActionPlan,
  calculateCarbonImpact,
  buildSectorIntelligence,
  computeVarianceRatio,
  processBenchmarking,
} as const;

export type { AnonymizedBenchmarkRecord, BenchmarkData };
