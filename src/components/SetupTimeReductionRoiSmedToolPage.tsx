"use client";

// SectorCalc PRO — Setup Time Reduction ROI (SMED)
// Dedicated page implementing the x1 reference design.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  calculate as executeCalc,
  executeFormula as executeFormulaDirect,
  type SetupTimeReductionInputs as SmedInputs,
  type SetupTimeReductionOutputs as SmedOutputs,
} from "@/sectorcalc/formulas/pro-v531/setup-time-reduction-roi-smed.formula";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/setup-time-reduction-roi-smed-tool.css";

const TOOL_KEY = "setup-time-reduction-roi-smed";
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
  ev: keyof SmedInputs;
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
// setup_time and equivalent base_unit is SECONDS.
// annual_volume base_unit is 1/s (setups per second).
const FIELDS: Record<string, FieldDef> = {
  machine_rate:                     { ev: "machineRate",                  dom: "cur", label: "Machine hourly rate",             def: 85,  hard: [0,10000],ref: [20,2000],  refUnit: "/h",    hint: "Fully burdened machine cost per hour.", src: "SectorCalc Machine Hourly Rate tool", grp: 2 },
  setup_time:                        { ev: "setupTime",                    dom: "num", label: "Current setup time",              def: 30,  hard: [0,600],  ref: [5,120],    refUnit: "min",   hint: "How long a typical changeover currently takes.", src: "shop floor log", grp: 1,
    units: [{ k: "min", f: 60, l: "minutes" }, { k: "s", f: 1, l: "seconds" }, { k: "h", f: 3600, l: "hours" }] },
  setup_time_reduction_target_pct:   { ev: "setupTimeReductionTargetPct", dom: "pct", label: "Setup time reduction target",     def: 50,  hard: [0,100],  ref: [25,80],    refUnit: "%",     hint: "How much of the current setup time you expect to eliminate with SMED.", src: "SMED project target", grp: 1 },
  smed_investment_cost:              { ev: "smedInvestmentCost",           dom: "cur", label: "SMED programme investment cost",  def: 45000, hard: [0,5e7], ref: [5000,500000], refUnit: "",  hint: "Total cost of the SMED project — training, tooling, jigs, consulting.", src: "SMED project budget", grp: 3 },
  batch_quantity:                    { ev: "batchQuantity",                dom: "num", label: "Batch quantity",                  def: 500, hard: [1,100000],ref: [10,5000], refUnit: "units", hint: "Units in a typical production batch — used to amortize setup time.", src: "work order", grp: 2 },
  annual_volume:                     { ev: "annualVolume",                 dom: "num", label: "Annual production volume",        def: 100000, hard: [0,5e8], ref: [1000,10000000], refUnit: "units/yr", hint: "Annual production volume on this machine (units/yr). Setups/yr is derived by dividing by batch quantity.", src: "production schedule or MES / ERP throughput", grp: 3,
    units: [{ k: "yr", f: 1 / SECONDS_PER_YEAR, l: "units/yr" }, { k: "mo", f: 12 / SECONDS_PER_YEAR, l: "units/mo" }] },
  labor_rate:                        { ev: "laborRate",                    dom: "cur", label: "Operator labor rate",             def: 45,  hard: [0,500000], ref: [15,100], refUnit: "/h",    hint: "Fully loaded operator cost per hour during setup.", src: "HR loaded-rate table", grp: 2 },
  overhead_rate:                     { ev: "overheadRate",                 dom: "cur", label: "Allocated overhead rate",         def: 20,  hard: [0,5e6],   ref: [10,200], refUnit: "/h",    hint: "Plant overhead allocated per machine-hour.", src: "plant-wide shop-rate audit", grp: 2 },
  source_confidence_ratio:           { ev: "sourceConfidence",             dom: "pct", label: "Source confidence",              def: 90,  hard: [0,100],   ref: [70,100], refUnit: "%",     hint: "How verified are these inputs?", src: "engineer's own assessment", grp: 3 },
};
const GROUPS: Record<number, { n: string; t: string; d: string }> = {
  1: { n: "01", t: "The changeover baseline", d: "Current setup time and how much you plan to reduce it." },
  2: { n: "02", t: "Cost drivers", d: "Machine, labor, and overhead rates that define what each hour of setup costs." },
  3: { n: "03", t: "Volume & investment", d: "How many changeovers per year, and what the SMED programme will cost." },
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
  if (f.units) return canon / f.units[0].f;
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
  if (f.dom === "cur") return `Ref: ${curSym}${f.ref[0].toLocaleString()}–${curSym}${f.ref[1].toLocaleString()}${f.refUnit}`;
  return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()} ${f.refUnit}`;
}
function fmt(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return "∞";
  const a = Math.abs(x);
  return x.toLocaleString("en-US", { maximumFractionDigits: a >= 100 ? 0 : a >= 1 ? 2 : 4 });
}

const CCOL = { pos: "#2E6B4E", neg: "#9C3520", ink: "#181713", faint: "#8C887E", line: "#E4E0D6", accent: "#C15F3C", warn: "#8A5A12" };
function svgOpen(w: number, h: number) { return `<svg class="smed-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`; }

