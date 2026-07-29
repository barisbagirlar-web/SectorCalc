// @ts-nocheck
import { calculate } from './tools/SC-010-labor-cost/v1.0.0/formula.js';
import { COUNTRIES } from './tools/SC-010-labor-cost/v1.0.0/reference.js';
import { readThemePalette, exportSurfaceBg, onThemeChange } from './lib/theme-palette.js';
import { makeIntegrityShareURL, parseIntegrityShare } from './lib/share-integrity.js';
import { parseInputNumber } from './lib/parse-number.js';

function requirePick(r, keys, label) {
  for (const k of keys) {
    const v = r[k];
    if (v !== undefined && v !== null && v !== '') {
      const n = Number(v);
      if (Number.isFinite(n)) return n;
    }
  }
  throw new Error(`engine field missing: ${label} (tried ${keys.join(', ')})`);
}

const FIELDS = [
  'netSalary',
  'hoursPerWeek',
  'employerSSRate',
  'employerUnempRate',
  'employeeRate',
  'healthMonthly',
  'mealMonthly',
  'transportMonthly',
  'annualBonus',
  'severanceRate'
];
const presets = {
  small: {
    netSalary: 2500,
    payFrequency: 'monthly',
    hoursPerWeek: 40,
    employerSSRate: 0.0765,
    employerUnempRate: 0.06,
    employeeRate: 0.23,
    healthMonthly: 0,
    mealMonthly: 0,
    transportMonthly: 0,
    annualBonus: 0,
    severanceRate: 0
  },
  mid: {
    netSalary: 4000,
    payFrequency: 'monthly',
    hoursPerWeek: 45,
    employerSSRate: 0.0765,
    employerUnempRate: 0.06,
    employeeRate: 0.23,
    healthMonthly: 200,
    mealMonthly: 50,
    transportMonthly: 30,
    annualBonus: 6000,
    severanceRate: 0.02
  }
};
const $ = (id) => document.getElementById(id);
let _reportSyncing = false;
function reportIsOpen() {
  return !!($('reportArea') && $('reportArea').querySelector('.sc-report-hd'));
}
function syncReportIfOpen() {
  if (_reportSyncing || !reportIsOpen() || !calcData) return;
  _reportSyncing = true;
  try {
    generateReport({ sync: true });
  } finally {
    _reportSyncing = false;
  }
}
function setFieldState(f, ok, msg) {
  const fld = $('fld-' + f);
  const val = $('val-' + f);
  if (fld) fld.classList.toggle('has-error', !ok);
  if (val) {
    val.className = 'sc-val ' + (ok ? 'ok' : 'error');
    val.textContent = msg;
  }
}

let calcData = null;

function readInputs() {
  const countryEl = $('country');
  const country = (countryEl && countryEl.value) || 'US';
  const input = { country, payFrequency: $('payFrequency').value };
  FIELDS.forEach((f) => {
    const n = parseInputNumber($(f)?.value);
    input[f] = Number.isFinite(n) ? n : 0;
  });
  return input;
}

function applyCountryDefaults(code) {
  const c = COUNTRIES[code];
  if (!c) return;
  if ($('employerSSRate')) $('employerSSRate').value = c.employerSSRate;
  if ($('employerUnempRate')) $('employerUnempRate').value = c.employerUnempRate;
  if ($('employeeRate')) $('employeeRate').value = c.employeeRate;
  if ($('severanceRate')) $('severanceRate').value = c.severanceRate;
}

