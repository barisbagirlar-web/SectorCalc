"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import { BreakEvenReportCharts } from "@/sectorcalc/pro-report/charts/BreakEvenReportCharts";
import "@/styles/break-even-survival-cash-tool.css";

const TOOL_KEY = "break-even-survival-cash-calculator";
const BYPASS_SESSION_ID = "bypass-unlimited";

const CURRENCIES = [
  { code: "EUR", sym: "€" },{ code: "USD", sym: "$" },{ code: "GBP", sym: "£" },
  { code: "TRY", sym: "₺" },{ code: "JPY", sym: "¥JP" },{ code: "CNY", sym: "¥CN" },
  { code: "CHF", sym: "CHF" },{ code: "SEK", sym: "kr" },{ code: "AUD", sym: "A$" },
  { code: "CAD", sym: "C$" },{ code: "INR", sym: "₹" },{ code: "AED", sym: "AED" },
];

interface FieldDef { label: string; def: number; hard: [number,number]; ref: [number,number]; hint: string; src: string; grp: number; pct?: boolean; }
const FIELDS: Record<string,FieldDef> = {
  n_monthly_fixed_cash_cost:       { label:"Monthly fixed cash cost",       def:45000,  hard:[0,5e7],  ref:[5000,500000],  hint:"All fixed costs that must be paid regardless of revenue.", src:"P&L / cash flow statement", grp:1 },
  n_monthly_debt_service:          { label:"Monthly debt service",           def:8500,   hard:[0,5e7],  ref:[0,200000],    hint:"Loan repayments and interest obligations per month.", src:"debt schedule", grp:1 },
  n_contribution_margin_ratio:     { label:"Contribution margin ratio",      def:0.42,   hard:[0,1],    ref:[0.2,0.8],     hint:"Revenue remaining after variable costs (as a ratio).", src:"management accounts", grp:1, pct:true },
  n_current_monthly_revenue:       { label:"Current monthly revenue",        def:95000,  hard:[0,5e8],  ref:[1000,5000000],hint:"Actual or most recent monthly revenue.", src:"revenue report", grp:2 },
  n_unrestricted_cash_balance:     { label:"Unrestricted cash balance",      def:120000, hard:[0,5e9],  ref:[0,2000000],   hint:"Cash available right now — excluding restricted or escrowed funds.", src:"bank statement", grp:2 },
  n_target_survival_months:        { label:"Target cash runway (months)",    def:6,      hard:[1,60],   ref:[3,12],        hint:"How many months of runway you want to secure.", src:"board / management decision", grp:2 },
  n_downside_revenue_factor:       { label:"Downside revenue factor",        def:0.75,   hard:[0,1],    ref:[0.5,0.95],    hint:"What fraction of normal revenue you'd expect in a stress scenario.", src:"management estimate", grp:3, pct:true },
  n_minimum_cash_buffer:           { label:"Minimum cash buffer",            def:25000,  hard:[0,5e7],  ref:[0,500000],    hint:"The floor below which you'd never let cash fall.", src:"board policy", grp:3 },
  n_source_confidence_ratio:       { label:"Source confidence",              def:0.85,   hard:[0,1],    ref:[0.7,1],       hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
  n_uncertainty_multiplier:        { label:"Uncertainty multiplier",         def:1.15,   hard:[1,3],    ref:[1.05,1.5],    hint:"Buffer multiplier applied to the survival cash target.", src:"risk management policy", grp:3 },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1:{ n:"01", t:"Cost structure", d:"Fixed costs and contribution margin — the break-even drivers." },
  2:{ n:"02", t:"Current position", d:"Where you are now: revenue, cash, and how long you need to last." },
  3:{ n:"03", t:"Stress scenario", d:"Downside assumptions and buffers for survivability planning." },
};

interface FieldState { value:string; error:string|null; warn:boolean; }

function fmt(x:number|null|undefined):string {
  if (x==null||Number.isNaN(x)) return "—";
  if (!Number.isFinite(x)) return "∞";
  const a=Math.abs(x);
  return x.toLocaleString("en-US",{maximumFractionDigits:a>=100?0:a>=1?2:4});
}
function fmtRef(f:FieldDef,curSym:string):string {
  if (f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${curSym}${f.ref[0].toLocaleString()}–${curSym}${f.ref[1].toLocaleString()}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }
type SensitivityDriverResult = { inputId:string; label:string; up:number|null; down:number|null; span:number|null };
type SensitivityData = { targetOutput:string; baseline:number|null; baseInputs:Record<string,number>|null; drivers:SensitivityDriverResult[] } | null;

export default function BreakEvenSurvivalCashToolPage() {
  const [curSym, setCurSym] = useState("€");
  const reportRef = useRef<HTMLDivElement>(null);
  const { user } = useUserSubscription();
  const [usageSessionId, setUsageSessionId] = useState<string|null>(null);
  const [remainingRuns, setRemainingRuns] = useState<number|null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string|null>(null);
  const [authToken, setAuthToken] = useState<string|null>(null);
  const lastUid = useRef<string|null|undefined>(undefined);
  const [isExecuting, setIsExecuting] = useState(false);
  const [serverResult, setServerResult] = useState<ServerResultState|null>(null);
  const [executeError, setExecuteError] = useState<string|null>(null);
  const [sensitivityData, setSensitivityData] = useState<SensitivityData>(null);

  // Isolated fetch to the read-only sensitivity endpoint, independent of the
  // main execute call above — a failure or slow response here can never
  // block or corrupt the sealed report itself. Matches the established
  // pattern in UniversalIndustrialDecisionForm.tsx.
  useEffect(() => {
    if (!serverResult) { setSensitivityData(null); return; }
    let cancelled = false;
    fetch("/api/pro-calculator/sensitivity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tool_key: TOOL_KEY, raw_inputs: serverResult.inputs, selected_units: {} }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.ok || !data.supported) return;
        setSensitivityData({
          targetOutput: data.targetOutput,
          baseline: typeof data.baseline === "number" ? data.baseline : null,
          baseInputs: data.baseInputs ?? null,
          drivers: data.drivers ?? [],
        });
      })
      .catch(() => { /* sensitivity chart is a bonus, not required for the report */ });
    return () => { cancelled = true; };
  }, [serverResult]);

  useEffect(() => {
    const uid = user?.uid ?? null;
    if (lastUid.current === uid) return;
    lastUid.current = uid;
    setAuthToken(null); setUsageSessionId(null); setRemainingRuns(null);
    setSessionError(null); setExecuteError(null); setServerResult(null);
    if (user) user.getIdToken(false).then(setAuthToken).catch(()=>setSessionError("Could not verify your session — please refresh."));
  }, [user]);

  useEffect(() => {
    if (user?.email && isProBypassEmail(user.email)) { setUsageSessionId(BYPASS_SESSION_ID); setRemainingRuns(999); }
  }, [user?.email]);

  const requestSession = useCallback(async () => {
    if (user?.email && isProBypassEmail(user.email)) return;
    setSessionLoading(true); setSessionError(null);
    try {
      if (!user) { window.location.href=`/login?next=${encodeURIComponent(window.location.pathname)}`; return; }
      const idToken = await user.getIdToken(false);
      const res = await fetch("/api/pro-tool-session/create",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${idToken}`},body:JSON.stringify({toolKey:TOOL_KEY})});
      if (!res.ok) { const d=await res.json().catch(()=>({})); if(d.error==="INSUFFICIENT_CREDITS"){window.location.href="/pricing";return;} throw new Error(d.error||"Session failed"); }
      const s=await res.json(); setUsageSessionId(s.usageSessionId); setRemainingRuns(s.remainingRuns);
    } catch(err){ setSessionError(err instanceof Error?err.message:"Could not start a session."); }
    finally { setSessionLoading(false); }
  }, [user]);

  const [fieldStates, setFieldStates] = useState<Record<string,FieldState>>(()=>{
    const s:Record<string,FieldState>={};
    for (const id of Object.keys(FIELDS)) {
      const f=FIELDS[id];
      s[id]={ value:String(f.pct?f.def*100:f.def), error:null, warn:false };
    }
    return s;
  });

  const updateField = useCallback((id:string, val:string) => {
    setFieldStates(prev=>{
      const f=FIELDS[id]; const raw=parseFloat(val);
      let error:string|null=null, warn=false;
      if(val.trim()===""||Number.isNaN(raw)) error="Enter a number.";
      else {
        const canon=f.pct?raw/100:raw;
        if(canon<f.hard[0]||canon>f.hard[1]) error=`Outside valid range (${f.hard[0]}–${f.hard[1]}${f.pct?"%":""}).`;
        else if(canon<f.ref[0]||canon>f.ref[1]) warn=true;
      }
      return {...prev,[id]:{value:val,error,warn}};
    });
  }, []);

  const rawInputs = useMemo(()=>{
    const o:Record<string,number>={};
    for(const [id,st] of Object.entries(fieldStates)){
      const raw=parseFloat(st.value);
      if(st.error||Number.isNaN(raw)) return null;
      o[id]=FIELDS[id].pct?raw/100:raw;
    }
    return o;
  },[fieldStates]);

  const errorCount = useMemo(()=>Object.values(fieldStates).filter(s=>s.error).length,[fieldStates]);

  const handleGenerate = useCallback(async () => {
    if (!rawInputs||isExecuting||!usageSessionId) return;
    setIsExecuting(true); setExecuteError(null);
    const snap=rawInputs; const snapCur=curSym;
    try {
      const selectedUnits:Record<string,string>={};
      for(const id of Object.keys(FIELDS)) if(FIELDS[id].pct) selectedUnits[id]="percent";
      const res=await fetch("/api/pro-calculator/execute",{method:"POST",
        headers:{"Content-Type":"application/json",...(authToken?{Authorization:`Bearer ${authToken}`}:{})},
        body:JSON.stringify({tool_key:TOOL_KEY,raw_inputs:snap,selected_units:selectedUnits,usage_session_id:usageSessionId})});
      if(!res.ok){const d=await res.json().catch(()=>({}));throw new Error(d.error||`Server error ${res.status}`);}
      const data=await res.json();
      const outputsMap:Record<string,number>={};
      if(Array.isArray(data.outputs)) { for(const o of data.outputs) if(o && typeof o.id==="string" && typeof o.value==="number" && Number.isFinite(o.value)) outputsMap[o.id]=o.value; }
      else if(data.outputs && typeof data.outputs==="object") { for(const [k,v] of Object.entries(data.outputs as Record<string,unknown>)) if(typeof v==="number" && Number.isFinite(v)) outputsMap[k]=v; }
      const seal=data.audit_seal as Record<string,unknown>|undefined;
      const sealOk=!!seal&&seal.seal_status==="SEALED"&&typeof seal.output_hash==="string";
      if(!sealOk) throw new Error("Sealed response missing — report withheld.");
      setServerResult({outputs:outputsMap,seal:{output_hash:seal!.output_hash as string,hash_algorithm:seal!.hash_algorithm as string,executed_at:seal!.executed_at as string},inputs:snap,currency:snapCur});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    } catch(err){ setExecuteError(err instanceof Error?err.message:"Execution failed"); }
    finally { setIsExecuting(false); }
  },[rawInputs,isExecuting,usageSessionId,authToken,curSym]);

  const canGenerate=!!rawInputs&&!isExecuting;

  const renderField=(id:string)=>{
    const f=FIELDS[id]; const st=fieldStates[id];
    const cls=st.error?"be-bad":st.warn?"be-warn":"";
    const msg=st.error?st.error:st.warn?`Outside typical range (${fmtRef(f,curSym)}). Value accepted.`:"";
    return (
      <div className="be-f" key={id}>
        <div className="be-f-top"><label htmlFor={`in_${id}`}>{f.label}</label></div>
        <div className={`be-control ${cls}`}>
          <input id={`in_${id}`} type="number" step="any" inputMode="decimal" value={st.value}
            onChange={e=>updateField(id,e.target.value)} aria-invalid={!!st.error} />
          {!f.pct&&<span className="be-prefix">{curSym}</span>}
          {f.pct&&<span className="be-prefix" style={{borderLeft:"1px solid var(--be-line)",borderRight:"none"}}>%</span>}
        </div>
        <div className="be-f-foot">
          <span className="be-hint">{f.hint} <em style={{fontStyle:"normal",color:"var(--be-faint)"}}>· {f.src}</em></span>
          <span className="be-bench-ref">{fmtRef(f,curSym)}</span>
        </div>
        {msg&&<div className={`be-msg ${st.error?"be-err":"be-warn"}`} role={st.error?"alert":"status"}>{msg}</div>}
      </div>
    );
  };

  // Derive live preview from raw inputs
  const liveBreakEven = rawInputs && rawInputs.n_contribution_margin_ratio > 0
    ? (rawInputs.n_monthly_fixed_cash_cost + rawInputs.n_monthly_debt_service) / rawInputs.n_contribution_margin_ratio
    : null;

  return (
    <div className="be-shell">
      <div className="be-mast">
        <div className="be-kicker">SectorCalc PRO · Cash Survival · Break-even &amp; runway</div>
        <h1>Break-Even &amp; Survival Cash Calculator</h1>
        <p className="be-lede">Where is your break-even? How much cash do you need to survive a downside? Sealed audit report with margin-of-safety and runway analysis.</p>
        <div className="be-meta">
          <span>Engine <b>v5.3.2-domain</b></span><span>Method <b>break-even / survival cash</b></span><span>Report <b>sealed · SHA-256</b></span>
        </div>
        <div className="be-curbar">
          <label htmlFor="be-curSel">Report currency</label>
          <select id="be-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="be-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>

      <div className="be-bench">
        <div className="be-form-col">
          {[1,2,3].map(g=>(
            <div className="be-grp" key={g}>
              <div className="be-grp-h"><span className="be-grp-n">{GROUPS[g].n}</span><span className="be-grp-t">{GROUPS[g].t}</span></div>
              <div className="be-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="be-rail">
          <div className="be-rail-in">
            <div className="be-verdict">
              <div className="be-verdict-band be-neutral">live preview</div>
              <div className="be-verdict-body">
                <div className="be-big">{liveBreakEven?<>{curSym}{fmt(liveBreakEven)} <small>/mo</small></>:"—"}</div>
                <div className="be-big-cap">{liveBreakEven?"break-even revenue":errorCount?`${errorCount} input(s) need attention`:"enter data to begin"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="be-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="be-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="be-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="be-conf" style={{color:"var(--be-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="be-conf" style={{color:"var(--be-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>

      {serverResult&&(
        <div className="be-report" ref={reportRef}>
          <div className="be-rep-mast">
            <h2>Break-Even &amp; Survival Cash — proof report</h2>
            <div className="be-rid">SC-PRO-BE · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · currency {serverResult.currency}</div>
          </div>
          <div className="be-rep-body">
            <BreakEvenReportCharts
              toolSlug={TOOL_KEY}
              currencySymbol={serverResult.currency}
              outputs={serverResult.outputs}
              sensitivity={sensitivityData}
            />
            <div className="be-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="be-print-btn" onClick={()=>window.print()} aria-label="Download this report as a PDF">Download PDF</button>
            <div className="be-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="finance"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
