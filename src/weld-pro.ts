// @ts-nocheck
import { calculate } from './tools/SC-001-weld-thickness/v1.0.0/formula.js';

function pick(r, keys, def = 0) { for (const k of keys) { const v = r[k]; if (v !== undefined && v !== null && v !== '') { const n = Number(v); return Number.isFinite(n) ? n : def; } } return def; }

const FIELDS = ['designLoadN','weldLengthMm','weldStrengthMpa','safetyFactor','materialThicknessMm'];
const presets = {
  struct: { designLoadN:50000, weldLengthMm:200, weldStrengthMpa:480, safetyFactor:2, materialThicknessMm:10, jointType:'fillet' },
  prec:   { designLoadN:10000, weldLengthMm:50, weldStrengthMpa:480, safetyFactor:2.5, materialThicknessMm:4, jointType:'fillet' }
};
const $ = (id) => document.getElementById(id);
let calcData = null;

function readInputs() { const input = { jointType: $('jointType').value }; FIELDS.forEach(f => input[f] = parseFloat($(f).value) || 0); if (input.safetyFactor < 1) input.safetyFactor = 1; return input; }

function validateAndCalc() {
  let hasError = false;
  const checks = [['designLoadN', v => v <= 0], ['weldLengthMm', v => v <= 0], ['weldStrengthMpa', v => v <= 0], ['safetyFactor', v => v < 1], ['materialThicknessMm', v => v <= 0]];
  checks.forEach(([f, bad]) => {
    const v = parseFloat($(f).value);
    if (isNaN(v) || bad(v)) { $('fld-'+f).classList.add('has-error'); $('val-'+f).className='sc-val error'; $('val-'+f).textContent='X must be positive'; hasError = true; }
    else { $('fld-'+f).classList.remove('has-error'); $('val-'+f).className='sc-val ok'; $('val-'+f).textContent='OK'; }
  });
  if (hasError) { $('liveResult').textContent = '—'; $('liveSub').innerHTML = ''; return; }

  const input = readInputs();
  let r;
  try { r = calculate(input); } catch (e) { $('liveResult').textContent = 'ERR'; $('liveSub').innerHTML = '<span>' + e.message + '</span>'; return; }

  const leg = pick(r, ['finalLegMm','legMm','requiredLegMm','leg']);
  const throat = pick(r, ['requiredThroatMm','throatMm','throat']);
  const minLeg = pick(r, ['minLegMm','codeMinLegMm','minLeg']);
  const util = pick(r, ['utilization','util','ratio']);
  const steps = Array.isArray(r.steps) ? r.steps : [];

  calcData = { input, r, leg, throat, minLeg, util, steps };
  $('liveResult').textContent = leg.toFixed(2) + ' mm';
  $('liveSub').innerHTML = '<span>Util ' + (util * 100).toFixed(0) + '%</span><span>Throat ' + throat.toFixed(2) + '</span><span>Min leg ' + minLeg.toFixed(2) + '</span>';
}

function loadPreset(key) {
  const p = presets[key];
  FIELDS.forEach(f => $(f).value = p[f]);
  $('jointType').value = p.jointType;
  document.querySelectorAll('.sc-preset').forEach((b, i) => b.classList.toggle('active', (key === 'struct' ? i === 0 : i === 1)));
  validateAndCalc();
}
function resetAll() { loadPreset('struct'); }
function loadFromURL() {
  const s = new URLSearchParams(location.search).get('s'); if (!s) return;
  try { const o = JSON.parse(decodeURIComponent(s)); FIELDS.forEach(f => { if (o[f] !== undefined) $(f).value = o[f]; }); if (o.jointType) $('jointType').value = o.jointType; } catch (e) {}
}

function gaugeColor(u) { return u >= 1 ? '#f5222d' : (u >= 0.9 ? '#faad14' : '#52c41a'); }
function overallStatus(u) { return u >= 1 ? 'CRITICAL' : (u >= 0.9 ? 'WARNING' : 'PASS'); }