function validateAndCalc() {
  if (window.__scProGate && !window.__scProGate.isEntitled()) {
    if ($('liveResult')) $('liveResult').textContent = 'Locked';
    if ($('liveSub'))
      $('liveSub').innerHTML =
        '<span>Session unlock required for full editing (on-device math)</span>';
    return;
  }
  let hasError = false;
  const net = parseFloat($('netSalary').value);
  if (isNaN(net) || net < 0) {
    setFieldState('netSalary', false, 'X Net salary must be >= 0');
    hasError = true;
  } else {
    setFieldState('netSalary', true, 'OK');
  }
  const hrs = parseFloat($('hoursPerWeek').value);
  if (isNaN(hrs) || hrs <= 0 || hrs > 168) {
    setFieldState('hoursPerWeek', false, 'X Hours 0-168');
    hasError = true;
  } else {
    setFieldState('hoursPerWeek', true, 'OK');
  }
  ['employerSSRate', 'employerUnempRate', 'severanceRate'].forEach((f) => {
    const v = parseInputNumber($(f).value);
    if (isNaN(v) || v < 0 || v > 1) {
      setFieldState(f, false, 'X ratio 0-1');
      hasError = true;
    } else {
      setFieldState(f, true, 'OK');
    }
  });
  {
    const v = parseInputNumber($('employeeRate').value);
    if (isNaN(v) || v < 0 || v > 0.95) {
      setFieldState('employeeRate', false, 'X ratio 0-0.95');
      hasError = true;
    } else {
      setFieldState('employeeRate', true, 'OK');
    }
  }
  if (hasError) {
    $('liveResult').textContent = '—';
    $('liveSub').innerHTML = '';
    return;
  }

  const input = readInputs();
  let r;
  let trueCost, mult, hiddenPct, gross, breakdown;
  try {
    r = calculate(input);
    trueCost = requirePick(
      r,
      ['trueMonthlyCost', 'totalMonthlyCost', 'monthlyCost', 'trueCost', 'totalCost'],
      'trueMonthlyCost'
    );
    mult = requirePick(r, ['costMultiplier', 'multiplier', 'ratio', 'factor'], 'costMultiplier');
    hiddenPct = requirePick(
      r,
      ['hiddenCostPct', 'hiddenPct', 'overheadPct', 'burdenPct'],
      'hiddenCostPct'
    );
    gross = requirePick(r, ['grossMonthly', 'gross', 'baseMonthly', 'grossSalary'], 'grossMonthly');
    breakdown = Array.isArray(r.breakdown)
      ? r.breakdown.map((row) => ({
          name: row.item,
          amount: Number(row.amount),
          pct: Number(row.pct)
        }))
      : [];
  } catch (e) {
    $('liveResult').textContent = 'ERR';
    $('liveSub').innerHTML = '<span>' + e.message + '</span>';
    return;
  }

  calcData = { input, r, trueCost, mult, hiddenPct, gross, breakdown };
  $('liveResult').textContent = trueCost.toFixed(0) + ' /mo';
  $('liveSub').innerHTML =
    '<span>Multiplier ' +
    mult.toFixed(2) +
    'x</span><span>Hidden ' +
    hiddenPct.toFixed(1) +
    '%</span><span>Gross ' +
    gross.toFixed(0) +
    '</span>';
  syncReportIfOpen();
}

function loadPreset(key) {
  const p = presets[key];
  FIELDS.forEach((f) => ($(f).value = p[f]));
  $('payFrequency').value = p.payFrequency;
  document
    .querySelectorAll('.sc-preset')
    .forEach((b) => b.classList.toggle('active', b.dataset.preset === key));
  validateAndCalc();
}
function resetAll() {
  loadPreset('small');
}
function startBlankStudy() {
  FIELDS.forEach((f) => {
    if ($(f)) $(f).value = '';
  });
  if ($('payFrequency')) $('payFrequency').selectedIndex = 0;
  document.querySelectorAll('.sc-preset').forEach((b) => b.classList.remove('active'));
  calcData = null;
  if ($('liveResult')) $('liveResult').textContent = '—';
  if ($('liveSub')) $('liveSub').innerHTML = '';
  if ($('reportArea')) $('reportArea').innerHTML = '';
}

function loadFromURL() {
  const r = parseIntegrityShare(location.search);
  if (!r.ok || !r.state) return;
  if (r.tampered)
    alert(
      'WARNING: share link failed integrity check (missing or mismatched hash). Values loaded but treat as untrusted.'
    );
  const o = r.state;
  FIELDS.forEach((f) => {
    if (o[f] !== undefined && $(f)) $(f).value = o[f];
  });
  if (o.payFrequency && $('payFrequency')) $('payFrequency').value = o.payFrequency;
  if (o.country && $('country')) $('country').value = o.country;
}

function gaugeColor(mult) {
  return mult >= 2 ? '#9B2423' : mult >= 1.5 ? '#D05D29' : '#237F52';
}
function overallStatus(mult) {
  return mult >= 2 ? 'CRITICAL' : mult >= 1.5 ? 'WARNING' : 'PASS';
}

