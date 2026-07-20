"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/cspf-tool.css";

const TOOL_KEY = "customer-sku-profitability-forensics";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_unit_price": { label:"Unit selling price", def:250, hard:[0,1000000.0], ref:[5,50000], refUnit:"", hint:"Selling price per unit.", src:"price list", grp:1 },
  "n_unit_variable_cost": { label:"Unit variable cost", def:140, hard:[0,1000000.0], ref:[1,40000], refUnit:"", hint:"Direct variable cost per unit.", src:"BOM / costing system", grp:1 },
  "n_logistics_cost_pct": { label:"Logistics cost", def:8.0, hard:[0,100], ref:[0.02,0.25], refUnit:"%", hint:"Freight, warehousing, fulfillment as % of price.", src:"logistics cost allocation", grp:2, pct:true },
  "n_service_cost_pct": { label:"Service/support cost", def:5.0, hard:[0,100], ref:[0.01,0.2], refUnit:"%", hint:"Customer service and support cost as % of price.", src:"support cost allocation", grp:2, pct:true },
  "n_return_rate_pct": { label:"Return rate", def:3.0, hard:[0,100], ref:[0,0.15], refUnit:"%", hint:"Fraction of units returned.", src:"returns log", grp:2, pct:true },
  "n_target_margin": { label:"Target margin", def:35.0, hard:[0,100], ref:[0.15,0.6], refUnit:"%", hint:"The margin target for this SKU.", src:"pricing policy", grp:3, pct:true },
  "n_annual_volume": { label:"Annual volume (units/yr canonical)", def:3500, hard:[0,500000000.0], ref:[10,1000000], refUnit:"units/yr", hint:"Annual unit sales volume.", src:"sales forecast / ERP", grp:3 },
  "n_labor_rate": { label:"Labor rate", def:45, hard:[0,500000], ref:[15,200], refUnit:"/h", hint:"Fully loaded labor cost per hour (for context).", src:"HR / payroll", grp:3 },
  "n_overhead_rate": { label:"Overhead rate", def:20, hard:[0,1000000], ref:[5,200], refUnit:"/h", hint:"Overhead per hour (for context).", src:"cost accounting", grp:3 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Price & cost", d:"Unit price and variable cost — the raw contribution before burdens." },
  2: { n:"02", t:"Burdens", d:"Logistics, service, and return costs as a percentage of price." },
  3: { n:"03", t:"Volume & rates", d:"Annual volume and labor/overhead rates for context." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${cs}${f.ref[0].toLocaleString()}–${cs}${f.ref[1].toLocaleString()}${f.refUnit?" "+f.refUnit:""}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function CustomerSkuProfitabilityForensicsToolPage() {
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
      if(Array.isArray(data.outputs)) for(const o of data.outputs) if(typeof o.value==="number") outputsMap[o.id]=o.value;
      else if(data.outputs) Object.assign(outputsMap,data.outputs);
      const seal=data.audit_seal as Record<string,unknown>|undefined;
      if(!seal||seal.seal_status!=="SEALED"||typeof seal.output_hash!=="string") throw new Error("Sealed response missing.");
      setServerResult({outputs:outputsMap,seal:{output_hash:seal.output_hash as string,hash_algorithm:seal.hash_algorithm as string,executed_at:seal.executed_at as string},inputs:snap,currency:snapCur});
      setTimeout(()=>reportRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),100);
    } catch(err){ setExecuteError(err instanceof Error?err.message:"Execution failed"); } finally{ setIsExecuting(false); }
  },[rawInputs,isExecuting,usageSessionId,authToken,curSym]);

  const renderField=(id:string)=>{
    const f=FIELDS[id]; const st=fieldStates[id]; const p="cspf";
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
    <div className="cspf-shell">
      <div className="cspf-mast">
        <div className="cspf-kicker">SectorCalc PRO · Finance · SKU-level margin forensics</div>
        <h1>Customer / SKU Profitability Forensics</h1>
        <p className="cspf-lede">Is this SKU actually profitable once logistics, service, and returns are burdened in? A full contribution-margin forensic with a sealed proof report.</p>
        <div className="cspf-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="cspf-curbar">
          <label htmlFor="cspf-curSel">Report currency</label>
          <select id="cspf-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="cspf-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="cspf-bench">
        <div className="cspf-form-col">
          {[1,2,3].map(g=>(
            <div className="cspf-grp" key={g}>
              <div className="cspf-grp-h"><span className="cspf-grp-n">{GROUPS[g].n}</span><span className="cspf-grp-t">{GROUPS[g].t}</span></div>
              <div className="cspf-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="cspf-rail">
          <div className="cspf-rail-in">
            <div className="cspf-verdict">
              <div className="cspf-verdict-band cspf-neutral">ready</div>
              <div className="cspf-verdict-body">
                <div className="cspf-big">{canGenerate?"✓":"—"}</div>
                <div className="cspf-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="cspf-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="cspf-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="cspf-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="cspf-conf" style={{color:"var(--cspf-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="cspf-conf" style={{color:"var(--cspf-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="cspf-report" ref={reportRef}>
          <div className="cspf-rep-mast">
            <h2>Customer / SKU Profitability Forensics — proof report</h2>
            <div className="cspf-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="cspf-rep-body">
            <h3 className="cspf-sec-h">Sealed outputs</h3>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.toLowerCase().includes("fmea")&&!k.toLowerCase().includes("trigger")&&!k.toLowerCase().includes("crossing")).slice(0,12).map(([k,v])=>(
              <div className="cspf-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="cspf-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="cspf-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="cspf-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="finance"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
