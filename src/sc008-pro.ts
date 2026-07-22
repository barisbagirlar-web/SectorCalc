// @ts-nocheck
import { calculate, simulateStack } from './tools/SC-008-tolerance-stack/v1.0.0/formula.js';

// Single source of truth: the Decimal engine in formula.ts. No inline Number math.
// Engine version is frozen into every report so results are traceable to a code revision.
const ENGINE_VERSION = 'SC008-2026.07-formula-v1.0.0';
const MC_RUNS = 10000;
const unitConv = { mm:{toMm:1,fromMm:1}, inch:{toMm:25.4,fromMm:1/25.4}, um:{toMm:0.001,fromMm:1000} };
const presets = {
  standard:{ specUpper:0.150, specLower:-0.150, cpkTarget:1.33, seed:12345, dims:[{name:'Spacer Width',nominal:25,tolerance:0.05},{name:'Bearing OD',nominal:30,tolerance:0.025},{name:'Housing Bore',nominal:-55,tolerance:0.04}] },
  tight:{ specUpper:0.050, specLower:-0.050, cpkTarget:1.67, seed:54321, dims:[{name:'Ti Spacer',nominal:15,tolerance:0.01},{name:'Ball Bearing',nominal:20,tolerance:0.005},{name:'Al Housing',nominal:-35,tolerance:0.015}] },
  loose:{ specUpper:0.300, specLower:-0.300, cpkTarget:1.00, seed:99999, dims:[{name:'Steel Plate',nominal:50,tolerance:0.2},{name:'Bushing',nominal:25,tolerance:0.1},{name:'Cast Housing',nominal:-75,tolerance:0.25}] },
  vtight:{ specUpper:0.025, specLower:-0.025, cpkTarget:2.00, seed:77777, dims:[{name:'Implant Spacer',nominal:10,tolerance:0.005},{name:'Ceramic Bearing',nominal:8,tolerance:0.003},{name:'Ti Housing',nominal:-18,tolerance:0.008}] }
};
let currentUnit = 'mm';
let dimensions = presets.standard.dims.map(d => ({...d}));
let calcData = null;
const $ = (id) => document.getElementById(id);

// Deterministic, non-cryptographic fingerprint for traceability (NOT a security hash).
function fnv1a(str){ let h = 0x811c9dc5; for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193); } return (h>>>0).toString(16).padStart(8,'0'); }

function renderDims(){
  $('dimList').innerHTML = dimensions.map((d,i)=>`<div class="sc-dim"><span class="sc-dim-num">${i+1}</span><input type="text" value="${d.name}" data-i="${i}" data-f="name" style="font-family:var(--font-sans);color:var(--text-secondary);font-size:12px"><input type="number" value="${d.nominal.toFixed(3)}" step="0.001" data-i="${i}" data-f="nominal"><input type="number" value="${d.tolerance.toFixed(3)}" step="0.001" min="0" data-i="${i}" data-f="tolerance"><button class="sc-dim-del" data-del="${i}">&times;</button></div>`).join('');
}

function buildInput(){
  const toMm = unitConv[currentUnit].toMm;
  const su = (parseFloat($('specUpper').value)||0) * toMm;
  const sl = (parseFloat($('specLower').value)||0) * toMm;
  const cpkTarget = parseFloat($('cpkTarget').value)||1.33;
  const seed = parseInt($('mcSeed').value)||12345;
  const dims = dimensions.map(d => ({ name:d.name, nominal:d.nominal*toMm, tolerance:d.tolerance*toMm }));
  const nominalSum = dims.reduce((s,d)=>s+d.nominal,0);
  // Absolute limits = nominal sum + deviation. This is the fix for the nominal-sum bug.
  const usl = nominalSum + su;
  const lsl = nominalSum + sl;
  const components = dims.map(d => ({ name:d.name, nominal:String(d.nominal), tol:String(d.tolerance), distribution:'normal' }));
  return { su, sl, cpkTarget, seed, dims, nominalSum, usl, lsl, input:{ components, usl:String(usl), lsl:String(lsl), seed:String(seed), iterations:String(MC_RUNS) } };
}

