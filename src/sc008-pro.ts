// @ts-nocheck
import { calculate } from './tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { lcg, sampleNormal, sampleUniform, sampleTruncatedNormal, sampleTriangular } from './core/monte-carlo.js';
import { D } from './core/engine.js';
import { parseCSV, saveProject, loadProject, listProjects, makeShareURL, parseShareURL, compareRevisions } from './lib/sc008-p4.js';

// Sampling lives here (composed from monte-carlo.ts primitives); the MATH lives in
// formula.ts calculate(). calculate() receives the samples, so UI/PDF/share all agree.
const ENGINE_VERSION = 'SC008-2026.07-formula-v1.0.0+dist';
const TH = { track:'#EDE9E2', grid:'#D5CFC5', axis:'#8A847A', text:'#5A554D', ink:'#1A1714', blue:'#005387', green:'#237F52', amber:'#D05D29', red:'#9B2423', greenFill:'rgba(35,127,82,0.12)', amberFill:'rgba(208,93,41,0.10)', redFill:'rgba(155,36,35,0.12)', blueFill:'rgba(0,83,135,0.10)' };
const MC_RUNS = 10000;
const unitConv = { mm:{toMm:1,fromMm:1}, inch:{toMm:25.4,fromMm:1/25.4}, um:{toMm:0.001,fromMm:1000} };
const presets = {
  standard:{ specUpper:0.150, specLower:-0.150, cpkTarget:1.33, seed:12345, dims:[{name:'Spacer Width',nominal:25,tolerance:0.05,dist:'normal'},{name:'Bearing OD',nominal:30,tolerance:0.025,dist:'normal'},{name:'Housing Bore',nominal:-55,tolerance:0.04,dist:'normal'}] },
  tight:{ specUpper:0.050, specLower:-0.050, cpkTarget:1.67, seed:54321, dims:[{name:'Ti Spacer',nominal:15,tolerance:0.01,dist:'truncated_normal'},{name:'Ball Bearing',nominal:20,tolerance:0.005,dist:'truncated_normal'},{name:'Al Housing',nominal:-35,tolerance:0.015,dist:'normal'}] },
  loose:{ specUpper:0.300, specLower:-0.300, cpkTarget:1.00, seed:99999, dims:[{name:'Steel Plate',nominal:50,tolerance:0.2,dist:'uniform'},{name:'Bushing',nominal:25,tolerance:0.1,dist:'uniform'},{name:'Cast Housing',nominal:-75,tolerance:0.25,dist:'triangular'}] },
  vtight:{ specUpper:0.025, specLower:-0.025, cpkTarget:2.00, seed:77777, dims:[{name:'Implant Spacer',nominal:10,tolerance:0.005,dist:'truncated_normal'},{name:'Ceramic Bearing',nominal:8,tolerance:0.003,dist:'truncated_normal'},{name:'Ti Housing',nominal:-18,tolerance:0.008,dist:'truncated_normal'}] }
};
let currentUnit = 'mm';
let dimensions = presets.standard.dims.map(d => ({...d}));
let calcData = null;
const $ = (id) => document.getElementById(id);
let _reportSyncing = false;
function reportIsOpen(){ return !!($('reportArea') && $('reportArea').querySelector('.sc-report-hd')); }
function syncReportIfOpen(){
  if (_reportSyncing || !reportIsOpen() || !calcData) return;
  _reportSyncing = true;
  try { generateReport({ sync: true }); } finally { _reportSyncing = false; }
}

function toProjectState(){
  return {
    specUpper:$('specUpper').value, specLower:$('specLower').value, cpkTarget:$('cpkTarget').value,
    seed:$('mcSeed').value, unit:currentUnit,
    dims:dimensions.map(d => ({ name:d.name, nominal:d.nominal, tol:d.tolerance, dist:d.dist||'normal' }))
  };
}
function applyProjectState(st){
  $('specUpper').value=st.specUpper; $('specLower').value=st.specLower; $('cpkTarget').value=st.cpkTarget; $('mcSeed').value=st.seed;
  if (st.unit){ currentUnit=st.unit; $('unitSpec').value=st.unit; $('unitSpec2').value=st.unit; }
  if (Array.isArray(st.dims)){
    dimensions = st.dims.map(d => ({ name:d.name, nominal:d.nominal, tolerance:d.tol ?? d.tolerance, dist:d.dist||'normal' }));
  }
}
function fnv1a(str){ let h=0x811c9dc5; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,0x01000193); } return (h>>>0).toString(16).padStart(8,'0'); }

function renderDims(){
  $('dimList').innerHTML = dimensions.map((d,i)=>`<div class="sc-dim"><span class="sc-dim-num">${i+1}</span><input type="text" value="${d.name}" data-i="${i}" data-f="name" style="font-family:var(--font-sans);color:var(--text-secondary)"><input type="number" value="${d.nominal.toFixed(3)}" step="0.001" data-i="${i}" data-f="nominal"><input type="number" value="${d.tolerance.toFixed(3)}" step="0.001" min="0" data-i="${i}" data-f="tolerance"><select data-i="${i}" data-f="dist"><option value="normal" ${d.dist==='normal'?'selected':''}>normal</option><option value="uniform" ${d.dist==='uniform'?'selected':''}>uniform</option><option value="truncated_normal" ${d.dist==='truncated_normal'?'selected':''}>trunc-N</option><option value="triangular" ${d.dist==='triangular'?'selected':''}>triang.</option></select><button class="sc-dim-del" data-del="${i}">&times;</button></div>`).join('');
}

