// @server-only
/**
 * Machine Investment Feasibility: Buy vs Lease vs Keep — formula engine
 *
 * SINGLE SOURCE OF TRUTH. Pure function, no eval / new Function.
 * Isomorphic — no Node-only or browser-only APIs. Safe to import from
 * both server (sealed report via calculate()) and client (live x1 rail
 * + charts via executeFormula() / schedule() / tornado()).
 *
 * Domain model (closed-form, sourced — no invented constants):
 *   Lease  — VDI 2067 Blatt 1 capital-recovery: CAPEX x CRF(i,n) x (1+m+ins)
 *   Keep   — ISO 15686-5 life-cycle cost: opportunity cost (annuitized market
 *            value) + escalating maintenance/energy/scrap (O'Connor bathtub,
 *            ASME PTC 47, ISO 22400-2)
 *   Verdict— highest NPV (least-negative total cost); NPV per ISO 15686-5 A.3
 *
 * Verified by standalone execution against the domain spec closed-form
 * targets before shipping (CRF, lease factor, per-year keep, break-even,
 * winner ordering, stress tests). The spec asserted NPV_keep (-138,600)
 * and NPV_buy (-178,400) totals contain minor arithmetic slips; this engine
 * computes the mathematically correct discounting of the spec own per-year
 * cost definitions instead of copying those totals. Verdict is unchanged.
 *
 * Modeling choices taken faithfully from the spec verification section
 * where its formula section was internally ambiguous:
 *  - BUY operating cost is flat (new machine); only KEEP escalates.
 *  - break-even year is nominal/undiscounted (financing crossover); the NPV
 *    verdict is discounted. Two intentionally different bases.
 *
 * out_breakeven_year is always finite: when Buy's cumulative cost never
 * drops below Lease's within any horizon (Buy's annual operating cost
 * exceeds the annual lease payment), the "no crossover" case is encoded
 * as NO_BREAKEVEN_YEAR rather than Infinity — every declared output must
 * be a finite number per the PRO V2 formula/output contract. Callers
 * should treat any value >= NO_BREAKEVEN_YEAR as "no break-even".
 */

import type { ProFormulaModule, ProFormulaResult } from "./pro-formula-contract";

export const NO_BREAKEVEN_YEAR = 999;

// --- Type exports -----------------------------------------------------------

export interface InvestmentFeasibilityInputs {
  capex: number;
  discountRate: number;
  studyYears: number;
  lessorMargin: number;
  insuranceRate: number;
  buyMaintenance: number;
  buyEnergy: number;
  buyInsurance: number;
  marketValue: number;
  keepBaseMaintenance: number;
  keepBaseEnergy: number;
  productionVolume: number;
  scrapRateBase: number;
  unitCost: number;
  maintEscalation: number;
  energyDegradation: number;
  scrapEscalation: number;
}

export interface InvestmentFeasibilityOutputs {
  out_lease_factor: number;
  out_annual_lease: number;
  out_opportunity_cost: number;
  out_npv_buy: number;
  out_npv_lease: number;
  out_npv_keep: number;
  out_total_cost_buy: number;
  out_total_cost_lease: number;
  out_total_cost_keep: number;
  out_winner: number;
  out_savings_vs_second: number;
  out_breakeven_year: number;
  out_decision_margin_pct: number;
  out_evidence_completeness: number;
}

// --- Core math --------------------------------------------------------------

export function crf(i: number, n: number): number {
  if (n <= 0) return NaN;
  if (Math.abs(i) < 1e-12) return 1 / n;
  const p = Math.pow(1 + i, n);
  return (i * p) / (p - 1);
}

export interface ScheduleRow {
  year: number;
  buy: number;
  lease: number;
  keep: number;
}

export interface Schedule {
  years: number;
  leaseFactor: number;
  annualLease: number;
  opportunityCost: number;
  rows: ScheduleRow[];
}

export function schedule(inp: InvestmentFeasibilityInputs): Schedule {
  const years = Math.max(1, Math.round(inp.studyYears));
  const leaseFactor = crf(inp.discountRate, years) * (1 + inp.lessorMargin + inp.insuranceRate);
  const annualLease = inp.capex * leaseFactor;
  const opportunityCost = inp.marketValue * crf(inp.discountRate, years);

  const buyScrap = inp.productionVolume * inp.scrapRateBase * inp.unitCost;
  const buyAnnual = inp.buyMaintenance + inp.buyEnergy + buyScrap + inp.buyInsurance;

  const rows: ScheduleRow[] = [];
  for (let t = 1; t <= years; t++) {
    const keepMaint = inp.keepBaseMaintenance * Math.pow(1 + inp.maintEscalation, t - 1);
    const keepEnergy = inp.keepBaseEnergy * Math.pow(1 + inp.energyDegradation, t - 1);
    const keepScrapRate = inp.scrapRateBase * Math.pow(1 + inp.scrapEscalation, t - 1);
    const keepScrap = inp.productionVolume * keepScrapRate * inp.unitCost;
    const keep = opportunityCost + keepMaint + keepEnergy + keepScrap;
    rows.push({ year: t, buy: buyAnnual, lease: annualLease, keep });
  }
  return { years, leaseFactor, annualLease, opportunityCost, rows };
}

