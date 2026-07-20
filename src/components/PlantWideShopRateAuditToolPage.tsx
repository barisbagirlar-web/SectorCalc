"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/pwsr-tool.css";

const TOOL_KEY = "plant-wide-shop-rate-cost-structure-audit";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_total_annual_cost": { label:"Total annual plant cost", def:1200000, hard:[0,1000000000.0], ref:[100000,100000000.0], refUnit:"", hint:"Total annual operating cost for the plant.", src:"P&L / cost accounting", grp:1 },
  "n_total_productive_hours": { label:"Total productive hours", def:32000, hard:[0,1000000.0], ref:[1000,200000], refUnit:"h", hint:"Total productive hours across the plant per year.", src:"MES / production log", grp:1 },
  "n_machine_group_cost": { label:"Machine group annual cost", def:450000, hard:[0,100000000.0], ref:[10000,10000000.0], refUnit:"", hint:"Annual cost attributable to this machine group.", src:"cost allocation", grp:2 },
  "n_machine_group_hours": { label:"Machine group hours", def:12000, hard:[0,1000000.0], ref:[500,100000], refUnit:"h", hint:"Annual productive hours for this machine group.", src:"MES / production log", grp:2 },
  "n_overhead_pool": { label:"Overhead pool", def:380000, hard:[0,100000000.0], ref:[10000,10000000.0], refUnit:"", hint:"Total overhead to be allocated across the plant.", src:"cost accounting", grp:3 },
  "n_overhead_allocation_base": { label:"Overhead allocation base", def:32000, hard:[0,10000000.0], ref:[1000,1000000.0], refUnit:"h", hint:"The base (usually hours) overhead is allocated across.", src:"cost accounting policy", grp:3 },
  "n_current_shop_rate": { label:"Current shop rate", def:65, hard:[0,10000], ref:[20,500], refUnit:"/h", hint:"The shop rate currently charged/used.", src:"current rate card", grp:3 },
  "n_target_margin_pct": { label:"Target margin", def:15, hard:[0,100], ref:[5,40], refUnit:"%", hint:"Target margin to build into the audited shop rate.", src:"pricing policy", grp:3 },
  "n_utilization_pct": { label:"Utilisation", def:78, hard:[0,100], ref:[50,100], refUnit:"%", hint:"Actual utilisation of available capacity.", src:"capacity planning", grp:3 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Plant-wide totals", d:"Total annual cost and productive hours across the whole plant." },
  2: { n:"02", t:"Machine group", d:"Cost and hours for the specific machine group being audited." },
  3: { n:"03", t:"Overhead & targets", d:"Overhead pool, current shop rate, target margin, and utilisation." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()}${f.refUnit?" "+f.refUnit:""}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function PlantWideShopRateAuditToolPage() {
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
    const f=FIELDS[id]; const st=fieldStates[id]; const p="pwsr";
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
    <div className="pwsr-shell">
      <div className="pwsr-mast">
        <div className="pwsr-kicker">SectorCalc PRO · Manufacturing · Shop rate audit</div>
        <h1>Plant-Wide Shop Rate & Cost Structure Audit</h1>
        <p className="pwsr-lede">Is your current shop rate right? Audits plant-wide cost structure against actual productive hours and overhead allocation — with a sealed proof report.</p>
        <div className="pwsr-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="pwsr-curbar">
          <label htmlFor="pwsr-curSel">Report currency</label>
          <select id="pwsr-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="pwsr-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="pwsr-bench">
        <div className="pwsr-form-col">
          {[1,2,3].map(g=>(
            <div className="pwsr-grp" key={g}>
              <div className="pwsr-grp-h"><span className="pwsr-grp-n">{GROUPS[g].n}</span><span className="pwsr-grp-t">{GROUPS[g].t}</span></div>
              <div className="pwsr-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="pwsr-rail">
          <div className="pwsr-rail-in">
            <div className="pwsr-verdict">
              <div className="pwsr-verdict-band pwsr-neutral">ready</div>
              <div className="pwsr-verdict-body">
                <div className="pwsr-big">{canGenerate?"✓":"—"}</div>
                <div className="pwsr-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="pwsr-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="pwsr-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="pwsr-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="pwsr-conf" style={{color:"var(--pwsr-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="pwsr-conf" style={{color:"var(--pwsr-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="pwsr-report" ref={reportRef}>
          <div className="pwsr-rep-mast">
            <h2>Plant-Wide Shop Rate & Cost Structure Audit — proof report</h2>
            <div className="pwsr-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="pwsr-rep-body">
            <h3 className="pwsr-sec-h">Sealed outputs</h3>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.toLowerCase().includes("fmea")&&!k.toLowerCase().includes("trigger")&&!k.toLowerCase().includes("crossing")).slice(0,12).map(([k,v])=>(
              <div className="pwsr-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="pwsr-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="pwsr-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="pwsr-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="manufacturing"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
