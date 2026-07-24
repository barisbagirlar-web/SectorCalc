// @ts-nocheck
import { calculate } from './tools/SC-020-feeds-speeds/v1.0.0/formula.js';
import { evaluateWarnings } from './tools/SC-020-feeds-speeds/v1.0.0/warnings.js';
import { MATERIALS, MATERIAL_IDS } from './tools/SC-020-feeds-speeds/v1.0.0/reference.js';
import {
  lengthToMm,
  speedToMPerMin,
  powerToKw,
  torqueToNm,
  FS_ENGINE_ID,
  FS_ENGINE_VERSION,
  FS_ENGINE_BUILD_DATE
} from './core/fs-engine.js';
import { readThemePalette, exportSurfaceBg, onThemeChange } from './lib/theme-palette.js';

const ENGINE_LABEL = `${FS_ENGINE_ID} (${FS_ENGINE_BUILD_DATE})`;
const $ = (id) => document.getElementById(id);

const presets = {
  steel: {
    materialId: 'P2', diameter: 10, teeth: 4, vc: 150, fz: 0.05, ap: 5, ae: 2,
    spindleKw: 7.5, spindleTorque: 50, stickOut: 30, nose: 0.8, efficiency: 0.8,
    coolant: 'flood', interruption: 'continuous', toolCost: 45, machineCost: 1.2,
    units: { diameter: 'mm', vc: 'm/min', fz: 'mm', ap: 'mm', ae: 'mm', power: 'kW', torque: 'N·m', stick: 'mm', nose: 'mm' }
  },
  alum: {
    materialId: 'N1', diameter: 12, teeth: 3, vc: 500, fz: 0.08, ap: 4, ae: 3,
    spindleKw: 11, spindleTorque: 70, stickOut: 25, nose: 0.4, efficiency: 0.85,
    coolant: 'mql', interruption: 'light', toolCost: 60, machineCost: 1.5,
    units: { diameter: 'mm', vc: 'm/min', fz: 'mm', ap: 'mm', ae: 'mm', power: 'kW', torque: 'N·m', stick: 'mm', nose: 'mm' }
  },
  ti: {
    materialId: 'S1', diameter: 10, teeth: 4, vc: 45, fz: 0.04, ap: 3, ae: 1.5,
    spindleKw: 15, spindleTorque: 90, stickOut: 22, nose: 0.8, efficiency: 0.8,
    coolant: 'high_pressure', interruption: 'medium', toolCost: 120, machineCost: 2.0,
    units: { diameter: 'mm', vc: 'm/min', fz: 'mm', ap: 'mm', ae: 'mm', power: 'kW', torque: 'N·m', stick: 'mm', nose: 'mm' }
  }
};

let calcData = null;
let _reportSyncing = false;

function reportIsOpen() {
  return !!($('reportArea') && $('reportArea').querySelector('.sc-report-hd'));
}
function syncReportIfOpen() {
  if (_reportSyncing || !reportIsOpen() || !calcData) return;
  _reportSyncing = true;
  try { generateReport({ sync: true }); } finally { _reportSyncing = false; }
}

function setFieldState(f, ok, msg) {
  const fld = $('fld-' + f);
  const val = $('val-' + f);
  if (fld) {
    fld.classList.toggle('has-error', !ok);
    fld.classList.toggle('has-warn', false);
  }
  if (val) {
    val.className = 'sc-val ' + (ok ? 'ok' : 'error');
    val.textContent = msg;
  }
}

function fillMaterials() {
  const sel = $('materialId');
  if (!sel || sel.options.length) return;
  for (const id of MATERIAL_IDS) {
    const m = MATERIALS[id];
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = `${id} - ${m.name}`;
    sel.appendChild(opt);
  }
}

function onMaterialChange() {
  const m = MATERIALS[$('materialId').value];
  if (m) {
    $('vc').value = m.refVc;
    $('u-vc').value = 'm/min';
    $('nose').value = m.refNoseRadius;
    $('val-materialId').textContent = `Ref Vc ${m.refVc} m/min | kc1 ${m.kc1}`;
  }
  validateAndCalc();
}