function validate(){
  let ok = true;
  const su = parseFloat($('specUpper').value), sl = parseFloat($('specLower').value), cpkT = parseFloat($('cpkTarget').value);
  if (isNaN(su)||su<=0){ $('fld-specUpper').classList.add('has-error'); $('val-specUpper').className='sc-val error'; $('val-specUpper').textContent='X deviation + must be > 0'; ok=false; } else { $('fld-specUpper').classList.remove('has-error'); $('val-specUpper').className='sc-val ok'; $('val-specUpper').textContent='OK'; }
  if (isNaN(sl)||sl>=0){ $('fld-specLower').classList.add('has-error'); $('val-specLower').className='sc-val error'; $('val-specLower').textContent='X deviation - must be < 0'; ok=false; } else { $('fld-specLower').classList.remove('has-error'); $('val-specLower').className='sc-val ok'; $('val-specLower').textContent='OK'; }
  if (isNaN(cpkT)||cpkT<0.5||cpkT>3){ $('fld-cpkTarget').classList.add('has-error'); $('val-cpkTarget').className='sc-val error'; $('val-cpkTarget').textContent='X target 0.5-3.0'; ok=false; } else { $('fld-cpkTarget').classList.remove('has-error'); $('val-cpkTarget').className='sc-val ok'; $('val-cpkTarget').textContent = cpkT>=1.67?'OK tight target':'OK'; }
  dimensions.forEach(d => { if (!(d.tolerance>0)) ok=false; });
  return ok;
}

// Real histogram from actual Monte Carlo samples (not a decorative bell curve).
function histogram(samples, bins){
  if (!samples.length) return [];
  const min = Math.min(...samples), max = Math.max(...samples), w = (max-min)/bins || 1;
  const out = Array.from({length:bins}, (_,i)=>({ x0:min+w*i, c:0 }));
  for (const s of samples){ let idx = Math.floor((s-min)/w); if (idx>=bins) idx=bins-1; if (idx<0) idx=0; out[idx].c++; }
  return out;
}

function compute(){
  if (!validate()){ $('liveResult').textContent='—'; $('liveSub').innerHTML=''; return; }
  const b = buildInput();
  let result, samplesNum;
  try {
    const samples = simulateStack(b.input.components, b.input);   // Decimal[] from the single engine
    samplesNum = samples.map(s => s.toNumber());
    result = calculate(b.input, samples);                          // same samples -> UI, PDF, share agree
  } catch (e){ $('liveResult').textContent='ERR'; $('liveSub').innerHTML='<span>'+e.message+'</span>'; return; }
  const rssTol = Number(result.rssPlus), wcTol = Number(result.worstPlus);
  const mcSpread = (Number(result.mcP9987)-Number(result.mcP0013))/2;
  const cpk = Number(result.cpk), ppm = Number(result.ppm);
  const specHalf = Math.abs(b.su);
  const rssInSpec = rssTol <= specHalf && (Number(result.nominalSum)+rssTol <= b.usl) && (Number(result.nominalSum)-rssTol >= b.lsl);
  const fromMm = unitConv[currentUnit].fromMm;
  const hist = histogram(samplesNum, 28);

  const inputHash = fnv1a(JSON.stringify({ c:b.input.components, usl:b.input.usl, lsl:b.input.lsl, seed:b.input.seed }));
  const outputHash = fnv1a(JSON.stringify(result));
  const calcId = 'SC008-' + inputHash.slice(0,8).toUpperCase();

  calcData = { b, result, samplesNum, rssTol, wcTol, mcSpread, cpk, ppm, specHalf, rssInSpec, fromMm, hist, inputHash, outputHash, calcId };
  $('liveResult').textContent = '+/- ' + (rssTol*fromMm).toFixed(4) + ' ' + currentUnit;
  $('liveSub').innerHTML = '<span>'+b.dims.length+' dims</span><span>pred. Cpk '+cpk.toFixed(2)+'</span><span>'+(rssInSpec?'predicted in spec':'predicted OUT')+'</span>';
}

