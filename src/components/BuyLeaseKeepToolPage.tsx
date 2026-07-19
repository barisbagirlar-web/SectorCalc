"use client";

// SectorCalc PRO — Machine Investment Feasibility: Buy vs Lease vs Keep
// Dedicated page implementing the x1 reference design (see machine-hourly-rate
// for the sibling pattern). Live preview via the pure formula engine (no
// credit cost); sealed report via /api/pro-calculator/execute (1 credit).
//
// Input keys sent to the server are the EXACT schema.inputs[].id values
// (snake_case: capex, discount_rate, ...) with raw DISPLAY values and a
// matching selected_units entry — never pre-converted canonical values —
// so the server's unit-normalizer converts exactly once.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  executeFormula,
  schedule,
  cumulative,
  tornado,
  NO_BREAKEVEN_YEAR,
  declaredOutputKeys as SEALED_OUTPUT_KEYS,
  type InvestmentFeasibilityInputs,
  type InvestmentFeasibilityOutputs,
  type TornadoBar,
} from "@/sectorcalc/formulas/pro-v531/machine-investment-feasibility-buy-lease-keep.formula";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/buy-lease-keep-tool.css";

const TOOL_KEY = "machine-investment-feasibility-buy-lease-keep";
const BYPASS_SESSION_ID = "bypass-unlimited";

// ── Currency registry ────────────────────────────────────────────
const CURRENCIES: Array<{ code: string; sym: string }> = [
  { code: "EUR", sym: "€" }, { code: "USD", sym: "$" }, { code: "GBP", sym: "£" },
  { code: "TRY", sym: "₺" }, { code: "JPY", sym: "¥JP" }, { code: "CNY", sym: "¥CN" },
  { code: "CHF", sym: "CHF" }, { code: "SEK", sym: "kr" }, { code: "AUD", sym: "A$" },
  { code: "CAD", sym: "C$" }, { code: "INR", sym: "₹" }, { code: "AED", sym: "AED" },
];

// ── Field schema — id MUST equal schema.inputs[].id exactly ────────
type Dom = "cur" | "pct" | "num";
interface UnitOption { k: string; f: number; l: string } // f: multiplier from this display unit to canonical
interface FieldDef {
  ev: keyof InvestmentFeasibilityInputs;
  dom: Dom;
  label: string;
  def: number;
  hard: [number, number]; // in DISPLAY units (percent as 0-100, currency/num as-is)
  ref: [number, number];  // industry reference range, same display units as hard
  refUnit: string;
  hint: string;
  src: string;
  grp: number;
  units?: UnitOption[]; // when present, renders a unit dropdown; canonical value = raw * factor
}
const FIELDS: Record<string, FieldDef> = {
  capex:                 { ev: "capex",               dom: "cur", label: "CAPEX — purchase price (installed)", def: 100000, hard: [1, 5e8], ref: [15000, 2000000], refUnit: "", hint: "New machine, installed and commissioned.", src: "vendor quote or capex budget", grp: 1 },
  discount_rate:         { ev: "discountRate",         dom: "pct", label: "Discount / interest rate",           def: 8,      hard: [0, 40],  ref: [6, 12],           refUnit: "%", hint: "Corporate cost of capital. Drives NPV and lease recovery.", src: "finance policy", grp: 1 },
  study_years:           { ev: "studyYears",           dom: "num", label: "Study period",                       def: 7,      hard: [1, 40],  ref: [5, 10],           refUnit: "yr", hint: "Analysis horizon and lease term.", src: "engineering assumption register", grp: 1,
                           units: [{ k: "yr", f: 1, l: "years" }, { k: "mo", f: 1 / 12, l: "months" }] },
  lessor_margin:         { ev: "lessorMargin",         dom: "pct", label: "Lessor margin",                      def: 2,      hard: [0, 20],  ref: [1, 4],            refUnit: "%", hint: "Leasing company profit spread.", src: "Equipment Lessor Council", grp: 2 },
  insurance_rate:        { ev: "insuranceRate",        dom: "pct", label: "Lease insurance rate",               def: 0.5,    hard: [0, 10],  ref: [0.3, 1],          refUnit: "%", hint: "All-risk cover folded into the lease factor.", src: "insurance policy quote", grp: 2 },
  buy_maintenance:       { ev: "buyMaintenance",       dom: "cur", label: "Buy — annual maintenance",           def: 5000,   hard: [0, 5e7], ref: [2000, 15000],     refUnit: "/yr", hint: "New machine, flat over the horizon.", src: "OEM service schedule", grp: 3 },
  buy_energy:            { ev: "buyEnergy",            dom: "cur", label: "Buy — annual energy",                def: 8000,   hard: [0, 5e7], ref: [3000, 20000],     refUnit: "/yr", hint: "Energy for the new machine.", src: "metered or nameplate kW", grp: 3 },
  buy_insurance:         { ev: "buyInsurance",         dom: "cur", label: "Buy — annual insurance",             def: 0,      hard: [0, 5e7], ref: [0, 3000],         refUnit: "/yr", hint: "Owner's insurance (0 if self-insured).", src: "policy quote", grp: 3 },
  market_value:          { ev: "marketValue",          dom: "cur", label: "Keep — current market value",       def: 40000,  hard: [0, 5e8], ref: [5000, 150000],    refUnit: "", hint: "Resale value forgone by keeping = opportunity cost.", src: "appraisal or resale comp", grp: 4 },
  keep_base_maintenance: { ev: "keepBaseMaintenance",  dom: "cur", label: "Keep — year-1 maintenance",         def: 5000,   hard: [0, 5e7], ref: [3000, 20000],     refUnit: "/yr", hint: "Escalates with age (see Advanced).", src: "maintenance log, last 12mo", grp: 4 },
  keep_base_energy:      { ev: "keepBaseEnergy",       dom: "cur", label: "Keep — year-1 energy",              def: 8000,   hard: [0, 5e7], ref: [3000, 25000],     refUnit: "/yr", hint: "Degrades with age (see Advanced).", src: "metered, last 12mo", grp: 4 },
  production_volume:     { ev: "productionVolume",     dom: "num", label: "Annual production volume",          def: 10000,  hard: [0, 1e9], ref: [1000, 500000],    refUnit: "u/yr", hint: "Shared by Buy and Keep (same line).", src: "MES/ERP throughput", grp: 5,
                           units: [{ k: "yr", f: 1, l: "units/yr" }, { k: "mo", f: 12, l: "units/mo" }] },
  scrap_rate_base:       { ev: "scrapRateBase",        dom: "pct", label: "Year-1 scrap rate",                  def: 2,      hard: [0, 100], ref: [0.5, 5],          refUnit: "%", hint: "Escalates for Keep with wear.", src: "ISO 22400-2", grp: 5 },
  unit_cost:             { ev: "unitCost",             dom: "cur", label: "Cost per scrapped unit",             def: 12,     hard: [0, 1e6], ref: [1, 200],          refUnit: "", hint: "Material + value added lost per scrap.", src: "BOM + labor cost", grp: 5 },
  maint_escalation:      { ev: "maintEscalation",      dom: "pct", label: "Keep maintenance escalation",        def: 8,      hard: [0, 50],  ref: [6, 12],           refUnit: "%/yr", hint: "Bathtub wear-out phase.", src: "O'Connor 2014, Ch.9", grp: 6 },
  energy_degradation:    { ev: "energyDegradation",    dom: "pct", label: "Keep energy degradation",            def: 2,      hard: [0, 30],  ref: [1.5, 2.5],        refUnit: "%/yr", hint: "Efficiency loss with age.", src: "ASME PTC 47", grp: 6 },
  scrap_escalation:      { ev: "scrapEscalation",      dom: "pct", label: "Keep scrap-rate escalation",         def: 5,      hard: [0, 50],  ref: [3, 8],            refUnit: "%/yr", hint: "Wear-induced defect growth.", src: "ISO 22400-2", grp: 6 },
};
const GROUPS: Record<number, { n: string; t: string; d: string }> = {
  1: { n: "01", t: "Global assumptions", d: "Shared by all three scenarios: what the machine costs new, the cost of capital, and how long you are analysing." },
  2: { n: "02", t: "Lease terms (capital-recovery method)", d: "You never type a rent figure — the annual lease is derived from CAPEX via the capital-recovery factor plus margin and insurance." },
  3: { n: "03", t: "Buy — owning a new machine", d: "Operating cost of the newly purchased machine. Held flat (new asset)." },
  4: { n: "04", t: "Keep — running the existing machine", d: "Opportunity cost of not selling, plus ageing operating cost that escalates over time." },
  5: { n: "05", t: "Production & scrap", d: "Throughput and scrap economics, shared by the Buy and Keep lines." },
  6: { n: "06", t: "Advanced — escalation coefficients", d: "Sourced industry defaults for how an ageing machine gets more expensive. Editable." },
};

