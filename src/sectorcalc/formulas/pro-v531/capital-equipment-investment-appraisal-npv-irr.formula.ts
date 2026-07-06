import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export interface CalculationResult {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
}

export const toolKey = "capital-equipment-investment-appraisal-npv-irr";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

function safeDiv(n: number, d: number): number {
  if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0;
  return n / d;
}

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // --- Validate required inputs ---
  const requiredKeys = [
    "n_initial_investment",
    "n_annual_net_cash_flow",
    "n_discount_rate",
    "n_analysis_years",
    "n_residual_value",
    "n_stress_downside_factor",
    "n_annual_volume",
    "n_labor_rate",
    "n_overhead_rate",
    "n_defect_or_loss_cost",
    "n_source_confidence_ratio",
    "n_uncertainty_multiplier",
  ];

  let evidenceCount = 0;
  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    } else {
      evidenceCount++;
    }
  }

  // --- Extract inputs ---
  const n_initial_investment = get(inputs, "n_initial_investment");
  const n_annual_net_cash_flow = get(inputs, "n_annual_net_cash_flow");
  const n_discount_rate = get(inputs, "n_discount_rate");
  const n_analysis_years = get(inputs, "n_analysis_years");
  const n_residual_value = get(inputs, "n_residual_value");
  const n_stress_downside_factor = get(inputs, "n_stress_downside_factor");
  const n_annual_volume = get(inputs, "n_annual_volume");
  const n_labor_rate = get(inputs, "n_labor_rate");
  const n_overhead_rate = get(inputs, "n_overhead_rate");
  const n_defect_or_loss_cost = get(inputs, "n_defect_or_loss_cost");
  const n_source_confidence_ratio = get(inputs, "n_source_confidence_ratio");
  const n_uncertainty_multiplier = get(inputs, "n_uncertainty_multiplier");

  // --- Derived parameters ---
  const years = Math.max(1, Math.round(n_analysis_years));
  const rate = n_discount_rate / 100;
  const stress = Math.max(0, Math.min(1, n_stress_downside_factor));

  // --- NPV calculation ---
  const annual_cf = n_annual_net_cash_flow + safeDiv(n_residual_value, n_analysis_years);
  let npv = -n_initial_investment;
  for (let y = 1; y <= years; y++) {
    npv += annual_cf / Math.pow(1 + rate, y);
  }
  npv += n_residual_value / Math.pow(1 + rate, years);

  // --- IRR calculation (Newton's method) ---
  let irr = 0.1;
  const maxIter = 100;
  for (let iter = 0; iter < maxIter; iter++) {
    let npv_at_guess = -n_initial_investment;
    for (let y = 1; y <= years; y++) {
      npv_at_guess += annual_cf / Math.pow(1 + irr, y);
    }
    npv_at_guess += n_residual_value / Math.pow(1 + irr, years);

    if (Math.abs(npv_at_guess) < 0.001) break;

    // Derivative at guess (dNPV/dIRR)
    let dnpv = 0;
    for (let y = 1; y <= years; y++) {
      dnpv += (-y * annual_cf) / Math.pow(1 + irr, y + 1);
    }
    dnpv += (-years * n_residual_value) / Math.pow(1 + irr, years + 1);

    if (Math.abs(dnpv) < 1e-12) {
      irr = 0;
      break;
    }
    irr = irr - npv_at_guess / dnpv;

    if (!isFiniteNumber(irr)) {
      irr = 0;
      break;
    }
    if (irr < -0.99) irr = -0.99;
    if (irr > 10) irr = 10;
  }
  const irr_pct = irr * 100;

  // --- Payback period ---
  let cumulative = -n_initial_investment;
  let payback = years;
  for (let y = 1; y <= years; y++) {
    cumulative += annual_cf;
    if (cumulative >= 0) {
      payback = y - safeDiv(cumulative - annual_cf, annual_cf);
      break;
    }
  }

  // --- Profitability Index ---
  const pi = n_initial_investment > 0
    ? safeDiv(npv + n_initial_investment, n_initial_investment)
    : 0;

  // --- Decision ---
  let decision: number;
  if (npv > 0 && irr > rate) {
    decision = 0; // PASS
  } else if (npv > 0) {
    decision = 1; // REVIEW (NPV positive but IRR below discount rate)
  } else {
    decision = 2; // HOLD
  }

  // --- Output 1: out_evidence_completeness ---
  const totalInputs = requiredKeys.length;
  const evidenceRatio = safeDiv(evidenceCount, totalInputs);
  outputs["out_evidence_completeness"] = round(Math.min(1, Math.max(0, evidenceRatio)), 4);

  // --- Output 2: out_normalized_demand ---
  const demandMetric = n_annual_volume * safeDiv(n_labor_rate, 1000);
  outputs["out_normalized_demand"] = round(demandMetric, 4);

  // --- Output 3: out_reference_deviation ---
  const refDev = safeDiv(n_overhead_rate - n_labor_rate, Math.max(1, n_labor_rate));
  outputs["out_reference_deviation"] = round(Math.min(1, Math.max(-1, refDev)), 4);

  // --- Output 4: out_derating_factor ---
  const derating = 1 - stress * n_uncertainty_multiplier * (1 - n_source_confidence_ratio);
  outputs["out_derating_factor"] = round(Math.max(0, Math.min(1, derating)), 4);

  // --- Output 5: out_demand_metric ---
  outputs["out_demand_metric"] = round(demandMetric * n_source_confidence_ratio, 4);

  // --- Output 6: out_capacity_metric ---
  const capacityMetric = safeDiv(n_annual_net_cash_flow, Math.max(1, n_initial_investment));
  outputs["out_capacity_metric"] = round(capacityMetric, 4);

  // --- Output 7: out_utilization_margin ---
  outputs["out_utilization_margin"] = round(pi, 4);

  // --- Output 8: out_expanded_uncertainty ---
  const uncertainty = n_uncertainty_multiplier * (1 - n_source_confidence_ratio) * Math.abs(npv);
  outputs["out_expanded_uncertainty"] = round(uncertainty, 4);

  // --- Output 9: out_threshold_crossing ---
  let threshold = 0;
  if (npv > 0) threshold = 1;
  if (n_defect_or_loss_cost > 0 && npv < n_defect_or_loss_cost) threshold = -1;
  outputs["out_threshold_crossing"] = threshold;

  // --- Output 10: out_sensitivity_driver ---
  const drivers = [
    Math.abs(n_initial_investment),
    Math.abs(n_annual_net_cash_flow),
    Math.abs(n_overhead_rate),
    Math.abs(n_labor_rate),
  ];
  const maxDriver = Math.max(...drivers);
  const driverIdx = drivers.indexOf(maxDriver);
  outputs["out_sensitivity_driver"] = driverIdx;

  // --- Output 11: out_fmea_trigger ---
  let fmeaTrigger = 0;
  if (decision === 1) fmeaTrigger = 1;
  if (stress > 0.3) fmeaTrigger += 2;
  if (irr <= 0) fmeaTrigger += 4;
  outputs["out_fmea_trigger"] = fmeaTrigger;

  // --- Output 12: out_money_at_risk ---
  const riskCost = n_defect_or_loss_cost * n_annual_volume * stress;
  const moneyAtRisk = Math.max(0, riskCost - npv * (1 - stress));
  outputs["out_money_at_risk"] = round(moneyAtRisk, 4);

  // --- Output 13: out_scenario_delta ---
  const scenarioDelta = npv - irr_pct * 100;
  outputs["out_scenario_delta"] = round(scenarioDelta, 4);

  // --- Output 14: out_audit_hash_payload ---
  const hashSeed = npv * 1000 + irr * 100 + payback * 10 + n_initial_investment;
  const auditHash = Math.abs(hashSeed) % 1000000;
  outputs["out_audit_hash_payload"] = round(auditHash, 0);

  // --- Output 15: out_final_decision_state ---
  outputs["out_final_decision_state"] = decision;

  // --- Sanity check: ensure all 15 outputs are finite ---
  const allOutputKeys = [
    "out_evidence_completeness",
    "out_normalized_demand",
    "out_reference_deviation",
    "out_derating_factor",
    "out_demand_metric",
    "out_capacity_metric",
    "out_utilization_margin",
    "out_expanded_uncertainty",
    "out_threshold_crossing",
    "out_sensitivity_driver",
    "out_fmea_trigger",
    "out_money_at_risk",
    "out_scenario_delta",
    "out_audit_hash_payload",
    "out_final_decision_state",
  ];

  for (const key of allOutputKeys) {
    if (!isFiniteNumber(outputs[key])) {
      outputs[key] = 0;
      warnings.push("Non-finite output corrected to zero: " + key);
    }
  }

  // Derive status
  let status: CalculationStatus = "OK";
  if (warnings.length > 0) status = "REVIEW";
  if (decision === 2) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: allOutputKeys,
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