// Distribution semantics are explicit: normal & truncated_normal treat tol as +/-3 sigma;
// uniform & triangular treat tol as the hard half-range. This is the P2 contract made visible.
function sampleComponent(rng, c){
  const nom = D(c.nominal), tol = D(c.tol ?? c.tolerance);
  if (c.dist === 'uniform') return sampleUniform(rng, nom.minus(tol), nom.plus(tol));
  if (c.dist === 'triangular') return sampleTriangular(rng, nom.minus(tol), nom, nom.plus(tol));
  if (c.dist === 'truncated_normal') return sampleTruncatedNormal(rng, nom, tol.div(3), nom.minus(tol), nom.plus(tol));
  return sampleNormal(rng, nom, tol.div(3));
}
function mySimulate(comps, seed, n){
  const rng = lcg(seed); const out = [];
  for (let i=0;i<n;i++){ let s=D(0); for (const c of comps) s = s.plus(sampleComponent(rng, c)); out.push(s); }
  return out;
}
function histogram(samples, bins){
  if (!samples.length) return [];
  const min=Math.min(...samples), max=Math.max(...samples), w=(max-min)/bins||1;
  const out=Array.from({length:bins},(_,i)=>({x0:min+w*i,c:0}));
  for (const s of samples){ let idx=Math.floor((s-min)/w); if(idx>=bins)idx=bins-1; if(idx<0)idx=0; out[idx].c++; }
  return out;
}

function buildInput(){
  const toMm = unitConv[currentUnit].toMm;
  const su = (parseFloat($('specUpper').value)||0)*toMm;
  const sl = (parseFloat($('specLower').value)||0)*toMm;
  const cpkTarget = parseFloat($('cpkTarget').value)||1.33;
  const seed = parseInt($('mcSeed').value)||12345;
  const dims = dimensions.map(d => ({ name:d.name, nominal:d.nominal*toMm, tolerance:d.tolerance*toMm, dist:d.dist||'normal' }));
  const nominalSum = dims.reduce((s,d)=>s+d.nominal,0);
  const usl = nominalSum + su, lsl = nominalSum + sl;          // absolute limits around nominal sum (nominal-sum fix)
  const components = dims.map(d => ({ name:d.name, nominal:String(d.nominal), tol:String(d.tolerance), distribution:'normal' }));
  return { su, sl, cpkTarget, seed, dims, nominalSum, usl, lsl, uslD:D(usl), lslD:D(lsl), input:{ components, usl:String(usl), lsl:String(lsl), seed:String(seed), iterations:String(MC_RUNS) } };
}

function validate(){
  let ok=true;
  const su=parseFloat($('specUpper').value), sl=parseFloat($('specLower').value), cpkT=parseFloat($('cpkTarget').value);
  if(isNaN(su)||su<=0){ $('fld-specUpper').classList.add('has-error'); $('val-specUpper').className='sc-val error'; $('val-specUpper').textContent='X deviation + must be > 0'; ok=false; } else { $('fld-specUpper').classList.remove('has-error'); $('val-specUpper').className='sc-val ok'; $('val-specUpper').textContent='OK'; }
  if(isNaN(sl)||sl>=0){ $('fld-specLower').classList.add('has-error'); $('val-specLower').className='sc-val error'; $('val-specLower').textContent='X deviation - must be < 0'; ok=false; } else { $('fld-specLower').classList.remove('has-error'); $('val-specLower').className='sc-val ok'; $('val-specLower').textContent='OK'; }
  if(isNaN(cpkT)||cpkT<0.5||cpkT>3){ $('fld-cpkTarget').classList.add('has-error'); $('val-cpkTarget').className='sc-val error'; $('val-cpkTarget').textContent='X target 0.5-3.0'; ok=false; } else { $('fld-cpkTarget').classList.remove('has-error'); $('val-cpkTarget').className='sc-val ok'; $('val-cpkTarget').textContent=cpkT>=1.67?'OK tight target':'OK'; }
  dimensions.forEach(d=>{ if(!(d.tolerance>0)) ok=false; });
  return ok;
}