interface FieldState { value: string; unit: string; error: string | null; warn: boolean; canon: number | null; }

function unitFactor(f: FieldDef, unitKey: string): number {
  if (!f.units) return 1;
  return (f.units.find((u) => u.k === unitKey) ?? f.units[0]).f;
}
function toCanon(f: FieldDef, raw: number, unitKey: string): number {
  const v = f.dom === "pct" ? raw / 100 : raw;
  return v * unitFactor(f, unitKey);
}
function fromCanon(f: FieldDef, canon: number, unitKey: string): number {
  const v = canon / unitFactor(f, unitKey);
  return f.dom === "pct" ? v * 100 : v;
}
function boundValue(f: FieldDef, raw: number, canon: number): number {
  if (f.dom === "pct") return raw;
  if (f.units) return canon / f.units[0].f; // compare in the primary display unit, matching refCheck
  return canon;
}
function refCheck(f: FieldDef, canon: number): boolean {
  if (f.units) {
    const primary = f.units[0];
    const inPrimary = canon / primary.f;
    return inPrimary < f.ref[0] || inPrimary > f.ref[1];
  }
  const lo = f.dom === "pct" ? f.ref[0] / 100 : f.ref[0];
  const hi = f.dom === "pct" ? f.ref[1] / 100 : f.ref[1];
  return canon < lo || canon > hi;
}
function fmtRef(f: FieldDef, curSym: string): string {
  if (f.dom === "pct") return `Ref: ${f.ref[0]}–${f.ref[1]}%`;
  if (f.dom === "cur") return `Ref: ${curSym}${f.ref[0].toLocaleString()}–${curSym}${f.ref[1].toLocaleString()}`;
  return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()} ${f.refUnit}`;
}
function fmt(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return "∞";
  const a = Math.abs(x);
  return x.toLocaleString("en-US", { maximumFractionDigits: a >= 100 ? 0 : a >= 1 ? 2 : 4 });
}

// ── SVG chart builders (verified engine, reused as string generators) ──
const CCOL = { buy: "#3A4D8F", lease: "#2E6B4E", keep: "#C15F3C", ink: "#181713", faint: "#8C887E", line: "#E4E0D6" };
function svgOpen(w: number, h: number) { return `<svg class="blk-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`; }

