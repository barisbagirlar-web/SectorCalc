/**
 * Downtime & Scrap Loss Statement — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Isomorphic — no Node-only or browser-only APIs.
 *
 * Conforms to ProFormulaModule contract for generated-registry.ts.
 * The `calculate` wrapper maps generic Record<string, number> inputs
 * (n_ prefix keys) to typed DowntimeLossInputs, calls executeFormula(),
 * and wraps the result in ProFormulaResult format.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface DowntimeLossInputs {
  productiveHours: number;     // Planned productive hours (canonical hours)
  actualHours: number;         // Actual hours worked (canonical hours)
  hourlyRate: number;          // Hourly burden rate (canonical currency/hour)
  scrapQuantity: number;       // Units scrapped (count)
  unitCost: number;            // Cost per scrapped unit (canonical currency/unit)
  reworkHours: number;         // Hours spent on rework (canonical hours)
  reworkRate: number;          // Rework labor rate (canonical currency/hour)
  materialCost: number;        // Total material cost (canonical currency)
  defectRatePct: number;       // Defect rate percentage (canonical %, e.g. 2.5 = 2.5%)
  sourceConfidence: number;    // Source confidence ratio (0..1)
}

export interface DowntimeLossOutputs {
  out_downtime_hours: number;
  out_downtime_cost: number;
  out_scrap_material_loss: number;
  out_rework_loss: number;
  out_total_loss: number;
  out_uptime_ratio: number;
  out_pareto_driver: number;     // 0 = downtime, 1 = scrap, 2 = rework
  out_decision_state: number;    // 0 = ok, 1 = review, 2 = escalate
  out_threshold_crossing: number;
  out_fmea_trigger: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: DowntimeLossInputs): DowntimeLossOutputs {
  const {
    productiveHours, actualHours, hourlyRate,
    scrapQuantity, unitCost,
    reworkHours, reworkRate,
    materialCost, defectRatePct, sourceConfidence,
  } = inputs;

  // GUARD (ported 2026-07-16): Actual Hours cannot exceed Productive Hours -- that would
  // imply negative downtime, which is not physically possible and previously produced a
  // negative out_downtime_cost (money the shop supposedly "made" from downtime). Clamp to
  // zero rather than silently returning a nonsensical negative loss figure.
  const actualHoursClamped = actualHours > productiveHours ? productiveHours : actualHours;
  const ahOverPh = actualHours > productiveHours;

  const out_downtime_hours = productiveHours - actualHoursClamped;
  const out_downtime_cost = out_downtime_hours * hourlyRate;
  const out_scrap_material_loss = scrapQuantity * unitCost;
  const out_rework_loss = reworkHours * reworkRate;
  const out_total_loss = out_downtime_cost + out_scrap_material_loss + out_rework_loss;

  const out_uptime_ratio = productiveHours > 0
    ? actualHoursClamped / productiveHours
    : 0;

  // Pareto driver: 0 = downtime, 1 = scrap, 2 = rework
  let out_pareto_driver: number;
  if (out_downtime_cost > out_scrap_material_loss) {
    out_pareto_driver = out_downtime_cost > out_rework_loss ? 0 : 2;
  } else {
    out_pareto_driver = out_scrap_material_loss > out_rework_loss ? 1 : 2;
  }

  // Decision: 0 = ok, 1 = review, 2 = escalate
  let out_decision_state = out_total_loss < materialCost * 0.05
    ? 0
    : out_total_loss < materialCost * 0.15
      ? 1
      : 2;
  if (ahOverPh) out_decision_state = Math.max(out_decision_state, 1);

  const out_threshold_crossing = out_decision_state > 0 ? 1 : 0;
  const out_fmea_trigger = out_decision_state >= 2 ? 1 : 0;

  return {
    out_downtime_hours,
    out_downtime_cost,
    out_scrap_material_loss,
    out_rework_loss,
    out_total_loss,
    out_uptime_ratio,
    out_pareto_driver,
    out_decision_state,
    out_threshold_crossing,
    out_fmea_trigger,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: DowntimeLossInputs,
  driver: keyof DowntimeLossInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_total_loss;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_total_loss;
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
  "out_downtime_hours", "out_downtime_cost", "out_scrap_material_loss",
  "out_rework_loss", "out_total_loss", "out_uptime_ratio",
  "out_pareto_driver", "out_decision_state", "out_threshold_crossing",
  "out_fmea_trigger",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: DowntimeLossInputs = {
    productiveHours: get(inputs, "n_productive_hours"),
    actualHours: get(inputs, "n_actual_hours"),
    hourlyRate: get(inputs, "n_hourly_rate"),
    scrapQuantity: get(inputs, "n_scrap_quantity"),
    unitCost: get(inputs, "n_unit_cost"),
    reworkHours: get(inputs, "n_rework_hours"),
    reworkRate: get(inputs, "n_rework_rate"),
    materialCost: get(inputs, "n_material_cost"),
    defectRatePct: get(inputs, "n_defect_rate_pct"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = ["n_productive_hours", "n_actual_hours", "n_hourly_rate"] as const;
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

export const toolKey = "downtime-scrap-loss-statement";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_productive_hours: 176,
  n_actual_hours: 152,
  n_hourly_rate: 65,
  n_scrap_quantity: 45,
  n_unit_cost: 85,
  n_rework_hours: 18,
  n_rework_rate: 45,
  n_material_cost: 120000,
  n_defect_rate_pct: 2.5,
  n_source_confidence_ratio: 0.8,
};

export const requiredInputKeys: readonly string[] = [
  "n_productive_hours", "n_actual_hours", "n_hourly_rate",
  "n_scrap_quantity", "n_unit_cost", "n_rework_hours",
  "n_rework_rate", "n_material_cost", "n_defect_rate_pct",
  "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