function compute(){
  if(!validate()){ $('liveResult').textContent='—'; $('liveSub').innerHTML=''; return; }
  const b = buildInput();
  let result, samplesNum, samples;
  try {
    samples = mySimulate(b.dims, b.seed, MC_RUNS);            // distribution-aware Decimal samples
    samplesNum = samples.map(s => s.toNumber());
    result = calculate(b.input, samples);                      // single math engine on those samples
  } catch(e){ $('liveResult').textContent='ERR'; $('liveSub').innerHTML='<span>'+e.message+'</span>'; return; }
  const rssTol=Number(result.rssPlus), wcTol=Number(result.worstPlus);
  const mcSpread=(Number(result.mcP9987)-Number(result.mcP0013))/2;
  const cpk=Number(result.cpk), ppm=Number(result.ppm);
  const specHalf=Math.abs(b.su);
  const rssInSpec = rssTol<=specHalf && (Number(result.nominalSum)+rssTol<=b.usl) && (Number(result.nominalSum)-rssTol>=b.lsl);
  const fromMm=unitConv[currentUnit].fromMm;
  const hist=histogram(samplesNum,28);
  // 95% CI on the empirical defect rate (Decimal); kills the false-precision PPM claim.
  const n=samples.length;
  const outCount=samples.filter(s=>s.gt(b.uslD)||s.lt(b.lslD)).length;
  const phatD=D(outCount).div(n);
  const seD=phatD.times(D(1).minus(phatD)).div(n).sqrt();
  const ciLo=Math.max(0, Number(phatD.minus(seD.times('1.96'))))*1e6;
  const ciHi=Number(phatD.plus(seD.times('1.96')))*1e6;
  const inputHash=fnv1a(JSON.stringify({c:b.input.components, dist:b.dims.map(d=>d.dist), usl:b.input.usl, lsl:b.input.lsl, seed:b.input.seed}));
  const outputHash=fnv1a(JSON.stringify(result));
  const calcId='SC008-'+inputHash.slice(0,8).toUpperCase();
  calcData={ b, result, samplesNum, rssTol, wcTol, mcSpread, cpk, ppm, ciLo, ciHi, specHalf, rssInSpec, fromMm, hist, inputHash, outputHash, calcId };
  $('liveResult').textContent='+/- '+(rssTol*fromMm).toFixed(4)+' '+currentUnit;
  $('liveSub').innerHTML='<span>'+b.dims.length+' dims</span><span>pred. Cpk '+cpk.toFixed(2)+'</span><span>'+(rssInSpec?'predicted in spec':'predicted OUT')+'</span>';
  syncReportIfOpen();
}

function loadPreset(key){
  const p=presets[key];
  $('specUpper').value=p.specUpper; $('specLower').value=p.specLower; $('cpkTarget').value=p.cpkTarget; $('mcSeed').value=p.seed;
  $('unitSpec').value='mm'; $('unitSpec2').value='mm'; currentUnit='mm';
  dimensions=p.dims.map(d=>({...d}));
  document.querySelectorAll('.sc-preset').forEach(b=>b.classList.toggle('active',b.dataset.preset===key));
  renderDims(); compute();
}
function convertUnits(){
  const nu=$('unitSpec').value; if(nu===currentUnit)return;
  const r=unitConv[currentUnit].toMm*unitConv[nu].fromMm;
  $('specUpper').value=(parseFloat($('specUpper').value)*r).toFixed(4);
  $('specLower').value=(parseFloat($('specLower').value)*r).toFixed(4);
  $('unitSpec2').value=nu;
  dimensions=dimensions.map(d=>({...d,nominal:+(d.nominal*r).toFixed(4),tolerance:+(d.tolerance*r).toFixed(4)}));
  currentUnit=nu; renderDims(); compute();
}
function loadFromURL(){
  const r = parseShareURL(location.search);
  if (!r.ok || !r.state) return;
  if (r.tampered) { alert('WARNING: this share link failed its integrity check — the inputs may have been altered. Values loaded but treat as untrusted.'); }
  applyProjectState(r.state);
}
function radarAxes(d){
  const specMargin=Math.max(0,Math.min(1,1-d.rssTol/d.specHalf));
  const cpkRatio=Math.max(0,Math.min(1,d.cpk/d.b.cpkTarget));
  const yieldRate=Math.max(0,Math.min(1,1-d.ppm/1e6));
  const mcRssAgree=Math.max(0,Math.min(1,1-Math.abs(d.mcSpread-d.rssTol)/Math.max(d.rssTol,1e-9)));
  const statGain=Math.max(0,Math.min(1,d.rssTol/Math.max(d.wcTol,1e-9)));
  return [{name:'Spec margin',val:specMargin,note:'1 - RSS/specHalf'},{name:'Pred. Cpk ratio',val:cpkRatio,note:'predicted Cpk / target'},{name:'Pred. yield',val:yieldRate,note:'1 - PPM/1e6'},{name:'MC-RSS agree',val:mcRssAgree,note:'sim vs RSS spread'},{name:'Stat. gain',val:statGain,note:'RSS / worst-case'}];
}