function chartNPV(r: InvestmentFeasibilityOutputs, curSym: string): string {
  const w = 680, h = 200, padL = 70, padR = 90, padT = 14, rowH = 44, gap = 18;
  const data = [
    { n: "BUY", v: r.out_total_cost_buy, i: 0 },
    { n: "LEASE", v: r.out_total_cost_lease, i: 1 },
    { n: "KEEP", v: r.out_total_cost_keep, i: 2 },
  ];
  const max = Math.max(r.out_total_cost_buy, r.out_total_cost_lease, r.out_total_cost_keep, 1);
  let s = svgOpen(w, h);
  data.forEach((d, k) => {
    const y = padT + k * (rowH + gap);
    const bw = (w - padL - padR) * (d.v / max);
    const win = d.i === r.out_winner;
    s += `<text x="${padL - 10}" y="${y + rowH / 2 + 4}" text-anchor="end" fill="${CCOL.ink}" font-size="12">${d.n}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${w - padL - padR}" height="${rowH}" fill="#EFEBE2"/>`;
    s += `<rect x="${padL}" y="${y}" width="${bw.toFixed(1)}" height="${rowH}" fill="${win ? CCOL.lease : CCOL.buy}" opacity="${win ? 1 : 0.55}"/>`;
    s += `<text x="${padL + bw + 8}" y="${y + rowH / 2 + 4}" fill="${CCOL.ink}" font-size="12">${curSym}${fmt(d.v)}${win ? "  ◀ win" : ""}</text>`;
  });
  return s + "</svg>";
}

function chartCumulative(cum: Array<{ year: number; buy: number; lease: number; keep: number }>, curSym: string): string {
  const w = 680, h = 280, padL = 64, padR = 16, padT = 16, padB = 34;
  const years = cum[cum.length - 1].year;
  let maxV = 0; cum.forEach((p) => { maxV = Math.max(maxV, p.buy, p.lease, p.keep); });
  maxV = maxV * 1.05 || 1;
  const X = (yr: number) => padL + (w - padL - padR) * (yr / years);
  const Y = (v: number) => padT + (h - padT - padB) * (v / maxV);
  let s = svgOpen(w, h);
  for (let g = 0; g <= 4; g++) {
    const gv = (maxV * g) / 4, gy = Y(gv);
    s += `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="${CCOL.line}" stroke-width="1"/>`;
    s += `<text x="${padL - 8}" y="${gy + 4}" text-anchor="end" fill="${CCOL.faint}" font-size="10">${curSym}${fmt(gv)}</text>`;
  }
  for (let yr = 0; yr <= years; yr++) s += `<text x="${X(yr)}" y="${h - padB + 18}" text-anchor="middle" fill="${CCOL.faint}" font-size="10">${yr}</text>`;
  const line = (key: "buy" | "lease" | "keep", col: string) => {
    const pts = cum.map((p) => `${X(p.year)},${Y(p[key])}`).join(" ");
    return `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.2"/>`;
  };
  s += line("buy", CCOL.buy) + line("lease", CCOL.lease) + line("keep", CCOL.keep);
  const lg: Array<[string, string]> = [["Buy", CCOL.buy], ["Lease", CCOL.lease], ["Keep", CCOL.keep]];
  lg.forEach(([l, c], k) => {
    const lx = padL + k * 90;
    s += `<rect x="${lx}" y="4" width="12" height="12" fill="${c}"/><text x="${lx + 18}" y="14" fill="${CCOL.ink}" font-size="11">${l}</text>`;
  });
  return s + "</svg>";
}

function chartTornado(bars: TornadoBar[], baseNpv: number, curSym: string): string {
  const w = 680, padL = 170, padR = 90, h = 40 + bars.length * 30;
  const axisW = w - padL - padR;
  const maxSpan = Math.max(...bars.map((b) => b.span), 1);
  let s = svgOpen(w, h);
  const mid = padL + axisW / 2;
  s += `<line x1="${mid}" y1="10" x2="${mid}" y2="${h - 16}" stroke="${CCOL.faint}" stroke-width="1" stroke-dasharray="3 3"/>`;
  bars.forEach((b, k) => {
    const y = 18 + k * 30;
    const loD = b.low - baseNpv, hiD = b.high - baseNpv;
    const left = Math.min(loD, hiD), right = Math.max(loD, hiD);
    const xL = mid + (left / maxSpan) * (axisW / 2), xR = mid + (right / maxSpan) * (axisW / 2);
    s += `<text x="${padL - 12}" y="${y + 15}" text-anchor="end" fill="${CCOL.ink}" font-size="11">${b.label}</text>`;
    s += `<rect x="${Math.min(xL, xR)}" y="${y}" width="${Math.abs(xR - xL)}" height="20" fill="${CCOL.keep}" opacity="0.8"/>`;
    s += `<text x="${w - padR + 8}" y="${y + 15}" fill="${CCOL.faint}" font-size="10">${curSym}${fmt(b.span)}</text>`;
  });
  return s + "</svg>";
}

