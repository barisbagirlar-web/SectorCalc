"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/weld-tool.css";

const TOOL_KEY = "weld-procedure-cost-consumable-estimation-suite";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_weld_length_m": { label:"Weld run length", def:2.5, hard:[0,1000], ref:[0.1,100], refUnit:"m", hint:"Total weld length for the procedure.", src:"weld drawing / WPS", grp:1 },
  "n_weld_throat_mm": { label:"Weld throat size", def:8, hard:[1,100], ref:[3,30], refUnit:"mm", hint:"Effective throat of the fillet or butt weld.", src:"weld drawing / WPS", grp:1 },
  "n_weld_density_g_per_cm3": { label:"Filler metal density", def:7.85, hard:[1,20], ref:[6,10], refUnit:"g/cm³", hint:"Density of the filler wire (carbon steel ≈ 7.85).", src:"wire manufacturer datasheet", grp:1 },
  "n_wire_cost_per_kg": { label:"Wire cost", def:3.5, hard:[0,500], ref:[1,20], refUnit:"/kg", hint:"Filler wire purchase price per kilogram.", src:"supplier quote", grp:2 },
  "n_gas_cost_per_min": { label:"Shielding gas cost", def:0.08, hard:[0,10], ref:[0.01,1], refUnit:"/min", hint:"Shielding gas cost per minute of arc time.", src:"gas supplier invoice", grp:2 },
  "n_arc_time_min": { label:"Arc-on time", def:18, hard:[0,10000.0], ref:[1,500], refUnit:"min", hint:"Time the arc is actually burning (not setup or repositioning).", src:"weld log / WPS", grp:3 },
  "n_weld_time_min": { label:"Total weld time", def:35, hard:[0,10000.0], ref:[1,1000], refUnit:"min", hint:"Total operator time including setup, tacking, inspection.", src:"weld log / time study", grp:3 },
  "n_labor_rate": { label:"Welder labor rate", def:42, hard:[0,500000.0], ref:[15,200], refUnit:"/h", hint:"Fully-loaded welder hourly cost.", src:"HR / payroll", grp:3 },
  "n_overhead_rate": { label:"Shop overhead rate", def:25, hard:[0,1000000.0], ref:[5,200], refUnit:"/h", hint:"Overhead per operator-hour in the welding shop.", src:"cost accounting", grp:3 },
  "n_deposition_efficiency_pct": { label:"Deposition efficiency", def:85.0, hard:[0,100], ref:[60,98], refUnit:"%", hint:"Fraction of wire mass that ends up in the weld (canonical: raw percent number, e.g. 85 = 85%).", src:"AWS / manufacturer data", grp:3 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Weld geometry", d:"Joint dimensions and weld density — the physical quantities that drive wire consumption." },
  2: { n:"02", t:"Consumable costs", d:"Wire and shielding gas unit prices." },
  3: { n:"03", t:"Time & overhead", d:"Arc time, total weld time, labour and overhead rates." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  if(f.refUnit) return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()} ${f.refUnit}`;
  return `Ref: ${cs}${f.ref[0].toLocaleString()}–${cs}${f.ref[1].toLocaleString()}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function WeldProcedureCostToolPage() {
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
      const f=FIELDS[id]; const def=f.pct?f.def:f.def;
      s[id]={value:String(def),error:null,warn:false};
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
    const f=FIELDS[id]; const st=fieldStates[id]; const p="weld";
    const cls=st.error?`${p}-bad`:st.warn?`${p}-warn`:"";
    const msg=st.error?st.error:st.warn?`Outside typical range (${fmtRef(f,curSym)}). Value accepted.`:"";
    return (
      <div className={`${p}-f`} key={id}>
        <div className={`${p}-f-top`}><label htmlFor={`in_${id}`}>{f.label}</label></div>
        <div className={`${p}-control ${cls}`}>
          <input id={`in_${id}`} type="number" step="any" inputMode="decimal" value={st.value} onChange={e=>updateField(id,e.target.value)} aria-invalid={!!st.error} />
          {!f.pct&&!f.refUnit&&<span className={`${p}-prefix`}>{curSym}</span>}
          {!f.pct&&f.refUnit&&<span className={`${p}-prefix`} style={{borderLeft:"1px solid var(--"+p+"-line)",borderRight:"none"}}>{f.refUnit}</span>}
          {f.pct&&<span className={`${p}-prefix`} style={{borderLeft:"1px solid var(--"+p+"-line)",borderRight:"none"}}>%</span>}
        </div>
        <div className={`${p}-f-foot`}><span className={`${p}-hint`}>{f.hint} <em style={{fontStyle:"normal",color:"var(--"+p+"-faint)"}}>· {f.src}</em></span><span className={`${p}-bench-ref`}>{fmtRef(f,curSym)}</span></div>
        {msg&&<div className={`${p}-msg ${st.error?p+"-err":p+"-warn"}`} role={st.error?"alert":"status"}>{msg}</div>}
      </div>
    );
  };

  return (
    <div className="weld-shell">
      <div className="weld-mast">
        <div className="weld-kicker">SectorCalc PRO · Manufacturing · Welding cost per metre</div>
        <h1>Weld Procedure Cost & Consumable Estimation</h1>
        <p className="weld-lede">What does a weld run cost? Computes wire mass, consumable cost, labour, overhead, and full cost per metre — with a sealed proof report.</p>
        <div className="weld-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="weld-curbar">
          <label htmlFor="weld-curSel">Report currency</label>
          <select id="weld-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="weld-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="weld-bench">
        <div className="weld-form-col">
          {[1,2,3].map(g=>(
            <div className="weld-grp" key={g}>
              <div className="weld-grp-h"><span className="weld-grp-n">{GROUPS[g].n}</span><span className="weld-grp-t">{GROUPS[g].t}</span></div>
              <div className="weld-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="weld-rail">
          <div className="weld-rail-in">
            <div className="weld-verdict">
              <div className="weld-verdict-band weld-neutral">ready</div>
              <div className="weld-verdict-body">
                <div className="weld-big">{canGenerate?"✓":"—"}</div>
                <div className="weld-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="weld-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="weld-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="weld-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="weld-conf" style={{color:"var(--weld-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="weld-conf" style={{color:"var(--weld-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="weld-report" ref={reportRef}>
          <div className="weld-rep-mast">
            <h2>Weld Procedure Cost & Consumable Estimation — proof report</h2>
            <div className="weld-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="weld-rep-body">
            <h3 className="weld-sec-h">Key outputs</h3>
                        <div className="weld-stat"><span>Total job cost</span><b>{serverResult.outputs["out_totalCostFloor"]!=null?(!isFinite(serverResult.outputs["out_totalCostFloor"])?"—":serverResult.outputs["out_totalCostFloor"].toFixed(2)):"—"}</b></div>
            <div className="weld-stat"><span>Wire mass</span><b>{serverResult.outputs["out_wireMassKg"]!=null?(!isFinite(serverResult.outputs["out_wireMassKg"])?"—":serverResult.outputs["out_wireMassKg"].toFixed(2)):"—"}</b></div>
            <div className="weld-stat"><span>Consumable efficiency</span><b>{serverResult.outputs["out_consumableEfficiency"]!=null?(!isFinite(serverResult.outputs["out_consumableEfficiency"])?"—":serverResult.outputs["out_consumableEfficiency"].toFixed(2)):"—"}</b></div>
            <div className="weld-sec-h" style={{marginTop:"24px"}}>All computed outputs</div>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.includes("fmea")&&!k.includes("Trigger")).slice(0,10).map(([k,v])=>(
              <div className="weld-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="weld-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="weld-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="weld-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="manufacturing"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
