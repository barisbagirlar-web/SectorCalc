"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/ovh-tool.css";

const TOOL_KEY = "outsource-vs-in-house-analyzer";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_in_house_material_cost": { label:"In-house material cost/unit", def:12.5, hard:[0,1000000.0], ref:[1,10000], refUnit:"", hint:"Material cost per unit if made in-house.", src:"BOM / costing system", grp:1 },
  "n_in_house_labor_cost": { label:"In-house labor cost/unit", def:8, hard:[0,1000000.0], ref:[1,5000], refUnit:"", hint:"Labor cost per unit if made in-house.", src:"job costing", grp:1 },
  "n_in_house_overhead": { label:"In-house overhead/unit", def:4.5, hard:[0,1000000.0], ref:[0,5000], refUnit:"", hint:"Overhead allocated per unit if made in-house.", src:"cost accounting", grp:1 },
  "n_in_house_setup_cost": { label:"In-house setup cost", def:5000, hard:[0,10000000.0], ref:[100,500000], refUnit:"", hint:"One-time setup/tooling cost for in-house production.", src:"engineering estimate", grp:1 },
  "n_outsource_unit_price": { label:"Outsource unit price", def:18, hard:[0,1000000.0], ref:[1,10000], refUnit:"", hint:"Price quoted by the outsource supplier per unit.", src:"supplier quote", grp:2 },
  "n_outsource_logistics_cost": { label:"Outsource logistics cost/unit", def:2.5, hard:[0,100000.0], ref:[0,1000], refUnit:"", hint:"Freight and logistics cost per unit if outsourced.", src:"logistics quote", grp:2 },
  "n_annual_volume": { label:"Annual volume", def:10000, hard:[0,100000000.0], ref:[100,1000000], refUnit:"units/yr", hint:"Annual production volume for this part.", src:"production forecast", grp:3 },
  "n_quality_risk_premium_pct": { label:"Quality risk premium", def:5, hard:[0,100], ref:[0,25], refUnit:"%", hint:"Risk premium applied to outsourced cost for quality/supply risk.", src:"risk assessment", grp:3 },
  "n_capacity_utilization_pct": { label:"In-house capacity utilisation", def:75, hard:[0,100], ref:[40,100], refUnit:"%", hint:"Current utilisation of the in-house capacity that would make this part.", src:"capacity planning", grp:3 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"In-house cost", d:"Material, labor, overhead, and setup cost to make this part yourself." },
  2: { n:"02", t:"Outsource cost", d:"Unit price and logistics cost if outsourced." },
  3: { n:"03", t:"Volume & risk", d:"Annual volume, quality risk premium, and capacity utilisation." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()}${f.refUnit?" "+f.refUnit:""}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function OutsourceVsInHouseAnalyzerToolPage() {
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
      if(Array.isArray(data.outputs)) { for(const o of data.outputs) if(o && typeof o.id==="string" && typeof o.value==="number" && Number.isFinite(o.value)) outputsMap[o.id]=o.value; }
      else if(data.outputs && typeof data.outputs==="object") { for(const [k,v] of Object.entries(data.outputs as Record<string,unknown>)) if(typeof v==="number" && Number.isFinite(v)) outputsMap[k]=v; }
      const seal=data.audit_seal as Record<string,unknown>|undefined;
      if(!seal||seal.seal_status!=="SEALED"||typeof seal.output_hash!=="string") throw new Error("Sealed response missing.");
      setServerResult({outputs:outputsMap,seal:{output_hash:seal.output_hash as string,hash_algorithm:seal.hash_algorithm as string,executed_at:seal.executed_at as string},inputs:snap,currency:snapCur});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    } catch(err){ setExecuteError(err instanceof Error?err.message:"Execution failed"); } finally{ setIsExecuting(false); }
  },[rawInputs,isExecuting,usageSessionId,authToken,curSym]);

  const renderField=(id:string)=>{
    const f=FIELDS[id]; const st=fieldStates[id]; const p="ovh";
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
    <div className="ovh-shell">
      <div className="ovh-mast">
        <div className="ovh-kicker">SectorCalc PRO · Manufacturing · Make-or-buy decision</div>
        <h1>Outsource vs In-House Analyzer</h1>
        <p className="ovh-lede">Should this part be made in-house or outsourced? Compares total in-house cost against outsourced price plus logistics and quality risk — with a sealed proof report.</p>
        <div className="ovh-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="ovh-curbar">
          <label htmlFor="ovh-curSel">Report currency</label>
          <select id="ovh-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="ovh-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="ovh-bench">
        <div className="ovh-form-col">
          {[1,2,3].map(g=>(
            <div className="ovh-grp" key={g}>
              <div className="ovh-grp-h"><span className="ovh-grp-n">{GROUPS[g].n}</span><span className="ovh-grp-t">{GROUPS[g].t}</span></div>
              <div className="ovh-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="ovh-rail">
          <div className="ovh-rail-in">
            <div className="ovh-verdict">
              <div className="ovh-verdict-band ovh-neutral">ready</div>
              <div className="ovh-verdict-body">
                <div className="ovh-big">{canGenerate?"✓":"—"}</div>
                <div className="ovh-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="ovh-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="ovh-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="ovh-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="ovh-conf" style={{color:"var(--ovh-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="ovh-conf" style={{color:"var(--ovh-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="ovh-report" ref={reportRef}>
          <div className="ovh-rep-mast">
            <h2>Outsource vs In-House Analyzer — proof report</h2>
            <div className="ovh-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="ovh-rep-body">
            <h3 className="ovh-sec-h">Sealed outputs</h3>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.toLowerCase().includes("fmea")&&!k.toLowerCase().includes("trigger")&&!k.toLowerCase().includes("crossing")).slice(0,12).map(([k,v])=>(
              <div className="ovh-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="ovh-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="ovh-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="ovh-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="manufacturing"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
