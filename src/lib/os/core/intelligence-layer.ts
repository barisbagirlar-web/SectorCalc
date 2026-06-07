/**
 * Intelligence Layer — sektörel uzmanlık modülleri ve karar desteği.
 * Gizli kayıp, reçete motoru ve CBAM/karbon etkisi.
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

/** Sapma oranı eşiği (0.10 = %10). */
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

/** Hedef–gerçekleşen sapma oranı (ondalık; 0.10 = %10). */
export function computeVarianceRatio(target: number, actual: number): number {
  const safeTarget = safeNumber(target);
  const safeActual = safeNumber(actual);

  if (safeTarget === 0) {
    return safeActual === 0 ? 0 : Math.sign(safeActual) || 1;
  }

  return (safeActual - safeTarget) / safeTarget;
}

/** Gizli operasyonel kayıp (soğutucu, boş dönüş, hava gecikmesi vb.). */
export function calculateHiddenLoss(sectorId: SectorRegistryKey, baseCost: number): number {
  const multiplier = HIDDEN_LOSS_MULTIPLIERS[sectorId] ?? DEFAULT_HIDDEN_LOSS_MULTIPLIER;
  return safeNumber(baseCost) * multiplier;
}

/** Karar desteği — tolerans sapmasına göre operasyonel reçete. */
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

/** CBAM / karbon etkisi (kg CO₂e proxy; usage = operasyonel birim). */
export function calculateCarbonImpact(sectorId: SectorRegistryKey, usage: number): number {
  const factor = CARBON_FACTORS[sectorId] ?? DEFAULT_CARBON_FACTOR;
  return safeNumber(usage) * factor;
}

/** Audit girdilerinden tam intelligence özeti. */
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