function loadPreset(key){
  const p = presets[key];
  $('specUpper').value=p.specUpper; $('specLower').value=p.specLower; $('cpkTarget').value=p.cpkTarget; $('mcSeed').value=p.seed;
  $('unitSpec').value='mm'; $('unitSpec2').value='mm'; currentUnit='mm';
  dimensions = p.dims.map(d=>({...d}));
  document.querySelectorAll('.sc-preset').forEach(b => b.classList.toggle('active', b.dataset.preset===key));
  renderDims(); compute();
}
function convertUnits(){
  const nu = $('unitSpec').value; if (nu===currentUnit) return;
  const r = unitConv[currentUnit].toMm * unitConv[nu].fromMm;
  $('specUpper').value=(parseFloat($('specUpper').value)*r).toFixed(4);
  $('specLower').value=(parseFloat($('specLower').value)*r).toFixed(4);
  $('unitSpec2').value=nu;
  dimensions = dimensions.map(d=>({...d, nominal:+(d.nominal*r).toFixed(4), tolerance:+(d.tolerance*r).toFixed(4)}));
  currentUnit=nu; renderDims(); compute();
}
function loadFromURL(){
  const s = new URLSearchParams(location.search).get('s'); if (!s) return;
  try { const o = JSON.parse(decodeURIComponent(s)); if (o.specUpper!==undefined) $('specUpper').value=o.specUpper; if (o.specLower!==undefined) $('specLower').value=o.specLower; if (o.cpkTarget!==undefined) $('cpkTarget').value=o.cpkTarget; if (o.seed!==undefined) $('mcSeed').value=o.seed; if (o.unit) { currentUnit=o.unit; $('unitSpec').value=o.unit; $('unitSpec2').value=o.unit; } if (Array.isArray(o.dims)) dimensions = o.dims; } catch(e){}
}

// Radar axes are COMPUTED from the result, not invented. Each is documented below.
function radarAxes(d){
  const specMargin = Math.max(0, Math.min(1, 1 - d.rssTol/d.specHalf));                 // 1 = lots of room, 0 = at limit
  const cpkRatio = Math.max(0, Math.min(1, d.cpk/d.b.cpkTarget));                       // predicted capability vs target
  const yieldRate = Math.max(0, Math.min(1, 1 - d.ppm/1e6));                            // predicted yield
  const mcRssAgree = Math.max(0, Math.min(1, 1 - Math.abs(d.mcSpread-d.rssTol)/Math.max(d.rssTol,1e-9))); // MC vs RSS consistency
  const statGain = Math.max(0, Math.min(1, d.rssTol/Math.max(d.wcTol,1e-9)));           // statistical vs worst-case gain
  return [
    { name:'Spec margin', val:specMargin, note:'1 - RSS/specHalf' },
    { name:'Pred. Cpk ratio', val:cpkRatio, note:'predicted Cpk / target' },
    { name:'Pred. yield', val:yieldRate, note:'1 - PPM/1e6' },
    { name:'MC-RSS agree', val:mcRssAgree, note:'sim vs RSS spread' },
    { name:'Stat. gain', val:statGain, note:'RSS / worst-case' }
  ];
}

