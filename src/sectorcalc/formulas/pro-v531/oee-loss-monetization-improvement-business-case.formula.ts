import "server-only";
/**
 * OEE Loss Monetization & Improvement Business Case — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed OEELossInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface OEELossInputs {
  plannedProductionTime: number;  // minutes
  operatingTime: number;          // minutes
  netOperatingTime: number;       // minutes
  valuableOperatingTime: number;  // minutes
  idealCycleTime: number;         // seconds per part
  totalParts: number;
  goodParts: number;
  hourlyContribution: number;     // currency per hour
  improvementCost: number;        // currency
  sourceConfidence: number;
}

export interface OEELossOutputs {
  out_availability: number;
  out_performance: number;
  out_quality: number;
  out_oee_score: number;
  out_availability_loss_value: number;
  out_performance_loss_value: number;
  out_quality_loss_value: number;
  out_total_oee_loss: number;
  out_improvement_value: number;
  out_roi_ratio: number;
  out_decision_state: number;
  out_threshold_crossing: number;
  out_fmea_trigger: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: OEELossInputs): OEELossOutputs {
  const {
    plannedProductionTime, operatingTime,
    netOperatingTime, valuableOperatingTime,
    idealCycleTime, totalParts, goodParts,
    hourlyContribution, improvementCost,
    sourceConfidence,
  } = inputs;

  // GUARD (ported 2026-07-16): OEE's time cascade is physically ordered
  // (planned >= operating >= net_operating >= valuable) and (total_parts >= good_parts).
  // A downstream value exceeding its upstream ceiling is not a real OEE state and
  // previously produced a negative loss component. Clamp to the ceiling.
  // NOTE: this branch's own unit handling (plannedProductionTime declared in minutes vs.
  // idealCycleTime in seconds, and availLossValue/perfLossValue with no /60 conversion
  // applied to hourlyContribution) was NOT touched here -- that is a separate,
  // unverified-on-this-branch question flagged back to the user rather than guessed at.
  const operatingTimeC = Math.min(operatingTime, plannedProductionTime);
  const netOperatingTimeC = Math.min(netOperatingTime, operatingTimeC);
  const valuableOperatingTimeC = Math.min(valuableOperatingTime, netOperatingTimeC);
  const goodPartsC = Math.min(goodParts, totalParts);

  const availability = plannedProductionTime > 0
    ? operatingTimeC / plannedProductionTime
    : 0;
  const performance = netOperatingTimeC > 0
    ? (totalParts * idealCycleTime) / netOperatingTimeC
    : 0;
  const quality = totalParts > 0
    ? goodPartsC / totalParts
    : 0;
  const oee = availability * performance * quality;

  const availLossValue = (plannedProductionTime - operatingTimeC) * hourlyContribution;
  const perfLossValue = (netOperatingTimeC - valuableOperatingTimeC) * hourlyContribution;
  const qualLossValue = totalParts > 0
    ? (totalParts - goodPartsC) * idealCycleTime * hourlyContribution / 3600
    : 0;
  const totalOeeLoss = availLossValue + perfLossValue + qualLossValue;

  const improvementValue = totalOeeLoss * 3 * 0.7;
  const roiRatio = improvementCost > 0
    ? improvementValue / improvementCost
    : 0;
  const decisionState = improvementValue > improvementCost * 2
    ? 0
    : (improvementValue > improvementCost ? 1 : 2);
  const thresholdCrossing = oee < 0.85 ? 1 : 0;
  const fmeaTrigger = quality < 0.95 ? 1 : 0;

  return {
    out_availability: availability,
    out_performance: performance,
    out_quality: quality,
    out_oee_score: oee,
    out_availability_loss_value: availLossValue,
    out_performance_loss_value: perfLossValue,
    out_quality_loss_value: qualLossValue,
    out_total_oee_loss: totalOeeLoss,
    out_improvement_value: improvementValue,
    out_roi_ratio: roiRatio,
    out_decision_state: decisionState,
    out_threshold_crossing: thresholdCrossing,
    out_fmea_trigger: fmeaTrigger,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: OEELossInputs,
  driver: keyof OEELossInputs,
  pct = 0.10,
): number {
  const up = executeFormula({
    ...inputs,
    [driver]: (inputs[driver] as number) * (1 + pct),
  }).out_total_oee_loss;
  const dn = executeFormula({
    ...inputs,
    [driver]: (inputs[driver] as number) * (1 - pct),
  }).out_total_oee_loss;
  return Math.abs(up - dn);
}

// ─── ProFormulaModule contract ──────────────────────────────────────────────

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string, fallback = 0): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

const OUTPUT_KEYS: readonly string[] = [
  "out_availability", "out_performance", "out_quality",
  "out_oee_score", "out_availability_loss_value",
  "out_performance_loss_value", "out_quality_loss_value",
  "out_total_oee_loss", "out_improvement_value", "out_roi_ratio",
  "out_decision_state", "out_threshold_crossing", "out_fmea_trigger",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: OEELossInputs = {
    plannedProductionTime: get(inputs, "n_planned_production_time"),
    operatingTime: get(inputs, "n_operating_time"),
    netOperatingTime: get(inputs, "n_net_operating_time"),
    valuableOperatingTime: get(inputs, "n_valuable_operating_time"),
    idealCycleTime: get(inputs, "n_ideal_cycle_time"),
    totalParts: get(inputs, "n_total_parts"),
    goodParts: get(inputs, "n_good_parts"),
    hourlyContribution: get(inputs, "n_hourly_contribution"),
    improvementCost: get(inputs, "n_improvement_cost"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = [
    "n_planned_production_time", "n_operating_time",
    "n_net_operating_time", "n_valuable_operating_time",
  ] as const;
  for (const key of mandatory) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push(`Input "${key}" is missing or invalid — using 0`);
    }
  }

  const raw = executeFormula(typed);
  const allOutputs = raw as unknown as Record<string, number>;
  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = allOutputs[key];
  }

  const ok = OUTPUT_KEYS.every((k) => isFiniteNumber(outputs[k]));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "oee-loss-monetization-improvement-business-case";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_planned_production_time: 480,
  n_operating_time: 420,
  n_net_operating_time: 380,
  n_valuable_operating_time: 340,
  n_ideal_cycle_time: 45,
  n_total_parts: 500,
  n_good_parts: 470,
  n_hourly_contribution: 120,
  n_improvement_cost: 25000,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_planned_production_time", "n_operating_time",
  "n_net_operating_time", "n_valuable_operating_time",
  "n_ideal_cycle_time", "n_total_parts", "n_good_parts",
  "n_hourly_contribution", "n_improvement_cost",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
