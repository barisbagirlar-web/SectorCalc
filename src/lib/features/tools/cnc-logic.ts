/**
 * CNC Machine Time — deterministic (naive) cost logic.
 * Formula DNA: (setupTime + cycleTime × quantity) / 60 × hourlyRate
 *
 * Phase 2: Stochastic risk engine consumes `buildCncMarginCoreInputs()` output
 * via `calculatePremiumVerdict` — see `CncStochasticPhaseSlot`.
 */

import { setupBurdenRatio } from "@/lib/features/tools/calculation-formulas";

/** Default hourly machine rate when not supplied on the free tier. */
export const CNC_DEFAULT_HOURLY_RATE_USD = 75;

export type CncMachineTimeInputs = {
  setupTime: number;
  cycleTime: number;
  quantity: number;
  hourlyRate?: number;
};

export type CncNaiveCostResult = {
  totalMinutes: number;
  machineHours: number;
  naiveCost: number;
  setupBurdenPercent: number;
  hourlyRate: number;
};

export function validateCncMachineTimeInputs(inputs: CncMachineTimeInputs): string | null {
  if (!Number.isFinite(inputs.setupTime) || inputs.setupTime < 0) {
    return "Setup time must be zero or greater.";
  }
  if (!Number.isFinite(inputs.cycleTime) || inputs.cycleTime < 0) {
    return "Cycle time must be zero or greater.";
  }
  if (!Number.isFinite(inputs.quantity) || inputs.quantity <= 0) {
    return "Quantity must be greater than zero.";
  }
  return null;
}

/** Total machining minutes — setup + cycle × quantity. */
export function calculateCncTotalMinutes(
  setupTime: number,
  cycleTime: number,
  quantity: number
): number {
  const qty = Math.max(1, quantity);
  return setupTime + cycleTime * qty;
}

/**
 * Deterministic naive machine cost.
 * Base formula: (setupTime + (cycleTime * quantity)) / 60 * hourlyRate
 */
export function calculateCncNaiveCost(
  inputs: CncMachineTimeInputs
): CncNaiveCostResult | { error: string } {
  const validationError = validateCncMachineTimeInputs(inputs);
  if (validationError) {
    return { error: validationError };
  }

  const hourlyRate = inputs.hourlyRate ?? CNC_DEFAULT_HOURLY_RATE_USD;
  const totalMinutes = calculateCncTotalMinutes(
    inputs.setupTime,
    inputs.cycleTime,
    inputs.quantity
  );
  const machineHours = totalMinutes / 60;
  const naiveCost = machineHours * hourlyRate;
  const setupBurdenPercent =
    setupBurdenRatio(inputs.setupTime, inputs.cycleTime, inputs.quantity) * 100;

  return {
    totalMinutes,
    machineHours,
    naiveCost,
    setupBurdenPercent,
    hourlyRate,
  };
}

/** Phase 2 — map free-tier inputs to MarginCore stochastic engine payload. */
export function buildCncMarginCoreInputs(
  inputs: CncMachineTimeInputs
): Record<string, number> {
  return {
    setupTime: inputs.setupTime,
    cycleTime: inputs.cycleTime,
    quantity: inputs.quantity,
    toolCost: 0,
    materialCost: 0,
    machineRate: inputs.hourlyRate ?? CNC_DEFAULT_HOURLY_RATE_USD,
    riskMargin: 15,
  };
}