function applyUnits(u) {
  $('u-diameter').value = u.diameter;
  $('u-vc').value = u.vc;
  $('u-fz').value = u.fz;
  $('u-ap').value = u.ap;
  $('u-ae').value = u.ae;
  $('u-power').value = u.power;
  $('u-torque').value = u.torque;
  $('u-stick').value = u.stick;
  $('u-nose').value = u.nose;
}

function readDisplayInputs() {
  return {
    materialId: $('materialId').value,
    diameter: parseFloat($('diameter').value),
    teeth: parseFloat($('teeth').value),
    vc: parseFloat($('vc').value),
    fz: parseFloat($('fz').value),
    ap: parseFloat($('ap').value),
    ae: parseFloat($('ae').value),
    spindleKw: parseFloat($('spindleKw').value),
    spindleTorque: parseFloat($('spindleTorque').value),
    stickOut: parseFloat($('stickOut').value),
    nose: parseFloat($('nose').value),
    efficiency: parseFloat($('efficiency').value),
    coolant: $('coolant').value,
    interruption: $('interruption').value,
    toolCost: parseFloat($('toolCost').value),
    machineCost: parseFloat($('machineCost').value),
    currency: $('currency').value,
    uDiameter: $('u-diameter').value,
    uVc: $('u-vc').value,
    uFz: $('u-fz').value,
    uAp: $('u-ap').value,
    uAe: $('u-ae').value,
    uPower: $('u-power').value,
    uTorque: $('u-torque').value,
    uStick: $('u-stick').value,
    uNose: $('u-nose').value
  };
}

function toSi(d) {
  return {
    materialId: d.materialId,
    diameterMm: lengthToMm(d.diameter, d.uDiameter, 'diameter').toString(),
    teeth: String(Math.round(d.teeth)),
    vcMPerMin: speedToMPerMin(d.vc, d.uVc, 'vc').toString(),
    fzMm: lengthToMm(d.fz, d.uFz, 'fz').toString(),
    apMm: lengthToMm(d.ap, d.uAp, 'ap').toString(),
    aeMm: lengthToMm(d.ae, d.uAe, 'ae').toString(),
    spindleKw: powerToKw(d.spindleKw, d.uPower, 'spindleKw').toString(),
    spindleTorqueNm: torqueToNm(d.spindleTorque, d.uTorque, 'spindleTorque').toString(),
    stickOutMm: lengthToMm(d.stickOut, d.uStick, 'stickOut').toString(),
    noseRadiusMm: lengthToMm(d.nose, d.uNose, 'nose').toString(),
    efficiency: String(d.efficiency),
    coolant: d.coolant,
    interruption: d.interruption,
    toolCost: String(d.toolCost),
    machineCostPerMin: String(d.machineCost),
    currency: d.currency
  };
}