function generateReport(){
  if (!calcData) compute();
  const d = calcData; if (!d) return;
  const u = d.fromMm, uL = currentUnit;
  const overall = !d.rssInSpec ? 'CRITICAL' : (d.cpk < d.b.cpkTarget ? 'WARNING' : 'PASS');
  const gCol = overall==='PASS'?'#52c41a':(overall==='WARNING'?'#faad14':'#f5222d');
  const gaugeAngle = Math.max(-90, Math.min(90, (d.rssTol/d.specHalf)*90));
  const pColors = ['#f5222d','#faad14','#5b8def','#a855f7','#4ecdc4'];
  const top = d.result.pareto[0];
  const axes = radarAxes(d);

  // Real histogram bars from samples.
  const maxC = Math.max(...d.hist.map(h=>h.c), 1);
  const histBars = d.hist.map((h,i)=>{ const bw = 500/d.hist.length; const bh = (h.c/maxC)*140; return `<rect x="${50+i*bw}" y="${150-bh}" width="${bw-1}" height="${bh}" fill="#5b8def" opacity="0.85"/>`; }).join('');

  // What-if: tighten top contributors, recompute predicted Cpk via the SAME engine. No invented cost.
  const whatIfs = d.result.pareto.slice(0,3).map(p => {
    const di = d.b.input.components.find(c => c.name===p.name);
    const tighter = { ...d.b.input, components: d.b.input.components.map(c => c.name===p.name ? {...c, tol:String(Number(c.tol)*0.9)} : c) };
    let nr; try { nr = calculate(tighter); } catch(e){ return { name:p.name, cpk:d.cpk, ppm:d.ppm }; }
    return { name:p.name, cpk:Number(nr.cpk), ppm:Number(nr.ppm) };
  });

  const recHTML = overall!=='PASS' ? `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Tighten the top predicted contributor: ${top?top.name:'—'}</span></div><div class="sc-rec-body">It drives ${top?top.pct:'—'}% of predicted RSS variation.<br><span class="pos">-> See What-If for the predicted Cpk effect of a 10% tightening</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">This is a prediction, not a measurement</span></div><div class="sc-rec-body">Predicted Cpk assumes a normal, centered process.<br><span class="neg">-> Confirm with real SPC data (observed Cpk) before any production sign-off</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">3</span><span class="sc-rec-title">Carry the engine version and hashes with this estimate</span></div><div class="sc-rec-body">Engine ${ENGINE_VERSION}, input ${d.inputHash}, output ${d.outputHash}.<br><span class="pos">-> Record these for an internal design-review trail</span></div></div>` : `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Predicted stack looks sound — keep it as a design estimate</span></div><div class="sc-rec-body">Predicted Cpk ${d.cpk.toFixed(2)} meets target ${d.b.cpkTarget}.<br><span class="pos">-> Re-run when tolerances or the stack change</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Verify with measured data before release</span></div><div class="sc-rec-body">Drawing-based prediction only.<br><span class="pos">-> Attach observed capability study at PPAP/FAI stage (outside this tool)</span></div></div>`;

  $('reportArea').innerHTML = `
    <div class="sc-report-hd">
      <div><div class="sc-report-title">SC-008 Tolerance Stack-Up — Predicted Analysis</div>
        <div class="sc-report-meta">
          Calculation ID: <span>${d.calcId}</span> (deterministic from inputs) &nbsp;|&nbsp; ${new Date().toISOString().slice(0,19)} UTC<br>
          Engine: <span>${ENGINE_VERSION}</span> &nbsp;|&nbsp; input hash <span>${d.inputHash}</span> &nbsp;|&nbsp; output hash <span>${d.outputHash}</span><br>
          Method: worst-case + RSS + seeded Monte Carlo (n=${MC_RUNS}, normal assumption, seed=${d.b.seed})<br>
          <span class="warn">Engineering preview — predicted from drawing tolerances, NOT measured process data. Not for production approval.</span><br>
          <span class="ok">Client-side only — your data never left your browser.</span>
        </div></div>
      <div class="sc-report-hd-right"><button class="sc-btn sc-btn-ghost" id="pdfBtn">Export PDF</button><button class="sc-btn sc-btn-ghost" id="gfxBtn">Export Graphic PDF</button><button class="sc-btn sc-btn-primary" id="shareBtn">Share</button></div>
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Predicted Risk (from tolerances, not measured)</div>
      ${overall==='CRITICAL'?`<div class="sc-alert sc-alert-crit"><div class="sc-alert-title">Predicted critical — stack likely exceeds spec</div><div class="sc-alert-body">Predicted RSS <strong>+/-${(d.rssTol*u).toFixed(4)} ${uL}</strong> vs deviation <strong>+/-${(d.specHalf*u).toFixed(3)} ${uL}</strong>. Predicted defect rate <strong>${d.ppm.toFixed(0)} PPM</strong>. Top predicted contributor: <strong>${top?top.name:'—'}</strong> (${top?top.pct:'—'}%).<br>This is a model prediction — validate with measured data before acting.</div></div>`:''}
      ${overall==='WARNING'?`<div class="sc-alert sc-alert-warn"><div class="sc-alert-title">Predicted marginal — capability below target</div><div class="sc-alert-body">Predicted Cpk <strong>${d.cpk.toFixed(2)}</strong> below target ${d.b.cpkTarget}. Predicted <strong>${d.ppm.toFixed(0)} PPM</strong>. Predicted in-spec but thin margin; a process mean shift would erode it.</div></div>`:''}
      ${overall==='PASS'?`<div class="sc-alert sc-alert-pass"><div class="sc-alert-title">Predicted acceptable — within spec on the model</div><div class="sc-alert-body">Predicted RSS <strong>+/-${(d.rssTol*u).toFixed(4)} ${uL}</strong> within deviation. Predicted Cpk <strong>${d.cpk.toFixed(2)}</strong> >= ${d.b.cpkTarget}. Predicted yield <strong>${(100-d.ppm/10000).toFixed(3)}%</strong>. Model-only — confirm with real data.</div></div>`:''}
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Method Comparison</div><div class="sc-cards">
      <div class="sc-card-res ${d.wcTol<=d.specHalf?'pass':'crit'}"><div class="sc-card-res-label">Worst Case</div><div class="sc-card-res-val">+/-${(d.wcTol*u).toFixed(4)}</div><div class="sc-card-res-sub">${uL} | 100% bound</div><span class="sc-card-res-badge ${d.wcTol<=d.specHalf?'sc-badge-pass':'sc-badge-crit'}">${d.wcTol<=d.specHalf?'IN SPEC':'EXCEEDS'}</span></div>
      <div class="sc-card-res ${d.rssInSpec?'pass':'crit'}"><div class="sc-card-res-label">RSS</div><div class="sc-card-res-val">+/-${(d.rssTol*u).toFixed(4)}</div><div class="sc-card-res-sub">${uL} | ~99.7%</div><span class="sc-card-res-badge ${d.rssInSpec?'sc-badge-pass':'sc-badge-crit'}">${d.rssInSpec?'IN SPEC':'EXCEEDS'}</span></div>
      <div class="sc-card-res ${d.rssInSpec?'pass':'crit'}"><div class="sc-card-res-label">Monte Carlo</div><div class="sc-card-res-val">+/-${(d.mcSpread*u).toFixed(4)}</div><div class="sc-card-res-sub">${uL} | 99.7% of samples</div><span class="sc-card-res-badge ${d.rssInSpec?'sc-badge-pass':'sc-badge-crit'}">${d.rssInSpec?'IN SPEC':'EXCEEDS'}</span></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Stack Dimensions</div><div class="sc-card"><table class="sc-table"><thead><tr><th>#</th><th>Dimension</th><th>Nominal</th><th>+/-Tol</th><th>Pred. contrib</th></tr></thead><tbody>
      ${d.b.dims.map((dim,i)=>{ const c=d.result.pareto.find(p=>p.name===dim.name); return `<tr><td>${i+1}</td><td class="td-name">${dim.name}</td><td>${(dim.nominal*u).toFixed(3)}</td><td>+/-${(dim.tolerance*u).toFixed(3)}</td><td class="${i===0?'td-high':'td-ok'}">${c?c.pct:'0'}%</td></tr>`; }).join('')}
    </tbody></table></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Specification Gauge</div><div class="sc-chart"><div style="display:flex;justify-content:center"><svg width="300" height="170" viewBox="0 0 300 170">
      <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="#111720" stroke-width="24" stroke-linecap="round"/>
      <path d="M 40 150 A 110 110 0 0 1 95 55" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 205 55 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 125 32 A 110 110 0 0 1 175 32" fill="none" stroke="rgba(245,34,45,0.2)" stroke-width="24" stroke-linecap="round"/>
      <line x1="150" y1="150" x2="${150+95*Math.cos((gaugeAngle-90)*Math.PI/180)}" y2="${150+95*Math.sin((gaugeAngle-90)*Math.PI/180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="150" cy="150" r="7" fill="${gCol}"/>
      <text x="150" y="135" text-anchor="middle" fill="#f0f4f8" font-size="22" font-weight="700" font-family="JetBrains Mono">+/-${(d.rssTol*u).toFixed(3)}</text>
      <text x="150" y="155" text-anchor="middle" fill="#4a5568" font-size="10">${uL} (RSS)</text>
      <text x="30" y="168" fill="#4a5568" font-size="9">0</text><text x="262" y="168" fill="#4a5568" font-size="9">${(d.specHalf*u).toFixed(2)}</text>
    </svg></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Monte Carlo Distribution (real samples, n=${MC_RUNS})</div><div class="sc-chart"><svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
      ${histBars}
      <line x1="50" y1="150" x2="550" y2="150" stroke="#1e2733"/>
      <text x="50" y="195" fill="#4a5568" font-size="9">min ${(Math.min(...d.samplesNum)*u).toFixed(3)}</text>
      <text x="550" y="195" text-anchor="end" fill="#4a5568" font-size="9">max ${(Math.max(...d.samplesNum)*u).toFixed(3)}</text>
      <text x="300" y="195" text-anchor="middle" fill="#6e7d8c" font-size="9">actual sample histogram (not a fitted curve)</text>
    </svg></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Predicted Variation Contribution (Pareto)</div><div class="sc-card">
      ${d.result.pareto.map((c,i)=>`<div class="sc-pareto-row"><div class="sc-pareto-name">${c.name}</div><div class="sc-pareto-track"><div class="sc-pareto-fill" style="width:${c.pct}%;background:${pColors[i%pColors.length]}"><span>${c.pct}%</span></div></div><div class="sc-pareto-pct">${c.pct}%</div></div>`).join('')}
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Method Stack Comparison</div><div class="sc-chart"><div class="sc-stack">
      ${[['Worst',d.wcTol,'#f5222d',1],['RSS',d.rssTol,'#faad14',1],['Monte Carlo',d.mcSpread,'#5b8def',1],['Spec dev',d.specHalf,'#52c41a',0.25]].map(([l,v,c,o])=>`<div class="sc-stack-col"><div class="sc-stack-wrap"><div class="sc-stack-bar" style="height:${Math.min(100,(v/d.specHalf)*100)}%;background:${c};opacity:${o}"><span class="sc-stack-bar-lbl">+/-${(v*u).toFixed(3)}</span></div></div><div class="sc-stack-lbl">${l}</div></div>`).join('')}
    </div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Predicted Design Capability</div><div class="sc-cards">
      <div class="sc-card-res ${d.cpk>=d.b.cpkTarget?'pass':'warn'}"><div class="sc-card-res-label">Predicted Cpk</div><div class="sc-card-res-val">${d.cpk.toFixed(2)}</div><div class="sc-card-res-sub">target >= ${d.b.cpkTarget}</div><span class="sc-card-res-badge ${d.cpk>=d.b.cpkTarget?'sc-badge-pass':'sc-badge-warn'}">${d.cpk>=d.b.cpkTarget?'PRED. CAPABLE':'PRED. BELOW'}</span></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Predicted PPM</div><div class="sc-card-res-val">${d.ppm.toFixed(0)}</div><div class="sc-card-res-sub">model estimate</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Predicted Yield</div><div class="sc-card-res-val">${(100-d.ppm/10000).toFixed(2)}%</div><div class="sc-card-res-sub">model estimate</div></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Computed Assessment Radar</div><div class="sc-chart"><div style="display:flex;justify-content:center"><svg width="300" height="300" viewBox="0 0 300 300">
      ${[1,0.66,0.33].map(f=>{ const pts=axes.map((_,i)=>{ const a=(i*72-90)*Math.PI/180; return `${150+f*110*Math.cos(a)},${150+f*110*Math.sin(a)}`; }).join(' '); return `<polygon points="${pts}" fill="none" stroke="#1e2733"/>`; }).join('')}
      ${axes.map((_,i)=>{ const a=(i*72-90)*Math.PI/180; return `<line x1="150" y1="150" x2="${150+110*Math.cos(a)}" y2="${150+110*Math.sin(a)}" stroke="#1e2733"/>`; }).join('')}
      <polygon points="${axes.map((c,i)=>{ const a=(i*72-90)*Math.PI/180; const r=c.val*110; return `${150+r*Math.cos(a)},${150+r*Math.sin(a)}`; }).join(' ')}" fill="${overall==='PASS'?'rgba(82,196,26,0.15)':overall==='WARNING'?'rgba(250,173,20,0.15)':'rgba(245,34,45,0.15)'}" stroke="${gCol}" stroke-width="2"/>
      ${axes.map((c,i)=>{ const a=(i*72-90)*Math.PI/180; const x=150+132*Math.cos(a), y=150+132*Math.sin(a); return `<text x="${x}" y="${y}" text-anchor="middle" fill="#6e7d8c" font-size="9" font-weight="600">${c.name}<title>${c.name}: ${c.note} = ${(c.val*100).toFixed(0)}%</title></text>`; }).join('')}
    </svg></div><div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);text-align:center;margin-top:8px">Every axis is computed from the result (hover for formula) — none are subjective scores.</div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">What-If (predicted Cpk after 10% tightening)</div><div class="sc-card"><div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;font-family:var(--font-mono)">Recomputed with the same engine. Cost impact is NOT estimated here — it needs your process cost model.</div>
      <div class="sc-whatif">${whatIfs.map(w=>{ const dc=w.cpk-d.cpk; return `<div class="sc-whatif-card"><div class="sc-whatif-lbl">${w.name}</div><div class="sc-whatif-val">Cpk ${w.cpk.toFixed(2)}</div><div class="sc-whatif-chg ${dc>0?'pos':dc<0?'neg':'neu'}">${dc>=0?'+':''}${dc.toFixed(2)} | ${w.ppm.toFixed(0)} PPM</div></div>`; }).join('')}</div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommendations</div><div class="sc-card">${recHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Methodology & Standards (reference only)</div><div class="sc-card"><div class="sc-std">
      <span>ISO 286-1</span> — tolerance grades (reference for deviation values)<br>
      <span>ASME Y14.5</span> — statistical tolerancing context (RSS)<br>
      <span>AIAG SPC</span> — Cpk definition: min[(USL-mu)/3s, (mu-LSL)/3s] (here mu,s are model-derived, not measured)<br>
      <span>Monte Carlo</span> — seeded Decimal LCG, normal per-component assumption; histogram from actual samples<br>
      <span>Known limitations</span> — 1D linear stack only; normal + centered assumption; no correlation model; predicted, not observed capability<br>
      <span>Reproducibility</span> — same inputs + seed + engine version reproduce this report exactly (hashes above)
    </div></div></div>
    <div class="sc-footer">SectorCalc — Engineering preview. Client-side. Deterministic Decimal engine. Not for production approval.<br>Predicted results from drawing tolerances; verify with measured process data.</div>`;

  $('pdfBtn').addEventListener('click', () => exportPDF(false));
  $('gfxBtn').addEventListener('click', () => exportPDF(true));
  $('shareBtn').addEventListener('click', shareReport);
}

