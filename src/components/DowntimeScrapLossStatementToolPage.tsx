"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/dsl-tool.css";

const TOOL_KEY = "downtime-scrap-loss-statement";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_productive_hours": { label:"Planned productive hours", def:160, hard:[0,8784], ref:[100,744], refUnit:"h", hint:"Hours the machine or line was scheduled to run.", src:"production schedule", grp:1 },
  "n_actual_hours": { label:"Actual hours run", def:148, hard:[0,8784], ref:[80,744], refUnit:"h", hint:"Hours the machine actually ran (excluding downtime).", src:"MES / OEE log", grp:1 },
  "n_hourly_rate": { label:"Fully-loaded hourly rate", def:150, hard:[0,50000.0], ref:[20,2000], refUnit:"/h", hint:"Machine + labor + overhead cost per hour.", src:"SectorCalc Machine Hourly Rate tool", grp:3 },
  "n_scrap_quantity": { label:"Scrap units", def:45, hard:[0,1000000.0], ref:[0,1000], refUnit:"units", hint:"Units scrapped and not reworkable.", src:"quality log", grp:2 },
  "n_unit_cost": { label:"Unit material cost", def:28, hard:[0,1000000.0], ref:[0,5000], refUnit:"", hint:"Material and direct cost per unit (to value scrapped output).", src:"BOM / costing system", grp:3 },
  "n_rework_hours": { label:"Rework hours", def:12, hard:[0,10000.0], ref:[0,200], refUnit:"h", hint:"Total labor/machine hours spent on rework.", src:"quality log", grp:2 },
  "n_rework_rate": { label:"Rework hourly rate", def:65, hard:[0,50000.0], ref:[10,500], refUnit:"/h", hint:"Cost per hour of rework (often different from the production rate).", src:"costing system", grp:3 },
  "n_material_cost": { label:"Period material cost", def:45000, hard:[0,500000000.0], ref:[0,5000000.0], refUnit:"", hint:"Total material consumed this period (for context/ratio).", src:"purchase ledger", grp:3 },
  "n_defect_rate_pct": { label:"Observed defect rate", def:2.8, hard:[0,100], ref:[0,10], refUnit:"%", hint:"Defects as a fraction of units produced (canonical: raw percent number, e.g. 2.5 = 2.5%).", src:"quality report", grp:2 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Production time", d:"Planned vs actual uptime — the basis for downtime cost." },
  2: { n:"02", t:"Scrap & rework", d:"Defective output: how much was scrapped, how much reworked." },
  3: { n:"03", t:"Cost rates", d:"The cost rates that convert time and material losses into currency." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  if(f.refUnit) return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()} ${f.refUnit}`;
  return `Ref: ${cs}${f.ref[0].toLocaleString()}–${cs}${f.ref[1].toLocaleString()}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function DowntimeScrapLossStatementToolPage() {
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
    const f=FIELDS[id]; const st=fieldStates[id]; const p="dsl";
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
    <div className="dsl-shell">
      <div className="dsl-mast">
        <div className="dsl-kicker">SectorCalc PRO · Manufacturing · Total quality loss valuation</div>
        <h1>Downtime & Scrap Loss Statement</h1>
        <p className="dsl-lede">What did downtime and defects cost this period? Quantifies downtime cost, scrap material loss, and rework cost in a single sealed proof report.</p>
        <div className="dsl-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="dsl-curbar">
          <label htmlFor="dsl-curSel">Report currency</label>
          <select id="dsl-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="dsl-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="dsl-bench">
        <div className="dsl-form-col">
          {[1,2,3].map(g=>(
            <div className="dsl-grp" key={g}>
              <div className="dsl-grp-h"><span className="dsl-grp-n">{GROUPS[g].n}</span><span className="dsl-grp-t">{GROUPS[g].t}</span></div>
              <div className="dsl-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="dsl-rail">
          <div className="dsl-rail-in">
            <div className="dsl-verdict">
              <div className="dsl-verdict-band dsl-neutral">ready</div>
              <div className="dsl-verdict-body">
                <div className="dsl-big">{canGenerate?"✓":"—"}</div>
                <div className="dsl-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="dsl-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="dsl-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="dsl-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="dsl-conf" style={{color:"var(--dsl-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="dsl-conf" style={{color:"var(--dsl-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="dsl-report" ref={reportRef}>
          <div className="dsl-rep-mast">
            <h2>Downtime & Scrap Loss Statement — proof report</h2>
            <div className="dsl-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="dsl-rep-body">
            <h3 className="dsl-sec-h">Key outputs</h3>
                        <div className="dsl-stat"><span>Downtime cost</span><b>{serverResult.outputs["out_downtime_cost"]!=null?(!isFinite(serverResult.outputs["out_downtime_cost"])?"—":serverResult.outputs["out_downtime_cost"].toFixed(2)):"—"}</b></div>
            <div className="dsl-stat"><span>Scrap material loss</span><b>{serverResult.outputs["out_scrap_material_loss"]!=null?(!isFinite(serverResult.outputs["out_scrap_material_loss"])?"—":serverResult.outputs["out_scrap_material_loss"].toFixed(2)):"—"}</b></div>
            <div className="dsl-stat"><span>Rework cost</span><b>{serverResult.outputs["out_rework_loss"]!=null?(!isFinite(serverResult.outputs["out_rework_loss"])?"—":serverResult.outputs["out_rework_loss"].toFixed(2)):"—"}</b></div>
            <div className="dsl-sec-h" style={{marginTop:"24px"}}>All computed outputs</div>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.includes("fmea")&&!k.includes("Trigger")).slice(0,10).map(([k,v])=>(
              <div className="dsl-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="dsl-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="dsl-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="dsl-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="manufacturing"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
