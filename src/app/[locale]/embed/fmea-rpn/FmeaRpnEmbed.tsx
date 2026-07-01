"use client";
import { useState, useCallback } from "react";

export function FmeaRpnEmbed() {
  const [s, setS] = useState(7);
  const [o, setO] = useState(5);
  const [d, setD] = useState(4);
  const [r, setR] = useState<number|null>(null);
  const calc = useCallback(() => setR(s*o*d), [s,o,d]);
  return (
    <div style={{fontFamily:"system-ui,sans-serif",padding:16,maxWidth:480,margin:"0 auto"}}>
      <h2 style={{fontSize:16,fontWeight:700,marginBottom:12}}>FMEA RPN Calculator</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
        <div><label style={{display:"block",fontSize:11,fontWeight:600,marginBottom:4}}>Severity</label><select value={s} onChange={e=>setS(Number(e.target.value))} style={{width:"100%",padding:"6px 8px",fontSize:13,border:"1px solid #ccc"}}>{[1,2,3,4,5,6,7,8,9,10].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
        <div><label style={{display:"block",fontSize:11,fontWeight:600,marginBottom:4}}>Occurrence</label><select value={o} onChange={e=>setO(Number(e.target.value))} style={{width:"100%",padding:"6px 8px",fontSize:13,border:"1px solid #ccc"}}>{[1,2,3,4,5,6,7,8,9,10].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
        <div><label style={{display:"block",fontSize:11,fontWeight:600,marginBottom:4}}>Detection</label><select value={d} onChange={e=>setD(Number(e.target.value))} style={{width:"100%",padding:"6px 8px",fontSize:13,border:"1px solid #ccc"}}>{[1,2,3,4,5,6,7,8,9,10].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
      </div>
      <button onClick={calc} style={{width:"100%",padding:"10px 16px",fontSize:14,fontWeight:600,background:"#1a1915",color:"#fff",border:"none",cursor:"pointer"}}>Calculate RPN</button>
      {r!==null && <div style={{marginTop:16,textAlign:"center"}}><p style={{fontSize:12,color:"#666"}}>RPN = {s} \u00d7 {o} \u00d7 {d}</p><p style={{fontSize:28,fontWeight:700,margin:"4px 0"}}>{r}</p></div>}
      <p style={{marginTop:16,fontSize:11,color:"#999",textAlign:"center"}}><a href="https://sectorcalc.com/calculators/fmea-rpn" target="_blank" rel="noopener" style={{color:"#666"}}>FMEA RPN Calculator by SectorCalc</a></p>
    </div>
  );
}