function validateAndCalc() {
  fillMaterials();
  let hasError = false;
  const d = readDisplayInputs();
  const checks = [
    ['diameter', d.diameter > 0, 'X diameter > 0'],
    ['teeth', Number.isInteger(d.teeth) && d.teeth >= 1, 'X integer teeth >= 1'],
    ['vc', d.vc > 0, 'X Vc > 0'],
    ['fz', d.fz > 0, 'X fz > 0'],
    ['ap', d.ap > 0, 'X ap > 0'],
    ['ae', d.ae > 0, 'X ae > 0'],
    ['spindleKw', d.spindleKw > 0, 'X power > 0'],
    ['spindleTorque', d.spindleTorque > 0, 'X torque > 0'],
    ['stickOut', d.stickOut > 0, 'X stick-out > 0'],
    ['nose', d.nose > 0, 'X nose > 0'],
    ['efficiency', d.efficiency >= 0.3 && d.efficiency <= 1, 'X efficiency 0.3-1'],
    ['toolCost', d.toolCost >= 0, 'X tool cost >= 0'],
    ['machineCost', d.machineCost > 0, 'X machine cost > 0']
  ];
  for (const [f, ok, msg] of checks) {
    if (!ok) { setFieldState(f, false, msg); hasError = true; }
    else {
      const hint = f === 'vc' && MATERIALS[d.materialId]
        ? `OK | ref ${MATERIALS[d.materialId].refVc} m/min`
        : 'OK';
      setFieldState(f, true, hint);
    }
  }

  // ae vs diameter in SI
  try {
    const diamMm = Number(lengthToMm(d.diameter, d.uDiameter).toString());
    const aeMm = Number(lengthToMm(d.ae, d.uAe).toString());
    if (aeMm > diamMm) {
      setFieldState('ae', false, 'X ae must be <= diameter');
      hasError = true;
    }
  } catch (e) {
    hasError = true;
  }

  if (hasError) {
    $('liveResult').textContent = '-';
    $('liveSub').innerHTML = '';
    $('liveVerdict').textContent = '';
    return;
  }

  let si, r, warnings;
  try {
    si = toSi(d);
    r = calculate(si);
    warnings = evaluateWarnings(si, r);
  } catch (e) {
    $('liveResult').textContent = 'ERR';
    $('liveSub').innerHTML = `<span>${e.message}</span>`;
    $('liveVerdict').textContent = '';
    return;
  }

  calcData = { display: d, si, r, warnings };
  $('liveResult').textContent = `${r.nRpm} rpm`;
  $('liveSub').innerHTML =
    `<span>Vf ${r.vfCompMmMin} mm/min</span>` +
    `<span>T ${r.toolLifeMin} min</span>` +
    `<span>Pc ${r.powerKw} kW</span>` +
    `<span>δ ${r.deflectionUm} um</span>`;
  $('liveVerdict').textContent = r.verdict;
  $('liveVerdict').style.color =
    r.verdict === 'RELEASED TO PRODUCTION' ? 'var(--accent-green)'
      : r.verdict === 'RUN WITH CAUTION' ? 'var(--accent-amber)'
        : 'var(--accent-red)';
  syncReportIfOpen();
}

function loadPreset(key) {
  const p = presets[key];
  fillMaterials();
  $('materialId').value = p.materialId;
  $('diameter').value = p.diameter;
  $('teeth').value = p.teeth;
  $('vc').value = p.vc;
  $('fz').value = p.fz;
  $('ap').value = p.ap;
  $('ae').value = p.ae;
  $('spindleKw').value = p.spindleKw;
  $('spindleTorque').value = p.spindleTorque;
  $('stickOut').value = p.stickOut;
  $('nose').value = p.nose;
  $('efficiency').value = p.efficiency;
  $('coolant').value = p.coolant;
  $('interruption').value = p.interruption;
  $('toolCost').value = p.toolCost;
  $('machineCost').value = p.machineCost;
  applyUnits(p.units);
  document.querySelectorAll('.sc-preset').forEach((b) => b.classList.toggle('active', b.dataset.preset === key));
  const m = MATERIALS[p.materialId];
  if (m) $('val-materialId').textContent = `Ref Vc ${m.refVc} m/min | kc1 ${m.kc1}`;
  validateAndCalc();
}

function resetAll() { loadPreset('steel'); }

function loadFromURL() {
  const s = new URLSearchParams(location.search).get('s');
  if (!s) return;
  try {
    const o = JSON.parse(decodeURIComponent(s));
    fillMaterials();
    Object.keys(o).forEach((k) => {
      if ($(k) && o[k] !== undefined) $(k).value = o[k];
    });
    if (o.units) applyUnits(o.units);
  } catch (e) { /* ignore bad share */ }
}

function verdictClass(v) {
  if (v === 'RELEASED TO PRODUCTION') return 'pass';
  if (v === 'RUN WITH CAUTION') return 'warn';
  return 'crit';
}

