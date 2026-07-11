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

export const toolKey = "machine-investment-feasibility-buy-lease-keep";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function safeDiv(n: number, d: number): number { if (!isFiniteNumber(n) || !isFiniteNumber(d) || Math.abs(d) < 1e-12) return 0; return n / d; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const requiredKeys = [
    "n_machine_purchase_price",
    "n_down_payment_pct",
    "n_lease_annual_payment",
    "n_lease_term_years",
    "n_loan_interest_rate_pct",
    "n_loan_term_years",
    "n_annual_maintenance_cost",
    "n_annual_downtime_cost",
    "n_residual_value",
    "n_operating_savings_per_year",
    "n_discount_rate",
  ];

  for (const key of requiredKeys) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  const purchase_price = Math.max(0, get(inputs, "n_machine_purchase_price"));
  const down_payment_pct = Math.max(0, Math.min(100, get(inputs, "n_down_payment_pct")));
  const lease_annual = Math.max(0, get(inputs, "n_lease_annual_payment"));
  const lease_term = Math.max(1, Math.round(get(inputs, "n_lease_term_years")));
  const loan_rate = Math.max(0, get(inputs, "n_loan_interest_rate_pct")) / 100;
  const loan_term = Math.max(1, Math.round(get(inputs, "n_loan_term_years")));
  const maintenance = Math.max(0, get(inputs, "n_annual_maintenance_cost"));
  const downtime = Math.max(0, get(inputs, "n_annual_downtime_cost"));
  const residual = Math.max(0, get(inputs, "n_residual_value"));
  const savings = Math.max(0, get(inputs, "n_operating_savings_per_year"));
  const discount_rate = Math.max(0, get(inputs, "n_discount_rate")) / 100;

  const analysis_years = Math.max(lease_term, loan_term);
  const down_payment = purchase_price * (down_payment_pct / 100);
  const loan_amount = purchase_price - down_payment;

  // --- BUY SCENARIO ---
  // Loan payment (PMT): loan_amount * rate / (1 - (1+rate)^-n)
  const loan_pmt = loan_rate > 0
    ? loan_amount * loan_rate / (1 - Math.pow(1 + loan_rate, -loan_term))
    : loan_amount / loan_term;
  const buy_initial_cash = down_payment;
  const buy_annual_payments = loan_pmt;
  const buy_maintenance = maintenance;
  const buy_downtime = downtime;
  let buy_total_lifecycle = buy_initial_cash;
  for (let y = 1; y <= analysis_years; y++) {
    buy_total_lifecycle += buy_annual_payments + buy_maintenance + buy_downtime;
  }
  buy_total_lifecycle -= residual; // recover residual value at end
  // Buy NPV
  let buy_npv = -buy_initial_cash;
  for (let y = 1; y <= analysis_years; y++) {
    const net_benefit = savings - (buy_annual_payments + buy_maintenance + buy_downtime);
    buy_npv += safeDiv(net_benefit, Math.pow(1 + discount_rate, y));
  }
  buy_npv += safeDiv(residual, Math.pow(1 + discount_rate, analysis_years));

  // --- LEASE SCENARIO ---
  const lease_initial_cash = 0;
  const lease_annual_payments = lease_annual;
  let lease_total_lifecycle = 0;
  for (let y = 1; y <= analysis_years; y++) {
    lease_total_lifecycle += lease_annual_payments;
  }
  let lease_npv = 0;
  for (let y = 1; y <= analysis_years; y++) {
    lease_npv += safeDiv(savings - lease_annual_payments, Math.pow(1 + discount_rate, y));
  }

  // --- KEEP SCENARIO ---
  let keep_total_lifecycle = 0;
  for (let y = 1; y <= analysis_years; y++) {
    keep_total_lifecycle += downtime + maintenance;
  }
  // Keep NPV = present value of (savings * 0.5 since older machine is less efficient) minus keep costs
  let keep_npv = 0;
  for (let y = 1; y <= analysis_years; y++) {
    const keep_benefit = savings * 0.5 - (maintenance + downtime);
    keep_npv += safeDiv(keep_benefit, Math.pow(1 + discount_rate, y));
  }

  // Selected alternative: 0=buy, 1=lease, 2=keep
  const bestNpv = Math.max(buy_npv, lease_npv, keep_npv);
  let selected_alternative: number;
  if (bestNpv <= 0) {
    selected_alternative = 3; // NONE — all negative
  } else if (bestNpv === buy_npv) {
    selected_alternative = 0; // BUY
  } else if (bestNpv === lease_npv) {
    selected_alternative = 1; // LEASE
  } else {
    selected_alternative = 2; // KEEP
  }

  // Decision gap = best NPV - second best NPV
  const sortedNpvs = [buy_npv, lease_npv, keep_npv].sort((a, b) => b - a);
  const decision_gap = sortedNpvs.length > 1 ? sortedNpvs[0] - sortedNpvs[1] : 0;

  // Decision state
  let decision: number;
  if (bestNpv > 0 && decision_gap > Math.abs(bestNpv) * 0.1) {
    decision = 0; // GOOD — clear winner
  } else if (bestNpv > 0) {
    decision = 1; // REVIEW — close alternatives
  } else {
    decision = 2; // BLOCKED — no viable option
  }
  if (selected_alternative === 3) decision = 3; // all negative special state

  outputs["out_buy_initial_cash"] = round(buy_initial_cash, 2);
  outputs["out_buy_annual_payments"] = round(buy_annual_payments, 2);
  outputs["out_buy_maintenance"] = round(buy_maintenance, 2);
  outputs["out_buy_downtime"] = round(buy_downtime, 2);
  outputs["out_buy_total_lifecycle"] = round(buy_total_lifecycle, 2);
  outputs["out_buy_npv"] = round(buy_npv, 2);
  outputs["out_lease_initial_cash"] = round(lease_initial_cash, 2);
  outputs["out_lease_annual_payments"] = round(lease_annual_payments, 2);
  outputs["out_lease_total_lifecycle"] = round(lease_total_lifecycle, 2);
  outputs["out_lease_npv"] = round(lease_npv, 2);
  outputs["out_keep_total_lifecycle"] = round(keep_total_lifecycle, 2);
  outputs["out_keep_npv"] = round(keep_npv, 2);
  outputs["out_selected_alternative"] = selected_alternative;
  outputs["out_decision_gap"] = round(decision_gap, 2);
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
