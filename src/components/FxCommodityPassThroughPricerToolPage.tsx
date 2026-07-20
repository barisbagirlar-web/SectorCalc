"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUserSubscription } from "@/lib/features/billing/use-user-subscription";
import { isProBypassEmail } from "@/lib/features/billing/subscription";
import { PremiumReportFeedback } from "@/components/reports/PremiumReportFeedback";
import "@/styles/fxcp-tool.css";

const TOOL_KEY = "fx-commodity-pass-through-pricer";
const BYPASS_SESSION_ID = "bypass-unlimited";
const CURRENCIES = [
  { code:"EUR",sym:"€" },{ code:"USD",sym:"$" },{ code:"GBP",sym:"£" },
  { code:"TRY",sym:"₺" },{ code:"CHF",sym:"CHF" },{ code:"AED",sym:"AED" },
];

interface FieldState { value:string; error:string|null; warn:boolean; }
interface FieldDef { label:string; def:number; hard:[number,number]; ref:[number,number]; refUnit:string; hint:string; src:string; grp:number; pct?:boolean; }

const FIELDS: Record<string,FieldDef> = {
  "n_base_price": { label:"Base price", def:1000, hard:[0,10000000.0], ref:[10,1000000], refUnit:"", hint:"Current base price before FX/commodity pass-through.", src:"price list", grp:1 },
  "n_fx_rate_spot": { label:"Spot FX rate", def:1.12, hard:[0.01,100], ref:[0.5,2], refUnit:"", hint:"Current spot exchange rate.", src:"FX market data", grp:1 },
  "n_fx_rate_budget": { label:"Budget FX rate", def:1.08, hard:[0.01,100], ref:[0.5,2], refUnit:"", hint:"The FX rate used when the price was originally set.", src:"budget / hedge documentation", grp:1 },
  "n_commodity_index_current": { label:"Commodity index (current)", def:185, hard:[0,100000.0], ref:[50,500], refUnit:"", hint:"Current commodity price index.", src:"commodity market data", grp:2 },
  "n_commodity_index_budget": { label:"Commodity index (budget)", def:170, hard:[0,100000.0], ref:[50,500], refUnit:"", hint:"Commodity price index when the price was set.", src:"budget documentation", grp:2 },
  "n_material_cost_pct": { label:"Material cost share", def:45, hard:[0,100], ref:[10,80], refUnit:"%", hint:"Material as a percentage of total cost.", src:"cost breakdown", grp:2 },
  "n_fx_hedge_pct": { label:"FX hedge coverage", def:60, hard:[0,100], ref:[0,100], refUnit:"%", hint:"Percentage of FX exposure that's hedged.", src:"treasury / hedge policy", grp:3 },
  "n_commodity_hedge_pct": { label:"Commodity hedge coverage", def:50, hard:[0,100], ref:[0,100], refUnit:"%", hint:"Percentage of commodity exposure that's hedged.", src:"treasury / hedge policy", grp:3 },
  "n_annual_volume": { label:"Annual volume", def:5000, hard:[0,100000000.0], ref:[100,1000000], refUnit:"units/yr", hint:"Annual sales volume at this price.", src:"sales forecast", grp:3 },
  "n_source_confidence_ratio": { label:"Source confidence", def:85.0, hard:[0,100], ref:[0.7,1], refUnit:"%", hint:"How verified are these figures?", src:"engineer's assessment", grp:3, pct:true },
};
const GROUPS: Record<number,{n:string;t:string;d:string}> = {
  1: { n:"01", t:"Base price & FX", d:"Base price and the FX rates driving currency exposure." },
  2: { n:"02", t:"Commodity exposure", d:"Commodity index movement and material cost share." },
  3: { n:"03", t:"Hedging & volume", d:"Hedge coverage and annual volume." },
};

function fmtRef(f:FieldDef,cs:string):string {
  if(f.pct) return `Ref: ${(f.ref[0]*100).toFixed(0)}–${(f.ref[1]*100).toFixed(0)}%`;
  return `Ref: ${f.ref[0].toLocaleString()}–${f.ref[1].toLocaleString()}${f.refUnit?" "+f.refUnit:""}`;
}

interface ServerSeal { output_hash?:string; hash_algorithm?:string; executed_at?:string; }
interface ServerResultState { outputs:Record<string,number>; seal:ServerSeal; inputs:Record<string,number>; currency:string; }

