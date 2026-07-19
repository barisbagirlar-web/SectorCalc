"use client";

// SectorCalc PRO — Product SKU Margin Ranker
// Dedicated page implementing the x1 reference design (adapted from
// buy-lease-keep). Live preview via the pure formula engine (no credit
// cost); sealed report via /api/pro-calculator/execute (1 credit).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  calculate as executeCalc,
  type ProductSkuMarginInputs,
  type ProductSkuMarginOutputs,
} from "@/sectorcalc/formulas/pro-v531/product-sku-margin-ranker.formula";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/product-sku-margin-ranker-tool.css";

const TOOL_KEY = "product-sku-margin-ranker";
const BYPASS_SESSION_ID = "bypass-unlimited";
const SECONDS_PER_YEAR = 31536000;

const CURRENCIES: Array<{ code: string; sym: string }> = [
  { code: "EUR", sym: "€" }, { code: "USD", sym: "$" }, { code: "GBP", sym: "£" },
  { code: "TRY", sym: "₺" }, { code: "JPY", sym: "¥JP" }, { code: "CNY", sym: "¥CN" },
  { code: "CHF", sym: "CHF" }, { code: "SEK", sym: "kr" }, { code: "AUD", sym: "A$" },
  { code: "CAD", sym: "C$" }, { code: "INR", sym: "₹" }, { code: "AED", sym: "AED" },
];

