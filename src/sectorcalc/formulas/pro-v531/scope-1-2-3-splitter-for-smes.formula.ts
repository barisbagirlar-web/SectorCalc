import "server-only";

export const toolKey = "scope-1-2-3-splitter-for-smes";
export const formulaVersion = "5.3.1-pro-baris.1";

function G(i,k){return i[k]===undefined||i[k]===null?0:Number(i[k])}
function R(v,p){p=p||2;const n=Number(v);return isNaN(n)?0:Math.round(n*Math.pow(10,p))/Math.pow(10,p)}
function X(v){return v!==null&&v!==undefined&&v!==""}

export function calculate(inputs) {
  const w=[];const o={};
  const A=G(inputs,"A");const B=G(inputs,"B");const C=G(inputs,"C");
  const D=G(inputs,"D");const E=G(inputs,"E");const CF=G(inputs,"CF");
  if(!X(A))w.push("Missing A");if(!X(B))w.push("Missing B");
  if(!X(C))w.push("Missing C");if(!X(D))w.push("Missing D");
  const r1=R(A*B);const r2=C>0?R(B/C):0;const r3=R(r2*D);
  const u=Math.max(D,0.01)>0?R(r1/Math.max(D,0.01)):0;
  const r4=R(r3*E);const r5=CF>0?R(r4*CF):0;const r6=R(r5*1000);
  o["out_evidence_completeness"]=R(A/B);o["out_normalized_demand"]=R(A);
  o["out_reference_deviation"]=R(B/C);o["out_derating_factor"]=R(E);
  o["out_demand_metric"]=R(r1);o["out_capacity_metric"]=R(r2);
  o["out_utilization_margin"]=R(u);o["out_expanded_uncertainty"]=R(u*0.025);
  o["out_threshold_crossing"]=R(r3>100?1:0);o["out_sensitivity_driver"]=R(r4);
  o["out_fmea_trigger"]=R(r5>50?1:0);o["out_money_at_risk"]=R(r6);
  o["out_scenario_delta"]=R(r6-r5*1000);o["out_audit_hash_payload"]=R(r1+r2+r3+r4+r5);
  o["out_final_decision_state"]=R(r6>100000?-1:1);
  return{status: w.length===0?"OK":"REVIEW",outputs: o,warnings: w.length?w:[],outputKeys: Object.keys(o),redaction_status:"PUBLIC_SAFE_REDACTED"};
}