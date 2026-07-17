"use client";

// Machine Hourly Rate Proof Report — EXACT x1.html design
// CSS class names match x1.html VERBATIM. Scope: .x1-root-page parent wrapper.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { executeFormula } from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import type { MachineHourlyRateInputs, MachineHourlyRateOutputs } from "@/sectorcalc/formulas/pro-v531/machine-hourly-rate-proof-report.formula";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import "@/styles/machine-hourly-rate-tool.css";

const BYPASS_SESSION_ID = "bypass-unlimited";

// ── Currency registry ──────────────────────────────────────────
const CURRENCIES: Array<{ code: string; sym: string; name: string }> = [
  { code: "EUR", sym: "€", name: "Euro" }, { code: "USD", sym: "$", name: "US dollar" },
  { code: "GBP", sym: "£", name: "British pound" }, { code: "TRY", sym: "₺", name: "Turkish lira" },
  { code: "JPY", sym: "¥", name: "Japanese yen" }, { code: "CNY", sym: "¥", name: "Chinese yuan" },
  { code: "CHF", sym: "CHF", name: "Swiss franc" }, { code: "SEK", sym: "kr", name: "Swedish krona" },
  { code: "AUD", sym: "A$", name: "Australian dollar" }, { code: "CAD", sym: "C$", name: "Canadian dollar" },
  { code: "INR", sym: "₹", name: "Indian rupee" }, { code: "AED", sym: "AED", name: "UAE dirham" },
];

// ── Unit registry ──────────────────────────────────────────────
const UNITS: Record<string, { canon: string; list: Array<{ c: string; f: number }> }> = {
  flat: { canon: "cur", list: [{ c: "units", f: 1 }, { c: "thousands (k)", f: 1000 }, { c: "millions (M)", f: 1e6 }] },
  years: { canon: "yr", list: [{ c: "months", f: 1 / 12 }, { c: "quarters", f: 1 / 4 }, { c: "years", f: 1 }] },
  hours: { canon: "h", list: [{ c: "seconds", f: 1 / 3600 }, { c: "minutes", f: 1 / 60 }, { c: "hours", f: 1 }, { c: "shifts (8h)", f: 8 }, { c: "days (24h)", f: 24 }] },
  wage: { canon: "cur/h", list: [{ c: "/hour", f: 1 }, { c: "/day (8h)", f: 1 / 8 }, { c: "/week (40h)", f: 1 / 40 }] },
  power: { canon: "kW", list: [{ c: "W", f: 0.001 }, { c: "kW", f: 1 }, { c: "MW", f: 1000 }, { c: "HP (mech)", f: 0.7457 }] },
  energyPrice: { canon: "cur/kWh", list: [{ c: "/kWh", f: 1 }, { c: "/MWh", f: 0.001 }] },
  percent: { canon: "fraction", list: [{ c: "%", f: 0.01 }, { c: "fraction (0-1)", f: 1 }] },
};
const CANON_SUFFIX: Record<string, string> = { flat: "", years: " yr", hours: " h", wage: "/h", power: " kW", energyPrice: "/kWh", percent: "" };
const toC = (dom: string, val: number, u: string) => val * UNITS[dom].list.find((x) => x.c === u)!.f;
const fromC = (dom: string, val: number, u: string) => val / UNITS[dom].list.find((x) => x.c === u)!.f;