function generateReport(_opts){
  if(!calcData)compute();
  const d=calcData; if(!d)return;
  const u=d.fromMm, uL=currentUnit;
  const overall=!d.rssInSpec?'CRITICAL':(d.cpk<d.b.cpkTarget?'WARNING':'PASS');
  const gCol=overall==='PASS'?TH.green:(overall==='WARNING'?TH.amber:TH.red);
  const gaugeAngle=Math.max(-90,Math.min(90,(d.rssTol/d.specHalf)*90));
  const pColors=[TH.red,TH.amber,TH.blue,'#005387',TH.green];
  const top=d.result.pareto[0]; const axes=radarAxes(d);
  const maxC=Math.max(...d.hist.map(h=>h.c),1);
  const histBars=d.hist.map((h,i)=>{ const bw=500/d.hist.length; const bh=(h.c/maxC)*140; return `<rect x="${50+i*bw}" y="${150-bh}" width="${bw-1}" height="${bh}" fill="${TH.blue}" opacity="0.8"/>`; }).join('');
  const distUsed=[...new Set(d.b.dims.map(x=>x.dist))].join(', ');
  const whatIfs=d.result.pareto.slice(0,3).map(p=>{
    const tighterComps=d.b.dims.map(c=>c.name===p.name?{...c,tolerance:c.tolerance*0.9}:c);
    let nr; try{ const s=mySimulate(tighterComps,d.b.seed,MC_RUNS); nr=calculate({...d.b.input,components:tighterComps.map(c=>({name:c.name,nominal:String(c.nominal),tol:String(c.tolerance),distribution:'normal'}))},s); }catch(e){ return {name:p.name,cpk:d.cpk,ppm:d.ppm}; }
    return {name:p.name,cpk:Number(nr.cpk),ppm:Number(nr.ppm)};
  });
  const recHTML=overall!=='PASS'?`
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Tighten the top predicted contributor: ${top?top.name:'—'}</span></div><div class="sc-rec-body">It drives ${top?top.pct:'—'}% of predicted RSS variation.<br><span class="pos">-> See What-If for predicted Cpk after a 10% tightening (recomputed, no invented cost)</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Check the distribution assumption per part</span></div><div class="sc-rec-body">Used: ${distUsed}. Predicted Cpk/PPM depend on this choice.<br><span class="neg">-> Replace the assumption with measured data where you have it</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">3</span><span class="sc-rec-title">This is a prediction — carry the hashes</span></div><div class="sc-rec-body">Engine ${ENGINE_VERSION}, input ${d.inputHash}, output ${d.outputHash}.<br><span class="pos">-> Record for an internal design-review trail; confirm with SPC before release</span></div></div>`:`
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Predicted stack looks sound — keep as a design estimate</span></div><div class="sc-rec-body">Predicted Cpk ${d.cpk.toFixed(2)} meets target ${d.b.cpkTarget}. Distributions: ${distUsed}.<br><span class="pos">-> Re-run when tolerances, the stack or a distribution choice changes</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Verify with measured data before release</span></div><div class="sc-rec-body">Drawing-based prediction only.<br><span class="pos">-> Attach an observed capability study at PPAP/FAI stage (outside this tool)</span></div></div>`;

  $('reportArea').innerHTML=`
    <div class="sc-report-hd"><div><div class="sc-report-title">SC-008 Tolerance Stack-Up — Predicted Analysis</div>
      <div class="sc-report-meta">Calculation ID: <span>${d.calcId}</span> (deterministic from inputs) &nbsp;|&nbsp; ${new Date().toISOString().slice(0,19)} UTC<br>
      Engine: <span>${ENGINE_VERSION}</span> &nbsp;|&nbsp; input hash <span>${d.inputHash}</span> &nbsp;|&nbsp; output hash <span>${d.outputHash}</span><br>
      Method: worst-case + RSS + seeded Monte Carlo (n=${MC_RUNS}, seed=${d.b.seed}) &nbsp;|&nbsp; per-part distributions: <span>${distUsed}</span><br>
      <span class="warn">Engineering preview — predicted from drawing tolerances and chosen distributions, NOT measured data. Not for production approval.</span><br>
      <span class="ok">Client-side only — your data never left your browser.</span></div></div>
      <div class="sc-report-hd-right">
        <button class="sc-btn sc-btn-ghost" id="pdfBtn">Export PDF</button>
        <button class="sc-btn sc-btn-ghost" id="gfxBtn">Export Graphic PDF</button>
        <button class="sc-btn sc-btn-primary" id="shareBtn">Share (integrity)</button>
        <button class="sc-btn sc-btn-ghost" id="snapABtn">Snap A</button>
        <button class="sc-btn sc-btn-ghost" id="snapBBtn">Snap B</button>
      </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Predicted Risk (from tolerances + chosen distributions)</div>
      ${overall==='CRITICAL'?`<div class="sc-alert sc-alert-crit"><div class="sc-alert-title">Predicted critical — stack likely exceeds spec</div><div class="sc-alert-body">Predicted RSS <strong>+/-${(d.rssTol*u).toFixed(4)} ${uL}</strong> vs deviation <strong>+/-${(d.specHalf*u).toFixed(3)} ${uL}</strong>. Predicted defect rate <strong>${d.ppm.toFixed(0)} PPM</strong> (95% CI ${d.ciLo.toFixed(0)}–${d.ciHi.toFixed(0)}). Top contributor <strong>${top?top.name:'—'}</strong> (${top?top.pct:'—'}%). Model prediction — validate with measured data.</div></div>`:''}
      ${overall==='WARNING'?`<div class="sc-alert sc-alert-warn"><div class="sc-alert-title">Predicted marginal — capability below target</div><div class="sc-alert-body">Predicted Cpk <strong>${d.cpk.toFixed(2)}</strong> below target ${d.b.cpkTarget}. Predicted <strong>${d.ppm.toFixed(0)} PPM</strong> (95% CI ${d.ciLo.toFixed(0)}–${d.ciHi.toFixed(0)}). In-spec on the model but thin margin.</div></div>`:''}
      ${overall==='PASS'?`<div class="sc-alert sc-alert-pass"><div class="sc-alert-title">Predicted acceptable — within spec on the model</div><div class="sc-alert-body">Predicted RSS <strong>+/-${(d.rssTol*u).toFixed(4)} ${uL}</strong> within deviation. Predicted Cpk <strong>${d.cpk.toFixed(2)}</strong> &gt;= ${d.b.cpkTarget}. Predicted yield <strong>${(100-d.ppm/10000).toFixed(3)}%</strong>. Model-only — confirm with real data.</div></div>`:''}
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Method Comparison</div><div class="sc-cards">
      <div class="sc-card-res ${d.wcTol<=d.specHalf?'pass':'crit'}"><div class="sc-card-res-label">Worst Case</div><div class="sc-card-res-val">+/-${(d.wcTol*u).toFixed(4)}</div><div class="sc-card-res-sub">${uL} | 100% bound</div><span class="sc-card-res-badge ${d.wcTol<=d.specHalf?'sc-badge-pass':'sc-badge-crit'}">${d.wcTol<=d.specHalf?'IN SPEC':'EXCEEDS'}</span></div>
      <div class="sc-card-res ${d.rssInSpec?'pass':'crit'}"><div class="sc-card-res-label">RSS</div><div class="sc-card-res-val">+/-${(d.rssTol*u).toFixed(4)}</div><div class="sc-card-res-sub">${uL} | ~99.7%</div><span class="sc-card-res-badge ${d.rssInSpec?'sc-badge-pass':'sc-badge-crit'}">${d.rssInSpec?'IN SPEC':'EXCEEDS'}</span></div>
      <div class="sc-card-res ${d.rssInSpec?'pass':'crit'}"><div class="sc-card-res-label">Monte Carlo</div><div class="sc-card-res-val">+/-${(d.mcSpread*u).toFixed(4)}</div><div class="sc-card-res-sub">${uL} | 99.7% of samples</div><span class="sc-card-res-badge ${d.rssInSpec?'sc-badge-pass':'sc-badge-crit'}">${d.rssInSpec?'IN SPEC':'EXCEEDS'}</span></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Stack Dimensions (with chosen distribution)</div><div class="sc-card"><table class="sc-table"><thead><tr><th>#</th><th>Dimension</th><th>Nominal</th><th>+/-Tol</th><th>Distrib.</th><th>Pred. contrib</th></tr></thead><tbody>
      ${d.b.dims.map((dim,i)=>{ const c=d.result.pareto.find(p=>p.name===dim.name); return `<tr><td>${i+1}</td><td class="td-name">${dim.name}</td><td>${(dim.nominal*u).toFixed(3)}</td><td>+/-${(dim.tolerance*u).toFixed(3)}</td><td>${dim.dist}</td><td class="${i===0?'td-high':'td-ok'}">${c?c.pct:'0'}%</td></tr>`; }).join('')}
    </tbody></table></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Specification Gauge</div><div class="sc-chart"><div style="display:flex;justify-content:center"><svg width="300" height="170" viewBox="0 0 300 170">
      <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="${TH.track}" stroke-width="24" stroke-linecap="round"/>
      <path d="M 40 150 A 110 110 0 0 1 95 55" fill="none" stroke="${TH.greenFill}" stroke-width="24" stroke-linecap="round"/>
      <path d="M 205 55 A 110 110 0 0 1 260 150" fill="none" stroke="${TH.greenFill}" stroke-width="24" stroke-linecap="round"/>
      <path d="M 125 32 A 110 110 0 0 1 175 32" fill="none" stroke="${TH.redFill}" stroke-width="24" stroke-linecap="round"/>
      <line x1="150" y1="150" x2="${150+95*Math.cos((gaugeAngle-90)*Math.PI/180)}" y2="${150+95*Math.sin((gaugeAngle-90)*Math.PI/180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="150" cy="150" r="7" fill="${gCol}"/>
      <text x="150" y="135" text-anchor="middle" fill="${TH.ink}" font-size="22" font-weight="700" font-family="IBM Plex Mono">+/-${(d.rssTol*u).toFixed(3)}</text>
      <text x="150" y="155" text-anchor="middle" fill="${TH.text}" font-size="10">${uL} (RSS)</text>
      <text x="30" y="168" fill="${TH.text}" font-size="9">0</text><text x="262" y="168" fill="${TH.text}" font-size="9">${(d.specHalf*u).toFixed(2)}</text>
    </svg></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Monte Carlo Distribution (real samples, n=${MC_RUNS})</div><div class="sc-chart"><svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
      ${histBars}<line x1="50" y1="150" x2="550" y2="150" stroke="${TH.grid}"/>
      <text x="50" y="195" fill="${TH.text}" font-size="9">min ${(Math.min(...d.samplesNum)*u).toFixed(3)}</text>
      <text x="550" y="195" text-anchor="end" fill="${TH.text}" font-size="9">max ${(Math.max(...d.samplesNum)*u).toFixed(3)}</text>
      <text x="300" y="195" text-anchor="middle" fill="${TH.axis}" font-size="9">actual sample histogram under chosen distributions (not a fitted curve)</text>
    </svg></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Predicted Variation Contribution (Pareto)</div><div class="sc-card">
      ${d.result.pareto.map((c,i)=>`<div class="sc-pareto-row"><div class="sc-pareto-name">${c.name}</div><div class="sc-pareto-track"><div class="sc-pareto-fill" style="width:${c.pct}%;background:${pColors[i%pColors.length]}"><span>${c.pct}%</span></div></div><div class="sc-pareto-pct">${c.pct}%</div></div>`).join('')}
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Method Stack Comparison</div><div class="sc-chart"><div class="sc-stack">
      ${[['Worst',d.wcTol,TH.red,1],['RSS',d.rssTol,TH.amber,1],['Monte Carlo',d.mcSpread,TH.blue,1],['Spec dev',d.specHalf,TH.green,0.25]].map(([l,v,c,o])=>`<div class="sc-stack-col"><div class="sc-stack-wrap"><div class="sc-stack-bar" style="height:${Math.min(100,(v/d.specHalf)*100)}%;background:${c};opacity:${o}"><span class="sc-stack-bar-lbl">+/-${(v*u).toFixed(3)}</span></div></div><div class="sc-stack-lbl">${l}</div></div>`).join('')}
    </div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Predicted Design Capability</div><div class="sc-cards">
      <div class="sc-card-res ${d.cpk>=d.b.cpkTarget?'pass':'warn'}"><div class="sc-card-res-label">Predicted Cpk</div><div class="sc-card-res-val">${d.cpk.toFixed(2)}</div><div class="sc-card-res-sub">target &gt;= ${d.b.cpkTarget}</div><span class="sc-card-res-badge ${d.cpk>=d.b.cpkTarget?'sc-badge-pass':'sc-badge-warn'}">${d.cpk>=d.b.cpkTarget?'PRED. CAPABLE':'PRED. BELOW'}</span></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Predicted PPM</div><div class="sc-card-res-val">${d.ppm.toFixed(0)}</div><div class="sc-card-res-sub">95% CI ${d.ciLo.toFixed(0)}–${d.ciHi.toFixed(0)}</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Predicted Yield</div><div class="sc-card-res-val">${(100-d.ppm/10000).toFixed(2)}%</div><div class="sc-card-res-sub">model estimate</div></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Computed Assessment Radar</div><div class="sc-chart"><div style="display:flex;justify-content:center"><svg width="300" height="300" viewBox="0 0 300 300">
      ${[1,0.66,0.33].map(f=>{ const pts=axes.map((_,i)=>{ const a=(i*72-90)*Math.PI/180; return `${150+f*110*Math.cos(a)},${150+f*110*Math.sin(a)}`; }).join(' '); return `<polygon points="${pts}" fill="none" stroke="${TH.grid}"/>`; }).join('')}
      ${axes.map((_,i)=>{ const a=(i*72-90)*Math.PI/180; return `<line x1="150" y1="150" x2="${150+110*Math.cos(a)}" y2="${150+110*Math.sin(a)}" stroke="${TH.grid}"/>`; }).join('')}
      <polygon points="${axes.map((c,i)=>{ const a=(i*72-90)*Math.PI/180; const r=c.val*110; return `${150+r*Math.cos(a)},${150+r*Math.sin(a)}`; }).join(' ')}" fill="${overall==='PASS'?TH.greenFill:overall==='WARNING'?TH.amberFill:TH.redFill}" stroke="${gCol}" stroke-width="2"/>
      ${axes.map((c,i)=>{ const a=(i*72-90)*Math.PI/180; const x=150+132*Math.cos(a), y=150+132*Math.sin(a); return `<text x="${x}" y="${y}" text-anchor="middle" fill="${TH.text}" font-size="9" font-weight="600">${c.name}<title>${c.name}: ${c.note} = ${(c.val*100).toFixed(0)}%</title></text>`; }).join('')}
    </svg></div><div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);text-align:center;margin-top:8px">Every axis computed from the result (hover for formula) — none subjective.</div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">What-If (predicted Cpk after 10% tightening, recomputed)</div><div class="sc-card"><div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;font-family:var(--font-mono)">Cost impact NOT estimated — needs your process cost model.</div>
      <div class="sc-whatif">${whatIfs.map(w=>{ const dc=w.cpk-d.cpk; return `<div class="sc-whatif-card"><div class="sc-whatif-lbl">${w.name}</div><div class="sc-whatif-val">Cpk ${w.cpk.toFixed(2)}</div><div class="sc-whatif-chg ${dc>0?'pos':dc<0?'neg':'neu'}">${dc>=0?'+':''}${dc.toFixed(2)} | ${w.ppm.toFixed(0)} PPM</div></div>`; }).join('')}</div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommendations</div><div class="sc-card">${recHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Methodology, Standards & Limitations</div><div class="sc-card"><div class="sc-std">
      <span>ISO 286-1</span> — tolerance grades (reference for deviation values)<br>
      <span>ASME Y14.5</span> — statistical tolerancing context (RSS)<br>
      <span>AIAG SPC</span> — Cpk = min[(USL-mu)/3s,(mu-LSL)/3s]; here mu,s are model-derived, not measured<br>
      <span>Distribution semantics</span> — normal/truncated-normal: tol = +/-3 sigma; uniform/triangular: tol = hard half-range<br>
      <span>Monte Carlo</span> — seeded Decimal LCG; histogram from actual samples; PPM with 95% confidence interval<br>
      <span>Known limitations</span> — 1D linear stack; no correlation model; per-part sigma derived from tol (no measured process input yet); predicted, not observed capability<br>
      <span>Reproducibility</span> — same inputs + distributions + seed + engine version reproduce this report exactly (hashes above)
    </div></div></div>
    <div class="sc-footer">SectorCalc — Engineering preview. Client-side. Deterministic Decimal engine. Not for production approval.<br>Predicted from drawing tolerances and chosen distributions; verify with measured process data.</div>`;
  // Assign onclick (not addEventListener) so live report sync does not stack handlers
  const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
  on('pdfBtn', () => exportPDF(false));
  on('gfxBtn', () => exportPDF(true));
  on('shareBtn', () => {
    navigator.clipboard.writeText(makeShareURL(location.origin, toProjectState())).then(()=>alert('Share URL copied (tamper-evident integrity hash attached)'));
  });
  const snap = (slot) => { window['__snap'+slot] = { cpk:d.cpk, ppm:d.ppm, rss:d.rssTol, worst:d.wcTol, label:'Snap '+slot+' ('+d.calcId+')' }; alert('Saved '+window['__snap'+slot].label); if (window.__snapA && window.__snapB) showCompare(); };
  on('snapABtn', () => snap('A'));
  on('snapBBtn', () => snap('B'));
  function showCompare(){
    const rows = compareRevisions(window.__snapA, window.__snapB);
    const tbl = rows.map(r=>`<tr><td class="td-name">${r.metric}</td><td>${r.a.toFixed(3)}</td><td>${r.b.toFixed(3)}</td><td class="${r.better?'td-ok':'td-high'}">${r.delta>=0?'+':''}${r.delta.toFixed(3)}</td></tr>`).join('');
    const sec = document.createElement('div'); sec.className='sc-sec';
    sec.innerHTML = `<div class="sc-sec-hd">Revision Compare (A vs B)</div><div class="sc-card"><table class="sc-table"><thead><tr><th>Metric</th><th>A</th><th>B</th><th>Delta (green=improvement)</th></tr></thead><tbody>${tbl}</tbody></table></div>`;
    $('reportArea').appendChild(sec);
  }
}