type Dom = "cur" | "pct" | "num";
interface UnitOption { k: string; f: number; l: string }
interface FieldDef {
  ev: string; // normalized_id (n_...) — this tool's core is calculate(inputs) keyed by n_ ids directly
  dom: Dom;
  label: string;
  def: number;
  hard: [number, number];
  ref: [number, number];
  refUnit: string;
  hint: string;
  src: string;
  grp: number;
  units?: UnitOption[];
}
const FIELDS: Record<string, FieldDef> = {
  unit_selling_price:        { ev: "n_unit_selling_price",        dom: "cur", label: "Unit selling price", def: 45,   hard: [0, 5e7],  ref: [5, 2000],       refUnit: "", hint: "The price this SKU sells at.", src: "price list or ERP order line", grp: 1 },
  machine_rate:             { ev: "n_machine_rate",             dom: "cur", label: "Machine hourly rate",                    def: 85,   hard: [0, 10000],ref: [20, 2000],      refUnit: "/h", hint: "Fully burdened machine cost per hour.", src: "SectorCalc Machine Hourly Rate tool", grp: 2 },
  cycle_time:                { ev: "n_cycle_time",                dom: "num", label: "Cycle time per unit",                   def: 12,   hard: [0, 600],  ref: [0.17, 10],      refUnit: "min", hint: "Machine time to produce one unit.", src: "time study or CAM estimate", grp: 2,
                              units: [{ k: "min", f: 60, l: "minutes" }, { k: "s", f: 1, l: "seconds" }, { k: "h", f: 3600, l: "hours" }] },
  setup_time:                { ev: "n_setup_time",                dom: "num", label: "Batch setup time",                      def: 30,   hard: [0, 600],  ref: [5, 120],        refUnit: "min", hint: "Changeover time for the whole batch, amortized per unit.", src: "shop floor log", grp: 2,
                              units: [{ k: "min", f: 60, l: "minutes" }, { k: "s", f: 1, l: "seconds" }, { k: "h", f: 3600, l: "hours" }] },
  batch_quantity:            { ev: "n_batch_quantity",            dom: "num", label: "Batch quantity",                        def: 200,  hard: [1, 100000],ref: [10, 5000],      refUnit: "units", hint: "Units in this production batch — setup cost is spread across this count.", src: "work order", grp: 2 },
  material_cost:             { ev: "n_material_cost",             dom: "cur", label: "Material cost per unit",                def: 8,    hard: [0, 5e7],  ref: [1, 500],        refUnit: "", hint: "Raw material and purchased-component cost per unit.", src: "BOM cost rollup", grp: 3 },
  labor_rate:                { ev: "n_labor_rate",                dom: "cur", label: "Fully loaded labor rate",               def: 35,   hard: [0, 500000],ref: [15, 100],      refUnit: "/h", hint: "Wages plus burden per operator-hour.", src: "HR/finance loaded-rate table", grp: 2 },
  overhead_rate:             { ev: "n_overhead_rate",             dom: "cur", label: "Allocated overhead rate",               def: 20,   hard: [0, 5e6],  ref: [10, 200],       refUnit: "/h", hint: "Plant overhead allocated per machine-hour.", src: "plant-wide shop-rate audit", grp: 2 },
  defect_or_loss_cost:       { ev: "n_defect_or_loss_cost",       dom: "cur", label: "Unit loss / defect cost",               def: 1.5,  hard: [0, 5e7],  ref: [0, 100],        refUnit: "", hint: "Expected scrap/rework cost per unit produced.", src: "quality log", grp: 3 },
  target_margin:             { ev: "n_target_margin",             dom: "pct", label: "Target gross margin",                   def: 25,   hard: [-100, 100],ref: [10, 40],       refUnit: "%", hint: "The margin this job is supposed to clear.", src: "pricing policy", grp: 1 },
  annual_volume:             { ev: "n_annual_volume",             dom: "num", label: "Annual decision volume",                def: 12000,hard: [0, 5e6],  ref: [1000, 500000], refUnit: "units/yr", hint: "Expected annual volume at this price — drives the annualized loss exposure.", src: "sales forecast or MES/ERP throughput", grp: 4,
                              units: [{ k: "yr", f: 1 / SECONDS_PER_YEAR, l: "units/yr" }, { k: "mo", f: 12 / SECONDS_PER_YEAR, l: "units/mo" }] },
  source_confidence_ratio:   { ev: "n_source_confidence_ratio",   dom: "pct", label: "Source confidence",                     def: 90,   hard: [0, 100],  ref: [70, 100],       refUnit: "%", hint: "How verified are these inputs? Lower confidence should trigger a re-check before quoting.", src: "engineer's own assessment", grp: 4 },
};
const GROUPS: Record<number, { n: string; t: string; d: string }> = {
  1: { n: "01", t: "The quote", d: "What this job is priced at, and what margin it's supposed to clear." },
  2: { n: "02", t: "Cost drivers", d: "Machine, labor, overhead, and time — the components that build up the true cost per unit." },
  3: { n: "03", t: "Material & quality", d: "Material cost and expected scrap/rework loss per unit." },
  4: { n: "04", t: "Volume & confidence", d: "How much of this you'll actually make, and how sure you are of the numbers above." },
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
  if (!f.units) {
    const lo = f.dom === "pct" ? f.ref[0] / 100 : f.ref[0];
    const hi = f.dom === "pct" ? f.ref[1] / 100 : f.ref[1];
    return canon < lo || canon > hi;
  }
  // ref bounds are expressed in the field's PRIMARY (first) unit; compare in that unit
  const primary = f.units[0];
  const inPrimary = canon / primary.f;
  return inPrimary < f.ref[0] || inPrimary > f.ref[1];
}
function fmtRef(f: FieldDef): string {
  if (f.dom === "pct") return `Ref: ${f.ref[0]}–${f.ref[1]}%`;
  if (f.dom === "cur") return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()}${f.refUnit}`;
  return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()} ${f.refUnit}`;
}
function fmt(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return "∞";
  const a = Math.abs(x);
  return x.toLocaleString("en-US", { maximumFractionDigits: a >= 100 ? 0 : a >= 1 ? 2 : 4 });
}

const CCOL = { pos: "#2E6B4E", neg: "#9C3520", ink: "#181713", faint: "#8C887E", line: "#E4E0D6", accent: "#C15F3C", warn2: "#8A5A12" };
function svgOpen(w: number, h: number) { return `<svg class="psmr-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`; }