function exportPDF(graphic){
  const d = calcData; if (!d) return;
  const u = d.fromMm, uL = currentUnit;
  if (graphic){
    const el = $('reportArea');
    html2canvas(el, { scale:1.5, backgroundColor:'#070a0f', useCORS:true, logging:false }).then(canvas => {
      const { jsPDF } = window.jspdf; const pdf = new jsPDF({ unit:'pt', format:'a4' });
      const pW = pdf.internal.pageSize.getWidth(), pH = pdf.internal.pageSize.getHeight();
      const iH = (canvas.height*pW)/canvas.width; const img = canvas.toDataURL('image/jpeg', 0.82);
      let left = iH, pos = 0; pdf.addImage(img,'JPEG',0,pos,pW,iH); left -= pH;
      while (left>0){ pos -= pH; pdf.addPage(); pdf.addImage(img,'JPEG',0,pos,pW,iH); left -= pH; }
      const n = pdf.getNumberOfPages(); for (let i=1;i<=n;i++){ pdf.setPage(i); pdf.setFontSize(7); pdf.setTextColor(120); pdf.text('SectorCalc | '+d.calcId+' | '+ENGINE_VERSION+' | preview, not for production | p'+i+'/'+n, 48, pH-16); }
      pdf.save(d.calcId+'-graphic.pdf');
    }).catch(e => alert('Graphic PDF failed: '+e.message));
    return;
  }
  const { jsPDF } = window.jspdf; const doc = new jsPDF({ unit:'pt', format:'a4' }); let y=48;
  const line = (t,s,c,b)=>{ doc.setFontSize(s||10); doc.setTextColor(c||'#222'); doc.setFont('helvetica',b?'bold':'normal'); const ls=doc.splitTextToSize(t,500); doc.text(ls,48,y); y+=ls.length*((s||10)+4)+2; if(y>780){doc.addPage();y=48;} };
  const overall = !d.rssInSpec?'CRITICAL':(d.cpk<d.b.cpkTarget?'WARNING':'PASS');
  line('SC-008 Tolerance Stack-Up — Predicted Analysis',16,'#111',true);
  line('Calc ID '+d.calcId+' | '+new Date().toISOString().slice(0,19)+' UTC | Engine '+ENGINE_VERSION,9,'#666');
  line('input hash '+d.inputHash+' | output hash '+d.outputHash,9,'#666');
  line('Engineering preview — predicted from drawing tolerances, not measured data. Not for production approval.',9,'#b8860b');
  line('Client-side only — data never left your browser.',9,'#1a7f37'); y+=6;
  line('VERDICT (predicted): '+overall+'   RSS +/-'+(d.rssTol*u).toFixed(4)+' '+uL+'   pred. Cpk '+d.cpk.toFixed(2)+'   pred. PPM '+d.ppm.toFixed(0),12,overall==='PASS'?'#1a7f37':overall==='WARNING'?'#b8860b':'#c0392b',true); y+=8;
  line('METHOD COMPARISON',11,'#111',true);
  line('Worst-case +/-'+(d.wcTol*u).toFixed(4)+' '+uL,10); line('RSS +/-'+(d.rssTol*u).toFixed(4)+' '+uL,10); line('Monte Carlo +/-'+(d.mcSpread*u).toFixed(4)+' '+uL+' (n='+MC_RUNS+')',10); y+=8;
  line('STACK',11,'#111',true);
  d.b.dims.forEach((dim,i)=>{ const c=d.result.pareto.find(p=>p.name===dim.name); line((i+1)+'. '+dim.name+'  '+(dim.nominal*u).toFixed(3)+' +/-'+(dim.tolerance*u).toFixed(3)+'  ('+(c?c.pct:'0')+'%)',9); }); y+=8;
  line('LIMITATIONS: 1D linear; normal+centered assumption; no correlation; predicted not observed capability.',8,'#666');
  line('Generated by SectorCalc.com — deterministic Decimal engine — preview.',8,'#999');
  doc.save(d.calcId+'.pdf');
}