export function cumulative(
  inp: InvestmentFeasibilityInputs,
): Array<{ year: number; buy: number; lease: number; keep: number }> {
  const s = schedule(inp);
  const out: Array<{ year: number; buy: number; lease: number; keep: number }> = [
    { year: 0, buy: inp.capex, lease: 0, keep: 0 },
  ];
  let cb = inp.capex;
  let cl = 0;
  let ck = 0;
  for (const r of s.rows) {
    cb += r.buy;
    cl += r.lease;
    ck += r.keep;
    out.push({ year: r.year, buy: cb, lease: cl, keep: ck });
  }
  return out;
}

const REQUIRED_KEYS = [
  "n_capex", "n_discount_rate", "n_study_years", "n_lessor_margin",
  "n_insurance_rate", "n_buy_maintenance", "n_buy_energy", "n_buy_insurance",
  "n_market_value", "n_keep_base_maintenance", "n_keep_base_energy",
  "n_production_volume", "n_scrap_rate_base", "n_unit_cost",
  "n_maint_escalation", "n_energy_degradation", "n_scrap_escalation",
] as const;

// --- Pure calculation -------------------------------------------------------

export function executeFormula(inp: InvestmentFeasibilityInputs): InvestmentFeasibilityOutputs {
  const s = schedule(inp);
  const i = inp.discountRate;

  let npvBuy = -inp.capex;
  let npvLease = 0;
  let npvKeep = 0;
  for (const r of s.rows) {
    const d = Math.pow(1 + i, r.year);
    npvBuy += -r.buy / d;
    npvLease += -r.lease / d;
    npvKeep += -r.keep / d;
  }

  const npvs = [npvBuy, npvLease, npvKeep];
  const winner = npvs.indexOf(Math.max(npvBuy, npvLease, npvKeep));
  const sorted = [...npvs].sort((a, b) => b - a);
  const savingsVsSecond = sorted.length > 1 ? sorted[0] - sorted[1] : 0;

  const buyAnnual = s.rows.length ? s.rows[0].buy : 0;
  const annualSaving = s.annualLease - buyAnnual;
  const breakevenYear = annualSaving > 1e-9 ? inp.capex / annualSaving : NO_BREAKEVEN_YEAR;

  const winnerNpvAbs = Math.abs(sorted[0]);
  const decisionMarginPct = winnerNpvAbs > 1e-9 ? savingsVsSecond / winnerNpvAbs : 0;

  return {
    out_lease_factor: s.leaseFactor,
    out_annual_lease: s.annualLease,
    out_opportunity_cost: s.opportunityCost,
    out_npv_buy: npvBuy,
    out_npv_lease: npvLease,
    out_npv_keep: npvKeep,
    out_total_cost_buy: -npvBuy,
    out_total_cost_lease: -npvLease,
    out_total_cost_keep: -npvKeep,
    out_winner: winner,
    out_savings_vs_second: savingsVsSecond,
    out_breakeven_year: breakevenYear,
    out_decision_margin_pct: decisionMarginPct,
    out_evidence_completeness: 1,
  };
}

// --- Sensitivity / tornado --------------------------------------------------

export type TornadoDriver =
  | "discountRate" | "capex" | "maintEscalation"
  | "buyEnergy" | "scrapRateBase" | "lessorMargin";

export interface TornadoBar {
  driver: TornadoDriver;
  label: string;
  low: number;
  high: number;
  span: number;
}

const TORNADO_SPEC: Array<{ driver: TornadoDriver; label: string; pct: number }> = [
  { driver: "discountRate", label: "Discount rate +/-2pt", pct: 0.02 },
  { driver: "capex", label: "CAPEX +/-15%", pct: 0.15 },
  { driver: "maintEscalation", label: "Maint. escalation +/-25%", pct: 0.25 },
  { driver: "buyEnergy", label: "Energy +/-10%", pct: 0.10 },
  { driver: "scrapRateBase", label: "Scrap rate +/-20%", pct: 0.20 },
  { driver: "lessorMargin", label: "Lessor margin +/-1pt", pct: 0.01 },
];

export function tornado(inp: InvestmentFeasibilityInputs): TornadoBar[] {
  const base = executeFormula(inp);
  const winnerKey = (["out_npv_buy", "out_npv_lease", "out_npv_keep"] as const)[base.out_winner];
  const perturb = (driver: TornadoDriver, dir: 1 | -1, pct: number): number => {
    const next = { ...inp };
    if (driver === "discountRate") next.discountRate = inp.discountRate + dir * 0.02;
    else if (driver === "lessorMargin") next.lessorMargin = inp.lessorMargin + dir * 0.01;
    else {
      (next as unknown as Record<string, number>)[driver] =
        (inp as unknown as Record<string, number>)[driver] * (1 + dir * pct);
    }
    return executeFormula(next)[winnerKey];
  };
  const bars = TORNADO_SPEC.map((sp) => {
    const low = perturb(sp.driver, -1, sp.pct);
    const high = perturb(sp.driver, 1, sp.pct);
    return { driver: sp.driver, label: sp.label, low, high, span: Math.abs(high - low) };
  });
  return bars.sort((a, b) => b.span - a.span);
}

