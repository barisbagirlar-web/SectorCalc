/**
 * Operations oracle baselines — independent reference implementations (Phase 5C).
 * Does NOT import production calculator functions.
 */

import { OracleValidationError } from "@/lib/features/formula-governance/oracle/oracle-types";

export const OPERATIONS_ORACLE_SLUGS = [
  "machine-time-calculator",
  "cnc-quote-risk-analyzer",
] as const;

export type OperationsOracleSlug = (typeof OPERATIONS_ORACLE_SLUGS)[number];

export function isOperationsOracleSlug(slug: string): slug is OperationsOracleSlug {
  return (OPERATIONS_ORACLE_SLUGS as readonly string[]).includes(slug);
}

export type MachineTimeOracleInput = {
  readonly setupMinutes: number;
  readonly cycleSeconds: number;
  readonly quantity: number;
  readonly machineRate: number;
};

export type MachineTimeOracleOutput = {
  readonly totalMinutes: number;
  readonly machineCost: number;
};

export type CncQuoteRiskOracleInput = {
  readonly setupTime: number;
  readonly cycleTime: number;
  readonly quantity: number;
  readonly toolCost: number;
  readonly materialCost: number;
  readonly machineRate: number;
  readonly scrapRatePercent?: number;
};

export type CncQuoteRiskOracleOutput = {
  readonly machineHours: number;
  readonly machineCost: number;
  readonly baseCost: number;
};

function assertNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new OracleValidationError("INVALID_TIME_INPUT", `${label} must be a non-negative finite number.`);
  }
}

function assertPositive(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new OracleValidationError("INVALID_PRICE", `${label} must be a positive finite number.`);
  }
}

/** Reference machine minutes and cost from setup + cycle × quantity. */
export function calculateMachineTimeOracle(input: MachineTimeOracleInput): MachineTimeOracleOutput {
  assertNonNegative(input.setupMinutes, "Setup minutes");
  assertNonNegative(input.cycleSeconds, "Cycle seconds");
  assertPositive(input.quantity, "Quantity");
  assertPositive(input.machineRate, "Machine rate");

  const totalMinutes = input.setupMinutes + (input.cycleSeconds * input.quantity) / 60;
  const machineCost = (totalMinutes / 60) * input.machineRate;

  return { totalMinutes, machineCost };
}

/**
 * Reference CNC visible base cost (free-tier calcCnc formula only).
 * Excludes premium hidden multipliers, volatility, and safe-price verdict.
 */
export function calculateCncQuoteRiskOracle(input: CncQuoteRiskOracleInput): CncQuoteRiskOracleOutput {
  assertNonNegative(input.setupTime, "Setup time");
  assertNonNegative(input.cycleTime, "Cycle time");
  assertNonNegative(input.toolCost, "Tool cost");
  assertNonNegative(input.materialCost, "Material cost");
  assertPositive(input.machineRate, "Machine rate");
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    throw new OracleValidationError("INVALID_QUANTITY", "Quantity must be a positive finite number.");
  }

  const quantity = Math.max(1, input.quantity);
  const scrapPct = input.scrapRatePercent ?? 5;
  if (!Number.isFinite(scrapPct) || scrapPct < 0) {
    throw new OracleValidationError("INVALID_RATE", "Scrap rate must be a non-negative percent.");
  }

  const machineHours = (input.setupTime + input.cycleTime * quantity) / 60;
  const machineCost = machineHours * input.machineRate;
  const scrapFactor = 1 + scrapPct / 100;
  const baseCost = (machineCost + input.toolCost + input.materialCost) * scrapFactor;

  return { machineHours, machineCost, baseCost };
}
