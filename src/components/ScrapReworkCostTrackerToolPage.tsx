"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/srct-tool.css";

const TOOL_KEY = "scrap-rework-cost-tracker";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_total_produced": { label:"Total units produced", def:5000, hard:[1,10000000.0], ref:[100,100000], refUnit:"units", hint:"Total production output for the tracked period.", src:"MES / production log", grp:1 },
  "n_scrap_quantity": { label:"Scrap units", def:85, hard:[0,1000000.0], ref:[0,1000], refUnit:"units", hint:"Units scrapped (not reworkable) in the period.", src:"quality log", grp:1 },
  "n_rework_quantity": { label:"Rework units", def:120, hard:[0,1000000.0], ref:[0,2000], refUnit:"units", hint:"Units reworked (returned to good).", src:"quality log", grp:1 },
  "n_unit_material_cost": { label:"Unit material cost", def:18, hard:[0,100000.0], ref:[0,1000], refUnit:"", hint:"Material cost per unit (to value scrapped material).", src:"BOM / costing system", grp:2 },
  "n_unit_labor_cost": { label:"Unit direct labor cost", def:12, hard:[0,100000.0], ref:[0,500], refUnit:"", hint:"Labor cost embedded in each produced unit.", src:"job costing", grp:2 },
  "n_rework_labor_rate": { label:"Rework labor rate", def:35, hard:[0,50000.0], ref:[10,300], refUnit:"/h", hint:"Hourly rate for rework operators.", src:"HR / payroll", grp:2 },
  "n_rework_time_per_unit": { label:"Rework time per unit", def:0.75, hard:[0,100], ref:[0.1,8], refUnit:"h", hint:"Average time to rework one defective unit.", src:"time study / work measurement", grp:2 },
  "n_defect_rate_target_pct": { label:"Defect rate target", def:1.0, hard:[0,100], ref:[0,5], refUnit:"%", hint:"The defect rate you're trying to achieve (canonical: raw percent number, e.g. 2 = 2%).", src:"quality improvement plan", grp:3 },
  "n_monthly_volume": { label:"Monthly production volume", def:5000, hard:[1,10000000.0], ref:[100,100000], refUnit:"units", hint:"Typical monthly output volume (to annualise quality loss).", src:"production schedule", grp:3 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Production volume", d:"Total output and defect counts for the period." },
  2: { n:"02", t:"Unit costs", d:"Material and labor costs that value each defective unit." },
  3: { n:"03", t:"Targets & frequency", d:"Defect rate target and monthly volume for ongoing tracking." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${cs}${f.ref[0].toLocaleString()}–${cs}${f.ref[1].toLocaleString()}${f.refUnit?" "+f.refUnit:""}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function ScrapReworkCostTrackerToolPage() {
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
      if(Array.isArray(data.outputs)) for(const o of data.outputs) if(typeof o.value==="number") outputsMap[o.id]=o.value;
      else if(data.outputs) Object.assign(outputsMap,data.outputs);
      const seal=data.audit_seal as Record<string,unknown>|undefined;
      if(!seal||seal.seal_status!=="SEALED"||typeof seal.output_hash!=="string") throw new Error("Sealed response missing.");
      setServerResult({outputs:outputsMap,seal:{output_hash:seal.output_hash as string,hash_algorithm:seal.hash_algorithm as string,executed_at:seal.executed_at as string},inputs:snap,currency:snapCur});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    } catch(err){ setExecuteError(err instanceof Error?err.message:"Execution failed"); } finally{ setIsExecuting(false); }
  },[rawInputs,isExecuting,usageSessionId,authToken,curSym]);

  const renderField=(id:string)=>{
    const f=FIELDS[id]; const st=fieldStates[id]; const p="srct";
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
    <div className="srct-shell">
      <div className="srct-mast">
        <div className="srct-kicker">SectorCalc PRO · Manufacturing · Quality cost visibility</div>
        <h1>Scrap & Rework Cost Tracker</h1>
        <p className="srct-lede">What are defects actually costing? Computes scrap cost, rework cost, and monthly quality loss — with a sealed proof report and target vs actual comparison.</p>
        <div className="srct-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="srct-curbar">
          <label htmlFor="srct-curSel">Report currency</label>
          <select id="srct-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="srct-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="srct-bench">
        <div className="srct-form-col">
          {[1,2,3].map(g=>(
            <div className="srct-grp" key={g}>
              <div className="srct-grp-h"><span className="srct-grp-n">{GROUPS[g].n}</span><span className="srct-grp-t">{GROUPS[g].t}</span></div>
              <div className="srct-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="srct-rail">
          <div className="srct-rail-in">
            <div className="srct-verdict">
              <div className="srct-verdict-band srct-neutral">ready</div>
              <div className="srct-verdict-body">
                <div className="srct-big">{canGenerate?"✓":"—"}</div>
                <div className="srct-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="srct-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="srct-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="srct-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="srct-conf" style={{color:"var(--srct-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="srct-conf" style={{color:"var(--srct-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="srct-report" ref={reportRef}>
          <div className="srct-rep-mast">
            <h2>Scrap & Rework Cost Tracker — proof report</h2>
            <div className="srct-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="srct-rep-body">
            <h3 className="srct-sec-h">Key outputs</h3>
                        <div className="srct-stat"><span>Scrap cost (period)</span><b>{serverResult.outputs["out_scrapCost"]!=null?(!isFinite(serverResult.outputs["out_scrapCost"])?"—":serverResult.outputs["out_scrapCost"].toFixed(2)):"—"}</b></div>
            <div className="srct-stat"><span>Rework cost (period)</span><b>{serverResult.outputs["out_reworkCost"]!=null?(!isFinite(serverResult.outputs["out_reworkCost"])?"—":serverResult.outputs["out_reworkCost"].toFixed(2)):"—"}</b></div>
            <div className="srct-stat"><span>Total defect units</span><b>{serverResult.outputs["out_totalDefectUnits"]!=null?(!isFinite(serverResult.outputs["out_totalDefectUnits"])?"—":serverResult.outputs["out_totalDefectUnits"].toFixed(2)):"—"}</b></div>
            <div className="srct-sec-h" style={{marginTop:"24px"}}>All computed outputs</div>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.includes("fmea")&&!k.includes("Trigger")).slice(0,10).map(([k,v])=>(
              <div className="srct-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="srct-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="srct-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="srct-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="manufacturing"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