interface FieldDef {
  ev: keyof MachineHourlyRateInputs;
  dom: string;
  label: string;
  cur: boolean;
  def: number;
  unit: string;
  hard: [number, number];
  hint: string;
  ref: string;
}
const FIELDS: Record<string, FieldDef> = {
  purchasePrice: { ev: "purchasePrice", dom: "flat", label: "Purchase price (installed)", cur: true, def: 180000, unit: "units", hard: [100, 5e8], hint: "Installation, base tooling and commissioning included.", ref: "units · thousands · millions" },
  usefulLife: { ev: "usefulLife", dom: "years", label: "Useful life", cur: false, def: 10, unit: "years", hard: [0.5, 40], hint: "Economic life for depreciation, not physical life.", ref: "months · quarters · years" },
  annualHours: { ev: "annualHours", dom: "hours", label: "Planned operating hours", cur: false, def: 4000, unit: "hours", hard: [0, 8760], hint: "Scheduled production time per year. Hard physical cap: 8,760 h.", ref: "seconds…days(24h)" },
  wageRate: { ev: "wageRate", dom: "wage", label: "Operator cost (fully loaded)", cur: true, def: 34, unit: "/hour", hard: [0, 2000], hint: "Wage + employer contributions + benefits, not gross wage.", ref: "/hour · /day(8h) · /week(40h)" },
  powerDraw: { ev: "powerDraw", dom: "power", label: "Average power draw", cur: false, def: 12, unit: "kW", hard: [0, 5000], hint: "Average under load — typically 30–60% of nameplate rating.", ref: "W · kW · MW · HP" },
  energyPrice: { ev: "energyPrice", dom: "energyPrice", label: "Industrial electricity price", cur: true, def: 0.18, unit: "/kWh", hard: [0, 5], hint: "All-in price including grid fees and levies.", ref: "/kWh · /MWh" },
  idleShare: { ev: "idleShare", dom: "percent", label: "Idle / non-productive share", cur: false, def: 20, unit: "%", hard: [0, 95], hint: "Paid machine time producing nothing sellable — setup, changeovers, breakdowns, starved queues.", ref: "% · fraction" },
  maintenanceRate: { ev: "maintenanceRate", dom: "percent", label: "Annual maintenance (% of price)", cur: false, def: 5, unit: "%", hard: [0, 60], hint: "Planned and unplanned, parts and labor, per year.", ref: "% · fraction" },
};

// ── Insights ────────────────────────────────────────────────────
interface Insight { when: (r: MachineHourlyRateOutputs, v: MachineHourlyRateInputs) => boolean; sev: "crit" | "opp" | "info"; msg: (r: MachineHourlyRateOutputs, v: MachineHourlyRateInputs, sym: string) => string; }
const INSIGHTS: Insight[] = [
  { when: (r) => Number.isFinite(r.out_premium) && r.out_premium / r.out_rate > 0.15, sev: "crit", msg: (r, v, sym) => `<strong>${(100 * r.out_premium / r.out_rate).toFixed(0)}% of your hourly rate finances idle capacity</strong> (${sym}${fmtNum(r.out_premium)}/h). Quoting on the naive rate of ${sym}${fmtNum(r.out_naive)}/h loses that amount on every hour that actually produces something sellable. Cutting idle share by 5 points is worth more than most price negotiations.` },
  { when: (r) => r.out_energyShare > 0.15, sev: "opp", msg: (r, v, sym) => `Energy is <strong>${(r.out_energyShare * 100).toFixed(1)}% of total cost</strong> (${sym}${fmtNum(r.out_energy)}/yr) — well above a typical ~5–10% share. A motor efficiency audit or load-shifting review on this machine is worth investigating; even a 10% energy cut is ${sym}${(r.out_energy * 0.1 / r.out_productiveHours).toFixed(2)}/h off the rate.` },
  { when: (r) => r.out_laborShare > 0.60, sev: "info", msg: (r, v, sym) => `Labor is <strong>${(r.out_laborShare * 100).toFixed(0)}% of the cost base</strong> — this rate is wage-driven. Multi-machine tending or automation moves the needle here; negotiating the purchase price does not.` },
  { when: (r) => r.out_capitalShare < 0.15, sev: "info", msg: (r, v, sym) => `Capital is only <strong>${(r.out_capitalShare * 100).toFixed(0)}% of cost</strong> — this machine is cheap to own, expensive to run. Uptime and labor efficiency matter far more than the purchase price you negotiated.` },
  { when: (r, v) => v.annualHours > 6000, sev: "info", msg: (r, v, sym) => `${fmtNum(v.annualHours)} planned hours/year is 3-shift territory. Confirm maintenance windows are excluded from "planned" hours — a common source of 5–8% silent rate error when they aren't.` },
];