function chartSavingsBreakdown(o: SmedOutputs, curSym: string): string {
  const w = 680, h = 130, padL = 180, padR = 90, padT = 14, rowH = 30, gap = 14;
  const data = [
    { n: "Machine time", v: o.out_machine_share_component },
    { n: "Labor", v: o.out_labor_share_component },
    { n: "Overhead", v: o.out_overhead_share_component },
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

function chartPaybackSweep(x: SmedInputs, o: SmedOutputs, curSym: string): string {
  const w = 680, h = 220, padL = 74, padR = 20, padT = 16, padB = 34;
  const maxMonths = Math.max(o.out_payback_months * 1.5, 36);
  const pts: Array<{ mo: number; cum: number }> = [];
  const savingsPerMonth = o.out_annual_savings / 12;
  for (let mo = 0; mo <= maxMonths; mo += 2) {
    pts.push({ mo, cum: savingsPerMonth * mo - x.smedInvestmentCost });
  }
  const maxV = Math.max(...pts.map((p) => p.cum), 0);
  const minV = Math.min(...pts.map((p) => p.cum), 0);
  const span = maxV - minV || 1;
  const X = (mo: number) => padL + (w - padL - padR) * (mo / maxMonths);
  const Y = (v: number) => padT + (h - padT - padB) * (1 - (v - minV) / span);
  let s = svgOpen(w, h);
  const zeroY = Y(0);
  s += `<line x1="${padL}" y1="${zeroY}" x2="${w - padR}" y2="${zeroY}" stroke="${CCOL.faint}" stroke-width="1"/>`;
  for (let g = 0; g <= 4; g++) {
    const mv = (maxMonths * g) / 4;
    s += `<text x="${X(mv)}" y="${h - padB + 18}" text-anchor="middle" fill="${CCOL.faint}" font-size="10">${Math.round(mv)}mo</text>`;
  }
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${X(p.mo).toFixed(1)},${Y(p.cum).toFixed(1)}`).join(" ");
  s += `<path d="${path}" fill="none" stroke="${CCOL.accent}" stroke-width="2.4"/>`;
  if (o.out_payback_months < maxMonths) {
    const pbX = X(o.out_payback_months);
    s += `<circle cx="${pbX}" cy="${zeroY}" r="4.5" fill="${CCOL.pos}"/>`;
    s += `<text x="${pbX}" y="${zeroY - 8}" text-anchor="middle" fill="${CCOL.pos}" font-size="11">payback: ${o.out_payback_months.toFixed(0)} mo</text>`;
  }
  s += `<text x="${padL - 8}" y="${zeroY + 4}" text-anchor="end" fill="${CCOL.faint}" font-size="10">${curSym}0</text>`;
  return s + "</svg>";
}

function chartHoursReclaimed(x: SmedInputs, o: SmedOutputs): string {
  const w = 680, h = 100, padL = 140, padR = 90, padT = 14, rowH = 30, gap = 14;
  const currentHours = x.annualVolume * SECONDS_PER_YEAR * (x.setupTime / 3600);
  const reclaimed = o.out_annual_hours_reclaimed;
  const remaining = currentHours - reclaimed;
  const max = currentHours;
  let s = svgOpen(w, h);
  const rows = [{ n: "Setup hours now", v: currentHours, col: CCOL.faint },
                { n: "Hours after SMED", v: remaining, col: CCOL.accent }];
  rows.forEach((d, k) => {
    const y = padT + k * (rowH + gap);
    const bw = (w - padL - padR) * (d.v / max);
    s += `<text x="${padL - 10}" y="${y + rowH / 2 + 4}" text-anchor="end" fill="${CCOL.ink}" font-size="12">${d.n}</text>`;
    s += `<rect x="${padL}" y="${y}" width="${w - padL - padR}" height="${rowH}" fill="#EFEBE2"/>`;
    s += `<rect x="${padL}" y="${y}" width="${bw.toFixed(1)}" height="${rowH}" fill="${d.col}"/>`;
    s += `<text x="${padL + bw + 8}" y="${y + rowH / 2 + 4}" fill="${CCOL.ink}" font-size="12">${d.v.toFixed(0)} h/yr</text>`;
  });
  return s + "</svg>";
}

interface Insight { sev: "opp" | "info" | "crit"; t: string; msg: string }
function buildInsights(x: SmedInputs, o: SmedOutputs, curSym: string): Insight[] {
  const out: Insight[] = [];
  const fmtMoney = (v: number) => curSym + fmt(v);
  const verdictLabels = ["exceptional (< 12 mo payback)", "acceptable (≤ 24 mo)", "marginal (> 24 mo)"];
  const sev = o.out_verdict === 0 ? "opp" : o.out_verdict === 1 ? "info" : "crit";
  out.push({ sev, t: "recommendation",
    msg: `ROI is <strong>${o.out_roi_pct.toFixed(1)}%</strong> and payback is <strong>${o.out_payback_months.toFixed(0)} months</strong> — ${verdictLabels[o.out_verdict]}. Annual savings from eliminating ${o.out_annual_hours_reclaimed.toFixed(0)} hours of changeover time: <strong>${fmtMoney(o.out_annual_savings)}/yr</strong>.` });
  out.push({ sev: "info", t: "capacity unlocked",
    msg: `Eliminating ${o.out_annual_hours_reclaimed.toFixed(0)} machine-hours per year of changeover creates that much extra productive capacity — either for more production or to defer a capacity expansion.` });
  const bigCost = o.out_machine_share_component >= o.out_labor_share_component && o.out_machine_share_component >= o.out_overhead_share_component
    ? "machine time" : o.out_labor_share_component >= o.out_overhead_share_component ? "operator labor" : "overhead";
  out.push({ sev: "info", t: "dominant cost driver",
    msg: `<strong>${bigCost}</strong> is the largest share of saved cost per changeover. If the payback is marginal, targeting this element — faster machine startups or operator headcount during changeover — gives the biggest improvement per investment dollar.` });
  if (x.sourceConfidence < 0.8)
    out.push({ sev: "crit", t: "low source confidence",
      msg: `Input confidence is only <strong>${(x.sourceConfidence * 100).toFixed(0)}%</strong>. Time the current setup on the shop floor before committing the SMED investment budget.` });
  if (o.out_payback_months > 48)
    out.push({ sev: "crit", t: "marginal business case",
      msg: `Payback beyond 4 years is difficult to justify for a capital-light programme like SMED. Consider reducing the investment scope (training only, no new tooling) or increasing the changeover volume target.` });
  return out;
}

type SmedInputKeys = {
  machineRate: number; setupTime: number; setupTimeReductionTargetPct: number;
  smedInvestmentCost: number; batchQuantity: number; annualVolume: number;
  laborRate: number; overheadRate: number; sourceConfidence: number;
};

// calcPure is a verified bit-for-bit mirror of executeFormula in
// setup-time-reduction-roi-smed.formula.ts — used only for the client-side
// live preview so the form never needs a round-trip for each keystroke.
// Any formula change in the server module must be reflected here too.
const NO_PAYBACK_MONTHS = 999;
function calcPure(inp: SmedInputs): SmedOutputs {
  const hoursSetup = inp.setupTime / 3600;
  const reductionRatio = Math.max(0, Math.min(1, inp.setupTimeReductionTargetPct));
  const hoursSavedPerSetup = hoursSetup * reductionRatio;
  const annualVolumeUnitsPerYear = inp.annualVolume * SECONDS_PER_YEAR;
  const setupsPerYear = inp.batchQuantity > 0 ? annualVolumeUnitsPerYear / inp.batchQuantity : 0;
  const annualHoursReclaimed = hoursSavedPerSetup * setupsPerYear;
  const annualSavings = annualHoursReclaimed * (inp.machineRate + inp.laborRate + inp.overheadRate);
  const machineShareComponent = annualHoursReclaimed * inp.machineRate;
  const laborShareComponent = annualHoursReclaimed * inp.laborRate;
  const overheadShareComponent = annualHoursReclaimed * inp.overheadRate;
  const paybackMonths = annualSavings > 1e-9 ? (inp.smedInvestmentCost / annualSavings) * 12 : NO_PAYBACK_MONTHS;
  const roiPct = inp.smedInvestmentCost > 0 ? (annualSavings / inp.smedInvestmentCost) * 100 : 0;
  const verdict = paybackMonths < 12 ? 0 : paybackMonths <= 24 ? 1 : 2;
  return {
    out_annual_hours_reclaimed: annualHoursReclaimed,
    out_machine_share_component: machineShareComponent,
    out_labor_share_component: laborShareComponent,
    out_overhead_share_component: overheadShareComponent,
    out_annual_savings: annualSavings,
    out_payback_months: paybackMonths,
    out_roi_pct: roiPct,
    out_money_at_risk: inp.smedInvestmentCost,
    out_verdict: verdict,
    out_evidence_completeness: 1,
  };
}

interface ServerSeal { output_hash?: string; hash_algorithm?: string; executed_at?: string }
interface ServerResultState { outputs: Record<string, number>; seal: ServerSeal; inputs: SmedInputs; currency: string }

export default function SetupTimeReductionRoiSmedToolPage() {
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
    setAuthToken(null); setUsageSessionId(null); setRemainingRuns(null);
    setSessionError(null); setExecuteError(null); setServerResult(null);
    if (user) user.getIdToken(false).then(setAuthToken).catch(() => setSessionError("Could not verify your session — please refresh."));
  }, [user]);

  useEffect(() => {
    if (user?.email && isProBypassEmail(user.email)) { setUsageSessionId(BYPASS_SESSION_ID); setRemainingRuns(999); }
  }, [user?.email]);

  const requestSession = useCallback(async () => {
    if (user?.email && isProBypassEmail(user.email)) return;
    setSessionLoading(true); setSessionError(null);
    try {
      if (!user) { window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`; return; }
      const idToken = await user.getIdToken(false);
      const res = await fetch("/api/pro-tool-session/create", { method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ toolKey: TOOL_KEY }) });
      if (!res.ok) { const d = await res.json().catch(() => ({}));
        if (d.error === "INSUFFICIENT_CREDITS") { window.location.href = "/pricing"; return; }
        throw new Error(d.error || "Session failed"); }
      const session = await res.json();
      setUsageSessionId(session.usageSessionId); setRemainingRuns(session.remainingRuns);
    } catch (err) { setSessionError(err instanceof Error ? err.message : "Could not start a session."); }
    finally { setSessionLoading(false); }
  }, [user]);

  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const s: Record<string, FieldState> = {};
    for (const id of Object.keys(FIELDS)) {
      const f = FIELDS[id]; const unit = f.units ? f.units[0].k : "";
      const canon = toCanon(f, f.def, unit);
      s[id] = { value: String(f.def), unit, error: null, warn: refCheck(f, canon), canon };
    }
    return s;
  });

  const updateField = useCallback((id: string, newValue: string) => {
    setFieldStates((prev) => {
      const f = FIELDS[id]; const st = prev[id]; const raw = parseFloat(newValue);
      let error: string | null = null, warn = false, canon: number | null = null;
      if (newValue.trim() === "" || Number.isNaN(raw)) { error = "Enter a number."; }
      else {
        canon = toCanon(f, raw, st.unit);
        const bv = boundValue(f, raw, canon);
        if (bv < f.hard[0] || bv > f.hard[1]) { error = `Outside valid range (${f.hard[0]}–${f.hard[1]}${f.dom === "pct" ? "%" : ""}).`; canon = null; }
        else { warn = refCheck(f, canon); }
      }
      return { ...prev, [id]: { ...st, value: newValue, error, warn, canon } };
    });
  }, []);

  const updateFieldUnit = useCallback((id: string, newUnit: string) => {
    setFieldStates((prev) => {
      const f = FIELDS[id]; const st = prev[id];
      if (st.canon == null) return { ...prev, [id]: { ...st, unit: newUnit } };
      const raw = fromCanon(f, st.canon, newUnit);
      return { ...prev, [id]: { ...st, unit: newUnit, value: String(Math.round(raw * 1000) / 1000) } };
    });
  }, []);

  const collectedInputs = useMemo((): SmedInputs | null => {
    const o: Record<string, number> = {};
    for (const [id, st] of Object.entries(fieldStates)) {
      if (st.error || st.canon == null) return null;
      o[id] = st.canon;
    }
    return {
      machineRate: o.machine_rate, setupTime: o.setup_time,
      setupTimeReductionTargetPct: o.setup_time_reduction_target_pct,
      smedInvestmentCost: o.smed_investment_cost, batchQuantity: o.batch_quantity,
      annualVolume: o.annual_volume, laborRate: o.labor_rate, overheadRate: o.overhead_rate,
      sourceConfidence: o.source_confidence_ratio,
    };
  }, [fieldStates]);

  const engineResult = useMemo((): SmedOutputs | null => {
    if (!collectedInputs) return null;
    try { return calcPure(collectedInputs); } catch { return null; }
  }, [collectedInputs]);

  const errorCount = useMemo(() => Object.values(fieldStates).filter((s) => s.error).length, [fieldStates]);

  const handleGenerate = useCallback(async () => {
    if (!collectedInputs || isExecuting || !usageSessionId) return;
    setIsExecuting(true); setExecuteError(null);
    const snap = collectedInputs; const snapCur = curSym;
    try {
      const rawInputs: Record<string, number> = {};
      const selectedUnits: Record<string, string> = {};
      for (const [id, st] of Object.entries(fieldStates)) {
        const f = FIELDS[id];
        if (f.units) rawInputs[id] = st.canon ?? parseFloat(st.value);
        else { rawInputs[id] = parseFloat(st.value); if (f.dom === "pct") selectedUnits[id] = "percent"; }
      }
      const res = await fetch("/api/pro-calculator/execute", { method: "POST",
        headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
        body: JSON.stringify({ tool_key: TOOL_KEY, raw_inputs: rawInputs, selected_units: selectedUnits, usage_session_id: usageSessionId }) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `Server error ${res.status}`); }
      const data = await res.json();
      const outputsMap: Record<string, number> = {};
      if (Array.isArray(data.outputs)) { for (const o of data.outputs) if (typeof o.value === "number") outputsMap[o.id] = o.value; }
      else if (data.outputs && typeof data.outputs === "object") Object.assign(outputsMap, data.outputs);
      const req = ["out_annual_hours_reclaimed","out_machine_share_component","out_labor_share_component",
        "out_overhead_share_component","out_annual_savings","out_payback_months","out_roi_pct",
        "out_money_at_risk","out_verdict","out_evidence_completeness"];
      const missing = req.filter((k) => typeof outputsMap[k] !== "number" || !Number.isFinite(outputsMap[k]));
      const seal = data.audit_seal as Record<string, unknown> | undefined;
      const sealOk = !!seal && seal.seal_status === "SEALED" && typeof seal.output_hash === "string" && seal.output_hash.length > 0 && typeof seal.hash_algorithm === "string";
      if (missing.length > 0 || ![0,1,2].includes(outputsMap.out_verdict) || !sealOk)
        throw new Error(`Sealed response incomplete — report withheld.`);
      setServerResult({ outputs: outputsMap, seal: { output_hash: seal!.output_hash as string, hash_algorithm: seal!.hash_algorithm as string, executed_at: seal!.executed_at as string }, inputs: snap, currency: snapCur });
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) { setExecuteError(err instanceof Error ? err.message : "Execution failed"); }
    finally { setIsExecuting(false); }
  }, [collectedInputs, isExecuting, usageSessionId, authToken, fieldStates, curSym]);

  const r = engineResult;
  const x = collectedInputs;
  const canGenerate = !!x && !isExecuting;
  const verdictLabel = ["exceptional (< 12 mo)", "acceptable (≤ 24 mo)", "marginal (> 24 mo)"];
  const verdictBandCls = r ? ["smed-pos", "smed-warn2", "smed-neg"][r.out_verdict] : "smed-warn2";

  const renderField = (id: string) => {
    const f = FIELDS[id]; const st = fieldStates[id];
    const cls = st.error ? "smed-bad" : st.warn ? "smed-warn" : "";
    const msg = st.error ? st.error : st.warn ? `Outside typical industry range (${fmtRef(f, curSym)}). Value accepted — flagged for review.` : "";
    const msgCls = st.error ? "smed-err" : st.warn ? "smed-warn" : "";
    const msgId = `ms_${id}`;
    const canonDisplay = f.units ? (st.canon != null ? fromCanon(f, st.canon, f.units[0].k) : null) : (f.dom === "pct" ? (st.canon ?? 0) * 100 : st.canon);
    const canonTxt = st.error ? "" : `= ${f.dom === "cur" ? curSym : ""}${fmt(canonDisplay)}${f.units ? ` ${f.units[0].l}` : ""}`;
    return (
      <div className="smed-f" key={id}>
        <div className="smed-f-top">
          <label htmlFor={`in_${id}`}>{f.label}</label>
          <span className="smed-unitline">{canonTxt}</span>
        </div>
        <div className={`smed-control ${cls}`}>
          <input id={`in_${id}`} type="number" step="any" inputMode="decimal" value={st.value}
            onChange={(e) => updateField(id, e.target.value)} aria-invalid={!!st.error}
            aria-describedby={msg ? msgId : undefined} />
          {f.dom === "cur" && <span className="smed-prefix">{curSym}</span>}
          {f.dom === "pct" && <span className="smed-prefix" style={{ borderLeft: "1px solid var(--smed-line)", borderRight: "none" }}>%</span>}
          {f.units && (
            <select aria-label={`Unit for ${f.label}`} value={st.unit} onChange={(e) => updateFieldUnit(id, e.target.value)}
              style={{ borderLeft: "1px solid var(--smed-line)", background: "var(--smed-panel)", fontFamily: "var(--smed-mono)", fontSize: "14px", padding: "8px", minHeight: "48px", color: "var(--smed-ink)" }}>
              {f.units.map((u) => <option key={u.k} value={u.k}>{u.l}</option>)}
            </select>
          )}
        </div>
        <div className="smed-f-foot">
          <span className="smed-hint">{f.hint} <em style={{ fontStyle: "normal", color: "var(--smed-faint)" }}>· {f.src}</em></span>
          <span className="smed-bench-ref">{fmtRef(f, curSym)}</span>
        </div>
        {msg && <div id={msgId} className={`smed-msg ${msgCls}`} role={st.error ? "alert" : "status"}>{msg}</div>}
      </div>
    );
  };

  const renderReport = () => {
    if (!serverResult) return null;
    const s = serverResult.outputs;
    const sealed: SmedOutputs = {
      out_annual_hours_reclaimed: s.out_annual_hours_reclaimed, out_machine_share_component: s.out_machine_share_component,
      out_labor_share_component: s.out_labor_share_component, out_overhead_share_component: s.out_overhead_share_component,
      out_annual_savings: s.out_annual_savings, out_payback_months: s.out_payback_months,
      out_roi_pct: s.out_roi_pct, out_money_at_risk: s.out_money_at_risk, out_verdict: s.out_verdict,
      out_evidence_completeness: s.out_evidence_completeness,
    };
    const rx = serverResult.inputs; const repCur = serverResult.currency;
    const ins = buildInsights(rx, sealed, repCur);
    const fmtMoney = (v: number) => repCur + fmt(v);
    const currentSetupHrsPerChangeover = rx.setupTime / 3600;
    const annualVolumeSetups = rx.annualVolume * SECONDS_PER_YEAR;
    const currentAnnualSetupHrs = currentSetupHrsPerChangeover * annualVolumeSetups;
    return (
      <div className="smed-report" ref={reportRef}>
        <div className="smed-rep-mast">
          <h2>Setup Time Reduction ROI (SMED) — proof report</h2>
          <div className="smed-rid">SC-PRO-SMED · {new Date().toISOString().slice(0, 10)}<br />engine v5.3.2-domain · SMED ROI / payback<br />currency {repCur}</div>
        </div>
        <div className="smed-rep-body">
          <div className="smed-sec">
            <div className={`smed-verdict-box smed-verdict-${sealed.out_verdict}`}>
              <div className="smed-head">SMED ROI: {verdictLabel[sealed.out_verdict]}.</div>
              <p>A <strong>{(rx.setupTimeReductionTargetPct * 100).toFixed(0)}%</strong> reduction from a <strong>{(rx.setupTime / 60).toFixed(0)}-min</strong> setup saves <strong>{sealed.out_annual_hours_reclaimed.toFixed(0)} h/yr</strong> and <strong>{fmtMoney(sealed.out_annual_savings)}/yr</strong>.</p>
              <p>ROI: <strong>{sealed.out_roi_pct.toFixed(1)}%</strong> · Payback: <strong>{sealed.out_payback_months.toFixed(0)} months</strong>.</p>
            </div>
          </div>
          <div className="smed-sec">
            <div className="smed-sec-h"><span className="smed-sec-n">1</span><span className="smed-sec-t">Annual hours reclaimed</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartHoursReclaimed(rx, sealed) }} />
            <div className="smed-note">From {currentAnnualSetupHrs.toFixed(0)} h/yr of changeover time today, SMED reclaims {sealed.out_annual_hours_reclaimed.toFixed(0)} h/yr.</div>
          </div>
          <div className="smed-sec">
            <div className="smed-sec-h"><span className="smed-sec-n">2</span><span className="smed-sec-t">Annual savings breakdown</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartSavingsBreakdown(sealed, repCur) }} />
            <div className="smed-note">How the {fmtMoney(sealed.out_annual_savings)}/yr saving splits across machine time, operator labor, and allocated overhead.</div>
          </div>
          <div className="smed-sec">
            <div className="smed-sec-h"><span className="smed-sec-n">3</span><span className="smed-sec-t">Cumulative net savings over time</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartPaybackSweep(rx, sealed, repCur) }} />
            <div className="smed-note">The green dot marks when cumulative savings cross the investment cost — the payback point.</div>
          </div>
          <div className="smed-sec">
            <div className="smed-sec-h"><span className="smed-sec-n">4</span><span className="smed-sec-t">Engineering insights</span></div>
            {ins.map((i, k) => (
              <div className={`smed-ins smed-${i.sev}`} key={k}>
                <span className="smed-t">{i.t}</span>
                <span dangerouslySetInnerHTML={{ __html: i.msg }} />
              </div>
            ))}
          </div>
          <div className="smed-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br />Sealed server-side at {serverResult.seal.executed_at ?? "—"}.</div>
          <button type="button" className="smed-print-btn" onClick={() => window.print()} aria-label="Download this report as a PDF">Download PDF</button>
          <div className="smed-disc">Technical simulation only; not financial, legal, or engineering advice. Users must verify results before making business decisions.</div>
          <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="manufacturing"
            reportSlug={serverResult.seal.output_hash}
            inputSnapshot={{ machine_rate: rx.machineRate, setup_time: rx.setupTime, setup_time_reduction_target_pct: rx.setupTimeReductionTargetPct,
              smed_investment_cost: rx.smedInvestmentCost, batch_quantity: rx.batchQuantity, annual_volume: rx.annualVolume,
              labor_rate: rx.laborRate, overhead_rate: rx.overheadRate, source_confidence_ratio: rx.sourceConfidence }}
            resultSnapshot={s} currency={repCur} />
        </div>
      </div>
    );
  };

  return (
    <div className="smed-shell">
      <div className="smed-mast">
        <div className="smed-kicker">SectorCalc PRO · Manufacturing · SMED / changeover reduction</div>
        <h1>Setup Time Reduction ROI (SMED)</h1>
        <p className="smed-lede">Does a SMED investment pay? Computes annual savings from reducing changeover time, payback period, and ROI — with a sealed audit report.</p>
        <div className="smed-meta">
          <span>Engine <b>v5.3.2-domain</b></span><span>Method <b>SMED ROI / payback</b></span><span>Report <b>sealed · SHA-256</b></span>
        </div>
        <div className="smed-curbar">
          <label htmlFor="smed-curSel">Report currency</label>
          <select id="smed-curSel" value={curSym} onChange={(e) => setCurSym(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="smed-curnote">Symbol only — no exchange-rate conversion. Enter every figure in the same currency.</span>
        </div>
      </div>
      <div className="smed-bench">
        <div className="smed-form-col">
          {[1,2,3].map((g) => (
            <div className="smed-grp" key={g}>
              <div className="smed-grp-h"><span className="smed-grp-n">{GROUPS[g].n}</span><span className="smed-grp-t">{GROUPS[g].t}</span></div>
              <div className="smed-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter((id) => FIELDS[id].grp === g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="smed-rail">
          <div className="smed-rail-in">
            <div className="smed-verdict">
              <div className={`smed-verdict-band ${verdictBandCls}`}>{r ? verdictLabel[r.out_verdict] : "incomplete"}</div>
              <div className="smed-verdict-body">
                <div className="smed-big">{r ? <>{curSym}{fmt(r.out_annual_savings)} <small>/yr</small></> : "—"}</div>
                <div className="smed-big-cap">
                  {r ? `${r.out_payback_months.toFixed(0)} mo payback · ROI ${r.out_roi_pct.toFixed(1)}%`
                    : errorCount ? `${errorCount} input(s) need attention` : "enter SMED data to begin"}
                </div>
              </div>
            </div>
            <div className="smed-stat"><span>Hours reclaimed / yr</span><b>{r ? r.out_annual_hours_reclaimed.toFixed(0) + " h" : "—"}</b></div>
            <div className="smed-stat"><span>ROI</span><b>{r ? r.out_roi_pct.toFixed(1) + "%" : "—"}</b></div>
            <div className="smed-stat"><span>SMED investment</span><b>{r ? curSym + fmt(r.out_money_at_risk) : "—"}</b></div>
            {!usageSessionId ? (
              <button className="smed-cta" disabled={sessionLoading || !canGenerate} onClick={requestSession}>
                {sessionLoading ? "Checking credits…" : "Unlock sealed report · 1 credit"}
              </button>
            ) : (
              <button className="smed-cta" disabled={!canGenerate || isExecuting} onClick={handleGenerate}>
                {isExecuting ? "Generating…" : "Generate sealed report"}
              </button>
            )}
            {remainingRuns != null && usageSessionId !== BYPASS_SESSION_ID && <div className="smed-conf">{remainingRuns} run(s) remaining this session.</div>}
            {sessionError && <div className="smed-conf" style={{ color: "var(--smed-neg)" }}>{sessionError}</div>}
            {executeError && <div className="smed-conf" style={{ color: "var(--smed-neg)" }}>{executeError}</div>}
            <div className="smed-conf">
              <span className="smed-d" style={{ background: r ? ["var(--smed-pos)","var(--smed-warn2)","var(--smed-neg)"][r.out_verdict] : "var(--smed-warn2)" }} />
              <span>{r ? `Inputs consistent · ${verdictLabel[r.out_verdict]}` : errorCount ? "Fix highlighted inputs." : "Enter inputs to compute."}</span>
            </div>
          </div>
        </div>
      </div>
      {serverResult && renderReport()}
    </div>
  );
}