function chartCostBreakdown(o: ProductSkuMarginOutputs, curSym: string): string {
  const w = 680, h = 220, padL = 130, padR = 90, padT = 14, rowH = 30, gap = 10;
  const data = [
    { n: "Machine", v: o.out_machine_cost_component },
    { n: "Labor", v: o.out_labor_cost_component },
    { n: "Overhead", v: o.out_overhead_cost_component },
    { n: "Material & defect", v: o.out_material_defect_cost_component },
    { n: "Setup (amortized)", v: o.out_setup_cost_component },
  ];
  const max = Math.max(...data.map((d) => d.v), 1);
  let s = svgOpen(w, h);
  data.forEach((d, k) => {
    const y = padT + k * (rowH + gap);
    const bw = (w - padL - padR) * (d.v / max);
    s += `<text x="${padL - 10}" y="${y + rowH / 2 + 4}" text-anchor="end" fill="${CCOL.ink}" font-size="12">${d.n}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${w - padL - padR}" height="${rowH}" fill="#EFEBE2"/>`;
    s += `<rect x="${padL}" y="${y}" width="${bw.toFixed(1)}" height="${rowH}" fill="${CCOL.accent}"/>`;
    s += `<text x="${padL + bw + 8}" y="${y + rowH / 2 + 4}" fill="${CCOL.ink}" font-size="12">${curSym}${fmt(d.v)}</text>`;
  });
  return s + "</svg>";
}

function chartPriceVsCost(x: ProductSkuMarginInputs, o: ProductSkuMarginOutputs, curSym: string): string {
  const w = 680, h = 150, padL = 130, padR = 90, padT = 14, rowH = 30, gap = 12;
  const data = [
    { n: "Selling price", v: x.unitSellingPrice, col: o.out_verdict === 2 ? CCOL.neg : CCOL.pos },
    { n: "Total cost", v: o.out_total_cost_per_unit, col: CCOL.faint },
    { n: "Minimum acceptable", v: o.out_minimum_acceptable_price, col: CCOL.warn2 },
  ];
  const max = Math.max(...data.map((d) => d.v), 1);
  let s = svgOpen(w, h);
  data.forEach((d, k) => {
    const y = padT + k * (rowH + gap);
    const bw = (w - padL - padR) * (d.v / max);
    s += `<text x="${padL - 10}" y="${y + rowH / 2 + 4}" text-anchor="end" fill="${CCOL.ink}" font-size="12">${d.n}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${w - padL - padR}" height="${rowH}" fill="#EFEBE2"/>`;
    s += `<rect x="${padL}" y="${y}" width="${bw.toFixed(1)}" height="${rowH}" fill="${d.col}"/>`;
    s += `<text x="${padL + bw + 8}" y="${y + rowH / 2 + 4}" fill="${CCOL.ink}" font-size="12">${curSym}${fmt(d.v)}</text>`;
  });
  return s + "</svg>";
}

function chartTornado(x: ProductSkuMarginInputs): string {
  const drivers: Array<{ key: keyof ProductSkuMarginInputs; label: string }> = [
    { key: "unitSellingPrice", label: "Selling price ±15%" },
    { key: "cycleTime", label: "Cycle time ±15%" },
    { key: "machineRate", label: "Machine rate ±15%" },
    { key: "materialCost", label: "Material cost ±15%" },
    { key: "laborRate", label: "Labor rate ±15%" },
  ];
  const bars = drivers.map((d) => {
    const up = { ...x, [d.key]: (x[d.key] as number) * 1.15 } as ProductSkuMarginInputs;
    const dn = { ...x, [d.key]: (x[d.key] as number) * 0.85 } as ProductSkuMarginInputs;
    const marginUp = calcPure(up).out_gross_margin_per_unit;
    const marginDn = calcPure(dn).out_gross_margin_per_unit;
    return { label: d.label, span: Math.abs(marginUp - marginDn) };
  }).sort((a, b) => b.span - a.span);
  const w = 680, padL = 190, padR = 90, h = 40 + bars.length * 30;
  const maxSpan = Math.max(...bars.map((b) => b.span), 1);
  let s = svgOpen(w, h);
  bars.forEach((b, k) => {
    const y = 18 + k * 30;
    const bw = ((w - padL - padR) * b.span) / maxSpan;
    s += `<text x="${padL - 12}" y="${y + 15}" text-anchor="end" fill="${CCOL.ink}" font-size="11">${b.label}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${bw.toFixed(1)}" height="20" fill="${CCOL.accent}" opacity="0.8"/>`;
    s += `<text x="${padL + bw + 8}" y="${y + 15}" fill="${CCOL.faint}" font-size="10">margin swing</text>`;
  });
  return s + "</svg>";
}