// --- ProFormulaModule contract ----------------------------------------------

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string, fallback = 0): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : fallback;
}



const OUTPUT_KEYS: readonly string[] = [
  "out_lease_factor", "out_annual_lease", "out_opportunity_cost",
  "out_npv_buy", "out_npv_lease", "out_npv_keep",
  "out_total_cost_buy", "out_total_cost_lease", "out_total_cost_keep",
  "out_winner", "out_savings_vs_second", "out_breakeven_year",
  "out_decision_margin_pct", "out_evidence_completeness",
];

export function calculate(inputs: Record<string, number>): ProFormulaResult {
  const warnings: string[] = [];

  let presentCount = 0;
  for (const key of REQUIRED_KEYS) {
    if (isFiniteNumber(inputs[key])) presentCount += 1;
    else warnings.push('Input "' + key + '" is missing or invalid - using 0');
  }

  const typed: InvestmentFeasibilityInputs = {
    capex: get(inputs, "n_capex"),
    discountRate: get(inputs, "n_discount_rate"),
    studyYears: get(inputs, "n_study_years"),
    lessorMargin: get(inputs, "n_lessor_margin"),
    insuranceRate: get(inputs, "n_insurance_rate"),
    buyMaintenance: get(inputs, "n_buy_maintenance"),
    buyEnergy: get(inputs, "n_buy_energy"),
    buyInsurance: get(inputs, "n_buy_insurance"),
    marketValue: get(inputs, "n_market_value"),
    keepBaseMaintenance: get(inputs, "n_keep_base_maintenance"),
    keepBaseEnergy: get(inputs, "n_keep_base_energy"),
    productionVolume: get(inputs, "n_production_volume"),
    scrapRateBase: get(inputs, "n_scrap_rate_base"),
    unitCost: get(inputs, "n_unit_cost"),
    maintEscalation: get(inputs, "n_maint_escalation"),
    energyDegradation: get(inputs, "n_energy_degradation"),
    scrapEscalation: get(inputs, "n_scrap_escalation"),
  };

  if (typed.capex <= 0) warnings.push("CAPEX must be greater than 0 for a meaningful comparison");

  const raw = executeFormula(typed) as unknown as Record<string, number>;
  // Full precision preserved here; the schema declares DISPLAY_ONLY rounding —
  // rounding belongs to the report/UI formatting layer, not the sealed value.
  const outputs: Record<string, number> = {};
  for (const key of OUTPUT_KEYS) {
    outputs[key] = key === "out_evidence_completeness"
      ? presentCount / REQUIRED_KEYS.length
      : raw[key];
  }

  const finite = OUTPUT_KEYS.every((k) => isFiniteNumber(outputs[k]));
  const allRequiredPresent = presentCount === REQUIRED_KEYS.length;
  let status: "OK" | "REVIEW" | "BLOCKED" = finite ? "OK" : "REVIEW";
  if (warnings.length > 0) status = "REVIEW";
  // Fail closed: a result computed from fabricated (zero-filled) missing
  // inputs must never present as a trustworthy OK/REVIEW verdict.
  if (typed.capex <= 0 || !allRequiredPresent) status = "BLOCKED";

  return {
    status,
    outputs,
    warnings,
    outputKeys: [...OUTPUT_KEYS],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}

export const toolKey = "machine-investment-feasibility-buy-lease-keep";
export const formulaVersion = "5.3.2-domain.1";

export const sampleInputs: Record<string, number> = {
  n_capex: 100000,
  n_discount_rate: 0.08,
  n_study_years: 7,
  n_lessor_margin: 0.02,
  n_insurance_rate: 0.005,
  n_buy_maintenance: 5000,
  n_buy_energy: 8000,
  n_buy_insurance: 0,
  n_market_value: 40000,
  n_keep_base_maintenance: 5000,
  n_keep_base_energy: 8000,
  n_production_volume: 10000,
  n_scrap_rate_base: 0.02,
  n_unit_cost: 12,
  n_maint_escalation: 0.08,
  n_energy_degradation: 0.02,
  n_scrap_escalation: 0.05,
};

export const requiredInputKeys: readonly string[] = [...REQUIRED_KEYS];
export const declaredOutputKeys: readonly string[] = [...OUTPUT_KEYS];

const proModule: ProFormulaModule = {
  toolKey,
  formulaVersion,
  calculate,
  sampleInputs,
  requiredInputKeys,
  declaredOutputKeys,
};

export default proModule;
