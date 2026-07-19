"use client";

// SectorCalc PRO — Receivables Cost / Payment Term Addendum
// Dedicated page implementing the x1 reference design (adapted from
// buy-lease-keep / capital-equipment-npv-irr). Live preview via the pure
// formula engine (no credit cost); sealed report via
// /api/pro-calculator/execute (1 credit).

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  executeFormula,
  type ReceivablesCostInputs,
  type ReceivablesCostOutputs,
} from "@/sectorcalc/formulas/pro-v531/receivables-cost-payment-term-addendum.formula";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/receivables-cost-tool.css";

const TOOL_KEY = "receivables-cost-payment-term-addendum";
const BYPASS_SESSION_ID = "bypass-unlimited";
const SECONDS_PER_DAY = 86400;

const CURRENCIES: Array<{ code: string; sym: string }> = [
  { code: "EUR", sym: "€" }, { code: "USD", sym: "$" }, { code: "GBP", sym: "£" },
  { code: "TRY", sym: "₺" }, { code: "JPY", sym: "¥JP" }, { code: "CNY", sym: "¥CN" },
  { code: "CHF", sym: "CHF" }, { code: "SEK", sym: "kr" }, { code: "AUD", sym: "A$" },
  { code: "CAD", sym: "C$" }, { code: "INR", sym: "₹" }, { code: "AED", sym: "AED" },
];