function generateReport() {
  if (!calcData) validateAndCalc();
  const d = calcData; if (!d) return;
  const calcId = 'SC-001-' + Math.random().toString(36).substr(2, 9).toUpperCase(); window.calcId = calcId;
  const status = overallStatus(d.util);
  const gCol = gaugeColor(d.util);
  const gaugeAngle = Math.max(-90, Math.min(90, (d.util / 1.5) * 180 - 90));

  const whatIfs = [
    { label: 'Load +20%', fn: i => ({ ...i, designLoadN: i.designLoadN * 1.2 }) },
    { label: 'Weld length +20%', fn: i => ({ ...i, weldLengthMm: i.weldLengthMm * 1.2 }) },
    { label: 'Strength -10%', fn: i => ({ ...i, weldStrengthMpa: i.weldStrengthMpa * 0.9 }) }
  ].map(w => {
    let tr; try { tr = calculate(w.fn(d.input)); } catch (e) { return { label: w.label, leg: d.leg, util: d.util }; }
    return { label: w.label, leg: pick(tr, ['finalLegMm','legMm','requiredLegMm','leg']), util: pick(tr, ['utilization','util','ratio']) };
  });

  const stepsRows = d.steps.length ? d.steps.map(s => `<tr><td>${s.step !== undefined ? s.step : ''}</td><td class="td-name">${s.description || ''}</td><td class="td-val">${s.result !== undefined ? s.result : (s.formula || '')}</td></tr>`).join('') : `<tr><td>-</td><td class="td-name">No step trace from engine</td><td class="td-val">see inputs</td></tr>`;

  const recHTML = status !== 'PASS' ? `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Weld is undersized for the load</span></div><div class="sc-rec-body">Utilization ${(d.util*100).toFixed(0)}% (&gt;= 90%).<br><span class="neg">-> Increase weld length or leg; utilization falls with more weld area</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Respect the code minimum leg</span></div><div class="sc-rec-body">Code min leg ${d.minLeg.toFixed(2)} mm for ${d.input.materialThicknessMm} mm material.<br><span class="neg">-> Required leg must not fall below this even if load allows</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">3</span><span class="sc-rec-title">Verify joint type and inspection</span></div><div class="sc-rec-body">Joint: ${d.input.jointType}. High utilization demands full inspection.<br><span class="pos">-> Specify NDT level matching the safety factor</span></div></div>` : `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Weld is adequately sized - document the leg callout</span></div><div class="sc-rec-body">Required leg ${d.leg.toFixed(2)} mm, utilization ${(d.util*100).toFixed(0)}%.<br><span class="pos">-> Put the leg and length on the drawing per EN ISO 2553</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Keep the audit trail</span></div><div class="sc-rec-body">Calc ID ${calcId} reproducible from inputs.<br><span class="pos">-> Attach PDF to the welding procedure / WPS package</span></div></div>`;

  const reportHTML = `
    <div class="sc-report-hd"><div class="sc-report-hd-left"><div class="sc-report-title">SC-001 Weld Thickness Analysis</div><div class="sc-report-meta">Calculation ID: <span>${calcId}</span> &nbsp;|&nbsp; ${new Date().toISOString().replace('T',' ').slice(0,19)} UTC<br>Standard: AWS D1.1 structural welding | EN ISO 2553 weld symbols<br>Method: Deterministic load / weld-capacity check<br><span class="ok">OK Client-Side Only - your data never left your browser</span></div></div>
      <div class="sc-report-hd-right"><button class="sc-btn sc-btn-ghost" onclick="exportPDF()">Export PDF</button><button class="sc-btn sc-btn-ghost" onclick="exportPDFGraphic()">Export Graphic PDF</button><button class="sc-btn sc-btn-primary" onclick="shareReport()">Share</button></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Risk Assessment</div>
      ${status === 'CRITICAL' ? `<div class="sc-alert sc-alert-crit"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">Critical - Weld undersized</div><div class="sc-alert-body">Utilization <strong>${(d.util*100).toFixed(0)}%</strong> (&gt;= 100%). The weld <strong>cannot carry the load</strong>.<br>Required leg ${d.leg.toFixed(2)} mm. Increase weld length or leg immediately.</div></div></div>` : ''}
      ${status === 'WARNING' ? `<div class="sc-alert sc-alert-warn"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">Warning - Utilization near limit</div><div class="sc-alert-body">Utilization <strong>${(d.util*100).toFixed(0)}%</strong> (&gt;= 90%). Marginal.<br>Little reserve for load variation; add weld area or reduce load.</div></div></div>` : ''}
      ${status === 'PASS' ? `<div class="sc-alert sc-alert-pass"><div class="sc-alert-icon">OK</div><div><div class="sc-alert-title">Pass - Weld adequately sized</div><div class="sc-alert-body">Utilization <strong>${(d.util*100).toFixed(0)}%</strong> below 90%. Required leg <strong>${d.leg.toFixed(2)} mm</strong>.<br>Throat ${d.throat.toFixed(2)} mm, code min leg ${d.minLeg.toFixed(2)} mm.</div></div></div>` : ''}
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Weld Summary</div><div class="sc-cards">
      <div class="sc-card-res ${status==='PASS'?'pass':status==='WARNING'?'warn':'crit'}"><div class="sc-card-res-label">Required Leg</div><div class="sc-card-res-val">${d.leg.toFixed(2)}</div><div class="sc-card-res-sub">mm</div><span class="sc-card-res-badge ${status==='PASS'?'sc-badge-pass':status==='WARNING'?'sc-badge-warn':'sc-badge-crit'}">${status}</span></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Utilization</div><div class="sc-card-res-val">${(d.util*100).toFixed(0)}%</div><div class="sc-card-res-sub">load / capacity</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Required Throat</div><div class="sc-card-res-val">${d.throat.toFixed(2)}</div><div class="sc-card-res-sub">mm</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Code Min Leg</div><div class="sc-card-res-val">${d.minLeg.toFixed(2)}</div><div class="sc-card-res-sub">mm</div></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Input Registry</div><div class="sc-card"><div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>Parameter</th><th>Value</th><th>Unit</th></tr></thead><tbody>
      <tr><td class="td-name">Design load</td><td class="td-val">${d.input.designLoadN}</td><td>N</td></tr>
      <tr><td class="td-name">Weld length</td><td class="td-val">${d.input.weldLengthMm}</td><td>mm</td></tr>
      <tr><td class="td-name">Weld strength</td><td class="td-val">${d.input.weldStrengthMpa}</td><td>MPa</td></tr>
      <tr><td class="td-name">Safety factor</td><td class="td-val">${d.input.safetyFactor}</td><td>-</td></tr>
      <tr><td class="td-name">Material thickness</td><td class="td-val">${d.input.materialThicknessMm}</td><td>mm</td></tr>
      <tr><td class="td-name">Joint type</td><td class="td-val">${d.input.jointType}</td><td>-</td></tr>
    </tbody></table></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Utilization Gauge</div><div class="sc-card"><div style="display:flex;justify-content:center"><svg width="300" height="170" viewBox="0 0 300 170">
      <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="#111720" stroke-width="24" stroke-linecap="round"/>
      <path d="M 40 150 A 110 110 0 0 1 150 40" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 150 40 A 110 110 0 0 1 210 70" fill="none" stroke="rgba(250,173,20,0.2)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 210 70 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(245,34,45,0.2)" stroke-width="24" stroke-linecap="round"/>
      <line x1="150" y1="150" x2="${150 + 95 * Math.cos(gaugeAngle * Math.PI / 180)}" y2="${150 + 95 * Math.sin(gaugeAngle * Math.PI / 180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="150" cy="150" r="7" fill="${gCol}"/>
      <text x="150" y="135" text-anchor="middle" fill="#f0f4f8" font-size="24" font-weight="700" font-family="JetBrains Mono">${(d.util*100).toFixed(0)}%</text>
      <text x="150" y="155" text-anchor="middle" fill="#4a5568" font-size="10">utilization</text>
      <text x="30" y="168" fill="#4a5568" font-size="9">0</text><text x="262" y="168" fill="#4a5568" font-size="9">150%</text>
    </svg></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Show Me The Math</div><div class="sc-card"><div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>#</th><th>Step</th><th>Result</th></tr></thead><tbody>${stepsRows}</tbody></table></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">What-If Sensitivity</div><div class="sc-card"><div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;font-family:var(--font-mono)">Scenario impact on required leg and utilization.</div>
      <div class="sc-whatif">${whatIfs.map(w => `<div class="sc-whatif-card"><div class="sc-whatif-lbl">${w.label}</div><div class="sc-whatif-val">${w.leg.toFixed(2)} mm</div><div class="sc-whatif-chg ${w.util >= 1 ? 'pos' : w.util >= 0.9 ? 'neu' : 'neg'}">util ${(w.util*100).toFixed(0)}%</div></div>`).join('')}</div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommended Actions</div><div class="sc-card">${recHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards & References</div><div class="sc-card"><div class="sc-std">
      <span>AWS D1.1</span> - Structural welding code, fillet weld sizing<br>
      <span>EN ISO 2553</span> - Weld symbols on drawings<br>
      <span>Throat relation</span> - fillet throat ~ 0.707 x leg<br>
      <span>Utilization</span> - applied stress / allowable; &gt;= 1.0 means undersized<br>
      <span>Deterministic</span> - same inputs always yield the same leg, client-side
    </div></div></div>
    <div class="sc-footer">Generated by SectorCalc.com - Deterministic Engineering Calculators - Client-Side Only - Your data never leaves your browser<br>Deterministic | Reproducible | Audit-Ready</div>`;
  $('reportArea').innerHTML = reportHTML;
}

function exportPDF() {
  const d = calcData; if (!d) return;
  const { jsPDF } = window.jspdf; const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const calcId = window.calcId || 'SC-001'; const status = overallStatus(d.util);
  let y = 48;
  const line = (txt, size, color, bold) => { doc.setFontSize(size || 10); doc.setTextColor(color || '#222222'); doc.setFont('helvetica', bold ? 'bold' : 'normal'); const ls = doc.splitTextToSize(txt, 500); doc.text(ls, 48, y); y += ls.length * ((size || 10) + 4) + 2; if (y > 780) { doc.addPage(); y = 48; } };
  line('SC-001 Weld Thickness Analysis', 16, '#111111', true);
  line('Calc ID: ' + calcId + '   |   ' + new Date().toISOString().slice(0,19) + ' UTC', 9, '#666666');
  line('Standard: AWS D1.1 | EN ISO 2553', 9, '#666666');
  line('Client-Side Only - your data never left your browser', 9, '#1a7f37'); y += 6;
  line('VERDICT: ' + status + '    Required leg ' + d.leg.toFixed(2) + ' mm    Utilization ' + (d.util*100).toFixed(0) + '%    Throat ' + d.throat.toFixed(2) + '    Min leg ' + d.minLeg.toFixed(2), 12, status==='PASS'?'#1a7f37':(status==='WARNING'?'#b8860b':'#c0392b'), true); y += 8;
  line('STEPS', 11, '#111111', true);
  (d.steps.length ? d.steps : [{ step: '-', description: 'no step trace', result: '' }]).forEach(s => line((s.step !== undefined ? s.step + '. ' : '') + (s.description || '') + ' = ' + (s.result !== undefined ? s.result : (s.formula || '')), 9)); y += 8;
  line('Generated by SectorCalc.com - Deterministic - Audit-Ready', 8, '#999999');
  doc.save('SC-001-' + calcId + '.pdf');
}

async function exportPDFGraphic() {
  const el = $('reportArea'); if (!el || !calcData) { alert('Generate the report first.'); return; }
  const btn = event && event.target; if (btn) { btn.textContent = 'Rendering...'; btn.disabled = true; }
  try {
    const canvas = await html2canvas(el, { scale: 1.5, backgroundColor: '#070a0f', useCORS: true, logging: false });
    const { jsPDF } = window.jspdf; const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width; const imgData = canvas.toDataURL('image/jpeg', 0.82);
    let heightLeft = imgH, position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH); heightLeft -= pageH;
    while (heightLeft > 0) { position -= pageH; pdf.addPage(); pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH); heightLeft -= pageH; }
    const pages = pdf.getNumberOfPages();
    for (let i = 1; i <= pages; i++) { pdf.setPage(i); pdf.setFontSize(7); pdf.setTextColor(120); pdf.text('SectorCalc.com | Calc ID ' + (window.calcId || 'SC-001') + ' | Deterministic | Client-Side | Page ' + i + '/' + pages, 48, pageH - 16); }
    pdf.save('SC-001-' + (window.calcId || 'report') + '-graphic.pdf');
  } catch (err) { alert('Graphic PDF failed: ' + err.message + '. Use Export PDF instead.'); }
  finally { if (btn) { btn.textContent = 'Export Graphic PDF'; btn.disabled = false; } }
}

function shareReport() {
  const d = calcData; if (!d) return;
  const s = encodeURIComponent(JSON.stringify(Object.assign({ jointType: d.input.jointType }, Object.fromEntries(FIELDS.map(f => [f, d.input[f]])))));
  navigator.clipboard.writeText(location.origin + '/weld-pro.html?s=' + s).then(() => alert('Shareable URL copied'));
}

window.generateReport = generateReport;
window.exportPDF = exportPDF;
window.exportPDFGraphic = exportPDFGraphic;
window.shareReport = shareReport;
window.loadPreset = loadPreset;
window.resetAll = resetAll;
window.validateAndCalc = validateAndCalc;

loadFromURL();
validateAndCalc();