export default function FxCommodityPassThroughPricerToolPage() {
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
    const f=FIELDS[id]; const st=fieldStates[id]; const p="fxcp";
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
    <div className="fxcp-shell">
      <div className="fxcp-mast">
        <div className="fxcp-kicker">SectorCalc PRO · Finance · Cost pass-through pricing</div>
        <h1>FX & Commodity Pass-Through Pricer</h1>
        <p className="fxcp-lede">How much should price move given FX and commodity swings? Computes the pass-through price adjustment accounting for hedging — with a sealed proof report.</p>
        <div className="fxcp-meta"><span>Engine <b>v5.3.2-domain</b></span><span>Report <b>sealed · SHA-256</b></span></div>
        <div className="fxcp-curbar">
          <label htmlFor="fxcp-curSel">Report currency</label>
          <select id="fxcp-curSel" value={curSym} onChange={e=>setCurSym(e.target.value)} style={{minHeight:"48px"}}>
            {CURRENCIES.map(c=><option key={c.code} value={c.sym}>{c.code} · {c.sym}</option>)}
          </select>
          <span className="fxcp-curnote">Symbol only — no exchange-rate conversion.</span>
        </div>
      </div>
      <div className="fxcp-bench">
        <div className="fxcp-form-col">
          {[1,2,3].map(g=>(
            <div className="fxcp-grp" key={g}>
              <div className="fxcp-grp-h"><span className="fxcp-grp-n">{GROUPS[g].n}</span><span className="fxcp-grp-t">{GROUPS[g].t}</span></div>
              <div className="fxcp-grp-d">{GROUPS[g].d}</div>
              {Object.keys(FIELDS).filter(id=>FIELDS[id].grp===g).map(renderField)}
            </div>
          ))}
        </div>
        <div className="fxcp-rail">
          <div className="fxcp-rail-in">
            <div className="fxcp-verdict">
              <div className="fxcp-verdict-band fxcp-neutral">ready</div>
              <div className="fxcp-verdict-body">
                <div className="fxcp-big">{canGenerate?"✓":"—"}</div>
                <div className="fxcp-big-cap">{errorCount?`${errorCount} input(s) need attention`:"all inputs valid — generate report"}</div>
              </div>
            </div>
            {!usageSessionId?(
              <button className="fxcp-cta" disabled={sessionLoading||!canGenerate} onClick={requestSession}>
                {sessionLoading?"Checking credits…":"Unlock sealed report · 1 credit"}
              </button>
            ):(
              <button className="fxcp-cta" disabled={!canGenerate||isExecuting} onClick={handleGenerate}>
                {isExecuting?"Generating…":"Generate sealed report"}
              </button>
            )}
            {remainingRuns!=null&&usageSessionId!==BYPASS_SESSION_ID&&<div className="fxcp-conf">{remainingRuns} run(s) remaining.</div>}
            {sessionError&&<div className="fxcp-conf" style={{color:"var(--fxcp-neg)"}}>{sessionError}</div>}
            {executeError&&<div className="fxcp-conf" style={{color:"var(--fxcp-neg)"}}>{executeError}</div>}
          </div>
        </div>
      </div>
      {serverResult&&(
        <div className="fxcp-report" ref={reportRef}>
          <div className="fxcp-rep-mast">
            <h2>FX & Commodity Pass-Through Pricer — proof report</h2>
            <div className="fxcp-rid">SC-PRO · {new Date().toISOString().slice(0,10)}<br/>engine v5.3.2-domain · {serverResult.currency}</div>
          </div>
          <div className="fxcp-rep-body">
            <h3 className="fxcp-sec-h">Sealed outputs</h3>
            {Object.entries(serverResult.outputs).filter(([k])=>!k.includes("Payload")&&!k.toLowerCase().includes("fmea")&&!k.toLowerCase().includes("trigger")&&!k.toLowerCase().includes("crossing")).slice(0,12).map(([k,v])=>(
              <div className="fxcp-stat-row" key={k}><span>{k.replace(/^out_/,"").replace(/_/g," ")}</span><b>{typeof v==="number"?(!isFinite(v)||Math.abs(v)>1e9?"—":v.toFixed(2)):"—"}</b></div>
            ))}
            <div className="fxcp-seal">SEAL · {serverResult.seal.hash_algorithm} {serverResult.seal.output_hash}<br/>Sealed at {serverResult.seal.executed_at??"—"}.</div>
            <button type="button" className="fxcp-print-btn" onClick={()=>window.print()}>Download PDF</button>
            <div className="fxcp-disc">Technical simulation only; not financial, legal, or engineering advice.</div>
            <PremiumReportFeedback key={serverResult.seal.output_hash} schemaSlug={TOOL_KEY} sectorSlug="finance"
              reportSlug={serverResult.seal.output_hash} inputSnapshot={serverResult.inputs}
              resultSnapshot={serverResult.outputs} currency={serverResult.currency} />
          </div>
        </div>
      )}
    </div>
  );
}