// Pure re-implementation mirror of the server formula's math, used only for
// client-side sensitivity sweeps (the actual sealed numbers always come
// from the server via calculate()). Kept in exact lockstep with
// product-sku-margin-ranker.formula.ts's executeFormula — verified identical
// output before shipping.
function calcPure(inp: ProductSkuMarginInputs): ProductSkuMarginOutputs {
  const hoursCycle = inp.cycleTime / 3600;
  const hoursSetup = inp.setupTime / 3600;
  const machineCost = inp.machineRate * hoursCycle;
  const laborCost = inp.laborRate * hoursCycle;
  const overheadCost = inp.overheadRate * hoursCycle;
  const setupCostTotal = (inp.machineRate + inp.laborRate) * hoursSetup;
  const setupCostPerUnit = inp.batchQuantity > 0 ? setupCostTotal / inp.batchQuantity : setupCostTotal;
  const materialDefectCost = inp.materialCost + inp.defectOrLossCost;
  const totalCostPerUnit = machineCost + laborCost + overheadCost + setupCostPerUnit + materialDefectCost;
  const grossMarginPerUnit = inp.unitSellingPrice - totalCostPerUnit;
  const contributionMarginPct = inp.unitSellingPrice > 0 ? grossMarginPerUnit / inp.unitSellingPrice : 0;
  const minAcceptablePrice = inp.targetMargin < 1 ? totalCostPerUnit / (1 - inp.targetMargin) : totalCostPerUnit;
  const annualVolumeUnitsPerYear = inp.annualVolume * SECONDS_PER_YEAR;
  const annualProfitContribution = grossMarginPerUnit * annualVolumeUnitsPerYear;
  const lossPerUnit = grossMarginPerUnit < 0 ? -grossMarginPerUnit : 0;
  const moneyAtRisk = lossPerUnit * annualVolumeUnitsPerYear;
  const verdict = contributionMarginPct >= inp.targetMargin ? 0 : grossMarginPerUnit > 0 ? 1 : 2;
  return {
    out_machine_cost_component: machineCost, out_labor_cost_component: laborCost,
    out_overhead_cost_component: overheadCost, out_material_defect_cost_component: materialDefectCost,
    out_setup_cost_component: setupCostPerUnit, out_total_cost_per_unit: totalCostPerUnit,
    out_gross_margin_per_unit: grossMarginPerUnit, out_contribution_margin_pct: contributionMarginPct,
    out_minimum_acceptable_price: minAcceptablePrice, out_annual_profit_contribution: annualProfitContribution,
    out_money_at_risk: moneyAtRisk, out_verdict: verdict, out_evidence_completeness: 1,
  };
}

interface Insight { sev: "opp" | "info" | "crit"; t: string; msg: string }
function buildInsights(x: ProductSkuMarginInputs, o: ProductSkuMarginOutputs, curSym: string): Insight[] {
  const out: Insight[] = [];
  const fmtMoney = (v: number) => curSym + fmt(v);
  if (o.out_verdict === 2) {
    out.push({ sev: "crit", t: "recommendation",
      msg: `<strong>This job is priced below its true cost.</strong> Every unit loses ${fmtMoney(-o.out_gross_margin_per_unit)}. At the expected annual volume, that's <strong>${fmtMoney(o.out_money_at_risk)}/yr</strong> in exposure. Do not quote at this price without renegotiating or cutting cost.` });
  } else if (o.out_verdict === 1) {
    out.push({ sev: "info", t: "recommendation",
      msg: `This job is profitable but <strong>below target margin</strong> (${(o.out_contribution_margin_pct * 100).toFixed(1)}% vs ${(x.targetMargin * 100).toFixed(0)}% target). It covers its cost but isn't hitting the margin policy calls for.` });
  } else {
    out.push({ sev: "opp", t: "recommendation",
      msg: `<strong>This job clears its target margin</strong> (${(o.out_contribution_margin_pct * 100).toFixed(1)}%) with room to spare. Safe to quote and safe to scale volume on.` });
  }
  out.push({ sev: "info", t: "annual profit contribution",
    msg: `At the expected volume, this SKU contributes <strong>${fmtMoney(o.out_annual_profit_contribution)}</strong> to annual profit. This is the number to rank SKUs against each other by — not margin percentage alone, which ignores volume.` });
  const priceGap = o.out_minimum_acceptable_price - x.unitSellingPrice;
  out.push({ sev: "info", t: "price gap",
    msg: priceGap > 0
      ? `To hit the ${(x.targetMargin * 100).toFixed(0)}% target margin at current cost, the price needs to be at least <strong>${fmtMoney(o.out_minimum_acceptable_price)}</strong> — a gap of ${fmtMoney(priceGap)} versus the current price.`
      : `The current price already clears the minimum acceptable price of ${fmtMoney(o.out_minimum_acceptable_price)} by ${fmtMoney(-priceGap)}.` });
  const components: Array<[string, number]> = [
    ["machine time", o.out_machine_cost_component], ["labor", o.out_labor_cost_component],
    ["overhead", o.out_overhead_cost_component], ["material & defect", o.out_material_defect_cost_component],
    ["setup (amortized)", o.out_setup_cost_component],
  ];
  const biggest = components.sort((a, b) => b[1] - a[1])[0];
  out.push({ sev: "info", t: "largest cost driver",
    msg: `<strong>${biggest[0]}</strong> is the largest component of unit cost (${fmtMoney(biggest[1])} of ${fmtMoney(o.out_total_cost_per_unit)}). That's the lever with the most room to negotiate or improve.` });
  if (x.sourceConfidence < 0.85)
    out.push({ sev: "crit", t: "low source confidence",
      msg: `Input confidence is only <strong>${(x.sourceConfidence * 100).toFixed(0)}%</strong>. Verify the machine rate, cycle time, and material cost against real records before committing to this price.` });
  return out;
}

