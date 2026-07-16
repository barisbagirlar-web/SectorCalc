import "server-only";
/**
 * FX & Commodity Pass-Through Pricer — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval/new Function.
 * Conforms to ProFormulaModule contract.
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

// ─── Type exports ───────────────────────────────────────────────────────────

export interface FxCommodityPassThroughInputs {
  basePrice: number;
  fxRateSpot: number;
  fxRateBudget: number;
  commodityIndexCurrent: number;
  commodityIndexBudget: number;
  materialCostPct: number;
  fxHedgePct: number;
  commodityHedgePct: number;
  annualVolume: number;
  sourceConfidence: number;
}

export interface FxCommodityPassThroughOutputs {
  out_evidenceCompleteness: number;
  out_normalizedDemand: number;
  out_referenceDeviation: number;
  out_deratingFactor: number;
  out_demandMetric: number;
  out_capacityMetric: number;
  out_utilizationMargin: number;
  out_expandedUncertainty: number;
  out_thresholdCrossing: number;
  out_sensitivityDriver: number;
  out_fmeaTrigger: number;
  out_moneyAtRisk: number;
  out_scenarioDelta: number;
  out_auditHashPayload: number;
  out_finalDecisionState: number;
}

// ─── Pure calculation ───────────────────────────────────────────────────────

export function executeFormula(inputs: FxCommodityPassThroughInputs): FxCommodityPassThroughOutputs {
  const {
    basePrice, fxRateSpot, fxRateBudget, commodityIndexCurrent,
    commodityIndexBudget, materialCostPct, fxHedgePct,
    commodityHedgePct, annualVolume, sourceConfidence,
  } = inputs;

  const fxChange = fxRateBudget > 0 ? (fxRateSpot - fxRateBudget) / fxRateBudget : 0;
  const commChange = commodityIndexBudget > 0 ? (commodityIndexCurrent - commodityIndexBudget) / commodityIndexBudget : 0;
  const fxImpact = fxChange * (materialCostPct / 100) * (1 - fxHedgePct / 100);
  const commImpact = commChange * (materialCostPct / 100) * (1 - commodityHedgePct / 100);
  const totalPassThrough = (fxImpact + commImpact) * 100;
  const adjustedPrice = basePrice * (1 + fxImpact + commImpact);
  const escalationAmount = adjustedPrice - basePrice;
  const annualEscalation = escalationAmount * annualVolume;

  let decision: number;
  if (Math.abs(totalPassThrough) < 5) {
    decision = 0; // OK
  } else if (totalPassThrough >= 5) {
    decision = 1; // REPRICE
  } else {
    decision = 2; // HOLD
  }

  const drivers = [
    Math.abs(fxChange), Math.abs(commChange),
    Math.abs(fxHedgePct), Math.abs(commodityHedgePct),
  ];
  const maxDriver = Math.max(...drivers);
  const driverIdx = drivers.indexOf(maxDriver);

  let fmeaTrigger = 0;
  if (decision === 1) fmeaTrigger = 1;
  if (Math.abs(totalPassThrough) > 15) fmeaTrigger += 2;
  if (fxHedgePct < 50 && commodityHedgePct < 50) fmeaTrigger += 4;

  const riskCost = Math.abs(annualEscalation) * (1 - sourceConfidence);
  const scenarioDelta = totalPassThrough * annualVolume;
  const hashSeed = totalPassThrough * 100 + adjustedPrice * 10 + basePrice;
  const auditHash = Math.abs(hashSeed) % 1000000;
  const demandMetric = annualVolume * (basePrice / 100);
  const refDev = fxRateBudget > 0 ? (fxRateSpot - fxRateBudget) / fxRateBudget : 0;

  let threshold = 0;
  if (totalPassThrough >= 5) threshold = 1;
  if (totalPassThrough < -5) threshold = -1;

  return {
    out_evidenceCompleteness: sourceConfidence,
    out_normalizedDemand: demandMetric,
    out_referenceDeviation: Math.min(1, Math.max(-1, refDev)),
    out_deratingFactor: Math.max(0, Math.min(1, 1 - Math.abs(totalPassThrough) / 100 * (1 - sourceConfidence))),
    out_demandMetric: demandMetric * sourceConfidence,
    out_capacityMetric: basePrice > 0 ? annualEscalation / basePrice : 0,
    out_utilizationMargin: basePrice > 0 ? adjustedPrice / basePrice : 0,
    out_expandedUncertainty: Math.abs(totalPassThrough) * (1 - sourceConfidence),
    out_thresholdCrossing: threshold,
    out_sensitivityDriver: driverIdx,
    out_fmeaTrigger: fmeaTrigger,
    out_moneyAtRisk: Math.max(0, riskCost),
    out_scenarioDelta: scenarioDelta,
    out_auditHashPayload: auditHash,
    out_finalDecisionState: decision,
  };
}

// ─── Sensitivity helper ─────────────────────────────────────────────────────

export function sensitivity(
  inputs: FxCommodityPassThroughInputs,
  driver: keyof FxCommodityPassThroughInputs,
  pct = 0.10,
): number {
  const up = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 + pct) }).out_moneyAtRisk;
  const dn = executeFormula({ ...inputs, [driver]: (inputs[driver] as number) * (1 - pct) }).out_moneyAtRisk;
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
  "out_evidenceCompleteness", "out_normalizedDemand", "out_referenceDeviation",
  "out_deratingFactor", "out_demandMetric", "out_capacityMetric",
  "out_utilizationMargin", "out_expandedUncertainty", "out_thresholdCrossing",
  "out_sensitivityDriver", "out_fmeaTrigger", "out_moneyAtRisk",
  "out_scenarioDelta", "out_auditHashPayload", "out_finalDecisionState",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  const typed: FxCommodityPassThroughInputs = {
    basePrice: get(inputs, "n_base_price"),
    fxRateSpot: get(inputs, "n_fx_rate_spot"),
    fxRateBudget: get(inputs, "n_fx_rate_budget"),
    commodityIndexCurrent: get(inputs, "n_commodity_index_current"),
    commodityIndexBudget: get(inputs, "n_commodity_index_budget"),
    materialCostPct: get(inputs, "n_material_cost_pct"),
    fxHedgePct: get(inputs, "n_fx_hedge_pct"),
    commodityHedgePct: get(inputs, "n_commodity_hedge_pct"),
    annualVolume: get(inputs, "n_annual_volume"),
    sourceConfidence: get(inputs, "n_source_confidence_ratio"),
  };

  const mandatory = [
    "n_base_price", "n_fx_rate_spot", "n_fx_rate_budget",
    "n_commodity_index_current", "n_commodity_index_budget",
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

export const toolKey = "fx-commodity-pass-through-pricer";
export const formulaVersion = "5.3.1-pro-baris.1";

export const sampleInputs: Record<string, number> = {
  n_base_price: 1000,
  n_fx_rate_spot: 1.12,
  n_fx_rate_budget: 1.08,
  n_commodity_index_current: 185,
  n_commodity_index_budget: 170,
  n_material_cost_pct: 45,
  n_fx_hedge_pct: 60,
  n_commodity_hedge_pct: 50,
  n_annual_volume: 5000,
  n_source_confidence_ratio: 0.85,
};

export const requiredInputKeys: readonly string[] = [
  "n_base_price", "n_fx_rate_spot", "n_fx_rate_budget",
  "n_commodity_index_current", "n_commodity_index_budget",
  "n_material_cost_pct", "n_fx_hedge_pct", "n_commodity_hedge_pct",
  "n_annual_volume", "n_source_confidence_ratio",
];

export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];
