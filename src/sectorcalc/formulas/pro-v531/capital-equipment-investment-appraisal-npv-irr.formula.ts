import "server-only";
import { PRO_SAMPLE_INPUTS } from "./pro-sample-inputs";

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

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

function computeNpv(initial: number, terminal: number, cashFlows: number[], rate: number, years: number): number {
  let npv = -initial;
  for (let y = 1; y <= years; y++) {
    npv += safeDiv(cashFlows[y - 1] || 0, Math.pow(1 + rate, y));
  }
  npv += safeDiv(terminal, Math.pow(1 + rate, years));
  return npv;
}

function computeIrr(initial: number, terminal: number, cashFlows: number[], years: number): number {
  let irr = 0.1;
  const maxIter = 100;
  for (let iter = 0; iter < maxIter; iter++) {
    let npv = -initial;
    for (let y = 1; y <= years; y++) {
      npv += safeDiv(cashFlows[y - 1] || 0, Math.pow(1 + irr, y));
    }
    npv += safeDiv(terminal, Math.pow(1 + irr, years));
    if (Math.abs(npv) < 0.001) break;
    let dnpv = 0;
    for (let y = 1; y <= years; y++) {
      dnpv += (-y * (cashFlows[y - 1] || 0)) / Math.pow(1 + irr, y + 1);
    }
    dnpv += (-years * terminal) / Math.pow(1 + irr, years + 1);
    if (Math.abs(dnpv) < 1e-12) { irr = 0; break; }
    irr = irr - safeDiv(npv, dnpv);
    if (!isFiniteNumber(irr)) { irr = 0; break; }
    if (irr < -0.99) irr = -0.99;
    if (irr > 10) irr = 10;
  }
  return irr * 100; // return as percentage
}

function computePayback(initial: number, cashFlows: number[]): number {
  let cumulative = -initial;
  for (let y = 0; y < cashFlows.length; y++) {
    cumulative += cashFlows[y];
    if (cumulative >= 0) {
      const prev = cumulative - cashFlows[y];
      return y + safeDiv(-prev, cashFlows[y]);
    }
  }
  return cashFlows.length; // did not pay back
}