interface ServerSeal { output_hash?: string; input_hash?: string; schema_hash?: string; hash_algorithm?: string; executed_at?: string }
interface ServerResultState { outputs: Record<string, number>; seal: ServerSeal; inputs: ProductSkuMarginInputs; currency: string }

export default function ProductSkuMarginRankerToolPage() {
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

  const collectedInputs = useMemo((): ProductSkuMarginInputs | null => {
    const o: Record<string, number> = {};
    for (const [id, st] of Object.entries(fieldStates)) {
      if (st.error || st.canon == null) return null;
      o[id] = st.canon;
    }
    return {
      unitSellingPrice: o.unit_selling_price, machineRate: o.machine_rate, cycleTime: o.cycle_time,
      setupTime: o.setup_time, batchQuantity: o.batch_quantity, materialCost: o.material_cost,
      laborRate: o.labor_rate, overheadRate: o.overhead_rate, defectOrLossCost: o.defect_or_loss_cost,
      targetMargin: o.target_margin, annualVolume: o.annual_volume, sourceConfidence: o.source_confidence_ratio,
    };
  }, [fieldStates]);

  const engineResult = useMemo((): ProductSkuMarginOutputs | null => {
    if (!collectedInputs) return null;
    try { return calcPure(collectedInputs); } catch { return null; }
  }, [collectedInputs]);

  const errorCount = useMemo(() => Object.values(fieldStates).filter((s) => s.error).length, [fieldStates]);

  const handleGenerate = useCallback(async () => {
    if (!collectedInputs || isExecuting || !usageSessionId) return;
    setIsExecuting(true);
    setExecuteError(null);
    const snapshotInputs = collectedInputs;
    const snapshotCurrency = curSym;
    try {
      const rawInputs: Record<string, number> = {};
      const selectedUnits: Record<string, string> = {};
      for (const [id, st] of Object.entries(fieldStates)) {
        const f = FIELDS[id];
        if (f.units) {
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

      const requiredOutputs = [
        "out_machine_cost_component", "out_labor_cost_component", "out_overhead_cost_component",
        "out_material_defect_cost_component", "out_setup_cost_component", "out_total_cost_per_unit",
        "out_gross_margin_per_unit", "out_contribution_margin_pct", "out_minimum_acceptable_price",
        "out_annual_profit_contribution", "out_money_at_risk", "out_verdict", "out_evidence_completeness",
      ];
      const missingOrNonFinite = requiredOutputs.filter(
        (k) => typeof outputsMap[k] !== "number" || !Number.isFinite(outputsMap[k]),
      );
      const verdictOk = [0, 1, 2].includes(outputsMap.out_verdict);
      const seal = data.audit_seal as Record<string, unknown> | undefined;
      const sealOk = !!seal && seal.seal_status === "SEALED" && typeof seal.output_hash === "string" && seal.output_hash.length > 0
        && typeof seal.hash_algorithm === "string";
      if (missingOrNonFinite.length > 0 || !verdictOk || !sealOk) {
        throw new Error(
          `Sealed response incomplete (${[
            missingOrNonFinite.length ? `missing/non-finite: ${missingOrNonFinite.join(", ")}` : null,
            verdictOk ? null : "invalid verdict flag",
            sealOk ? null : "missing or unsealed audit seal",
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
  const canGenerate = !!x && !isExecuting;
  const verdictLabel = ["meets target", "below target", "loss-making"];

  const renderField = (id: string) => {
    const f = FIELDS[id];
    const st = fieldStates[id];
    const cls = st.error ? "psmr-bad" : st.warn ? "psmr-warn" : "";
    const msg = st.error ? st.error : st.warn ? `Outside typical industry range (${fmtRef(f)}). Value accepted — flagged for review.` : "";
    const msgCls = st.error ? "psmr-err" : st.warn ? "psmr-warn" : "";
    const msgId = `ms_${id}`;
    const canonUnitLabel = f.units ? ` ${f.units[0].l}` : "";
    const canonDisplay = f.units ? (st.canon != null ? fromCanon(f, st.canon, f.units[0].k) : null) : (f.dom === "pct" ? (st.canon ?? 0) * 100 : st.canon);
    const canonTxt = st.error ? "" : `= ${f.dom === "cur" ? curSym : ""}${fmt(canonDisplay)}${canonUnitLabel}`;
    return (
      <div className="psmr-f" key={id}>
        <div className="psmr-f-top">
          <label htmlFor={`in_${id}`}>{f.label}</label>
          <span className="psmr-unitline">{canonTxt}</span>
        </div>
        <div className={`psmr-control ${cls}`}>
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
          {f.dom === "cur" && <span className="psmr-prefix">{curSym}{f.refUnit ? <em className="psmr-prefix-unit">{f.refUnit}</em> : null}</span>}
          {f.dom === "pct" && <span className="psmr-prefix" style={{ borderLeft: "1px solid var(--psmr-line)", borderRight: "none" }}>%</span>}
          {f.units && (
            <select
              aria-label={`Unit for ${f.label}`}
              value={st.unit}
              onChange={(e) => updateFieldUnit(id, e.target.value)}
              style={{ borderLeft: "1px solid var(--psmr-line)", background: "var(--psmr-panel)", fontFamily: "var(--psmr-mono)", fontSize: "14px", padding: "8px", minHeight: "48px", color: "var(--psmr-ink)" }}
            >
              {f.units.map((u) => <option key={u.k} value={u.k}>{u.l}</option>)}
            </select>
          )}
        </div>
        <div className="psmr-f-foot">
          <span className="psmr-hint">{f.hint} <em style={{ fontStyle: "normal", color: "var(--psmr-faint)" }}>· {f.src}</em></span>
          <span className="psmr-bench-ref">{fmtRef(f)}</span>
        </div>
        {msg && <div id={msgId} className={`psmr-msg ${msgCls}`} role={st.error ? "alert" : "status"}>{msg}</div>}
      </div>
    );
  };

  const renderReport = () => {
    if (!serverResult) return null;
    const s = serverResult.outputs;
    const sealed: ProductSkuMarginOutputs = {
      out_machine_cost_component: s.out_machine_cost_component,
      out_labor_cost_component: s.out_labor_cost_component,
      out_overhead_cost_component: s.out_overhead_cost_component,
      out_material_defect_cost_component: s.out_material_defect_cost_component,
      out_setup_cost_component: s.out_setup_cost_component,
      out_total_cost_per_unit: s.out_total_cost_per_unit,
      out_gross_margin_per_unit: s.out_gross_margin_per_unit,
      out_contribution_margin_pct: s.out_contribution_margin_pct,
      out_minimum_acceptable_price: s.out_minimum_acceptable_price,
      out_annual_profit_contribution: s.out_annual_profit_contribution,
      out_money_at_risk: s.out_money_at_risk,
      out_verdict: s.out_verdict,
      out_evidence_completeness: s.out_evidence_completeness,
    };
    const rx = serverResult.inputs;
    const repCur = serverResult.currency;
    const ins = buildInsights(rx, sealed, repCur);
    const seal = serverResult.seal.output_hash;
    const fmtMoney = (v: number) => repCur + fmt(v);

    return (
      <div className="psmr-report" ref={reportRef}>
        <div className="psmr-rep-mast">
          <h2>Product SKU Margin Ranker — proof report</h2>
          <div className="psmr-rid">
            SC-PRO-PSMR · {new Date().toISOString().slice(0, 10)}<br />
            engine v5.3.2-domain · cost-threshold comparison<br />
            currency {repCur}
          </div>
        </div>
        <div className="psmr-rep-body">
          <div className="psmr-sec">
            <div className={`psmr-verdict-box psmr-verdict-${sealed.out_verdict}`}>
              <div className="psmr-head">Verdict: {verdictLabel[sealed.out_verdict]}.</div>
              <p>Selling at <strong>{fmtMoney(rx.unitSellingPrice)}</strong> against a true cost of <strong>{fmtMoney(sealed.out_total_cost_per_unit)}</strong> per unit — a gross margin of <strong>{fmtMoney(sealed.out_gross_margin_per_unit)}</strong> ({(sealed.out_contribution_margin_pct * 100).toFixed(1)}% contribution margin).</p>
              {sealed.out_verdict === 2 && <p>Annualized exposure at the expected volume: <strong>{fmtMoney(sealed.out_money_at_risk)}</strong>.</p>}
            </div>
          </div>

          <div className="psmr-sec">
            <div className="psmr-sec-h"><span className="psmr-sec-n">1</span><span className="psmr-sec-t">Unit cost breakdown</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartCostBreakdown(sealed, repCur) }} />
            <div className="psmr-note">Every component of the true cost per unit, summing to {fmtMoney(sealed.out_total_cost_per_unit)}.</div>
          </div>

          <div className="psmr-sec">
            <div className="psmr-sec-h"><span className="psmr-sec-n">2</span><span className="psmr-sec-t">Price vs. cost</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartPriceVsCost(rx, sealed, repCur) }} />
            <div className="psmr-note">Selling price against true cost and the price needed to hit target margin.</div>
          </div>

          <div className="psmr-sec">
            <div className="psmr-sec-h"><span className="psmr-sec-n">3</span><span className="psmr-sec-t">Sensitivity — what moves the margin</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartTornado(rx) }} />
            <div className="psmr-note">Gross-margin-per-unit swing when each input is stressed ±15%.</div>
          </div>

          <div className="psmr-sec">
            <div className="psmr-sec-h"><span className="psmr-sec-n">4</span><span className="psmr-sec-t">Engineering insights</span></div>
            {ins.map((i, k) => (
              <div className={`psmr-ins psmr-${i.sev}`} key={k}>
                <span className="psmr-t">{i.t}</span>
                <span dangerouslySetInnerHTML={{ __html: i.msg }} />
              </div>
            ))}
          </div>

          <div className="psmr-seal">
            SEAL · {serverResult.seal.hash_algorithm} {seal}<br />
            Sealed server-side at {serverResult.seal.executed_at ?? "—"}.
          </div>
          <button
            type="button"
            className="psmr-print-btn"
            onClick={() => window.print()}
            aria-label="Download this report as a PDF"
          >
            Download PDF
          </button>
          <div className="psmr-disc">
            Technical simulation only; not financial, legal, or engineering advice. Users must verify results before making business decisions.
          </div>
          <PremiumReportFeedback
            key={serverResult.seal.output_hash}
            schemaSlug={TOOL_KEY}
            sectorSlug="manufacturing"
            reportSlug={serverResult.seal.output_hash}
            inputSnapshot={{
              unit_selling_price: rx.unitSellingPrice, machine_rate: rx.machineRate, cycle_time: rx.cycleTime,
              setup_time: rx.setupTime, batch_quantity: rx.batchQuantity, material_cost: rx.materialCost,
              labor_rate: rx.laborRate, overhead_rate: rx.overheadRate, defect_or_loss_cost: rx.defectOrLossCost,
              target_margin: rx.targetMargin, annual_volume: rx.annualVolume, source_confidence_ratio: rx.sourceConfidence,
            }}
            resultSnapshot={s}
            currency={repCur}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="psmr-shell">
      <div className="psmr-mast">
        <div className="psmr-kicker">SectorCalc PRO · Product Profitability · SKU ranking</div>
        <h1>Product SKU Margin Ranker</h1>
        <p className="psmr-lede">Computes the true fully-loaded cost per unit — machine, labor, overhead, material, defect, and amortized setup — against the selling price, and produces the annual profit contribution to rank this SKU against others.</p>
        <div className="psmr-meta">
          <span>Engine <b>v5.3.2-domain</b></span>
          <span>Method <b>unit economics + annual profit</b></span>
          <span>Report <b>sealed · SHA-256</b></span>
        </div>
        <div className="psmr-curbar">
          <label htmlFor="psmr-curSel">Report currency</label>
          <select id="psmr-curSel" value={curSym} onChange={(e) => setCurSym(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="psmr-curnote">Symbol only — no exchange-rate conversion. Enter every figure in the same currency.</span>
        </div>
      </div>

      <div className="psmr-bench">
        <div className="psmr-form-col">
          {[1, 2, 3, 4].map((g) => (
            <div className="psmr-grp" key={g}>
              <div className="psmr-grp-h"><span className="psmr-grp-n">{GROUPS[g].n}</span><span className="psmr-grp-t">{GROUPS[g].t}</span></div>
              <div className="psmr-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter((id) => FIELDS[id].grp === g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="psmr-rail">
          <div className="psmr-rail-in">
            <div className="psmr-verdict">
              <div className={`psmr-verdict-band ${r ? ["psmr-pos", "psmr-warn2", "psmr-neg"][r.out_verdict] : "psmr-warn2"}`}>
                {r ? verdictLabel[r.out_verdict] : "incomplete"}
              </div>
              <div className="psmr-verdict-body">
                <div className="psmr-big">{r ? <>{curSym}{fmt(r.out_gross_margin_per_unit)} <small>margin/unit</small></> : "—"}</div>
                <div className="psmr-big-cap">
                  {r
                    ? `${(r.out_contribution_margin_pct * 100).toFixed(1)}% contribution · cost ${curSym}${fmt(r.out_total_cost_per_unit)}/unit`
                    : errorCount ? `${errorCount} input(s) need attention` : "enter job data to begin"}
                </div>
              </div>
            </div>
            <div className="psmr-stat"><span>Total cost per unit</span><b>{r ? curSym + fmt(r.out_total_cost_per_unit) : "—"}</b></div>
            <div className="psmr-stat"><span>Annual profit contribution</span><b>{r ? curSym + fmt(r.out_annual_profit_contribution) : "—"}</b></div>
            <div className="psmr-stat"><span>Minimum acceptable price</span><b>{r ? curSym + fmt(r.out_minimum_acceptable_price) : "—"}</b></div>
            <div className="psmr-stat"><span>Money at risk (annualized)</span><b>{r ? curSym + fmt(r.out_money_at_risk) : "—"}</b></div>

            {!usageSessionId ? (
              <button className="psmr-cta" disabled={sessionLoading || !canGenerate} onClick={requestSession}>
                {sessionLoading ? "Checking credits…" : "Unlock sealed report · 1 credit"}
              </button>
            ) : (
              <button className="psmr-cta" disabled={!canGenerate || isExecuting} onClick={handleGenerate}>
                {isExecuting ? "Generating…" : "Generate sealed report"}
              </button>
            )}
            {remainingRuns != null && usageSessionId !== BYPASS_SESSION_ID && (
              <div className="psmr-conf">{remainingRuns} run(s) remaining this session.</div>
            )}
            {sessionError && <div className="psmr-conf" style={{ color: "var(--psmr-neg)" }}>{sessionError}</div>}
            {executeError && <div className="psmr-conf" style={{ color: "var(--psmr-neg)" }}>{executeError}</div>}
            <div className="psmr-conf">
              <span className="psmr-d" style={{ background: r ? ["var(--psmr-pos)", "var(--psmr-warn2)", "var(--psmr-neg)"][r.out_verdict] : "var(--psmr-warn2)" }} />
              <span>{r ? `Inputs consistent · ${verdictLabel[r.out_verdict]}` : errorCount ? "Fix highlighted inputs." : "Enter inputs to compute."}</span>
            </div>
          </div>
        </div>
      </div>

      {serverResult && renderReport()}
    </div>
  );
}