function shareReport(){
  const d = calcData; if (!d) return;
  const s = encodeURIComponent(JSON.stringify({ specUpper:$('specUpper').value, specLower:$('specLower').value, cpkTarget:$('cpkTarget').value, seed:$('mcSeed').value, unit:currentUnit, dims:dimensions }));
  navigator.clipboard.writeText(location.origin+'/sc008-pro.html?s='+s).then(()=>alert('Shareable URL copied (state encoded; deterministic on reload)'));
}

document.querySelectorAll('.sc-preset').forEach(b => b.addEventListener('click', ()=>loadPreset(b.dataset.preset)));
['specUpper','specLower','cpkTarget','mcSeed'].forEach(id => $(id).addEventListener('input', compute));
$('unitSpec').addEventListener('change', convertUnits);
$('unitSpec2').addEventListener('change', ()=>{ $('unitSpec').value=$('unitSpec2').value; convertUnits(); });
$('addDim').addEventListener('click', ()=>{ dimensions.push({name:'Dim '+(dimensions.length+1),nominal:10,tolerance:0.05}); renderDims(); compute(); });
$('resetAll').addEventListener('click', ()=>loadPreset('standard'));
$('genReport').addEventListener('click', generateReport);
$('dimList').addEventListener('input', e=>{ const t=e.target; if(t.dataset.i!==undefined){ const i=+t.dataset.i, f=t.dataset.f; dimensions[i][f]= f==='name'?t.value:parseFloat(t.value); compute(); }});
$('dimList').addEventListener('click', e=>{ const t=e.target; if(t.dataset.del!==undefined && dimensions.length>1){ dimensions.splice(+t.dataset.del,1); renderDims(); compute(); }});

loadFromURL();
renderDims();
compute();
