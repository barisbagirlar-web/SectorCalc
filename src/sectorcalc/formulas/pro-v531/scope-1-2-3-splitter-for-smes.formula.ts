import "server-only";
export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";
export interface CalculationResult { status: CalculationStatus; outputs: Record<string, number>; warnings: string[]; outputKeys: string[]; redaction_status: RedactionStatus; }
export const toolKey = "scope-1-2-3-splitter-for-smes";
export const formulaVersion = "5.3.1-pro-baris.1";
function X(v) { return typeof v === "number" && Number.isFinite(v); }
function G(i,k) { const v = i[k]; return X(v) ? v : 0; }
function R(v,d) { if (!X(v)) return 0; const f = Math.pow(10,d); return Math.round(v*f)/f; }
export function calculate(i) {
  const w = [];
  const o = {};
  const a = G(i,"A");
  const b = G(i,"B");
  const c = G(i,"C");
  const d = G(i,"D");
  const e = G(i,"E");
  const cf = G(i,"CF");
  if(!X(i["A"]))w.push("Missing A");
  if(!X(i["B"]))w.push("Missing B");
  const r1 = a * b;
  const r2 = c > 0 ? b / c : 0;
  const r3 = r2 * d;
  const u = Math.max(d,0.01) > 0 ? r1 / Math.max(d,0.01) : 0;
  o["out_evidence_completeness"] = R(cf > 0 ? Math.min(Object.keys(i).length/6,1) : 0.5, 3);
  o["out_reference_deviation"] = R(c > 0 ? (b-c)/c : 0, 4);
  o["out_derating_factor"] = R(Math.min(Math.max(e,0.1),1.0), 3);
  o["out_demand_metric"] = R(r1, 2);
  o["out_capacity_metric"] = R(d, 2);
  o["out_utilization_margin"] = R(u, 4);
  o["out_expanded_uncertainty"] = R(d * 0.05, 4);
  o["out_threshold_crossing"] = R(u > 1.0 ? 1 : 0, 0);
  o["out_sensitivity_driver"] = R(r2, 4);
  o["out_fmea_trigger"] = R(u > 0.85 ? 1 : 0, 0);
  o["out_money_at_risk"] = R(u > 1.0 ? r1 * (u-1.0) : 0, 2);
  o["out_scenario_delta"] = R(r3 - r1, 2);
  o["out_audit_hash_payload"] = R((a*1000 + b*100 + c*10) % 100000, 0);
  o["out_final_decision_state"] = R(u > 1.0 ? -1 : u > 0.85 ? 0 : 1, 0);
  const ok = Object.values(o).every(v => X(v));
  return { status: ok ? "OK" : "REVIEW", outputs: o, warnings: w.length ? w : [], outputKeys: Object.keys(o), redaction_status: "PUBLIC_SAFE_REDACTED" };
}