function chartBreakeven(x: InvestmentFeasibilityInputs, r: InvestmentFeasibilityOutputs, curSym: string): string {
  const w = 680, h = 280, padL = 64, padR = 16, padT = 16, padB = 34;
  const sch = schedule(x);
  let horizon = Math.max(sch.years, (r.out_breakeven_year < NO_BREAKEVEN_YEAR) ? Math.ceil(r.out_breakeven_year) + 1 : sch.years);
  horizon = Math.min(horizon, 40);
  const buyA = sch.rows.length ? sch.rows[0].buy : 0;
  const leaseA = r.out_annual_lease;
  const pts: Array<{ t: number; buy: number; lease: number }> = [];
  let maxV = 0;
  for (let t = 0; t <= horizon; t++) {
    const b = x.capex + buyA * t, l = leaseA * t;
    pts.push({ t, buy: b, lease: l });
    maxV = Math.max(maxV, b, l);
  }
  maxV = maxV * 1.05 || 1;
  const X = (t: number) => padL + (w - padL - padR) * (t / horizon);
  const Y = (v: number) => padT + (h - padT - padB) * (v / maxV);
  let s = svgOpen(w, h);
  for (let g = 0; g <= 4; g++) {
    const gv = (maxV * g) / 4, gy = Y(gv);
    s += `<line x1="${padL}" y1="${gy}" x2="${w - padR}" y2="${gy}" stroke="${CCOL.line}"/>`;
    s += `<text x="${padL - 8}" y="${gy + 4}" text-anchor="end" fill="${CCOL.faint}" font-size="10">${curSym}${fmt(gv)}</text>`;
  }
  const step = Math.max(1, Math.round(horizon / 8));
  for (let t = 0; t <= horizon; t += step) s += `<text x="${X(t)}" y="${h - padB + 18}" text-anchor="middle" fill="${CCOL.faint}" font-size="10">${t}</text>`;
  s += `<polyline points="${pts.map((p) => `${X(p.t)},${Y(p.buy)}`).join(" ")}" fill="none" stroke="${CCOL.buy}" stroke-width="2.2"/>`;
  s += `<polyline points="${pts.map((p) => `${X(p.t)},${Y(p.lease)}`).join(" ")}" fill="none" stroke="${CCOL.lease}" stroke-width="2.2"/>`;
  if ((r.out_breakeven_year < NO_BREAKEVEN_YEAR) && r.out_breakeven_year <= horizon) {
    const bx = X(r.out_breakeven_year), by = Y(x.capex + buyA * r.out_breakeven_year);
    s += `<line x1="${bx}" y1="${padT}" x2="${bx}" y2="${h - padB}" stroke="${CCOL.keep}" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    s += `<circle cx="${bx}" cy="${by}" r="4.5" fill="${CCOL.keep}"/>`;
    s += `<text x="${bx}" y="${padT + 12}" text-anchor="middle" fill="${CCOL.keep}" font-size="11">yr ${r.out_breakeven_year.toFixed(1)}</text>`;
  }
  const lg: Array<[string, string]> = [["Buy (CAPEX + opex)", CCOL.buy], ["Lease", CCOL.lease]];
  lg.forEach(([l, c], k) => {
    const lx = padL + k * 150;
    s += `<rect x="${lx}" y="4" width="12" height="12" fill="${c}"/><text x="${lx + 18}" y="14" fill="${CCOL.ink}" font-size="11">${l}</text>`;
  });
  return s + "</svg>";
}

interface Insight { sev: "opp" | "info" | "crit"; t: string; msg: string }

function buildInsights(x: InvestmentFeasibilityInputs, r: InvestmentFeasibilityOutputs, curSym: string): Insight[] {
  const out: Insight[] = [];
  const names = ["Buy", "Lease", "Keep"];
  const totalByWinner = [r.out_total_cost_buy, r.out_total_cost_lease, r.out_total_cost_keep][r.out_winner];
  const fmtMoney = (v: number) => curSym + fmt(v);

  out.push({ sev: "opp", t: "recommendation",
    msg: `<strong>${names[r.out_winner].toUpperCase()} is cheapest over ${schedule(x).years} years</strong> at a present-value cost of ${fmtMoney(totalByWinner)}, saving ${fmtMoney(r.out_savings_vs_second)} versus the next-best option.` });

  const tor = tornado(x);
  out.push({ sev: "info", t: "critical variable",
    msg: `The verdict is most sensitive to <strong>${tor[0].label.replace(/[+-].*/, "").trim()}</strong> (NPV swing ${fmtMoney(tor[0].span)}). Get this number from a quote or meter reading, not a guess, before committing.` });

  if (r.out_decision_margin_pct < 0.05)
    out.push({ sev: "crit", t: "thin margin — not a safe call",
      msg: `The winner leads by only <strong>${(100 * r.out_decision_margin_pct).toFixed(1)}%</strong> of its own present-value cost. That is inside the noise band of a single mis-estimated input. Present this as a near-tie, not a clear-cut decision.` });

  const allInIRR = x.discountRate + x.lessorMargin + x.insuranceRate;
  out.push({ sev: "info", t: "discount-rate identity check",
    msg: `The same rate (<strong>${(100 * x.discountRate).toFixed(1)}%</strong>) discounts all three NPVs, drives the lease capital-recovery factor, and annuitizes the Keep opportunity cost. The lessor's implied break-even IRR on this quote is exactly <strong>${(100 * allInIRR).toFixed(1)}%</strong> by construction — back-calculate a real quote's actual IRR before trusting the Lease number.` });

  const racing = [{ n: "maintenance", v: x.maintEscalation }, { n: "scrap", v: x.scrapEscalation }].filter((e) => e.v > x.discountRate);
  if (racing.length) {
    const worst = racing.sort((a, b) => b.v - a.v)[0];
    const yearsToDouble = Math.log(2) / Math.log((1 + worst.v) / (1 + x.discountRate));
    out.push({ sev: "crit", t: "escalation outruns discounting",
      msg: `Keep's <strong>${worst.n} escalation (${(100 * worst.v).toFixed(1)}%/yr)</strong> exceeds the discount rate. That component's discounted value is still increasing through year ${Math.ceil(yearsToDouble)}. Sanity-check against the last 24 months of work orders, not the year-1 figure alone.` });
  }

  if (x.buyInsurance > 0)
    out.push({ sev: "info", t: "cost-scope asymmetry: insurance",
      msg: `Buy carries an explicit insurance line (${fmtMoney(x.buyInsurance)}/yr) but Keep's model has none. If the existing machine is actually insured, Keep's true cost is understated by roughly that amount.` });

  out.push({ sev: "info", t: "scope limitation — tax shield not modeled",
    msg: `This engine prices pre-tax cash cost only. Depreciation tax shield normally favors Buy over Lease under most tax regimes — get your tax basis from finance if Buy is close behind the winner here.` });

  if ((r.out_breakeven_year < NO_BREAKEVEN_YEAR))
    out.push({ sev: "info", t: "nominal vs. discounted horizon",
      msg: `Buy's cumulative nominal outlay drops below Lease's at <strong>year ${r.out_breakeven_year.toFixed(1)}</strong> — but the NPV verdict is discounted. If this machine's realistic service life exceeds year ${Math.ceil(r.out_breakeven_year)}, re-run with a longer study period.` });
  else
    out.push({ sev: "info", t: "no nominal break-even in horizon",
      msg: `Lease's nominal cumulative cost never crosses Buy's within the ${schedule(x).years}-year study period.` });

  return out;
}


interface ServerSeal { output_hash?: string; input_hash?: string; schema_hash?: string; hash_algorithm?: string; executed_at?: string }
interface ServerResultState { outputs: Record<string, number>; seal: ServerSeal; inputs: InvestmentFeasibilityInputs; currency: string }

export default function BuyLeaseKeepToolPage() {
  const [curSym, setCurSym] = useState("€");
  const reportRef = useRef<HTMLDivElement>(null);

  const { user } = useUserSubscription();
  const [usageSessionId, setUsageSessionId] = useState<string | null>(null);
  const [remainingRuns, setRemainingRuns] = useState<number | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const lastUid = useRef<string | null | undefined>(undefined);

  const [isExecuting, setIsExecuting] = useState(false);
  const [serverResult, setServerResult] = useState<ServerResultState | null>(null);
  const [executeError, setExecuteError] = useState<string | null>(null);

  // Reset every identity-scoped piece of state whenever the signed-in user
  // changes (login, logout, account switch) — a stale token, credit session,
  // or bypass flag must never carry over to a different identity.
  useEffect(() => {
    const uid = user?.uid ?? null;
    if (lastUid.current === uid) return;
    lastUid.current = uid;
    setAuthToken(null);
    setUsageSessionId(null);
    setRemainingRuns(null);
    setSessionError(null);
    setExecuteError(null);
    setServerResult(null);
    if (user) {
      user.getIdToken(false).then(setAuthToken).catch(() => setSessionError("Could not verify your session — please refresh."));
    }
  }, [user]);

  useEffect(() => {
    if (user?.email && isProBypassEmail(user.email)) {
      setUsageSessionId(BYPASS_SESSION_ID);
      setRemainingRuns(999);
    }
  }, [user?.email]);

  const requestSession = useCallback(async () => {
    if (user?.email && isProBypassEmail(user.email)) return;
    setSessionLoading(true);
    setSessionError(null);
    try {
      if (!user) { window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`; return; }
      const idToken = await user.getIdToken(false);
      const res = await fetch("/api/pro-tool-session/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ toolKey: TOOL_KEY }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "INSUFFICIENT_CREDITS") { window.location.href = "/pricing"; return; }
        throw new Error(data.error || "Session failed");
      }
      const session = await res.json();
      setUsageSessionId(session.usageSessionId);
      setRemainingRuns(session.remainingRuns);
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : "Could not start a session — please try again.");
    } finally { setSessionLoading(false); }
  }, [user]);

  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const s: Record<string, FieldState> = {};
    for (const id of Object.keys(FIELDS)) {
      const f = FIELDS[id];
      const unit = f.units ? f.units[0].k : "";
      const canon = toCanon(f, f.def, unit);
      s[id] = { value: String(f.def), unit, error: null, warn: refCheck(f, canon), canon };
    }
    return s;
  });

  const updateField = useCallback((id: string, newValue: string) => {
    setFieldStates((prev) => {
      const f = FIELDS[id];
      const st = prev[id];
      const raw = parseFloat(newValue);
      let error: string | null = null;
      let warn = false;
      let canon: number | null = null;
      if (newValue.trim() === "" || Number.isNaN(raw)) {
        error = "Enter a number.";
      } else {
        canon = toCanon(f, raw, st.unit);
        const bv = boundValue(f, raw, canon);
        if (bv < f.hard[0] || bv > f.hard[1]) {
          error = `Outside valid range (${f.hard[0]}–${f.hard[1]}${f.dom === "pct" ? "%" : ""}).`;
          canon = null;
        } else {
          warn = refCheck(f, canon);
        }
      }
      return { ...prev, [id]: { ...st, value: newValue, error, warn, canon } };
    });
  }, []);

  // Switching the display unit preserves the canonical quantity — e.g. 7 years
  // becomes 84 months, not a raw re-interpretation of the number 7 as months.
  const updateFieldUnit = useCallback((id: string, newUnit: string) => {
    setFieldStates((prev) => {
      const f = FIELDS[id];
      const st = prev[id];
      if (st.canon == null) return { ...prev, [id]: { ...st, unit: newUnit } };
      const raw = fromCanon(f, st.canon, newUnit);
      const rounded = Math.round(raw * 1000) / 1000;
      return { ...prev, [id]: { ...st, unit: newUnit, value: String(rounded) } };
    });
  }, []);


  const collectedInputs = useMemo((): InvestmentFeasibilityInputs | null => {
    const o: Partial<InvestmentFeasibilityInputs> = {};
    for (const [id, st] of Object.entries(fieldStates)) {
      if (st.error || st.canon == null) return null;
      (o as Record<string, number>)[FIELDS[id].ev] = st.canon;
    }
    return o as InvestmentFeasibilityInputs;
  }, [fieldStates]);

  const engineResult = useMemo((): InvestmentFeasibilityOutputs | null => {
    if (!collectedInputs) return null;
    try { return executeFormula(collectedInputs); } catch { return null; }
  }, [collectedInputs]);

  const errorCount = useMemo(() => Object.values(fieldStates).filter((s) => s.error).length, [fieldStates]);

  const handleGenerate = useCallback(async () => {
    if (!collectedInputs || isExecuting || !usageSessionId) return;
    setIsExecuting(true);
    setExecuteError(null);
    // Snapshot the exact inputs and currency being submitted NOW — the report
    // must render from this immutable snapshot, never from live editable
    // state, so later edits to the form can't silently drift the proof report.
    const snapshotInputs = collectedInputs;
    const snapshotCurrency = curSym;
    try {
      const rawInputs: Record<string, number> = {};
      const selectedUnits: Record<string, string> = {};
      for (const [id, st] of Object.entries(fieldStates)) {
        const f = FIELDS[id];
        if (f.units) {
          // Schema only declares the base unit (years / units-per-year) for
          // these two fields — always submit the canonical value regardless
          // of which display unit the user is currently viewing, so the
          // per-field unit dropdown never causes a server-side misconversion.
          rawInputs[id] = st.canon ?? parseFloat(st.value);
        } else {
          rawInputs[id] = parseFloat(st.value);
          if (f.dom === "pct") selectedUnits[id] = "percent";
        }
      }
      const res = await fetch("/api/pro-calculator/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          tool_key: TOOL_KEY,
          raw_inputs: rawInputs,
          selected_units: selectedUnits,
          usage_session_id: usageSessionId,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error ${res.status}`);
      }
      const data = await res.json();
      const outputsMap: Record<string, number> = {};
      if (Array.isArray(data.outputs)) {
        for (const o of data.outputs) if (typeof o.value === "number") outputsMap[o.id] = o.value;
      } else if (data.outputs && typeof data.outputs === "object") {
        Object.assign(outputsMap, data.outputs);
      }

      // Fail closed: every declared output must be present and finite, the
      // winner must be a valid scenario index, and a real server audit seal
      // must be present — never fall back to local/mock values to paper over
      // an incomplete sealed response.
      const missingOrNonFinite = SEALED_OUTPUT_KEYS.filter(
        (k) => typeof outputsMap[k] !== "number" || !Number.isFinite(outputsMap[k]),
      );
      const winnerOk = [0, 1, 2].includes(outputsMap.out_winner);
      const seal = data.audit_seal as Record<string, unknown> | undefined;
      const sealOk = !!seal && typeof seal.output_hash === "string" && seal.output_hash.length > 0
        && typeof seal.hash_algorithm === "string";
      if (missingOrNonFinite.length > 0 || !winnerOk || !sealOk) {
        throw new Error(
          `Sealed response incomplete (${[
            missingOrNonFinite.length ? `missing/non-finite: ${missingOrNonFinite.join(", ")}` : null,
            winnerOk ? null : "invalid winner",
            sealOk ? null : "missing audit seal",
          ].filter(Boolean).join("; ")}) — report withheld.`,
        );
      }

      setServerResult({
        outputs: outputsMap,
        seal: {
          output_hash: seal!.output_hash as string,
          input_hash: seal!.input_hash as string | undefined,
          schema_hash: seal!.schema_hash as string | undefined,
          hash_algorithm: seal!.hash_algorithm as string,
          executed_at: seal!.executed_at as string | undefined,
        },
        inputs: snapshotInputs,
        currency: snapshotCurrency,
      });
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setExecuteError(err instanceof Error ? err.message : "Execution failed");
    } finally {
      setIsExecuting(false);
    }
  }, [collectedInputs, isExecuting, usageSessionId, authToken, fieldStates, curSym]);

  const r = engineResult;
  const x = collectedInputs;
  const names = ["Buy", "Lease", "Keep"];
  const canGenerate = !!x && !isExecuting;

  const renderField = (id: string) => {
    const f = FIELDS[id];
    const st = fieldStates[id];
    const cls = st.error ? "blk-bad" : st.warn ? "blk-warn" : "";
    const msg = st.error ? st.error : st.warn ? `Outside typical industry range (${fmtRef(f, curSym)}). Value accepted — flagged for review.` : "";
    const msgCls = st.error ? "blk-err" : st.warn ? "blk-warn" : "";
    const msgId = `ms_${id}`;
    const canonUnitLabel = f.units ? ` ${f.units[0].l}` : "";
    const canonTxt = st.error ? "" : `= ${f.dom === "cur" ? curSym : ""}${fmt(f.dom === "pct" ? (st.canon ?? 0) * 100 : st.canon)}${canonUnitLabel}`;
    return (
      <div className="blk-f" key={id}>
        <div className="blk-f-top">
          <label htmlFor={`in_${id}`}>{f.label}</label>
          <span className="blk-unitline">{canonTxt}</span>
        </div>
        <div className={`blk-control ${cls}`}>
          <input
            id={`in_${id}`}
            type="number"
            step="any"
            inputMode="decimal"
            value={st.value}
            onChange={(e) => updateField(id, e.target.value)}
            aria-invalid={!!st.error}
            aria-describedby={msg ? msgId : undefined}
          />
          {f.dom === "cur" && <span className="blk-prefix">{curSym}</span>}
          {f.dom === "pct" && <span className="blk-prefix" style={{ borderLeft: "1px solid var(--blk-line)", borderRight: "none" }}>%</span>}
          {f.units && (
            <select
              aria-label={`Unit for ${f.label}`}
              value={st.unit}
              onChange={(e) => updateFieldUnit(id, e.target.value)}
              style={{ borderLeft: "1px solid var(--blk-line)", background: "var(--blk-panel)", fontFamily: "var(--blk-mono)", fontSize: "14px", padding: "8px", minHeight: "48px", color: "var(--blk-ink)" }}
            >
              {f.units.map((u) => <option key={u.k} value={u.k}>{u.l}</option>)}
            </select>
          )}
        </div>
        <div className="blk-f-foot">
          <span className="blk-hint">{f.hint} <em style={{ fontStyle: "normal", color: "var(--blk-faint)" }}>· {f.src}</em></span>
          <span className="blk-bench-ref">{fmtRef(f, curSym)}</span>
        </div>
        {msg && <div id={msgId} className={`blk-msg ${msgCls}`} role={st.error ? "alert" : "status"}>{msg}</div>}
      </div>
    );
  };

  const renderReport = () => {
    if (!serverResult) return null;
    const s = serverResult.outputs;
    // Every key here is guaranteed present and finite — validated fail-closed
    // in handleGenerate before serverResult was ever set. No local fallback.
    const sealed: InvestmentFeasibilityOutputs = {
      out_lease_factor: s.out_lease_factor,
      out_annual_lease: s.out_annual_lease,
      out_opportunity_cost: s.out_opportunity_cost,
      out_npv_buy: s.out_npv_buy,
      out_npv_lease: s.out_npv_lease,
      out_npv_keep: s.out_npv_keep,
      out_total_cost_buy: s.out_total_cost_buy,
      out_total_cost_lease: s.out_total_cost_lease,
      out_total_cost_keep: s.out_total_cost_keep,
      out_winner: s.out_winner,
      out_savings_vs_second: s.out_savings_vs_second,
      out_breakeven_year: s.out_breakeven_year,
      out_decision_margin_pct: s.out_decision_margin_pct,
      out_evidence_completeness: s.out_evidence_completeness,
    };
    // Report renders exclusively from the immutable submitted snapshot — never
    // from live form state — so further edits to the form cannot drift the
    // sealed report's charts, schedule, or currency out of sync with its numbers.
    const rx = serverResult.inputs;
    const repCur = serverResult.currency;
    const cum = cumulative(rx);
    const tor = tornado(rx);
    const baseNpv = [sealed.out_npv_buy, sealed.out_npv_lease, sealed.out_npv_keep][sealed.out_winner];
    const ins = buildInsights(rx, sealed, repCur);
    const seal = serverResult.seal.output_hash;
    const sch = schedule(rx);
    const fmtMoney = (v: number) => repCur + fmt(v);

    return (
      <div className="blk-report" ref={reportRef}>
        <div className="blk-rep-mast">
          <h2>Buy vs Lease vs Keep — proof report</h2>
          <div className="blk-rid">
            SC-PRO-BLK · {new Date().toISOString().slice(0, 10)}<br />
            engine v5.3.2-domain · capital-recovery + ISO 15686-5<br />
            currency {repCur} · discounted NPV
          </div>
        </div>
        <div className="blk-rep-body">
          <div className="blk-sec">
            <div className="blk-verdict-box">
              <div className="blk-head">Recommendation: {names[sealed.out_winner]}.</div>
              <p>Over a {sch.years}-year horizon at a {(100 * rx.discountRate).toFixed(1)}% discount rate, <strong>{names[sealed.out_winner]}</strong> has the highest NPV (least-negative total cost) at <strong>{fmtMoney([sealed.out_total_cost_buy, sealed.out_total_cost_lease, sealed.out_total_cost_keep][sealed.out_winner])}</strong> present value.</p>
              <p>It saves <strong>{fmtMoney(sealed.out_savings_vs_second)}</strong> against the next-best option. Annual lease is derived from CAPEX by the lease capital-recovery factor ({sealed.out_lease_factor.toFixed(5)}), not entered by hand.</p>
            </div>
          </div>

          <div className="blk-sec">
            <div className="blk-sec-h"><span className="blk-sec-n">1</span><span className="blk-sec-t">Annual cost schedule</span></div>
            <table>
              <thead><tr><th>Year</th><th style={{ textAlign: "right" }}>Buy {repCur}</th><th style={{ textAlign: "right" }}>Lease {repCur}</th><th style={{ textAlign: "right" }}>Keep {repCur}</th></tr></thead>
              <tbody>
                <tr><td>0 (CAPEX)</td><td className="blk-n">{fmt(rx.capex)}</td><td className="blk-n">0</td><td className="blk-n">0</td></tr>
                {sch.rows.map((row) => (
                  <tr key={row.year}><td>{row.year}</td><td className="blk-n">{fmt(row.buy)}</td><td className="blk-n">{fmt(row.lease)}</td><td className="blk-n">{fmt(row.keep)}</td></tr>
                ))}
                <tr className="blk-total"><td>NPV (discounted)</td><td className="blk-n">{fmt(sealed.out_npv_buy)}</td><td className="blk-n">{fmt(sealed.out_npv_lease)}</td><td className="blk-n">{fmt(sealed.out_npv_keep)}</td></tr>
              </tbody>
            </table>
            <div className="blk-note">Buy operating cost is flat (new machine); Keep escalates with age. NPV row discounts every year at {(100 * rx.discountRate).toFixed(1)}%.</div>
          </div>

          <div className="blk-sec">
            <div className="blk-sec-h"><span className="blk-sec-n">2</span><span className="blk-sec-t">Total cost of ownership (NPV)</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartNPV(sealed, repCur) }} />
            <div className="blk-note">Present-value total cost per option. Shorter bar = cheaper. Winner highlighted.</div>
          </div>

          <div className="blk-sec">
            <div className="blk-sec-h"><span className="blk-sec-n">3</span><span className="blk-sec-t">Cumulative cash outflow</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartCumulative(cum, repCur) }} />
            <div className="blk-note">Undiscounted running cost incl. upfront CAPEX for Buy.</div>
          </div>

          <div className="blk-sec">
            <div className="blk-sec-h"><span className="blk-sec-n">4</span><span className="blk-sec-t">Sensitivity — what moves the verdict</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartTornado(tor, baseNpv, repCur) }} />
            <div className="blk-note">NPV swing of the winning option when each input is stressed.</div>
          </div>

          <div className="blk-sec">
            <div className="blk-sec-h"><span className="blk-sec-n">5</span><span className="blk-sec-t">Buy vs Lease break-even</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartBreakeven(rx, sealed, repCur) }} />
            <div className="blk-note">Nominal (undiscounted) crossover. {(sealed.out_breakeven_year < NO_BREAKEVEN_YEAR) ? `Buy overtakes Lease at year ${sealed.out_breakeven_year.toFixed(1)}.` : "Lease stays cheaper across the horizon."}</div>
          </div>

          <div className="blk-sec">
            <div className="blk-sec-h"><span className="blk-sec-n">6</span><span className="blk-sec-t">Engineering insights</span></div>
            {ins.map((i, k) => (
              <div className={`blk-ins blk-${i.sev}`} key={k}>
                <span className="blk-t">{i.t}</span>
                <span dangerouslySetInnerHTML={{ __html: i.msg }} />
              </div>
            ))}
          </div>

          <div className="blk-seal">
            SEAL · {serverResult.seal.hash_algorithm} {seal}<br />
            Sealed server-side at {serverResult.seal.executed_at ?? "—"}.
          </div>
          <button
            type="button"
            className="blk-print-btn"
            onClick={() => window.print()}
            aria-label="Download this report as a PDF"
          >
            Download PDF
          </button>
          <div className="blk-disc">
            Technical simulation only; not financial, legal, or engineering advice. Users must verify results before making business decisions.
          </div>
          <PremiumReportFeedback
            key={serverResult.seal.output_hash}
            schemaSlug={TOOL_KEY}
            sectorSlug="manufacturing"
            reportSlug={serverResult.seal.output_hash}
            inputSnapshot={{ ...rx }}
            resultSnapshot={s}
            currency={repCur}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="blk-shell">
      <div className="blk-mast">
        <div className="blk-kicker">SectorCalc PRO · Capital Investment · Life-cycle decision</div>
        <h1>Machine Investment Feasibility — Buy vs Lease vs Keep</h1>
        <p className="blk-lede">Three ways to put a machine on the floor rarely cost the same. This tool prices all three over the full study period — annuitized lease-recovery cost, ISO 15686-5 life-cycle cost for keeping an ageing asset, and discounted NPV for the verdict.</p>
        <div className="blk-meta">
          <span>Engine <b>v5.3.2-domain</b></span>
          <span>Standards <b>ISO 15686-5 · ISO 22400-2</b></span>
          <span>Report <b>sealed · SHA-256</b></span>
          <span>Method <b>discounted NPV</b></span>
        </div>
        <div className="blk-curbar">
          <label htmlFor="blk-curSel">Report currency</label>
          <select id="blk-curSel" value={curSym} onChange={(e) => setCurSym(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="blk-curnote">Symbol only — no exchange-rate conversion. Enter every figure in the same currency.</span>
        </div>
      </div>

      <div className="blk-bench">
        <div className="blk-form-col">
          {[1, 2, 3, 4, 5].map((g) => (
            <div className="blk-grp" key={g}>
              <div className="blk-grp-h"><span className="blk-grp-n">{GROUPS[g].n}</span><span className="blk-grp-t">{GROUPS[g].t}</span></div>
              <div className="blk-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter((id) => FIELDS[id].grp === g).map(renderField)}
            </div>
          ))}
          <details>
            <summary>Advanced — escalation coefficients</summary>
            <div className="blk-grp" style={{ borderBottom: "none" }}>
              <div className="blk-grp-d">{GROUPS[6].d}</div>
              {Object.keys(FIELDS).filter((id) => FIELDS[id].grp === 6).map(renderField)}
            </div>
          </details>
        </div>
        <div className="blk-rail">
          <div className="blk-rail-in">
            <div className="blk-verdict">
              <div className={`blk-verdict-band ${r ? "blk-pos" : "blk-warn"}`}>{r ? `recommend · ${names[r.out_winner].toLowerCase()}` : "incomplete"}</div>
              <div className="blk-verdict-body">
                <div className="blk-big">{r ? <>{names[r.out_winner]} <small>lowest {schedule(x!).years}-yr cost</small></> : "—"}</div>
                <div className="blk-big-cap">
                  {r
                    ? `total cost ${curSym}${fmt([r.out_total_cost_buy, r.out_total_cost_lease, r.out_total_cost_keep][r.out_winner])} · saves ${curSym}${fmt(r.out_savings_vs_second)} vs next`
                    : errorCount ? `${errorCount} input(s) need attention` : "enter machine & cost data to begin"}
                </div>
              </div>
            </div>
            <div className="blk-stat"><span>NPV · Buy</span><b>{r ? curSym + fmt(r.out_npv_buy) : "—"}</b></div>
            <div className="blk-stat"><span>NPV · Lease</span><b>{r ? curSym + fmt(r.out_npv_lease) : "—"}</b></div>
            <div className="blk-stat"><span>NPV · Keep</span><b>{r ? curSym + fmt(r.out_npv_keep) : "—"}</b></div>
            <div className="blk-stat"><span>Annual lease (capital-recovery)</span><b>{r ? `${curSym}${fmt(r.out_annual_lease)}/yr` : "—"}</b></div>
            <div className="blk-stat"><span>Buy–Lease break-even</span><b>{r ? ((r.out_breakeven_year < NO_BREAKEVEN_YEAR) ? `${r.out_breakeven_year.toFixed(1)} yr` : "never") : "—"}</b></div>

            {!usageSessionId ? (
              <button className="blk-cta" disabled={sessionLoading || !canGenerate} onClick={requestSession}>
                {sessionLoading ? "Checking credits…" : "Unlock sealed report · 1 credit"}
              </button>
            ) : (
              <button className="blk-cta" disabled={!canGenerate || isExecuting} onClick={handleGenerate}>
                {isExecuting ? "Generating…" : "Generate sealed report"}
              </button>
            )}
            {remainingRuns != null && usageSessionId !== BYPASS_SESSION_ID && (
              <div className="blk-conf">{remainingRuns} run(s) remaining this session.</div>
            )}
            {sessionError && <div className="blk-conf" style={{ color: "var(--blk-neg)" }}>{sessionError}</div>}
            {executeError && <div className="blk-conf" style={{ color: "var(--blk-neg)" }}>{executeError}</div>}
            <div className="blk-conf">
              <span className="blk-d" style={{ background: r ? "var(--blk-pos)" : "var(--blk-warn)" }} />
              <span>{r ? `Inputs consistent · decision margin ${(100 * r.out_decision_margin_pct).toFixed(1)}%` : errorCount ? "Fix highlighted inputs." : "Enter inputs to compute."}</span>
            </div>
          </div>
        </div>
      </div>

      {serverResult && renderReport()}
    </div>
  );
}