function exportPDF(graphic){
  const d=calcData; if(!d)return;
  const u=d.fromMm, uL=currentUnit; const distUsed=[...new Set(d.b.dims.map(x=>x.dist))].join(', ');
  if(graphic){
    html2canvas($('reportArea'),{scale:1.5,backgroundColor:'#FFFFFF',useCORS:true,logging:false}).then(canvas=>{
      const {jsPDF}=window.jspdf; const pdf=new jsPDF({unit:'pt',format:'a4'});
      const pW=pdf.internal.pageSize.getWidth(), pH=pdf.internal.pageSize.getHeight();
      const iH=(canvas.height*pW)/canvas.width; const img=canvas.toDataURL('image/jpeg',0.82);
      let left=iH,pos=0; pdf.addImage(img,'JPEG',0,pos,pW,iH); left-=pH;
      while(left>0){ pos-=pH; pdf.addPage(); pdf.addImage(img,'JPEG',0,pos,pW,iH); left-=pH; }
      const n=pdf.getNumberOfPages(); for(let i=1;i<=n;i++){ pdf.setPage(i); pdf.setFontSize(7); pdf.setTextColor(120); pdf.text('SectorCalc | '+d.calcId+' | '+ENGINE_VERSION+' | preview, not for production | p'+i+'/'+n,48,pH-16); }
      pdf.save(d.calcId+'-graphic.pdf');
    }).catch(e=>alert('Graphic PDF failed: '+e.message));
    return;
  }
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'pt',format:'a4'}); let y=48;
  const line=(t,s,c,b)=>{ doc.setFontSize(s||10); doc.setTextColor(c||'#222'); doc.setFont('helvetica',b?'bold':'normal'); const ls=doc.splitTextToSize(t,500); doc.text(ls,48,y); y+=ls.length*((s||10)+4)+2; if(y>780){doc.addPage();y=48;} };
  const overall=!d.rssInSpec?'CRITICAL':(d.cpk<d.b.cpkTarget?'WARNING':'PASS');
  line('SC-008 Tolerance Stack-Up — Predicted Analysis',16,'#111',true);
  line('Calc ID '+d.calcId+' | '+new Date().toISOString().slice(0,19)+' UTC | Engine '+ENGINE_VERSION,9,'#666');
  line('input hash '+d.inputHash+' | output hash '+d.outputHash+' | distributions: '+distUsed,9,'#666');
  line('Engineering preview — predicted from drawing tolerances + chosen distributions, not measured data. Not for production approval.',9,'#b8860b');
  line('Client-side only — data never left your browser.',9,'#1a7f37'); y+=6;
  line('VERDICT (predicted): '+overall+'   RSS +/-'+(d.rssTol*u).toFixed(4)+' '+uL+'   pred. Cpk '+d.cpk.toFixed(2)+'   pred. PPM '+d.ppm.toFixed(0)+' (95% CI '+d.ciLo.toFixed(0)+'-'+d.ciHi.toFixed(0)+')',11,overall==='PASS'?'#1a7f37':overall==='WARNING'?'#b8860b':'#c0392b',true); y+=8;
  line('METHOD COMPARISON',11,'#111',true);
  line('Worst-case +/-'+(d.wcTol*u).toFixed(4)+' '+uL,10); line('RSS +/-'+(d.rssTol*u).toFixed(4)+' '+uL,10); line('Monte Carlo +/-'+(d.mcSpread*u).toFixed(4)+' '+uL+' (n='+MC_RUNS+')',10); y+=8;
  line('STACK (nominal / tol / distribution / predicted contrib)',11,'#111',true);
  d.b.dims.forEach((dim,i)=>{ const c=d.result.pareto.find(p=>p.name===dim.name); line((i+1)+'. '+dim.name+'  '+(dim.nominal*u).toFixed(3)+' +/-'+(dim.tolerance*u).toFixed(3)+'  ['+dim.dist+']  ('+(c?c.pct:'0')+'%)',9); }); y+=8;
  line('LIMITATIONS: 1D linear; no correlation; per-part sigma from tol; predicted not observed capability.',8,'#666');
  line('Generated by SectorCalc.com — deterministic Decimal engine — preview.',8,'#999');
  doc.save(d.calcId+'.pdf');
}