function generateReport(opts = {}) {
  if (!calcData) validateAndCalc();
  const d = calcData;
  if (!d) return;
  const now = new Date();
  const calcId = (opts.sync && window.calcId) ? window.calcId : ('SC020-' + d.r.integrity.toUpperCase());
  window.calcId = calcId;
  const P = readThemePalette();
  const r = d.r;
  const vc = verdictClass(r.verdict);
  const blocking = d.warnings.filter((w) => w.severity === 'blocking');
  const warning = d.warnings.filter((w) => w.severity === 'warning');
  const notes = d.warnings.filter((w) => w.severity === 'note');

  // Sensitivity: Vc +/- 10%
  const sens = [-10, 0, 10].map((pct) => {
    const si2 = { ...d.si, vcMPerMin: String(Number(d.si.vcMPerMin) * (1 + pct / 100)) };
    let rr;
    try { rr = calculate(si2); } catch (e) { return { pct, life: '-', power: '-' }; }
    return { pct, life: rr.toolLifeMin, power: rr.powerKw, verdict: rr.verdict };
  });

  const inputRows = [
    ['Material', d.display.materialId, r.materialName, '-'],
    ['Diameter', `${d.display.diameter} ${d.display.uDiameter}`, `${d.si.diameterMm} mm`, 'mm'],
    ['Teeth z', String(d.display.teeth), d.si.teeth, '-'],
    ['Vc', `${d.display.vc} ${d.display.uVc}`, `${d.si.vcMPerMin} m/min`, 'm/min'],
    ['fz', `${d.display.fz} ${d.display.uFz}`, `${d.si.fzMm} mm`, 'mm'],
    ['ap', `${d.display.ap} ${d.display.uAp}`, `${d.si.apMm} mm`, 'mm'],
    ['ae', `${d.display.ae} ${d.display.uAe}`, `${d.si.aeMm} mm`, 'mm'],
    ['Spindle power', `${d.display.spindleKw} ${d.display.uPower}`, `${d.si.spindleKw} kW`, 'kW'],
    ['Spindle torque', `${d.display.spindleTorque} ${d.display.uTorque}`, `${d.si.spindleTorqueNm} N·m`, 'N·m'],
    ['Stick-out', `${d.display.stickOut} ${d.display.uStick}`, `${d.si.stickOutMm} mm`, 'mm'],
    ['Nose radius', `${d.display.nose} ${d.display.uNose}`, `${d.si.noseRadiusMm} mm`, 'mm'],
    ['Efficiency', String(d.display.efficiency), d.si.efficiency, 'ratio'],
    ['Coolant', d.display.coolant, d.display.coolant, '-'],
    ['Interruption', d.display.interruption, d.display.interruption, '-'],
    ['Tool cost', `${d.display.currency} ${d.display.toolCost}`, d.si.toolCost, 'symbol'],
    ['Machine / min', String(d.display.machineCost), d.si.machineCostPerMin, d.display.currency]
  ];

  const alertHTML = `
    ${r.verdict === 'DO NOT RUN' ? `<div class="sc-alert sc-alert-crit"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">DO NOT RUN</div><div class="sc-alert-body">Predicted spindle, deflection, or tool-life limits are outside a safe run window.<br>${blocking.map((w) => w.message).join('<br>') || 'Review blocking warnings in Audit/Review.'}</div></div></div>` : ''}
    ${r.verdict === 'RUN WITH CAUTION' ? `<div class="sc-alert sc-alert-warn"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">RUN WITH CAUTION</div><div class="sc-alert-body">Parameters are usable with elevated risk. Verify on-machine load and finish.<br>${warning.map((w) => w.message).join('<br>')}</div></div></div>` : ''}
    ${r.verdict === 'RELEASED TO PRODUCTION' ? `<div class="sc-alert sc-alert-pass"><div class="sc-alert-icon">OK</div><div><div class="sc-alert-title">RELEASED TO PRODUCTION</div><div class="sc-alert-body">Within reference envelopes for power, torque, deflection, and tool life - still calibrate constants to supplier data before contract work.</div></div></div>` : ''}
  `;

  const reportHTML = `
    <div class="sc-report-hd">
      <div class="sc-report-hd-left">
        <div class="sc-report-title">SC-020 CNC Feeds &amp; Speeds + Tool Life</div>
        <div class="sc-report-meta">
          Calculation ID: <span>${calcId}</span> &nbsp;|&nbsp; ${now.toISOString().replace('T', ' ').slice(0, 19)} UTC<br>
          Engine: <span>${ENGINE_LABEL}</span> | Integrity <span>${r.integrity}</span><br>
          Material: ${r.isoGroup} / ${r.materialName}<br>
          <span class="ok">OK Client-Side Only - your data never left your browser</span>
        </div>
      </div>
      <div class="sc-report-hd-right">
        <button class="sc-btn sc-btn-ghost" onclick="exportJSON()">Export JSON</button>
        <button class="sc-btn sc-btn-ghost" onclick="exportPDF()">Export PDF</button>
        <button class="sc-btn sc-btn-ghost" onclick="exportPDFGraphic()">Export Graphic PDF</button>
        <button class="sc-btn sc-btn-primary" onclick="shareReport()">Share</button>
      </div>
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Verdict</div>${alertHTML}</div>
    <div class="sc-sec"><div class="sc-sec-hd">Results</div><div class="sc-cards">
      <div class="sc-card-res ${vc}"><div class="sc-card-res-label">Spindle n</div><div class="sc-card-res-val">${r.nRpm}</div><div class="sc-card-res-sub">rpm</div><span class="sc-card-res-badge ${vc === 'pass' ? 'sc-badge-pass' : vc === 'warn' ? 'sc-badge-warn' : 'sc-badge-crit'}">${r.verdict.split(' ').slice(0, 2).join(' ')}</span></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Vf compensated</div><div class="sc-card-res-val">${r.vfCompMmMin}</div><div class="sc-card-res-sub">mm/min</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Tool life T</div><div class="sc-card-res-val">${r.toolLifeMin}</div><div class="sc-card-res-sub">min</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Power Pc</div><div class="sc-card-res-val">${r.powerKw}</div><div class="sc-card-res-sub">kW (${r.powerUtilPct}%)</div></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Cutting Mechanics</div><div class="sc-card"><div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>Metric</th><th>Value</th><th>Unit</th></tr></thead><tbody>
      <tr><td class="td-name">Mean chip hm</td><td class="td-val">${r.hmMm}</td><td>mm</td></tr>
      <tr><td class="td-name">fz compensated</td><td class="td-val">${r.fzCompMm}</td><td>mm</td></tr>
      <tr><td class="td-name">Engagement</td><td class="td-val">${r.engagementDeg}</td><td>deg</td></tr>
      <tr><td class="td-name">MRR Q</td><td class="td-val">${r.mrrCm3Min}</td><td>cm3/min</td></tr>
      <tr><td class="td-name">kc (Kienzle)</td><td class="td-val">${r.kcNPerMm2}</td><td>N/mm2</td></tr>
      <tr><td class="td-name">Cutting force Fc</td><td class="td-val">${r.fcN}</td><td>N</td></tr>
      <tr><td class="td-name">Torque Mc</td><td class="td-val">${r.torqueNm}</td><td>N·m (${r.torqueUtilPct}%)</td></tr>
      <tr><td class="td-name">Deflection</td><td class="td-val">${r.deflectionUm}</td><td>um</td></tr>
      <tr><td class="td-name">Theoretical Ra</td><td class="td-val">${r.raUm}</td><td>um</td></tr>
      <tr><td class="td-name">Gilbert Vc</td><td class="td-val">${r.gilbertVcMPerMin}</td><td>m/min</td></tr>
      <tr><td class="td-name">Gilbert savings</td><td class="td-val">${r.gilbertSavingsPct}</td><td>%</td></tr>
    </tbody></table></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Sensitivity (Vc)</div><div class="sc-card">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;font-family:var(--font-mono)">Tool life and power vs cutting speed.</div>
      <div class="sc-whatif">${sens.map((s) => `<div class="sc-whatif-card"><div class="sc-whatif-lbl">Vc ${s.pct >= 0 ? '+' : ''}${s.pct}%</div><div class="sc-whatif-val">${s.life}</div><div class="sc-whatif-chg neu">min | Pc ${s.power} kW</div></div>`).join('')}</div>
      <svg width="100%" height="120" viewBox="0 0 360 120" style="margin-top:16px">
        <rect x="0" y="0" width="360" height="120" fill="${P.surface}"/>
        ${sens.map((s, i) => {
          const x = 40 + i * 110;
          const h = Math.min(80, Math.max(8, Number(s.life) / 2));
          return `<rect x="${x}" y="${100 - h}" width="40" height="${h}" fill="${P.blue}"/><text x="${x + 20}" y="114" text-anchor="middle" fill="${P.muted}" font-size="9">${s.pct}%</text>`;
        }).join('')}
      </svg>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Audit / Review</div><div class="sc-card">
      <div class="sc-std" style="margin-bottom:14px">
        <span>Engine</span> ${ENGINE_LABEL}<br>
        <span>Integrity hash</span> ${r.integrity}<br>
        <span>Verdict</span> ${r.verdict}
      </div>
      <div class="sc-sec-hd" style="margin-top:8px">Inputs (as entered + SI)</div>
      <div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>Parameter</th><th>As entered</th><th>SI</th><th>Unit</th></tr></thead><tbody>
        ${inputRows.map((row) => `<tr><td class="td-name">${row[0]}</td><td class="td-val">${row[1]}</td><td class="td-val">${row[2]}</td><td>${row[3]}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="sc-sec-hd" style="margin-top:18px">Formulas</div>
      <div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>#</th><th>Step</th><th>Formula</th><th>Result</th></tr></thead><tbody>
        ${r.steps.map((s) => `<tr><td class="td-val">${s.step}</td><td class="td-name">${s.description}</td><td class="td-val">${s.formula}</td><td class="td-val">${s.result}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="sc-sec-hd" style="margin-top:18px">Assumptions</div>
      <ul style="font-size:12px;color:var(--text-tertiary);line-height:1.7;font-family:var(--font-mono);padding-left:18px">
        ${r.assumptions.map((a) => `<li>${a}</li>`).join('')}
      </ul>
      <div class="sc-sec-hd" style="margin-top:18px">Warnings</div>
      ${[...blocking, ...warning, ...notes].map((w) => `
        <div class="sc-rec" style="margin-bottom:8px">
          <div class="sc-rec-hd"><span class="sc-rec-num">${w.severity === 'blocking' ? '!' : w.severity === 'warning' ? 'W' : 'N'}</span><span class="sc-rec-title">${w.code} | ${w.severity}</span></div>
          <div class="sc-rec-body">${w.message}<br><span class="neg">-> ${w.action}</span></div>
        </div>`).join('')}
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards &amp; References</div><div class="sc-card"><div class="sc-std">
      <span>ISO 513</span> - Material groups and specific cutting force mid-band reference<br>
      <span>Taylor</span> - Extended tool life with coolant and interruption factors<br>
      <span>Kienzle</span> - Specific cutting force kc = kc1 * hm^(-mc)<br>
      <span>Gilbert</span> - Minimum-cost cutting speed from Ct/Cm economics<br>
      <span>FS-ENGINE</span> - Deterministic SI core ${FS_ENGINE_VERSION} | build ${FS_ENGINE_BUILD_DATE}
    </div></div></div>
    <div class="sc-footer">Generated by SectorCalc.com - Client-Side Only - Your data never leaves your browser<br>Engineering preview | FS-ENGINE | Deterministic | Not for production approval | Calibrate to supplier datasheets</div>`;
  $('reportArea').innerHTML = reportHTML;
}

function exportJSON() {
  if (!calcData) return;
  const payload = {
    tool: 'SC-020',
    engine: ENGINE_LABEL,
    integrity: calcData.r.integrity,
    display: calcData.display,
    si: calcData.si,
    result: calcData.r,
    warnings: calcData.warnings,
    generatedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `SC-020-${window.calcId || calcData.r.integrity}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportPDF() {
  const d = calcData; if (!d) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const calcId = window.calcId || 'SC-020';
  let y = 48;
  const line = (txt, size, color, bold) => {
    doc.setFontSize(size || 10);
    doc.setTextColor(color || '#222222');
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const ls = doc.splitTextToSize(txt, 500);
    doc.text(ls, 48, y);
    y += ls.length * ((size || 10) + 4) + 2;
    if (y > 780) { doc.addPage(); y = 48; }
  };
  line('SC-020 CNC Feeds & Speeds + Tool Life', 16, '#111111', true);
  line('Calc ID: ' + calcId + '   |   Integrity: ' + d.r.integrity + '   |   ' + new Date().toISOString().slice(0, 19) + ' UTC', 9, '#666666');
  line(ENGINE_LABEL, 9, '#666666');
  line('Client-Side Only - your data never left your browser', 9, '#1a7f37');
  y += 6;
  line('VERDICT: ' + d.r.verdict, 12, d.r.verdict === 'RELEASED TO PRODUCTION' ? '#1a7f37' : (d.r.verdict === 'RUN WITH CAUTION' ? '#b8860b' : '#c0392b'), true);
  line(`n ${d.r.nRpm} rpm | Vf ${d.r.vfCompMmMin} mm/min | T ${d.r.toolLifeMin} min | Pc ${d.r.powerKw} kW (${d.r.powerUtilPct}%)`, 10);
  line(`Fc ${d.r.fcN} N | Mc ${d.r.torqueNm} N.m | defl ${d.r.deflectionUm} um | Ra ${d.r.raUm} um`, 10);
  y += 8;
  line('INPUTS (SI)', 11, '#111111', true);
  line(`mat ${d.si.materialId} | D ${d.si.diameterMm} | z ${d.si.teeth} | Vc ${d.si.vcMPerMin} | fz ${d.si.fzMm} | ap ${d.si.apMm} | ae ${d.si.aeMm}`, 9);
  y += 8;
  line('Generated by SectorCalc.com - Engineering preview - Deterministic - Not for production approval', 8, '#999999');
  doc.save('SC-020-' + calcId + '.pdf');
}

async function exportPDFGraphic() {
  const el = $('reportArea'); if (!el || !calcData) { alert('Generate the report first.'); return; }
  const btn = event && event.target; if (btn) { btn.textContent = 'Rendering...'; btn.disabled = true; }
  try {
    const canvas = await html2canvas(el, { scale: 1.5, backgroundColor: exportSurfaceBg(), useCORS: true, logging: false });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth(), pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.82);
    let heightLeft = imgH, position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH); heightLeft -= pageH;
    while (heightLeft > 0) { position -= pageH; pdf.addPage(); pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH); heightLeft -= pageH; }
    const pages = pdf.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      pdf.setPage(i); pdf.setFontSize(7); pdf.setTextColor(120);
      pdf.text('SectorCalc.com | ' + ENGINE_LABEL + ' | ' + (window.calcId || 'SC-020') + ' | Page ' + i + '/' + pages, 48, pageH - 16);
    }
    pdf.save('SC-020-' + (window.calcId || 'report') + '-graphic.pdf');
  } catch (err) {
    alert('Graphic PDF failed: ' + err.message + '. Use Export PDF instead.');
  } finally {
    if (btn) { btn.textContent = 'Export Graphic PDF'; btn.disabled = false; }
  }
}

