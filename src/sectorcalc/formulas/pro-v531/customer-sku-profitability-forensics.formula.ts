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

export const toolKey = "customer-sku-profitability-forensics";
export const formulaVersion = "5.3.1-pro-baris.1";

function isFiniteNumber(v: unknown): v is number { return typeof v === "number" && Number.isFinite(v); }
function get(inputs: Record<string, number>, key: string): number { const v = inputs[key]; return isFiniteNumber(v) ? v : 0; }
function round(v: number, d: number): number { if (!isFiniteNumber(v)) return 0; const f = Math.pow(10, d); return Math.round(v * f) / f; }

export const sampleInputs = PRO_SAMPLE_INPUTS[toolKey];

export function calculate(inputs: Record<string, number>): CalculationResult {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  const up = get(inputs, "n_unit_price");
  const uvc = get(inputs, "n_unit_variable_cost");
  const av = get(inputs, "n_annual_volume") * 31536000; // normalized unit_per_s -> units/year
  const lcp = get(inputs, "n_logistics_cost_pct");
  const scp = get(inputs, "n_service_cost_pct");
  const rrp = get(inputs, "n_return_rate_pct");
  const tm = get(inputs, "n_target_margin");
  const conf = get(inputs, "n_source_confidence_ratio");

  if (!isFiniteNumber(inputs["n_unit_price"])) warnings.push("Missing: n_unit_price");
  if (!isFiniteNumber(inputs["n_unit_variable_cost"])) warnings.push("Missing: n_unit_variable_cost");
  if (!isFiniteNumber(inputs["n_annual_volume"])) warnings.push("Missing: n_annual_volume");
  // NOTE (2026-07-15 audit): n_labor_rate and n_overhead_rate are captured by the schema but
  // intentionally NOT used below. This tool's "unit_variable_cost" already represents the
  // fully-loaded per-unit cost; folding a $/hour labor/overhead rate in here would require a
  // per-unit service-time basis this schema does not collect, and guessing one would repeat
  // the same class of fabricated-formula bug found elsewhere in this audit. Flagged for
  // Baris to clarify intended semantics before wiring these in.

  // n_logistics_cost_pct / n_service_cost_pct / n_return_rate_pct / n_target_margin all have
  // base_unit "ratio" (0..1) per schema — the normalizer already converts a "percent" display
  // entry to ratio before calculate() ever sees it. The previous code divided by 100 a SECOND
  // time here, shrinking every burden and the target margin by 100x and making toxic-SKU
  // detection nearly impossible to trigger. Use the normalized ratios directly.
  const unit_contribution = up - uvc;
  const cm_ratio = up > 0 ? unit_contribution / up : 0;
  const logistics_burden = up * lcp;
  const service_burden = up * scp;
  const return_burden = up * rrp;
  const net_margin = unit_contribution - logistics_burden - service_burden - return_burden;
  const toxic_flag = net_margin < 0 ? 1 : 0;
  const total_margin = net_margin * av;
  const biggest_burden = Math.max(logistics_burden, service_burden, return_burden);
  const net_margin_ratio = up > 0 ? net_margin / up : 0;
  const target_margin_ratio = tm;
  let decision: number;
  // NOTE (2026-07-15 audit): previously compared cm_ratio (BEFORE logistics/service/return
  // burdens) against target, while toxic_flag used net_margin (AFTER burdens) — a SKU with
  // negative net margin could still get a GROW decision. Both now use the same post-burden
  // net margin ratio for a logically consistent verdict.
  if (net_margin_ratio > target_margin_ratio) decision = 0; // GROW
  else if (net_margin_ratio > 0) decision = 1;               // HOLD
  else decision = 2;                                          // CUT

  outputs["out_evidence_completeness"] = round(conf, 3);
  outputs["out_normalized_demand"] = round(av, 0);
  outputs["out_reference_deviation"] = round(tm > 0 ? Math.abs(net_margin_ratio - target_margin_ratio) / target_margin_ratio : 0, 4);
  outputs["out_derating_factor"] = round(net_margin < 0 ? 0 : net_margin / unit_contribution, 4);
  outputs["out_demand_metric"] = round(net_margin, 2);
  outputs["out_capacity_metric"] = round(total_margin, 2);
  outputs["out_utilization_margin"] = round(cm_ratio, 4);
  outputs["out_expanded_uncertainty"] = round(net_margin * 0.1, 2);
  outputs["out_threshold_crossing"] = toxic_flag;
  outputs["out_sensitivity_driver"] = biggest_burden === logistics_burden ? 0 : (biggest_burden === service_burden ? 1 : 2);
  outputs["out_fmea_trigger"] = toxic_flag;
  outputs["out_money_at_risk"] = round(toxic_flag ? total_margin : 0, 2);
  outputs["out_scenario_delta"] = round(biggest_burden * av, 2);
  outputs["out_audit_hash_payload"] = 0;
  outputs["out_final_decision_state"] = decision;

  const ok = Object.values(outputs).every(v => isFiniteNumber(v));
  return { status: ok ? "OK" : "REVIEW", outputs, warnings: warnings.length ? warnings : [], outputKeys: Object.keys(outputs), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