document.querySelectorAll('.sc-preset').forEach(b=>b.addEventListener('click',()=>loadPreset(b.dataset.preset)));
['specUpper','specLower','cpkTarget','mcSeed'].forEach(id=>$(id).addEventListener('input',compute));
$('unitSpec').addEventListener('change',convertUnits);
$('unitSpec2').addEventListener('change',()=>{ $('unitSpec').value=$('unitSpec2').value; convertUnits(); });
$('addDim').addEventListener('click',()=>{ dimensions.push({name:'Dim '+(dimensions.length+1),nominal:10,tolerance:0.05,dist:'normal'}); renderDims(); compute(); });
$('resetAll').addEventListener('click',()=>loadPreset('standard'));
$('genReport').addEventListener('click',generateReport);
$('dimList').addEventListener('input',e=>{ const t=e.target; if(t.dataset.i!==undefined){ const i=+t.dataset.i,f=t.dataset.f; dimensions[i][f]= f==='name'?t.value:(f==='dist'?t.value:parseFloat(t.value)); compute(); }});
$('dimList').addEventListener('change',e=>{ const t=e.target; if(t.dataset.f==='dist'){ dimensions[+t.dataset.i].dist=t.value; compute(); }});
$('dimList').addEventListener('click',e=>{ const t=e.target; if(t.dataset.del!==undefined&&dimensions.length>1){ dimensions.splice(+t.dataset.del,1); renderDims(); compute(); }});
$('saveBtn').addEventListener('click', () => { const n = prompt('Project name'); if (!n) return; saveProject(n, toProjectState()); alert('Saved "'+n+'"'); });
$('loadBtn').addEventListener('click', () => { const names = listProjects(); if (!names.length) { alert('No saved projects yet'); return; } const n = prompt('Load which?\n'+names.join(', ')); if (!n) return; const st = loadProject(n); if (!st) { alert('Not found'); return; } applyProjectState(st); renderDims(); compute(); });
$('csvBtn').addEventListener('click', () => $('csvFile').click());
$('csvFile').addEventListener('change', (e) => { const f = e.target.files?.[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { const rows = parseCSV(String(rd.result)); if (!rows.length) { alert('No valid rows in CSV'); return; } dimensions = rows.map(d => ({ name:d.name, nominal:d.nominal, tolerance:d.tol ?? d.tolerance, dist:d.dist||'normal' })); renderDims(); compute(); }; rd.readAsText(f); });
loadFromURL(); renderDims(); compute();
