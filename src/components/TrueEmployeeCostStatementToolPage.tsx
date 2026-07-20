"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/tecs-tool.css";

const TOOL_KEY = "true-employee-cost-statement";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_annual_base_salary": { label:"Annual base salary", def:50000, hard:[0,50000000.0], ref:[20000,500000], refUnit:"", hint:"Gross base salary before any employer add-ons.", src:"offer letter / payroll system", grp:1 },
  "n_payroll_tax_rate": { label:"Employer payroll tax rate", def:14.499999999999998, hard:[0,50.0], ref:[0.05,0.35], refUnit:"%", hint:"Combined employer NI / social security / pension contributions.", src:"national rate schedule", grp:1, pct:true },
  "n_annual_benefits_cost": { label:"Annual benefits cost", def:3800, hard:[0,200000.0], ref:[0,50000], refUnit:"", hint:"Health, dental, vision, pension matching paid by the employer.", src:"HR policy / benefits invoice", grp:2 },
  "n_annual_insurance_cost": { label:"Annual insurance cost", def:1200, hard:[0,100000.0], ref:[0,20000], refUnit:"", hint:"Workers' comp, liability insurance attributable to this role.", src:"insurance policy allocation", grp:2 },
  "n_annual_training_cost": { label:"Annual training allocation", def:1500, hard:[0,50000.0], ref:[0,10000], refUnit:"", hint:"Training, courses, certifications per year.", src:"L&D budget", grp:2 },
  "n_annual_equipment_it_cost": { label:"Annual equipment & IT cost", def:2500, hard:[0,100000.0], ref:[0,20000], refUnit:"", hint:"Laptop, phone, software licences, tooling.", src:"IT / ops budget", grp:2 },
  "n_annual_workspace_facility_cost": { label:"Annual workspace cost", def:4800, hard:[0,200000.0], ref:[0,50000], refUnit:"", hint:"Desk, office rent, utilities allocated to this role.", src:"facilities cost allocation", grp:3 },
  "n_target_billable_utilization_ratio": { label:"Productive utilisation ratio", def:85.0, hard:[1.0,100], ref:[0.6,1], refUnit:"%", hint:"Fraction of paid hours that are productive/billable.", src:"HR / project management system", grp:3, pct:true },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Base compensation", d:"Salary and the direct payroll taxes it triggers." },
  2: { n:"02", t:"Non-cash employment costs", d:"Benefits, insurance, training, and equipment allocated to this role." },
  3: { n:"03", t:"Workspace & utilisation", d:"Facility cost and the productive-hours assumption that drives the hourly cost figure." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${cs}${f.ref[0].toLocaleString()}–${cs}${f.ref[1].toLocaleString()}${f.refUnit?" "+f.refUnit:""}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function TrueEmployeeCostStatementToolPage() {
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
    const f=FIELDS[id]; const st=fieldStates[id]; const p="tecs";
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
    <div className="tecs-shell">
      <div className="tecs-mast">
        <div className="tecs-kicker">SectorCalc PRO · HR Finance · Fully-loaded cost of hire</div>
        <h1>True Employee Cost Statement</h1>
        <p className="tecs-lede">What does an employee actually cost? Computes the fully-loaded annual cost including payroll taxes, benefits, insurance, training, and overhead — with a sealed proof report.</p>
        <div className="tecs-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="tecs-curbar">
          <label htmlFor="tecs-curSel">Report currency</label>
          <select id="tecs-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="tecs-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="tecs-bench">
        <div className="tecs-form-col">
          {[1,2,3].map(g=>(
            <div className="tecs-grp" key={g}>
              <div className="tecs-grp-h"><span className="tecs-grp-n">{GROUPS[g].n}</span><span className="tecs-grp-t">{GROUPS[g].t}</span></div>
              <div className="tecs-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="tecs-rail">
          <div className="tecs-rail-in">
            <div className="tecs-verdict">
              <div className="tecs-verdict-band tecs-neutral">ready</div>
              <div className="tecs-verdict-body">
                <div className="tecs-big">{canGenerate?"✓":"—"}</div>
                <div className="tecs-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="tecs-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="tecs-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="tecs-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="tecs-conf" style={{color:"var(--tecs-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="tecs-conf" style={{color:"var(--tecs-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="tecs-report" ref={reportRef}>
          <div className="tecs-rep-mast">
            <h2>True Employee Cost Statement — proof report</h2>
            <div className="tecs-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="tecs-rep-body">
            <h3 className="tecs-sec-h">Key outputs</h3>
                        <div className="tecs-stat"><span>Hourly cost (productive)</span><b>{serverResult.outputs["out_productive_hourly_cost"]!=null?(!isFinite(serverResult.outputs["out_productive_hourly_cost"])?"—":serverResult.outputs["out_productive_hourly_cost"].toFixed(2)):"—"}</b></div>
            <div className="tecs-stat"><span>Monthly employer cost</span><b>{serverResult.outputs["out_monthly_employer_cost"]!=null?(!isFinite(serverResult.outputs["out_monthly_employer_cost"])?"—":serverResult.outputs["out_monthly_employer_cost"].toFixed(2)):"—"}</b></div>
            <div className="tecs-stat"><span>Base-to-loaded multiplier</span><b>{serverResult.outputs["out_base_to_loaded_multiplier"]!=null?(!isFinite(serverResult.outputs["out_base_to_loaded_multiplier"])?"—":serverResult.outputs["out_base_to_loaded_multiplier"].toFixed(2)):"—"}</b></div>
            <div className="tecs-sec-h" style={{marginTop:"24px"}}>All computed outputs</div>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.includes("fmea")&&!k.includes("Trigger")).slice(0,10).map(([k,v])=>(
              <div className="tecs-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="tecs-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="tecs-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="tecs-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="hr"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