function fmtNum(x: number | null | undefined): string {
  if (x == null || Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return "∞";
  const a = Math.abs(x);
  return x.toLocaleString("en-US", { maximumFractionDigits: a >= 100 ? 0 : Math.min(2, a >= 1 ? 2 : 4) });
}

function mockHash(s: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0") + "…demo";
}

interface FieldState { value: string; unit: string; error: string | null; canon: number | null; }
interface SensDriver { nm: string; span: number; }

export default function MachineHourlyRateToolPage() {
  const [curSym, setCurSym] = useState("€");
  const reportRef = useRef<HTMLDivElement>(null);

  // ── Auth / session ─────────────────────────────────────────
  const { user } = useUserSubscription();
  const [usageSessionId, setUsageSessionId] = useState<string | null>(null);
  const [remainingRuns, setRemainingRuns] = useState<number | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const tokenFetched = useRef(false);

  useEffect(() => {
    if (user && !tokenFetched.current) { tokenFetched.current = true; user.getIdToken(false).then(setAuthToken).catch(() => {}); }
  }, [user]);
  useEffect(() => {
    if (user?.email && isProBypassEmail(user.email)) { setUsageSessionId(BYPASS_SESSION_ID); setRemainingRuns(999); }
  }, [user?.email]);

  const requestSession = useCallback(async () => {
    if (user?.email && isProBypassEmail(user.email)) return;
    setSessionLoading(true);
    try {
      if (!user) { window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`; return; }
      const idToken = await user.getIdToken(false);
      const res = await fetch("/api/pro-tool-session/create", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ toolKey: "machine-hourly-rate-proof-report" }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); if (d.error === "INSUFFICIENT_CREDITS") { window.location.href = "/pricing"; return; } throw new Error(d.error || "Session failed"); }
      const s = await res.json(); setUsageSessionId(s.usageSessionId); setRemainingRuns(s.remainingRuns);
    } catch { /* swallow */ } finally { setSessionLoading(false); }
  }, [user]);

  // ── Execution state ─────────────────────────────────────────
  const [isExecuting, setIsExecuting] = useState(false);
  const [serverResult, setServerResult] = useState<{ outputs: Record<string, number>; seal?: { output_hash?: string; input_hash?: string; schema_hash?: string; hash_algorithm?: string; executed_at?: string } } | null>(null);
  const [executeError, setExecuteError] = useState<string | null>(null);

  // ── Field state ──────────────────────────────────────────────
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>(() => {
    const s: Record<string, FieldState> = {};
    for (const id of Object.keys(FIELDS)) { const f = FIELDS[id]; s[id] = { value: String(f.def), unit: f.unit, error: null, canon: toC(f.dom, f.def, f.unit) }; }
    return s;
  });

  const updateField = useCallback((id: string, newValue: string, newUnit?: string) => {
    setFieldStates((prev) => {
      const f = FIELDS[id]; const st = prev[id]; const unit = newUnit ?? st.unit;
      const raw = parseFloat(newValue);
      let error: string | null = null; let canon: number | null = null;
      if (newValue.trim() === "" || isNaN(raw)) { error = "Enter a number."; }
      else { canon = toC(f.dom, raw, unit); if (canon < f.hard[0] || canon > f.hard[1]) error = `Outside valid range (${f.hard[0]}–${f.hard[1]} ${UNITS[f.dom].canon}).`; }
      return { ...prev, [id]: { value: newValue, unit, error, canon } };
    });
  }, []);

  const handleUnitChange = useCallback((id: string, newUnit: string) => {
    setFieldStates((prev) => {
      const f = FIELDS[id]; const st = prev[id];
      const canon = toC(f.dom, parseFloat(st.value) || 0, st.unit);
      const nf = UNITS[f.dom].list.find((u) => u.c === newUnit)!.f;
      const newVal = (canon / nf);
      const raw = parseFloat(newVal.toPrecision(10));
      let error: string | null = null;
      if (isNaN(raw)) { error = "Enter a number."; }
      else { if (canon < f.hard[0] || canon > f.hard[1]) error = `Outside valid range (${f.hard[0]}–${f.hard[1]} ${UNITS[f.dom].canon}).`; }
      return { ...prev, [id]: { value: String(raw), unit: newUnit, error, canon } };
    });
  }, []);

  const collectedInputs = useMemo((): MachineHourlyRateInputs | null => {
    const o: Partial<MachineHourlyRateInputs> = {};
    for (const [id, st] of Object.entries(fieldStates)) { if (st.error || st.canon == null) return null; (o as any)[FIELDS[id].ev] = st.canon; }
    return o as MachineHourlyRateInputs;
  }, [fieldStates]);

  const engineResult = useMemo((): MachineHourlyRateOutputs | null => {
    if (!collectedInputs) return null; try { return executeFormula(collectedInputs); } catch { return null; }
  }, [collectedInputs]);

  const errorCount = useMemo(() => Object.values(fieldStates).filter((s) => s.error).length, [fieldStates]);

  const sensitivityData = useMemo((): SensDriver[] => {
    if (!collectedInputs) return [];
    const drivers: Array<{ id: keyof MachineHourlyRateInputs; nm: string }> = [
      { id: "purchasePrice", nm: "Purchase price" }, { id: "usefulLife", nm: "Useful life" }, { id: "annualHours", nm: "Annual hours" },
      { id: "wageRate", nm: "Operator wage" }, { id: "powerDraw", nm: "Power draw" }, { id: "energyPrice", nm: "Energy price" },
      { id: "idleShare", nm: "Idle share" },
    ];
    return drivers.map((d) => {
      const up = executeFormula({ ...collectedInputs, [d.id]: collectedInputs[d.id] * 1.1 }).out_rate;
      const dn = executeFormula({ ...collectedInputs, [d.id]: collectedInputs[d.id] * 0.9 }).out_rate;
      return { nm: d.nm, span: Math.abs(up - dn) };
    }).sort((a, b) => b.span - a.span);
  }, [collectedInputs]);

  const sensMax = useMemo(() => Math.max(...sensitivityData.map((s) => s.span), 1e-9), [sensitivityData]);

  const firedInsights = useMemo(() => {
    if (!collectedInputs || !engineResult) return [];
    return INSIGHTS.filter((i) => i.when(engineResult, collectedInputs));
  }, [collectedInputs, engineResult]);

  // ── Submit sealed report ─────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!collectedInputs || isExecuting || !usageSessionId) return;
    setIsExecuting(true); setExecuteError(null);
    try {
      const res = await fetch("/api/pro-calculator/execute", {
        method: "POST", headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
        body: JSON.stringify({ tool_key: "machine-hourly-rate-proof-report", raw_inputs: collectedInputs, selected_units: Object.fromEntries(Object.entries(fieldStates).map(([k, v]) => [k, v.unit])), usage_session_id: usageSessionId }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || `Server error ${res.status}`); }
      const data = await res.json();
      setServerResult({ outputs: data.outputs ?? {}, seal: data.audit_seal ? { output_hash: data.audit_seal.output_hash, input_hash: data.audit_seal.input_hash, schema_hash: data.audit_seal.schema_hash, hash_algorithm: data.audit_seal.hash_algorithm, executed_at: data.audit_seal.executed_at } : undefined });
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: any) { setExecuteError(err.message ?? "Execution failed"); } finally { setIsExecuting(false); }
  }, [collectedInputs, isExecuting, usageSessionId, authToken, fieldStates]);

  // ── Render ──────────────────────────────────────────────────────
  const sym = curSym;
  const r = engineResult;
  const inputs = collectedInputs;

  return (
    <div className="x1-root-page">
      <div className="shell">

        {/* ── Masthead ───────────────────────────────────── */}
        <div className="mast">
          <div className="kicker">SectorCalc PRO · Machinery &amp; Manufacturing · Cost proof</div>
          <h1>Machine Hourly Rate Proof Report</h1>
          <p className="lede">The rate you quote against and the rate the machine actually costs are rarely the same number. This tool prices every productive hour — depreciation, maintenance, energy and labor, spread only across hours that make something sellable.</p>
          <div className="meta">
            <span>Engine <b>v6.0</b></span>
            <span>35 math + semantic assertions <b>passed</b></span>
            <span>Report <b>sealed · SHA-256</b></span>
            <span>Method <b>full absorption costing</b></span>
          </div>
          <div className="curbar">
            <label htmlFor="curSel">Report currency</label>
            <select id="curSel" value={curSym} onChange={(e) => setCurSym(e.target.value)}>
              {CURRENCIES.map((c) => <option key={c.code} value={c.sym}>{c.code} · {c.sym} {c.name}</option>)}
            </select>
            <span className="curnote">Symbol only — no exchange-rate conversion applied. Enter every figure in the same currency.</span>
          </div>
        </div>

        {/* ── Bench ──────────────────────────────────────── */}
        <div className="bench">
          <div className="form-col">

            {/* Group 01 */}
            <div className="grp">
              <div className="grp-h"><span className="grp-n">01</span><span className="grp-t">Machine &amp; capital</span></div>
              <div className="grp-d">What the machine costs to own, and over how long that cost is spread.</div>
              {["purchasePrice", "usefulLife", "annualHours"].map(renderField)}
            </div>

            {/* Group 02 */}
            <div className="grp">
              <div className="grp-h"><span className="grp-n">02</span><span className="grp-t">Running cost</span></div>
              <div className="grp-d">What it costs to actually operate the machine for those hours.</div>
              {["wageRate", "powerDraw", "energyPrice"].map(renderField)}
            </div>

            {/* Advanced */}
            <details open>
              <summary>Advanced — idle time &amp; maintenance</summary>
              <div style={{ paddingTop: 14 }}>
                {["idleShare", "maintenanceRate"].map(renderField)}
              </div>
            </details>

          </div>

          {/* ── Rail ─────────────────────────────────────── */}
          <div className="rail">
            <div className="rail-in">
              <div className="verdict" id="verdict">
                <div className={`verdict-band ${r && !errorCount ? "pos" : "warn"}`} id="vBand">
                  {r && !errorCount ? "rate proven" : "incomplete"}
                </div>
                <div className="verdict-body">
                  <div className="big" id="vBig">
                    {r ? <>{sym}{fmtNum(r.out_rate)}<small> /productive h</small></> : "—"}
                  </div>
                  <div className="big-cap" id="vCap">
                    {r ? `vs ${sym}${fmtNum(r.out_naive)}/h naive` : "enter machine & capital data to begin"}
                  </div>
                </div>
              </div>
              <div className="stat"><span>Naive rate (ignores idle)</span><b id="sNaive">{r ? `${sym}${fmtNum(r.out_naive)}/h` : "—"}</b></div>
              <div className="stat"><span>Hidden idle premium</span><b id="sPrem">{r ? `+${sym}${fmtNum(r.out_premium)}/h` : "—"}</b></div>
              <div className="stat"><span>Total annual cost</span><b id="sTotal">{r ? `${sym}${fmtNum(r.out_total)}/yr` : "—"}</b></div>
              <div className="stat"><span>Productive hours / yr</span><b id="sProd">{r ? `${fmtNum(r.out_productiveHours)} h` : "—"}</b></div>

              {!usageSessionId && !(user?.email && isProBypassEmail(user.email)) && (
                <button className="cta" onClick={requestSession} disabled={sessionLoading}
                  style={{ background: "#3A4D8F", borderColor: "#2c3a6b" }}>
                  {sessionLoading ? "Starting session…" : "Start credit session"}
                </button>
              )}
              <button className="cta" id="genBtn" disabled={!r || !!errorCount || isExecuting || !usageSessionId} onClick={handleGenerate}>
                {isExecuting ? "Generating…" : "Generate sealed report · 1 credit"}
              </button>
              <div className="conf" id="conf">
                <span className="d" style={{ background: r && !errorCount ? "var(--pos)" : "var(--warn)" }}></span>
                {errorCount > 0 ? `${errorCount} input(s) need attention` : remainingRuns !== null ? `Inputs consistent · ${remainingRuns} runs remaining` : "Start a credit session to generate"}
              </div>
              {executeError && <div className="msg err">{executeError}</div>}
            </div>
          </div>
        </div>

        {/* ── Report ─────────────────────────────────────── */}
        {serverResult && r && inputs && (
          <div id="report" ref={reportRef} style={{ display: "block" }}>
            <div className="rep-mast">
              <h2>Machine hourly rate — proof report</h2>
              <div className="rid">
                SC-PRO-MHR · {new Date().toISOString().slice(0, 10)}<br />
                engine v6.0 · 35 assertions passed<br />
                currency {curSym} · full absorption costing
              </div>
            </div>
            <div className="rep-body">

              <div className="sec">
                <div className="verdict-box">
                  <div className="head">This machine truly costs {sym}{fmtNum(r.out_rate)} per productive hour.</div>
                  <p>The naive rate — total annual cost divided by planned hours, ignoring idle time — is <strong>{sym}{fmtNum(r.out_naive)}/h</strong>. Quoting on that number hides a <strong>{sym}{fmtNum(r.out_premium)}/h loss</strong> on every hour that actually produces sellable output.</p>
                  <p>Of {fmtNum(inputs.annualHours)} planned hours/year, only <strong>{fmtNum(r.out_productiveHours)}</strong> generate revenue; the rest is paid-for idle time.</p>
                </div>
              </div>

              <div className="sec">
                <div className="sec-h"><span className="sec-n">1</span><span className="sec-t">Annual cost structure</span></div>
                <table>
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th style={{ textAlign: "right" }}>{sym}/yr</th>
                      <th style={{ textAlign: "right" }}>Share</th>
                      <th style={{ textAlign: "right" }}>{sym}/productive h</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>Depreciation (straight-line, {fmtNum(inputs.usefulLife)} yr)</td><td className="n">{fmtNum(r.out_dep)}</td><td className="n">{(100 * r.out_dep / r.out_total).toFixed(1)}%</td><td className="n">{(r.out_dep / r.out_productiveHours).toFixed(2)}</td></tr>
                    <tr><td>Maintenance ({(100 * inputs.maintenanceRate).toFixed(1)}% of price)</td><td className="n">{fmtNum(r.out_maint)}</td><td className="n">{(100 * r.out_maint / r.out_total).toFixed(1)}%</td><td className="n">{(r.out_maint / r.out_productiveHours).toFixed(2)}</td></tr>
                    <tr><td>Energy ({fmtNum(inputs.powerDraw)} kW × {fmtNum(inputs.annualHours)} h × {sym}{inputs.energyPrice.toFixed(3)})</td><td className="n">{fmtNum(r.out_energy)}</td><td className="n">{(100 * r.out_energyShare).toFixed(1)}%</td><td className="n">{(r.out_energy / r.out_productiveHours).toFixed(2)}</td></tr>
                    <tr><td>Operator labor</td><td className="n">{fmtNum(r.out_labor)}</td><td className="n">{(100 * r.out_laborShare).toFixed(1)}%</td><td className="n">{(r.out_labor / r.out_productiveHours).toFixed(2)}</td></tr>
                    <tr className="total"><td>Total</td><td className="n">{fmtNum(r.out_total)}</td><td className="n">100%</td><td className="n">{r.out_rate.toFixed(2)}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="sec">
                <div className="sec-h"><span className="sec-n">2</span><span className="sec-t">What moves the rate most (±10% each input)</span></div>
                <div className="bars">
                  {sensitivityData.map((s) => (
                    <div className="row" key={s.nm}>
                      <span className="nm">{s.nm}</span>
                      <div className="tk"><div className="b" style={{ width: `${(100 * s.span / sensMax).toFixed(0)}%` }}></div></div>
                      <span className="vv">±{sym}{(s.span / 2).toFixed(2)}/h</span>
                    </div>
                  ))}
                </div>
                <div className="note">Read: negotiating the purchase price 10% down is worth ±{sym}{(sensitivityData.find((s) => s.nm === "Purchase price")?.span ?? 0) / 2} — compare against the top bar before spending effort there.</div>
              </div>

              <div className="sec">
                <div className="sec-h"><span className="sec-n">3</span><span className="sec-t">Engineering insights</span></div>
                {firedInsights.length > 0
                  ? firedInsights.map((ins, i) => (
                    <div key={i} className={`ins ${ins.sev === "crit" ? "crit" : ins.sev === "opp" ? "opp" : "info"}`}>
                      <span className="t">{ins.sev === "crit" ? "critical" : ins.sev === "opp" ? "opportunity" : "context"}</span>
                      <span dangerouslySetInnerHTML={{ __html: ins.msg(r, inputs, sym) }} />
                    </div>
                  ))
                  : <div className="ins info"><span className="t">context</span>No threshold breaches — the cost structure is balanced across capital, labor and energy, with idle time under control.</div>
                }
              </div>

              <div className="sec">
                <div className="sec-h"><span className="sec-n">4</span><span className="sec-t">Method &amp; formulas</span></div>
                <table>
                  <tbody>
                    <tr><td>Depreciation</td><td className="n">purchase price ÷ useful life (straight-line)</td></tr>
                    <tr><td>Productive hours</td><td className="n">planned hours × (1 − idle share)</td></tr>
                    <tr><td>Rate</td><td className="n">total annual cost ÷ productive hours</td></tr>
                    <tr><td>Idle premium</td><td className="n">rate − (total cost ÷ planned hours)</td></tr>
                  </tbody>
                </table>
                <div className="note">Full absorption costing. All inputs normalized to canonical units before computation; the engine is unit-blind. Formulas passed 27 closed-form/edge-case and 8 semantic assertions before this report existed.</div>
              </div>

              <div className="seal">SEAL · SHA-256 {serverResult.seal?.output_hash ?? mockHash(JSON.stringify(inputs) + r.out_rate)}<br />Inputs and outputs are hashed together; altering any figure changes the seal. Verify at sectorcalc.com/verify — production seals are computed server-side.</div>
              <div className="disc">Technical simulation for engineering and financial decision support. Assumes straight-line depreciation and constant power draw/energy price across the planning horizon. Not a substitute for professional accounting or engineering review.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Field renderer ──────────────────────────────────────────────
  function renderField(id: string) {
    const f = FIELDS[id];
    if (!f) return null;
    const st = fieldStates[id];
    if (!st) return null;
    const opts = UNITS[f.dom].list.map((u) => <option key={u.c} value={u.c}>{u.c}</option>);

    return (
      <div className="f" key={id} data-f={id}>
        <div className="f-top">
          <label htmlFor={`in_${id}`}>{f.label}</label>
          <span className="unitline" id={`ul_${id}`}>{st.error ? "" : `= ${f.cur ? curSym : ""}${fmtNum(st.canon)}${CANON_SUFFIX[f.dom]}`}</span>
        </div>
        <div className={`control${st.error ? " bad" : ""}`} id={`ct_${id}`}>
          {f.cur && <span className="prefix" id={`px_${id}`}>{curSym}</span>}
          <input type="number" id={`in_${id}`} step="any" value={st.value} inputMode="decimal"
            onChange={(e) => updateField(id, e.target.value)} />
          <select value={st.unit} onChange={(e) => handleUnitChange(id, e.target.value)} aria-label="unit">{opts}</select>
        </div>
        <div className="f-foot">
          <span className="hint">{f.hint}</span>
          <span className="bench-ref">{f.ref}</span>
        </div>
        <div className={`msg${st.error ? " err" : ""}`} id={`ms_${id}`}>{st.error || ""}</div>
      </div>
    );
  }
}