function shareReport() {
  const d = calcData; if (!d) return;
  const payload = {
    materialId: d.display.materialId,
    diameter: d.display.diameter,
    teeth: d.display.teeth,
    vc: d.display.vc,
    fz: d.display.fz,
    ap: d.display.ap,
    ae: d.display.ae,
    spindleKw: d.display.spindleKw,
    spindleTorque: d.display.spindleTorque,
    stickOut: d.display.stickOut,
    nose: d.display.nose,
    efficiency: d.display.efficiency,
    coolant: d.display.coolant,
    interruption: d.display.interruption,
    toolCost: d.display.toolCost,
    machineCost: d.display.machineCost,
    currency: d.display.currency,
    units: {
      diameter: d.display.uDiameter,
      vc: d.display.uVc,
      fz: d.display.uFz,
      ap: d.display.uAp,
      ae: d.display.uAe,
      power: d.display.uPower,
      torque: d.display.uTorque,
      stick: d.display.uStick,
      nose: d.display.uNose
    }
  };
  const s = encodeURIComponent(JSON.stringify(payload));
  navigator.clipboard.writeText(location.origin + '/machining-pro.html?s=' + s).then(() => alert('Shareable URL copied'));
}

try {
  fillMaterials();
  loadFromURL();
  validateAndCalc();
} catch (e) {
  console.error(e);
}

window.generateReport = generateReport;
window.exportJSON = exportJSON;
window.exportPDF = exportPDF;
window.exportPDFGraphic = exportPDFGraphic;
window.shareReport = shareReport;
window.loadPreset = loadPreset;
window.resetAll = resetAll;
window.validateAndCalc = validateAndCalc;
window.onMaterialChange = onMaterialChange;
onThemeChange(syncReportIfOpen);