type Dom = "cur" | "pct" | "num";
interface UnitOption { k: string; f: number; l: string }
interface FieldDef {
  ev: keyof ReceivablesCostInputs;
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
// average_collection_days' schema canonical base_unit is SECONDS (verified
// this session, PR #60) despite its "days" label — the units array converts
// display days/months directly to canonical seconds via the factor, so no
// special-casing is needed anywhere else in this file.
const FIELDS: Record<string, FieldDef> = {
  average_receivable_balance: { ev: "averageReceivableBalance", dom: "cur", label: "Average receivable balance",        def: 450000,  hard: [0, 5e8], ref: [20000, 5000000],   refUnit: "", hint: "Average outstanding accounts-receivable balance.", src: "AR aging report", grp: 1 },
  annual_interest_rate:        { ev: "annualInterestRate",        dom: "pct", label: "Cost of capital / interest rate",  def: 8,       hard: [0, 100], ref: [4, 15],             refUnit: "%", hint: "What it costs to have this cash tied up instead of available.", src: "finance policy", grp: 1 },
  average_collection_days:     { ev: "averageCollectionDays",     dom: "num", label: "Average collection period (DSO)", def: 52,      hard: [0, 3650],ref: [30, 75],            refUnit: "days", hint: "Days Sales Outstanding — how long invoices take to collect.", src: "AR aging report", grp: 2,
                                units: [{ k: "day", f: SECONDS_PER_DAY, l: "days" }, { k: "mo", f: 30 * SECONDS_PER_DAY, l: "months" }] },
  invoice_volume:               { ev: "invoiceVolume",               dom: "cur", label: "Annual invoice volume",          def: 3200000, hard: [0, 5e9], ref: [100000, 50000000], refUnit: "/yr", hint: "Total annual invoiced revenue.", src: "revenue ledger", grp: 2 },
  source_confidence_ratio:     { ev: "sourceConfidence",           dom: "pct", label: "Source confidence",               def: 85,      hard: [0, 100], ref: [70, 100],           refUnit: "%", hint: "How verified are these figures?", src: "engineer's own assessment", grp: 1 },
};
const GROUPS: Record<number, { n: string; t: string; d: string }> = {
  1: { n: "01", t: "The receivables position", d: "What's outstanding, and what it costs to carry it." },
  2: { n: "02", t: "Collection performance", d: "How long it takes to collect, and against how much revenue." },
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
function boundValue(f: FieldDef, raw: number, canon: number): number { return f.dom === "pct" ? raw : canon; }
function refCheck(f: FieldDef, canon: number): boolean {
  if (!f.units) {
    const lo = f.dom === "pct" ? f.ref[0] / 100 : f.ref[0];
    const hi = f.dom === "pct" ? f.ref[1] / 100 : f.ref[1];
    return canon < lo || canon > hi;
  }
  const primary = f.units[0];
  const inPrimary = canon / primary.f;
  return inPrimary < f.ref[0] || inPrimary > f.ref[1];
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

const CCOL = { pos: "#2E6B4E", neg: "#9C3520", ink: "#181713", faint: "#8C887E", line: "#E4E0D6", accent: "#C15F3C", warn2: "#8A5A12" };
function svgOpen(w: number, h: number) { return `<svg class="rcpt-chart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`; }

function chartConsistency(x: ReceivablesCostInputs, o: ReceivablesCostOutputs, curSym: string): string {
  const w = 680, h = 130, padL = 190, padR = 90, padT = 14, rowH = 30, gap = 14;
  const data = [
    { n: "Stated AR balance", v: x.averageReceivableBalance, col: CCOL.accent },
    { n: "AR implied by DSO & revenue", v: o.out_implied_ar_from_dso, col: CCOL.faint },
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

function chartDsoReduction(o: ReceivablesCostOutputs, curSym: string): string {
  const w = 680, h = 220, padL = 74, padR = 20, padT = 16, padB = 34;
  const maxDays = 30;
  const pts: Array<{ days: number; saving: number }> = [];
  for (let d = 0; d <= maxDays; d += 2) pts.push({ days: d, saving: o.out_savings_per_day_dso_reduction * d });
  const maxSaving = Math.max(...pts.map((p) => p.saving), 1);
  const X = (d: number) => padL + (w - padL - padR) * (d / maxDays);
  const Y = (v: number) => padT + (h - padT - padB) * (1 - v / maxSaving);
  let s = svgOpen(w, h);
  for (let g = 0; g <= 5; g++) {
    const dv = (maxDays * g) / 5;
    s += `<text x="${X(dv)}" y="${h - padB + 18}" text-anchor="middle" fill="${CCOL.faint}" font-size="10">${dv.toFixed(0)}d</text>`;
  }
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${X(p.days).toFixed(1)},${Y(p.saving).toFixed(1)}`).join(" ");
  s += `<path d="${path}" fill="none" stroke="${CCOL.accent}" stroke-width="2.4"/>`;
  s += `<text x="${padL - 8}" y="${Y(0) + 4}" text-anchor="end" fill="${CCOL.faint}" font-size="10">${curSym}0</text>`;
  s += `<text x="${padL - 8}" y="${Y(maxSaving) + 4}" text-anchor="end" fill="${CCOL.faint}" font-size="10">${curSym}${fmt(maxSaving)}</text>`;
  return s + "</svg>";
}

interface Insight { sev: "opp" | "info" | "crit"; t: string; msg: string }
function buildInsights(x: ReceivablesCostInputs, o: ReceivablesCostOutputs, curSym: string): Insight[] {
  const out: Insight[] = [];
  const fmtMoney = (v: number) => curSym + fmt(v);
  if (o.out_verdict === 2) {
    out.push({ sev: "crit", t: "recommendation",
      msg: `Financing cost is <strong>${(o.out_financing_cost_pct_of_revenue * 100).toFixed(2)}%</strong> of revenue — a material drag. Tighten collection terms or price the credit cost into your quotes.` });
  } else if (o.out_verdict === 1) {
    out.push({ sev: "info", t: "recommendation",
      msg: `Financing cost is <strong>${(o.out_financing_cost_pct_of_revenue * 100).toFixed(2)}%</strong> of revenue — moderate. Worth watching, not yet urgent.` });
  } else {
    out.push({ sev: "opp", t: "recommendation",
      msg: `Financing cost of <strong>${(o.out_financing_cost_pct_of_revenue * 100).toFixed(2)}%</strong> of revenue is within a normal range — no repricing needed on payment terms alone.` });
  }
  out.push({ sev: "info", t: "annual carrying cost",
    msg: `Carrying this receivables balance costs <strong>${fmtMoney(o.out_carrying_cost)}/yr</strong> at the stated cost of capital.` });
  if (o.out_ar_consistency_gap_pct > 0.15)
    out.push({ sev: "crit", t: "AR consistency check",
      msg: `The stated AR balance and the balance implied by DSO × revenue disagree by <strong>${(o.out_ar_consistency_gap_pct * 100).toFixed(1)}%</strong>. Double-check the DSO and revenue figures before trusting this cost number.` });
  else
    out.push({ sev: "info", t: "AR consistency check",
      msg: `The stated AR balance and the DSO-implied balance agree within <strong>${(o.out_ar_consistency_gap_pct * 100).toFixed(1)}%</strong> — the inputs are internally consistent.` });
  out.push({ sev: "info", t: "value of tightening terms",
    msg: `Every day shaved off the collection period is worth <strong>${fmtMoney(o.out_savings_per_day_dso_reduction)}/yr</strong> in reduced financing cost.` });
  return out;
}

interface ServerSeal { output_hash?: string; input_hash?: string; schema_hash?: string; hash_algorithm?: string; executed_at?: string }
interface ServerResultState { outputs: Record<string, number>; seal: ServerSeal; inputs: ReceivablesCostInputs; currency: string }

export default function ReceivablesCostToolPage() {
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

  const collectedInputs = useMemo((): ReceivablesCostInputs | null => {
    const o: Partial<ReceivablesCostInputs> = {};
    for (const [id, st] of Object.entries(fieldStates)) {
      if (st.error || st.canon == null) return null;
      (o as Record<string, number>)[FIELDS[id].ev] = st.canon;
    }
    return o as ReceivablesCostInputs;
  }, [fieldStates]);

  const engineResult = useMemo((): ReceivablesCostOutputs | null => {
    if (!collectedInputs) return null;
    try { return executeFormula(collectedInputs); } catch { return null; }
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
        "out_carrying_cost", "out_financing_cost_pct_of_revenue", "out_implied_ar_from_dso",
        "out_ar_consistency_gap_pct", "out_collection_days", "out_savings_per_day_dso_reduction",
        "out_money_at_risk", "out_verdict", "out_evidence_completeness",
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
  const verdictLabel = ["normal", "moderate", "material drag"];

  const renderField = (id: string) => {
    const f = FIELDS[id];
    const st = fieldStates[id];
    const cls = st.error ? "rcpt-bad" : st.warn ? "rcpt-warn" : "";
    const msg = st.error ? st.error : st.warn ? `Outside typical industry range (${fmtRef(f, curSym)}). Value accepted — flagged for review.` : "";
    const msgCls = st.error ? "rcpt-err" : st.warn ? "rcpt-warn" : "";
    const msgId = `ms_${id}`;
    const canonUnitLabel = f.units ? ` ${f.units[0].l}` : "";
    const canonDisplay = f.units ? (st.canon != null ? fromCanon(f, st.canon, f.units[0].k) : null) : (f.dom === "pct" ? (st.canon ?? 0) * 100 : st.canon);
    const canonTxt = st.error ? "" : `= ${f.dom === "cur" ? curSym : ""}${fmt(canonDisplay)}${canonUnitLabel}`;
    return (
      <div className="rcpt-f" key={id}>
        <div className="rcpt-f-top">
          <label htmlFor={`in_${id}`}>{f.label}</label>
          <span className="rcpt-unitline">{canonTxt}</span>
        </div>
        <div className={`rcpt-control ${cls}`}>
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
          {f.dom === "cur" && <span className="rcpt-prefix">{curSym}{f.refUnit ? <em className="rcpt-prefix-unit">{f.refUnit}</em> : null}</span>}
          {f.dom === "pct" && <span className="rcpt-prefix" style={{ borderLeft: "1px solid var(--rcpt-line)", borderRight: "none" }}>%</span>}
          {f.units && (
            <select
              aria-label={`Unit for ${f.label}`}
              value={st.unit}
              onChange={(e) => updateFieldUnit(id, e.target.value)}
              style={{ borderLeft: "1px solid var(--rcpt-line)", background: "var(--rcpt-panel)", fontFamily: "var(--rcpt-mono)", fontSize: "14px", padding: "8px", minHeight: "48px", color: "var(--rcpt-ink)" }}
            >
              {f.units.map((u) => <option key={u.k} value={u.k}>{u.l}</option>)}
            </select>
          )}
        </div>
        <div className="rcpt-f-foot">
          <span className="rcpt-hint">{f.hint} <em style={{ fontStyle: "normal", color: "var(--rcpt-faint)" }}>· {f.src}</em></span>
          <span className="rcpt-bench-ref">{fmtRef(f, curSym)}</span>
        </div>
        {msg && <div id={msgId} className={`rcpt-msg ${msgCls}`} role={st.error ? "alert" : "status"}>{msg}</div>}
      </div>
    );
  };

  const renderReport = () => {
    if (!serverResult) return null;
    const s = serverResult.outputs;
    const sealed: ReceivablesCostOutputs = {
      out_carrying_cost: s.out_carrying_cost,
      out_financing_cost_pct_of_revenue: s.out_financing_cost_pct_of_revenue,
      out_implied_ar_from_dso: s.out_implied_ar_from_dso,
      out_ar_consistency_gap_pct: s.out_ar_consistency_gap_pct,
      out_collection_days: s.out_collection_days,
      out_savings_per_day_dso_reduction: s.out_savings_per_day_dso_reduction,
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
      <div className="rcpt-report" ref={reportRef}>
        <div className="rcpt-rep-mast">
          <h2>Receivables Cost / Payment Term Addendum — proof report</h2>
          <div className="rcpt-rid">
            SC-PRO-RCPT · {new Date().toISOString().slice(0, 10)}<br />
            engine v5.3.2-domain · DSO-consistency-checked carrying cost<br />
            currency {repCur}
          </div>
        </div>
        <div className="rcpt-rep-body">
          <div className="rcpt-sec">
            <div className={`rcpt-verdict-box rcpt-verdict-${sealed.out_verdict}`}>
              <div className="rcpt-head">Financing cost: {verdictLabel[sealed.out_verdict]}.</div>
              <p>Carrying <strong>{fmtMoney(rx.averageReceivableBalance)}</strong> in receivables at <strong>{(rx.annualInterestRate * 100).toFixed(1)}%</strong> costs <strong>{fmtMoney(sealed.out_carrying_cost)}/yr</strong> — {(sealed.out_financing_cost_pct_of_revenue * 100).toFixed(2)}% of annual revenue.</p>
              <p>DSO is <strong>{sealed.out_collection_days.toFixed(0)} days</strong>. Every day shaved off is worth <strong>{fmtMoney(sealed.out_savings_per_day_dso_reduction)}/yr</strong>.</p>
            </div>
          </div>

          <div className="rcpt-sec">
            <div className="rcpt-sec-h"><span className="rcpt-sec-n">1</span><span className="rcpt-sec-t">AR consistency check</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartConsistency(rx, sealed, repCur) }} />
            <div className="rcpt-note">The stated balance vs. what DSO × annual revenue / 365 implies — a data-quality cross-check, not a second cost figure.</div>
          </div>

          <div className="rcpt-sec">
            <div className="rcpt-sec-h"><span className="rcpt-sec-n">2</span><span className="rcpt-sec-t">Value of tightening collection terms</span></div>
            <div dangerouslySetInnerHTML={{ __html: chartDsoReduction(sealed, repCur) }} />
            <div className="rcpt-note">Annual financing-cost saving from reducing DSO by up to 30 days.</div>
          </div>

          <div className="rcpt-sec">
            <div className="rcpt-sec-h"><span className="rcpt-sec-n">3</span><span className="rcpt-sec-t">Engineering insights</span></div>
            {ins.map((i, k) => (
              <div className={`rcpt-ins rcpt-${i.sev}`} key={k}>
                <span className="rcpt-t">{i.t}</span>
                <span dangerouslySetInnerHTML={{ __html: i.msg }} />
              </div>
            ))}
          </div>

          <div className="rcpt-seal">
            SEAL · {serverResult.seal.hash_algorithm} {seal}<br />
            Sealed server-side at {serverResult.seal.executed_at ?? "—"}.
          </div>
          <button
            type="button"
            className="rcpt-print-btn"
            onClick={() => window.print()}
            aria-label="Download this report as a PDF"
          >
            Download PDF
          </button>
          <div className="rcpt-disc">
            Technical simulation only; not financial, legal, or engineering advice. Users must verify results before making business decisions.
          </div>
          <PremiumReportFeedback
            key={serverResult.seal.output_hash}
            schemaSlug={TOOL_KEY}
            sectorSlug="finance"
            reportSlug={serverResult.seal.output_hash}
            inputSnapshot={{
              average_receivable_balance: rx.averageReceivableBalance, annual_interest_rate: rx.annualInterestRate,
              average_collection_days: rx.averageCollectionDays, invoice_volume: rx.invoiceVolume,
              source_confidence_ratio: rx.sourceConfidence,
            }}
            resultSnapshot={s}
            currency={repCur}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="rcpt-shell">
      <div className="rcpt-mast">
        <div className="rcpt-kicker">SectorCalc PRO · Working Capital · Financing cost decision</div>
        <h1>Receivables Cost / Payment Term Addendum</h1>
        <p className="rcpt-lede">What it actually costs to carry your accounts receivable, cross-checked against DSO and revenue for internal consistency — plus the real value of collecting faster.</p>
        <div className="rcpt-meta">
          <span>Engine <b>v5.3.2-domain</b></span>
          <span>Method <b>DSO-consistency-checked carrying cost</b></span>
          <span>Report <b>sealed · SHA-256</b></span>
        </div>
        <div className="rcpt-curbar">
          <label htmlFor="rcpt-curSel">Report currency</label>
          <select id="rcpt-curSel" value={curSym} onChange={(e) => setCurSym(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="rcpt-curnote">Symbol only — no exchange-rate conversion. Enter every figure in the same currency.</span>
        </div>
      </div>

      <div className="rcpt-bench">
        <div className="rcpt-form-col">
          {[1, 2].map((g) => (
            <div className="rcpt-grp" key={g}>
              <div className="rcpt-grp-h"><span className="rcpt-grp-n">{GROUPS[g].n}</span><span className="rcpt-grp-t">{GROUPS[g].t}</span></div>
              <div className="rcpt-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter((id) => FIELDS[id].grp === g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="rcpt-rail">
          <div className="rcpt-rail-in">
            <div className="rcpt-verdict">
              <div className={`rcpt-verdict-band ${r ? ["rcpt-pos", "rcpt-warn2", "rcpt-neg"][r.out_verdict] : "rcpt-warn2"}`}>
                {r ? verdictLabel[r.out_verdict] : "incomplete"}
              </div>
              <div className="rcpt-verdict-body">
                <div className="rcpt-big">{r ? <>{curSym}{fmt(r.out_carrying_cost)} <small>/yr</small></> : "—"}</div>
                <div className="rcpt-big-cap">
                  {r
                    ? `${(r.out_financing_cost_pct_of_revenue * 100).toFixed(2)}% of revenue · DSO ${r.out_collection_days.toFixed(0)}d`
                    : errorCount ? `${errorCount} input(s) need attention` : "enter receivables data to begin"}
                </div>
              </div>
            </div>
            <div className="rcpt-stat"><span>AR implied by DSO</span><b>{r ? curSym + fmt(r.out_implied_ar_from_dso) : "—"}</b></div>
            <div className="rcpt-stat"><span>Consistency gap</span><b>{r ? (r.out_ar_consistency_gap_pct * 100).toFixed(1) + "%" : "—"}</b></div>
            <div className="rcpt-stat"><span>Savings / day of DSO cut</span><b>{r ? curSym + fmt(r.out_savings_per_day_dso_reduction) : "—"}</b></div>

            {!usageSessionId ? (
              <button className="rcpt-cta" disabled={sessionLoading || !canGenerate} onClick={requestSession}>
                {sessionLoading ? "Checking credits…" : "Unlock sealed report · 1 credit"}
              </button>
            ) : (
              <button className="rcpt-cta" disabled={!canGenerate || isExecuting} onClick={handleGenerate}>
                {isExecuting ? "Generating…" : "Generate sealed report"}
              </button>
            )}
            {remainingRuns != null && usageSessionId !== BYPASS_SESSION_ID && (
              <div className="rcpt-conf">{remainingRuns} run(s) remaining this session.</div>
            )}
            {sessionError && <div className="rcpt-conf" style={{ color: "var(--rcpt-neg)" }}>{sessionError}</div>}
            {executeError && <div className="rcpt-conf" style={{ color: "var(--rcpt-neg)" }}>{executeError}</div>}
            <div className="rcpt-conf">
              <span className="rcpt-d" style={{ background: r ? ["var(--rcpt-pos)", "var(--rcpt-warn2)", "var(--rcpt-neg)"][r.out_verdict] : "var(--rcpt-warn2)" }} />
              <span>{r ? `Inputs consistent · ${verdictLabel[r.out_verdict]}` : errorCount ? "Fix highlighted inputs." : "Enter inputs to compute."}</span>
            </div>
          </div>
        </div>
      </div>

      {serverResult && renderReport()}
    </div>
  );
}