function generateReport(opts = {}) {
  if (!calcData) validateAndCalc();
  const d = calcData;
  if (!d) return;
  const now = new Date();
  const calcId =
    opts.sync && window.calcId
      ? window.calcId
      : 'SC-010-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  window.calcId = calcId;
  const P = readThemePalette();
  const status = overallStatus(d.mult);
  const gCol = gaugeColor(d.mult);
  const gaugeAngle = Math.max(-90, Math.min(90, (d.mult / 3) * 180 - 90));
  const paretoColors = [P.red, P.amber, P.blue, P.blue, P.blue, P.green, P.blue, P.blue];
  const top = d.breakdown[0];

  const whatIfs = [
    { label: 'Hours +10%', field: 'hoursPerWeek', factor: 1.1 },
    { label: 'Net salary +10%', field: 'netSalary', factor: 1.1 },
    { label: 'Benefits +50%', field: 'healthMonthly', factor: 1.5 }
  ].map((w) => {
    const ti = { ...d.input, [w.field]: d.input[w.field] * w.factor };
    let tr;
    try {
      tr = calculate(ti);
    } catch (e) {
      return { label: w.label, delta: 0, newCost: d.trueCost };
    }
    const nc = requirePick(
      tr,
      ['trueMonthlyCost', 'totalMonthlyCost', 'monthlyCost', 'trueCost', 'totalCost'],
      'trueMonthlyCost'
    );
    return { label: w.label, delta: nc - d.trueCost, newCost: nc };
  });

  const recHTML =
    status !== 'PASS'
      ? `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Audit the largest cost driver: ${top ? top.name : 'gross salary'}</span></div><div class="sc-rec-body">It is ${top ? top.pct.toFixed(1) : '—'}% of true cost.<br><span class="neg">-> Reducing it 10% lowers true cost proportionally</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Compare multiplier against industry benchmark</span></div><div class="sc-rec-body">Your multiplier is ${d.mult.toFixed(2)}x. Benchmark range 1.25-1.40x.<br><span class="neg">-> Above 1.5x usually signals heavy statutory burden or rich benefits</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">3</span><span class="sc-rec-title">Use true cost in every quote, never net salary</span></div><div class="sc-rec-body">Quoting on net under-prices labor by ${d.hiddenPct.toFixed(1)}%.<br><span class="pos">-> Feed ${d.trueCost.toFixed(0)}/mo into SC-012 quote pricing</span></div></div>`
      : `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Multiplier is healthy - keep using true cost in quotes</span></div><div class="sc-rec-body">Multiplier ${d.mult.toFixed(2)}x within benchmark 1.25-1.40x.<br><span class="pos">-> Re-run quarterly when statutory rates change</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Document the burden breakdown for finance</span></div><div class="sc-rec-body">Calc ID ${calcId} reproducible from inputs.<br><span class="pos">-> Attach PDF to cost-accounting records</span></div></div>`;

  const reportHTML = `
    <div class="sc-report-hd">
      <div class="sc-report-hd-left">
        <div class="sc-report-title">SC-010 True Labor Cost Analysis</div>
        <div class="sc-report-meta">
          Calculation ID: <span>${calcId}</span> &nbsp;|&nbsp; ${now.toISOString().replace('T', ' ').slice(0, 19)} UTC<br>
          Standard: IFRS labor cost recognition | Local statutory contributions<br>
          Method: Deterministic gross-up + statutory + benefit accumulation<br>
          <span class="ok">Core calculation on-device — formulas/inputs stay in this browser session (page analytics may still load)</span>
        </div>
      </div>
      <div class="sc-report-hd-right">
        <button class="sc-btn sc-btn-ghost" onclick="exportPDF()">Export PDF</button>
        <button class="sc-btn sc-btn-ghost" onclick="exportPDFGraphic()">Export Graphic PDF</button>
        <button class="sc-btn sc-btn-primary" onclick="shareReport()">Share</button>
      </div>
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Risk Assessment</div>
      ${status === 'CRITICAL' ? `<div class="sc-alert sc-alert-crit"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">Critical - Cost multiplier very high</div><div class="sc-alert-body">Multiplier <strong>${d.mult.toFixed(2)}x</strong> (&gt;= 2.0). Hidden burden <strong>${d.hiddenPct.toFixed(1)}%</strong>.<br>Quoting on net salary will <strong>severely under-price</strong> labor. Top driver: <strong>${top ? top.name : '—'}</strong> at ${top ? top.pct.toFixed(1) : '—'}%.</div></div></div>` : ''}
      ${status === 'WARNING' ? `<div class="sc-alert sc-alert-warn"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">Warning - Multiplier above benchmark</div><div class="sc-alert-body">Multiplier <strong>${d.mult.toFixed(2)}x</strong> (benchmark 1.25-1.40x). Hidden burden <strong>${d.hiddenPct.toFixed(1)}%</strong>.<br>Verify statutory rates and benefit levels; ensure quotes use true cost.</div></div></div>` : ''}
      ${status === 'PASS' ? `<div class="sc-alert sc-alert-pass"><div class="sc-alert-icon">OK</div><div><div class="sc-alert-title">Pass - Multiplier within benchmark</div><div class="sc-alert-body">Multiplier <strong>${d.mult.toFixed(2)}x</strong> within 1.25-1.40x. True monthly cost <strong>${d.trueCost.toFixed(0)}</strong>.<br>Burden structure is typical; keep using true cost in pricing.</div></div></div>` : ''}
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Cost Summary</div><div class="sc-cards">
      <div class="sc-card-res ${status === 'PASS' ? 'pass' : status === 'WARNING' ? 'warn' : 'crit'}"><div class="sc-card-res-label">True Cost / mo</div><div class="sc-card-res-val">${d.trueCost.toFixed(0)}</div><div class="sc-card-res-sub">all-in monthly</div><span class="sc-card-res-badge ${status === 'PASS' ? 'sc-badge-pass' : status === 'WARNING' ? 'sc-badge-warn' : 'sc-badge-crit'}">${status}</span></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Multiplier</div><div class="sc-card-res-val">${d.mult.toFixed(2)}x</div><div class="sc-card-res-sub">true / net</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Hidden Burden</div><div class="sc-card-res-val">${d.hiddenPct.toFixed(1)}%</div><div class="sc-card-res-sub">above net</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Gross / mo</div><div class="sc-card-res-val">${d.gross.toFixed(0)}</div><div class="sc-card-res-sub">grossed-up</div></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Input Registry</div><div class="sc-card"><div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>Parameter</th><th>Value</th><th>Unit</th></tr></thead><tbody>
      <tr><td class="td-name">Country profile</td><td class="td-val">${d.input.country}</td><td>-</td></tr>
      <tr><td class="td-name">Net salary</td><td class="td-val">${d.input.netSalary}</td><td>currency</td></tr>
      <tr><td class="td-name">Pay frequency</td><td class="td-val">${d.input.payFrequency}</td><td>-</td></tr>
      <tr><td class="td-name">Hours / week</td><td class="td-val">${d.input.hoursPerWeek}</td><td>h/wk</td></tr>
      <tr><td class="td-name">Employer SS rate</td><td class="td-val">${d.input.employerSSRate}</td><td>ratio</td></tr>
      <tr><td class="td-name">Employer unemp. rate</td><td class="td-val">${d.input.employerUnempRate}</td><td>ratio</td></tr>
      <tr><td class="td-name">Employee tax rate</td><td class="td-val">${d.input.employeeRate}</td><td>ratio</td></tr>
      <tr><td class="td-name">Health / month</td><td class="td-val">${d.input.healthMonthly}</td><td>currency</td></tr>
      <tr><td class="td-name">Meal / month</td><td class="td-val">${d.input.mealMonthly}</td><td>currency</td></tr>
      <tr><td class="td-name">Transport / month</td><td class="td-val">${d.input.transportMonthly}</td><td>currency</td></tr>
      <tr><td class="td-name">Annual bonus</td><td class="td-val">${d.input.annualBonus}</td><td>currency</td></tr>
      <tr><td class="td-name">Severance rate</td><td class="td-val">${d.input.severanceRate}</td><td>ratio</td></tr>
    </tbody></table></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Cost Multiplier Gauge</div><div class="sc-chart"><div style="display:flex;justify-content:center"><svg width="300" height="170" viewBox="0 0 300 170">
      <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="${P.track}" stroke-width="24" stroke-linecap="round"/>
      <path d="M 40 150 A 110 110 0 0 1 110 50" fill="none" stroke="rgba(35,127,82,0.25)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 110 50 A 110 110 0 0 1 190 50" fill="none" stroke="rgba(208,93,41,0.25)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 190 50 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(155,36,35,0.25)" stroke-width="24" stroke-linecap="round"/>
      <line x1="150" y1="150" x2="${150 + 95 * Math.cos((gaugeAngle * Math.PI) / 180)}" y2="${150 + 95 * Math.sin((gaugeAngle * Math.PI) / 180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="150" cy="150" r="7" fill="${gCol}"/>
      <text x="150" y="135" text-anchor="middle" fill="${P.ink}" font-size="24" font-weight="700" font-family="IBM Plex Mono">${d.mult.toFixed(2)}x</text>
      <text x="150" y="155" text-anchor="middle" fill="${P.muted}" font-size="10">true / net</text>
      <text x="30" y="168" fill="${P.muted}" font-size="9">1.0</text><text x="262" y="168" fill="${P.muted}" font-size="9">3.0</text>
    </svg></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Cost Breakdown (Pareto)</div><div class="sc-card">
      ${d.breakdown.map((c, i) => `<div class="sc-pareto-row"><div class="sc-pareto-name">${c.name}</div><div class="sc-pareto-track"><div class="sc-pareto-fill" style="width:${c.pct}%;background:${paretoColors[i % paretoColors.length]}"><span>${c.amount.toFixed(0)}</span></div></div><div class="sc-pareto-pct">${c.pct.toFixed(1)}%</div></div>`).join('')}
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">What-If Sensitivity</div><div class="sc-card">
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;font-family:var(--font-mono)">Scenario impact on true monthly cost.</div>
      <div class="sc-whatif">${whatIfs.map((w) => `<div class="sc-whatif-card"><div class="sc-whatif-lbl">${w.label}</div><div class="sc-whatif-val">${w.newCost.toFixed(0)}</div><div class="sc-whatif-chg ${w.delta > 0 ? 'pos' : w.delta < 0 ? 'neg' : 'neu'}">${w.delta >= 0 ? '+' : ''}${w.delta.toFixed(0)} /mo</div></div>`).join('')}</div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommended Actions</div><div class="sc-card">${recHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards & References</div><div class="sc-card"><div class="sc-std">
      <span>IFRS / IAS 19</span> - Employee benefits recognition<br>
      <span>Local labor law</span> - Statutory employer social-security and unemployment contributions<br>
      <span>Gross-up formula</span> - gross = net / (1 - employeeRate)<br>
      <span>True cost</span> - gross + employer statutory + benefits + prorated bonus + severance accrual<br>
      <span>Deterministic</span> - same inputs always yield the same result, client-side
    </div></div></div>
    <div class="sc-footer">Generated by SectorCalc.com - Client-Side Only - Core calc on-device; page analytics may still load<br>Engineering preview · Client-side · Deterministic · Not for production approval</div>`;
  $('reportArea').innerHTML = reportHTML;
}

function exportPDF() {
  const d = calcData;
  if (!d) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const calcId = window.calcId || 'SC-010';
  const status = overallStatus(d.mult);
  let y = 48;
  const line = (txt, size, color, bold) => {
    doc.setFontSize(size || 10);
    doc.setTextColor(color || '#222222');
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const ls = doc.splitTextToSize(txt, 500);
    doc.text(ls, 48, y);
    y += ls.length * ((size || 10) + 4) + 2;
    if (y > 780) {
      doc.addPage();
      y = 48;
    }
  };
  line('SC-010 True Labor Cost Analysis', 16, '#111111', true);
  line(
    'Calc ID: ' + calcId + '   |   ' + new Date().toISOString().slice(0, 19) + ' UTC',
    9,
    '#666666'
  );
  line('Standard: IFRS labor cost recognition | Local statutory contributions', 9, '#666666');
  line('Client-Side Only - core calc on-device (page analytics may still load)', 9, '#1a7f37');
  y += 6;
  line(
    'VERDICT: ' +
      status +
      '    True cost ' +
      d.trueCost.toFixed(0) +
      '/mo    Multiplier ' +
      d.mult.toFixed(2) +
      'x    Hidden ' +
      d.hiddenPct.toFixed(1) +
      '%',
    12,
    status === 'PASS' ? '#1a7f37' : status === 'WARNING' ? '#b8860b' : '#c0392b',
    true
  );
  y += 8;
  line('COST BREAKDOWN', 11, '#111111', true);
  d.breakdown.forEach((c) =>
    line(c.name + ': ' + c.amount.toFixed(0) + '  (' + c.pct.toFixed(1) + '%)', 9)
  );
  y += 8;
  line('INPUTS', 11, '#111111', true);
  line(
    'Net ' +
      d.input.netSalary +
      ' | freq ' +
      d.input.payFrequency +
      ' | hours ' +
      d.input.hoursPerWeek +
      ' | SS ' +
      d.input.employerSSRate +
      ' | unemp ' +
      d.input.employerUnempRate +
      ' | empTax ' +
      d.input.employeeRate,
    9
  );
  line(
    'Health ' +
      d.input.healthMonthly +
      ' | meal ' +
      d.input.mealMonthly +
      ' | transport ' +
      d.input.transportMonthly +
      ' | bonus ' +
      d.input.annualBonus +
      ' | severance ' +
      d.input.severanceRate,
    9
  );
  y += 8;
  line(
    'Generated by SectorCalc.com - Engineering preview - Deterministic - Not for production approval',
    8,
    '#999999'
  );
  doc.save('SC-010-' + calcId + '.pdf');
}

async function exportPDFGraphic() {
  const el = $('reportArea');
  if (!el || !calcData) {
    alert('Generate the report first.');
    return;
  }
  const btn = event && event.target;
  if (btn) {
    btn.textContent = 'Rendering...';
    btn.disabled = true;
  }
  try {
    const canvas = await html2canvas(el, {
      scale: 1.5,
      backgroundColor: exportSurfaceBg(),
      useCORS: true,
      logging: false
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth(),
      pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.82);
    let heightLeft = imgH,
      position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pageW, imgH);
      heightLeft -= pageH;
    }
    const pages = pdf.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7);
      pdf.setTextColor(120);
      pdf.text(
        'SectorCalc.com | Calc ID ' +
          (window.calcId || 'SC-010') +
          ' | Deterministic | Client-Side | Page ' +
          i +
          '/' +
          pages,
        48,
        pageH - 16
      );
    }
    pdf.save('SC-010-' + (window.calcId || 'report') + '-graphic.pdf');
  } catch (err) {
    alert('Graphic PDF failed: ' + err.message + '. Use Export PDF instead.');
  } finally {
    if (btn) {
      btn.textContent = 'Export Graphic PDF';
      btn.disabled = false;
    }
  }
}

function shareReport() {
  const d = calcData;
  if (!d) return;
  const state = Object.assign(
    { payFrequency: d.input.payFrequency, country: d.input.country },
    Object.fromEntries(FIELDS.map((f) => [f, d.input[f]]))
  );
  navigator.clipboard
    .writeText(makeIntegrityShareURL(location.origin, '/calculator/true-labor-cost', state))
    .then(() => alert('Shareable URL copied (integrity hash attached)'));
}

try {
  loadFromURL();
  validateAndCalc();
} catch (e) {
  console.error(e);
}

window.generateReport = generateReport;
onThemeChange(syncReportIfOpen);
window.exportPDF = exportPDF;
window.exportPDFGraphic = exportPDFGraphic;
window.shareReport = shareReport;
window.loadPreset = loadPreset;
window.resetAll = resetAll;
window.validateAndCalc = validateAndCalc;
window.applyCountryDefaults = applyCountryDefaults;
document.getElementById('country')?.addEventListener('change', (e) => {
  applyCountryDefaults(e.target.value);
  validateAndCalc();
});
if (window.SCStudy) {
  window.SCStudy.register('SC-010', {
    loadSample() {
      loadPreset('small');
    },
    startBlank() {
      startBlankStudy();
    }
  });
  window.SCStudy.resnapshot();
}
