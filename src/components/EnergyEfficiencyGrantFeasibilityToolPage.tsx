"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/eegi-tool.css";

const TOOL_KEY = "energy-efficiency-grant-incentive-feasibility-pack";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_current_kwh_per_year": { label:"Current annual energy use", def:500000, hard:[0,100000000.0], ref:[10000,10000000.0], refUnit:"kWh/yr", hint:"Current annual electricity consumption.", src:"utility bills / metering", grp:1 },
  "n_target_kwh_per_year": { label:"Target annual energy use", def:350000, hard:[0,100000000.0], ref:[5000,10000000.0], refUnit:"kWh/yr", hint:"Projected annual consumption after the efficiency project.", src:"engineering estimate", grp:1 },
  "n_avg_kwh_rate": { label:"Average electricity rate", def:0.14, hard:[0,10], ref:[0.05,0.5], refUnit:"/kWh", hint:"Blended electricity price per kWh.", src:"utility bills", grp:2 },
  "n_implementation_cost": { label:"Implementation cost", def:120000, hard:[0,100000000.0], ref:[5000,10000000.0], refUnit:"", hint:"Total capital cost of the efficiency project.", src:"project budget / quotes", grp:2 },
  "n_grant_coverage_pct": { label:"Grant coverage", def:0.35, hard:[0,1], ref:[0,0.8], refUnit:"%", hint:"Fraction of implementation cost covered by grants (as a ratio, e.g. 0.35 = 35%).", src:"grant program terms", grp:2 },
  "n_maintenance_cost_saving": { label:"Annual maintenance saving", def:5000, hard:[0,1000000.0], ref:[0,500000], refUnit:"", hint:"Additional annual maintenance savings from the new equipment.", src:"engineering estimate", grp:2 },
  "n_emission_factor_kgco2_per_kwh": { label:"Emission factor", def:0.45, hard:[0,2], ref:[0.1,1], refUnit:"kgCO2/kWh", hint:"Grid emission factor for calculating CO2 reduction.", src:"national grid emission factor", grp:3 },
  "n_equipment_life_years": { label:"Equipment life", def:15, hard:[1,50], ref:[5,30], refUnit:"years", hint:"Expected useful life of the new equipment.", src:"manufacturer specification", grp:3 },
  "n_discount_rate": { label:"Discount rate", def:0.06, hard:[0,0.5], ref:[0.03,0.15], refUnit:"", hint:"Discount rate for NPV-style lifetime savings (as a ratio, e.g. 0.06 = 6%).", src:"finance policy", grp:3 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Energy consumption", d:"Current and target annual energy use." },
  2: { n:"02", t:"Costs & savings", d:"Implementation cost, maintenance savings, and grant coverage." },
  3: { n:"03", t:"Financial parameters", d:"Equipment life and discount rate for NPV-style analysis." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()}${f.refUnit?" "+f.refUnit:""}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function EnergyEfficiencyGrantFeasibilityToolPage() {
  const [curSym,setCurSym]=useState("€");
  const reportRef=useRef<HTMLDivElement>(null);
  const { user }=useUserSubscription();
  const [usageSessionId,setUsageSessionId]=useState<string|null>(null);
  const [remainingRuns,setRemainingRuns]=useState<number|null>(null);
  const [sessionLoading,setSessionLoading]=useState(false);
  const [sessionError,setSessionError]=useState<string|null>(null);
  const [authToken,setAuthToken]=useState<string|null>(null);
  const lastUid=useRef<string|null|undefined>(undefined);
  const [isExecuting,setIsExecuting]=useState(false);
  const [serverResult,setServerResult]=useState<ServerResultState|null>(null);
  const [executeError,setExecuteError]=useState<string|null>(null);

  useEffect(()=>{
    const uid=user?.uid??null; if(lastUid.current===uid) return; lastUid.current=uid;
    setAuthToken(null);setUsageSessionId(null);setRemainingRuns(null);setSessionError(null);setExecuteError(null);setServerResult(null);
    if(user) user.getIdToken(false).then(setAuthToken).catch(()=>setSessionError("Could not verify your session."));
  },[user]);
  useEffect(()=>{ if(user?.email&&isProBypassEmail(user.email)){ setUsageSessionId(BYPASS_SESSION_ID);setRemainingRuns(999); } },[user?.email]);

  const requestSession=useCallback(async()=>{
    if(user?.email&&isProBypassEmail(user.email)) return;
    setSessionLoading(true);setSessionError(null);
    try {
      if(!user){ window.location.href=`/login?next=${encodeURIComponent(window.location.pathname)}`; return; }
      const idToken=await user.getIdToken(false);
      const res=await fetch("/api/pro-tool-session/create",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${idToken}`},body:JSON.stringify({toolKey:TOOL_KEY})});
      if(!res.ok){ const d=await res.json().catch(()=>({})); if(d.error==="INSUFFICIENT_CREDITS"){ window.location.href="/pricing";return; } throw new Error(d.error||"Session failed"); }
      const s=await res.json(); setUsageSessionId(s.usageSessionId);setRemainingRuns(s.remainingRuns);
    } catch(err){ setSessionError(err instanceof Error?err.message:"Could not start a session."); } finally{ setSessionLoading(false); }
  },[user]);

  const [fieldStates,setFieldStates]=useState<Record<string,FieldState>>(()=>{
    const s:Record<string,FieldState>={};
    for(const id of Object.keys(FIELDS)){
      const f=FIELDS[id];
      s[id]={value:String(f.def),error:null,warn:false};
    }
    return s;
  });

  const updateField=useCallback((id:string,val:string)=>{
    setFieldStates(prev=>{
      const f=FIELDS[id]; const raw=parseFloat(val);
      let error:string|null=null,warn=false;
      if(val.trim()===""||Number.isNaN(raw)) error="Enter a number.";
      else { const canon=f.pct?raw/100:raw; if(canon<f.hard[0]||canon>f.hard[1]) error=`Outside valid range.`; else if(canon<f.ref[0]||canon>f.ref[1]) warn=true; }
      return {...prev,[id]:{value:val,error,warn}};
    });
  },[]);

  const rawInputs=useMemo(()=>{
    const o:Record<string,number>={};
    for(const [id,st] of Object.entries(fieldStates)){
      const raw=parseFloat(st.value); if(st.error||Number.isNaN(raw)) return null;
      o[id]=FIELDS[id].pct?raw/100:raw;
    }
    return o;
  },[fieldStates]);
  const errorCount=useMemo(()=>Object.values(fieldStates).filter(s=>s.error).length,[fieldStates]);
  const canGenerate=!!rawInputs&&!isExecuting;

  const handleGenerate=useCallback(async()=>{
    if(!rawInputs||isExecuting||!usageSessionId) return;
    setIsExecuting(true); setExecuteError(null);
    const snap={...rawInputs}; const snapCur=curSym;
    try {
      const selectedUnits:Record<string,string>={};
      for(const id of Object.keys(FIELDS)) if(FIELDS[id].pct) selectedUnits[id]="percent";
      const res=await fetch("/api/pro-calculator/execute",{method:"POST",
        headers:{"Content-Type":"application/json",...(authToken?{Authorization:`Bearer ${authToken}`}:{})},
        body:JSON.stringify({tool_key:TOOL_KEY,raw_inputs:snap,selected_units:selectedUnits,usage_session_id:usageSessionId})});
      if(!res.ok){ const d=await res.json().catch(()=>({})); throw new Error(d.error||`Server error ${res.status}`); }
      const data=await res.json();
      const outputsMap:Record<string,number>={};
      if(Array.isArray(data.outputs)) { for(const o of data.outputs) if(typeof o.value==="number") outputsMap[o.id]=o.value; }
      else if(data.outputs && typeof data.outputs==="object") { Object.assign(outputsMap,data.outputs); }
      const seal=data.audit_seal as Record<string,unknown>|undefined;
      if(!seal||seal.seal_status!=="SEALED"||typeof seal.output_hash!=="string") throw new Error("Sealed response missing.");
      setServerResult({outputs:outputsMap,seal:{output_hash:seal.output_hash as string,hash_algorithm:seal.hash_algorithm as string,executed_at:seal.executed_at as string},inputs:snap,currency:snapCur});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    } catch(err){ setExecuteError(err instanceof Error?err.message:"Execution failed"); } finally{ setIsExecuting(false); }
  },[rawInputs,isExecuting,usageSessionId,authToken,curSym]);

  const renderField=(id:string)=>{
    const f=FIELDS[id]; const st=fieldStates[id]; const p="eegi";
    const cls=st.error?`${p}-bad`:st.warn?`${p}-warn`:"";
    const msg=st.error?st.error:st.warn?`Outside typical range (${fmtRef(f,curSym)}). Value accepted.`:"";
    return (
      <div className={`${p}-f`} key={id}>
        <div className={`${p}-f-top`}><label htmlFor={`in_${id}`}>{f.label}</label></div>
        <div className={`${p}-control ${cls}`}>
          <input id={`in_${id}`} type="number" step="any" inputMode="decimal" value={st.value} onChange={e=>updateField(id,e.target.value)} aria-invalid={!!st.error} />
          {!f.pct&&<span className={`${p}-prefix`}>{f.refUnit?f.refUnit:curSym}</span>}
          {f.pct&&<span className={`${p}-prefix`} style={{borderLeft:"1px solid var(--"+p+"-line)",borderRight:"none"}}>%</span>}
        </div>
        <div className={`${p}-f-foot`}><span className={`${p}-hint`}>{f.hint} <em style={{fontStyle:"normal",color:"var(--"+p+"-faint)"}}>· {f.src}</em></span><span className={`${p}-bench-ref`}>{fmtRef(f,curSym)}</span></div>
        {msg&&<div className={`${p}-msg ${st.error?p+"-err":p+"-warn"}`} role={st.error?"alert":"status"}>{msg}</div>}
      </div>
    );
  };

  return (
    <div className="eegi-shell">
      <div className="eegi-mast">
        <div className="eegi-kicker">SectorCalc PRO · Manufacturing · Energy project feasibility</div>
        <h1>Energy Efficiency Grant & Incentive Feasibility Pack</h1>
        <p className="eegi-lede">Does an energy efficiency project pay off after grants? Computes energy savings, emissions reduction, and payback net of incentives — with a sealed proof report.</p>
        <div className="eegi-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="eegi-curbar">
          <label htmlFor="eegi-curSel">Report currency</label>
          <select id="eegi-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="eegi-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="eegi-bench">
        <div className="eegi-form-col">
          {[1,2,3].map(g=>(
            <div className="eegi-grp" key={g}>
              <div className="eegi-grp-h"><span className="eegi-grp-n">{GROUPS[g].n}</span><span className="eegi-grp-t">{GROUPS[g].t}</span></div>
              <div className="eegi-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="eegi-rail">
          <div className="eegi-rail-in">
            <div className="eegi-verdict">
              <div className="eegi-verdict-band eegi-neutral">ready</div>
              <div className="eegi-verdict-body">
                <div className="eegi-big">{canGenerate?"✓":"—"}</div>
                <div className="eegi-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="eegi-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="eegi-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="eegi-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="eegi-conf" style={{color:"var(--eegi-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="eegi-conf" style={{color:"var(--eegi-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="eegi-report" ref={reportRef}>
          <div className="eegi-rep-mast">
            <h2>Energy Efficiency Grant & Incentive Feasibility Pack — proof report</h2>
            <div className="eegi-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="eegi-rep-body">
            <h3 className="eegi-sec-h">Sealed outputs</h3>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.toLowerCase().includes("fmea")&&!k.toLowerCase().includes("trigger")&&!k.toLowerCase().includes("crossing")).slice(0,12).map(([k,v])=>(
              <div className="eegi-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="eegi-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="eegi-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="eegi-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="manufacturing"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
