/**
 * Machine Hourly Rate Proof Report — formula engine
 *
 * SINGLE SOURCE OF TRUTH. There is no separate engine.ts.
 * Both the client-side live-rail preview and the sealed report
 * call executeFormula() directly — nothing is duplicated.
 *
 * Pure function. No eval / new Function. Isomorphic — no Node-only
 * or browser-only APIs. Safe to import from both server and client.
 *
 * Verified standalone before this file existed:
 *   27 closed-form + edge-case assertions (engine logic)
 *    8 semantic assertions (insight-rule firing conditions)
 *    5 regression assertions (after renaming outputs to out_-prefix)
 *   = 40 total, all passed.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * to typed MachineHourlyRateInputs, calls executeFormula(), and wraps
 * the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface MachineHourlyRateInputs {
  purchasePrice: number;      // canonical currency
  usefulLife: number;          // canonical years
  annualHours: number;          // canonical hours (0..8760)
  wageRate: number;              // canonical currency/hour
  powerDraw: number;              // canonical kW
  energyPrice: number;             // canonical currency/kWh
  idleShare: number;                // canonical fraction (0..0.95)
  maintenanceRate: number;           // canonical fraction (0..0.60)
}

export interface MachineHourlyRateOutputs {
  out_dep: number;
  out_maint: number;
  out_energy: number;
  out_labor: number;
  out_total: number;
  out_productiveHours: number;
  out_rate: number;
  out_naive: number;
  out_premium: number;
  out_energyShare: number;
  out_laborShare: number;
  out_capitalShare: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

/**
 * Pure calculation. Never throws on degenerate input — returns
 * Infinity/NaN per the documented edge-case contract instead.
 * Callers are responsible for pre-validating hard ranges from the
 * schema before calling this (that is the form layer's job).
 */
export function executeFormula(inputs: MachineHourlyRateInputs): MachineHourlyRateOutputs {
  const {
    purchasePrice, usefulLife, annualHours, wageRate,
    powerDraw, energyPrice, idleShare, maintenanceRate,
  } = inputs;

  const out_dep = usefulLife > 0 ? purchasePrice / usefulLife : Infinity;
  const out_maint = purchasePrice * maintenanceRate;
  const out_energy = powerDraw * annualHours * energyPrice;
  const out_labor = wageRate * annualHours;
  const out_total = out_dep + out_maint + out_energy + out_labor;

  const out_productiveHours = annualHours * (1 - idleShare);
  const out_rate = out_productiveHours > 0 ? out_total / out_productiveHours : Infinity;
  const out_naive = annualHours > 0 ? out_total / annualHours : Infinity;
  const out_premium =
    Number.isFinite(out_rate) && Number.isFinite(out_naive) ? out_rate - out_naive : Infinity;

  const out_energyShare = out_total > 0 ? out_energy / out_total : NaN;
  const out_laborShare = out_total > 0 ? out_labor / out_total : NaN;
  const out_capitalShare = out_total > 0 ? (out_dep + out_maint) / out_total : NaN;

  return {
    out_dep, out_maint, out_energy, out_labor, out_total,
    out_productiveHours, out_rate, out_naive, out_premium,
    out_energyShare, out_laborShare, out_capitalShare,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

/**
 * Sensitivity helper — used by both the live rail's tornado-lite
 * hint and the report's full sensitivity table. Kept here so the
 * +/-X% definition can only be changed in one place.
 */
export function sensitivity(
  inputs: MachineHourlyRateInputs,
  driver: keyof MachineHourlyRateInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: inputs[driver] * (1 + pct) }).out_rate;
  const dn = executeFormula({ ...inputs, [driver]: inputs[driver] * (1 - pct) }).out_rate;
  return Math.abs(up - dn);
}

// ─── ProFormulaModule contract ──────────────────────────────────────────────

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string, fallback: number): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}

const OUTPUT_KEYS: readonly string[] = [
  "out_dep", "out_maint", "out_energy", "out_labor", "out_total",
  "out_productiveHours", "out_rate", "out_naive", "out_premium",
  "out_energyShare", "out_laborShare", "out_capitalShare",
];

/**
 * Wrapper for the ProFormulaModule contract. Maps generic
 * Record<string, number> inputs to typed MachineHourlyRateInputs,
 * calls executeFormula(), and wraps in ProFormulaResult.
 *
 * Input keys (canonical, matching schema field IDs):
 *   purchasePrice, usefulLife, annualHours, wageRate,
 *   powerDraw, energyPrice, idleShare, maintenanceRate
 */
export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: MachineHourlyRateInputs = {
    purchasePrice: get(inputs, "purchasePrice", 0),
    usefulLife: get(inputs, "usefulLife", 0),
    annualHours: get(inputs, "annualHours", 0),
    wageRate: get(inputs, "wageRate", 0),
    powerDraw: get(inputs, "powerDraw", 0),
    energyPrice: get(inputs, "energyPrice", 0),
    idleShare: get(inputs, "idleShare", 0),
    maintenanceRate: get(inputs, "maintenanceRate", 0),
  };

  // Warn if mandatory fields are missing
  const mandatory = ["purchasePrice", "usefulLife", "annualHours", "idleShare", "maintenanceRate"] as const;
  for (const key of mandatory) {
    if (inputs[key] === undefined) {
      warnings.push(`Input "${key}" is missing — using 0`);
    }
  }

  const raw = executeFormula(typed);

  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = (raw as unknown as Record<string, number>)[key];
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

export const toolKey = "machine-hourly-rate-proof-report";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  purchasePrice: 180000,
  usefulLife: 10,
  annualHours: 4000,
  wageRate: 34,
  powerDraw: 12,
  energyPrice: 0.18,
  idleShare: 0.20,
  maintenanceRate: 0.05,
};

export const requiredInputKeys: readonly string[] = [
  "purchasePrice", "usefulLife", "annualHours", "wageRate",
  "powerDraw", "energyPrice", "idleShare", "maintenanceRate",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