function computeDiscountedPayback(initial: number, cashFlows: number[], rate: number): number {
  let cumulative = -initial;
  for (let y = 1; y <= cashFlows.length; y++) {
    const dcf = safeDiv(cashFlows[y - 1], Math.pow(1 + rate, y));
    cumulative += dcf;
    if (cumulative >= 0) {
      const prev = cumulative - dcf;
      return y + safeDiv(-prev, dcf);
    }
  }
  return cashFlows.length;
}

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const requiredKeys = [
    "n_initial_investment",
    "n_working_capital",
    "n_annual_cash_inflow_1",
    "n_annual_cash_inflow_2",
    "n_annual_cash_inflow_3",
    "n_annual_cash_inflow_4",
    "n_annual_cash_inflow_5",
    "n_terminal_residual_value",
    "n_discount_rate_percent",
    "n_scenario_downside_pct",
    "n_scenario_upside_pct",
  ];

  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  const initial_investment = Math.max(0, get(inputs, "n_initial_investment"));
  const working_capital = Math.max(0, get(inputs, "n_working_capital"));
  const cf1 = Math.max(0, get(inputs, "n_annual_cash_inflow_1"));
  const cf2 = Math.max(0, get(inputs, "n_annual_cash_inflow_2"));
  const cf3 = Math.max(0, get(inputs, "n_annual_cash_inflow_3"));
  const cf4 = Math.max(0, get(inputs, "n_annual_cash_inflow_4"));
  const cf5 = Math.max(0, get(inputs, "n_annual_cash_inflow_5"));
  const terminal_value = Math.max(0, get(inputs, "n_terminal_residual_value"));
  const discount_rate_pct = Math.max(0, get(inputs, "n_discount_rate_percent"));
  const downside_pct = get(inputs, "n_scenario_downside_pct");
  const upside_pct = Math.max(0, get(inputs, "n_scenario_upside_pct"));

  const rate = discount_rate_pct / 100;
  const years = 5;
  const cashFlows = [cf1, cf2, cf3, cf4, cf5];
  const total_initial_cash = initial_investment + working_capital;
  const annual_cash_flows_sum = cf1 + cf2 + cf3 + cf4 + cf5;

  // NPV
  const npv = computeNpv(total_initial_cash, terminal_value + working_capital, cashFlows, rate, years);

  // IRR
  const irr_percent = computeIrr(total_initial_cash, terminal_value + working_capital, cashFlows, years);

  // Simple payback
  const simple_payback = computePayback(total_initial_cash, cashFlows);

  // Discounted payback
  const discounted_payback = computeDiscountedPayback(total_initial_cash, cashFlows, rate);

  // Profitability Index
  const pv_inflows = cashFlows.reduce((sum, cf, i) => sum + safeDiv(cf, Math.pow(1 + rate, i + 1)), 0);
  const pv_terminal = safeDiv(terminal_value + working_capital, Math.pow(1 + rate, years));
  const pi = total_initial_cash > 0 ? safeDiv(pv_inflows + pv_terminal, total_initial_cash) : 0;

  // Scenarios
  const downsideFactor = 1 + (downside_pct / 100);
  const upsideFactor = 1 + (upside_pct / 100);
  const downsideCashFlows = cashFlows.map(cf => cf * downsideFactor);
  const upsideCashFlows = cashFlows.map(cf => cf * upsideFactor);
  const scenario_downside_npv = computeNpv(total_initial_cash, (terminal_value + working_capital) * downsideFactor, downsideCashFlows, rate, years);
  const scenario_base_npv = npv;
  const scenario_upside_npv = computeNpv(total_initial_cash, (terminal_value + working_capital) * upsideFactor, upsideCashFlows, rate, years);

  // Primary value driver: 0=cash flow year 1, 1=cash flow year 2, 2=residual, 3=working capital recovery
  const driverValues = [Math.abs(cf1), Math.abs(cf2), Math.abs(terminal_value), Math.abs(working_capital)];
  const maxVal = Math.max(...driverValues);
  const primary_value_driver = maxVal > 0 ? driverValues.indexOf(maxVal) : 0;

  // Decision state: 0=GOOD, 1=REVIEW, 2=BLOCKED
  let decision: number;
  if (npv > 0 && irr_percent > discount_rate_pct && simple_payback <= years) {
    decision = 0; // GOOD — clear invest
  } else if (npv > 0 || irr_percent > discount_rate_pct) {
    decision = 1; // REVIEW — marginal
  } else {
    decision = 2; // BLOCKED — do not invest
  }

  outputs["out_initial_investment"] = round(initial_investment, 2);
  outputs["out_working_capital"] = round(working_capital, 2);
  outputs["out_total_initial_cash"] = round(total_initial_cash, 2);
  outputs["out_annual_cash_flows_sum"] = round(annual_cash_flows_sum, 2);
  outputs["out_terminal_value"] = round(terminal_value + working_capital, 2);
  outputs["out_discount_rate"] = round(discount_rate_pct, 2);
  outputs["out_npv"] = round(npv, 2);
  outputs["out_irr_percent"] = round(irr_percent, 2);
  outputs["out_simple_payback_years"] = round(simple_payback, 2);
  outputs["out_discounted_payback_years"] = round(discounted_payback, 2);
  outputs["out_profitability_index"] = round(pi, 4);
  outputs["out_scenario_downside_npv"] = round(scenario_downside_npv, 2);
  outputs["out_scenario_base_npv"] = round(scenario_base_npv, 2);
  outputs["out_scenario_upside_npv"] = round(scenario_upside_npv, 2);
  outputs["out_primary_value_driver"] = primary_value_driver;
  outputs["out_investment_decision_state"] = decision;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return {
    status: ok ? "OK" : "REVIEW",
    outputs,
    warnings: warnings.length ? warnings : [],
    outputKeys: Object.keys(outputs),
    redaction_status: "PUBLIC_SAFE_REDACTED"
  };
}
