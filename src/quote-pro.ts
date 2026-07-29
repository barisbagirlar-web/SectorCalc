// @ts-nocheck
import { calculate } from './tools/SC-012-quote-pricing/v1.0.0/formula.js';
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
  'materialCost',
  'scrapRate',
  'laborHours',
  'laborHourlyCost',
  'machineHours',
  'machineHourlyCost',
  'setupMinutes',
  'setupHourlyCost',
  'overheadRate',
  'financingRate',
  'targetMargin',
  'quantity'
];
const presets = {
  job: {
    materialCost: 1000,
    scrapRate: 0.1,
    laborHours: 5,
    laborHourlyCost: 40,
    machineHours: 3,
    machineHourlyCost: 60,
    setupMinutes: 60,
    setupHourlyCost: 150,
    overheadRate: 0.25,
    financingRate: 0.02,
    targetMargin: 0.2,
    quantity: 10
  },
  run: {
    materialCost: 5000,
    scrapRate: 0.05,
    laborHours: 20,
    laborHourlyCost: 38,
    machineHours: 40,
    machineHourlyCost: 55,
    setupMinutes: 60,
    setupHourlyCost: 800,
    overheadRate: 0.2,
    financingRate: 0.015,
    targetMargin: 0.15,
    quantity: 100
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
  const input = {};
  FIELDS.forEach((f) => {
    input[f] = parseInputNumber($(f)?.value);
    if (!Number.isFinite(input[f])) input[f] = 0;
  });
  if (input.quantity < 1) input.quantity = 1;
  return input;
}

function toFormulaInput(i) {
  return {
    materialCost: i.materialCost,
    scrapRate: i.scrapRate,
    laborHours: i.laborHours,
    laborHourlyCost: i.laborHourlyCost,
    machineHours: i.machineHours,
    machineHourlyCost: i.machineHourlyCost,
    setupMinutes: i.setupMinutes,
    setupHourlyCost: i.setupHourlyCost,
    overheadRate: i.overheadRate,
    paymentDays: 30,
    monthlyInterestRate: i.financingRate,
    targetMargin: i.targetMargin,
    quantity: i.quantity
  };
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
  const checks = [
    ['materialCost', (v) => v < 0],
    ['scrapRate', (v) => v < 0 || v >= 1],
    ['laborHours', (v) => v < 0],
    ['laborHourlyCost', (v) => v < 0],
    ['machineHours', (v) => v < 0],
    ['machineHourlyCost', (v) => v < 0],
    ['setupMinutes', (v) => v < 0],
    ['setupHourlyCost', (v) => v < 0],
    ['overheadRate', (v) => v < 0 || v > 5],
    ['financingRate', (v) => v < 0 || v > 1],
    ['targetMargin', (v) => v < 0 || v >= 1],
    ['quantity', (v) => v < 1]
  ];
  checks.forEach(([f, bad]) => {
    const v = parseFloat($(f).value);
    if (isNaN(v) || bad(v)) {
      setFieldState(f, false, 'X out of range');
      hasError = true;
    } else {
      setFieldState(f, true, 'OK');
    }
  });
  if (hasError) {
    $('liveResult').textContent = '—';
    $('liveSub').innerHTML = '';
    return;
  }

  const input = readInputs();
  let r;
  let sell, unit, total, profit, marginPct, financing, engineRows;
  try {
    r = calculate(toFormulaInput(input));
    sell = requirePick(
      r,
      ['sellPrice', 'price', 'sellingPrice', 'totalSellPrice', 'sell'],
      'sellPrice'
    );
    unit = requirePick(r, ['unitPrice', 'pricePerUnit', 'sellPerUnit'], 'unitPrice');
    total = requirePick(r, ['totalCost', 'cost', 'totalJobCost', 'jobCost'], 'totalCost');
    profit = requirePick(r, ['profit', 'margin', 'totalProfit', 'grossProfit'], 'profit');
    marginPct = sell > 0 ? (profit / sell) * 100 : 0;
    financing = requirePick(r, ['financeCharge'], 'financeCharge');
    engineRows = Array.isArray(r.breakdown)
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

  calcData = { input, r, sell, unit, total, profit, marginPct, financing, engineRows };
  $('liveResult').textContent =
    (unit > 0 ? unit.toFixed(2) : sell.toFixed(0)) + (unit > 0 ? ' /pc' : '');
  $('liveSub').innerHTML =
    '<span>Sell ' +
    sell.toFixed(0) +
    '</span><span>Cost ' +
    total.toFixed(0) +
    '</span><span>Margin ' +
    marginPct.toFixed(1) +
    '%</span>';
  syncReportIfOpen();
}

function loadPreset(key) {
  const p = presets[key];
  FIELDS.forEach((f) => ($(f).value = p[f]));
  document
    .querySelectorAll('.sc-preset')
    .forEach((b) => b.classList.toggle('active', b.dataset.preset === key));
  validateAndCalc();
}
function resetAll() {
  loadPreset('job');
}
function startBlankStudy() {
  FIELDS.forEach((f) => {
    if ($(f)) $(f).value = '';
  });
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
  // Legacy alias: setupCost → setupHourlyCost with 60 minutes
  if (o.setupCost !== undefined && o.setupHourlyCost === undefined && $('setupHourlyCost')) {
    $('setupHourlyCost').value = o.setupCost;
    if ($('setupMinutes') && !o.setupMinutes) $('setupMinutes').value = 60;
  }
}

function gaugeColor(ratio) {
  return ratio < 1.0 ? '#9B2423' : ratio < 1.1 ? '#D05D29' : '#237F52';
}
function overallStatus(ratio) {
  return ratio < 1.0 ? 'CRITICAL' : ratio < 1.1 ? 'WARNING' : 'PASS';
}

function generateReport(opts = {}) {
  if (!calcData) validateAndCalc();
  const d = calcData;
  if (!d) return;
  const calcId =
    opts.sync && window.calcId
      ? window.calcId
      : 'SC-012-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  window.calcId = calcId;
  const P = readThemePalette();
  const ratio = d.total > 0 ? d.sell / d.total : 0;
  const status = overallStatus(ratio);
  const gCol = gaugeColor(ratio);
  const gaugeAngle = Math.max(-90, Math.min(90, (ratio / 2) * 180 - 90));
  const paretoColors = [P.red, P.amber, P.blue, P.blue, P.blue, P.green];
  const top = d.engineRows[0];

  const whatIfs = [
    { label: 'Quantity x2', fn: (i) => ({ ...i, quantity: i.quantity * 2 }) },
    {
      label: 'Margin +5pp',
      fn: (i) => ({ ...i, targetMargin: Math.min(0.9, i.targetMargin + 0.05) })
    },
    { label: 'Material +20%', fn: (i) => ({ ...i, materialCost: i.materialCost * 1.2 }) }
  ].map((w) => {
    let tr;
    try {
      tr = calculate(toFormulaInput(w.fn(d.input)));
    } catch (e) {
      return { label: w.label, newUnit: d.unit, delta: 0 };
    }
    const ns = requirePick(
      tr,
      ['sellPrice', 'price', 'sellingPrice', 'totalSellPrice', 'sell'],
      'sellPrice'
    );
    const nu = requirePick(tr, ['unitPrice', 'pricePerUnit', 'sellPerUnit'], 'unitPrice');
    const useUnit = d.unit > 0;
    const newV = useUnit ? nu : ns;
    const oldV = useUnit ? d.unit : d.sell;
    return { label: w.label, newUnit: newV, delta: newV - oldV };
  });

  const recHTML =
    status !== 'PASS'
      ? `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Margin is thin - attack the top cost driver</span></div><div class="sc-rec-body">${top ? top.name : '—'} is ${top ? top.pct.toFixed(1) : '—'}% of conversion cost.<br><span class="neg">-> A 10% cut there lifts margin directly</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Spread setup over a larger batch</span></div><div class="sc-rec-body">Setup ${d.input.setupMinutes} min @ ${d.input.setupHourlyCost}/h over ${d.input.quantity} pcs.<br><span class="pos">-> Doubling quantity cuts unit setup in half</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">3</span><span class="sc-rec-title">Use SC-010 true labor rate, never net wage</span></div><div class="sc-rec-body">Under-loaded labor silently erodes margin.<br><span class="pos">-> Re-feed laborHourlyCost from SC-010 true cost</span></div></div>`
      : `
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Margin is healthy - lock the quote and track actuals</span></div><div class="sc-rec-body">Sell/cost ratio ${ratio.toFixed(2)} above 1.10 target.<br><span class="pos">-> Compare quoted vs actual cost at job close</span></div></div>
    <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Document the build-up for the customer</span></div><div class="sc-rec-body">Calc ID ${calcId} reproducible from inputs.<br><span class="pos">-> Attach PDF as a transparent quote annex</span></div></div>`;

  const reportHTML = `
    <div class="sc-report-hd"><div class="sc-report-hd-left"><div class="sc-report-title">SC-012 Quote Pricing Analysis</div><div class="sc-report-meta">Calculation ID: <span>${calcId}</span> &nbsp;|&nbsp; ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC<br>Standard: GAAP revenue recognition | Full absorption costing<br>Method: Deterministic cost build-up + margin gross-up<br><span class="ok">Core calculation on-device — formulas/inputs stay in this browser session (page analytics may still load)</span></div></div>
      <div class="sc-report-hd-right"><button class="sc-btn sc-btn-ghost" onclick="exportPDF()">Export PDF</button><button class="sc-btn sc-btn-ghost" onclick="exportPDFGraphic()">Export Graphic PDF</button><button class="sc-btn sc-btn-primary" onclick="shareReport()">Share</button></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Risk Assessment</div>
      ${status === 'CRITICAL' ? `<div class="sc-alert sc-alert-crit"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">Critical - Sell price below cost</div><div class="sc-alert-body">Sell/cost ratio <strong>${ratio.toFixed(2)}</strong> (&lt; 1.0). This quote <strong>loses money</strong>.<br>Margin ${d.marginPct.toFixed(1)}%. Raise price or cut the top driver <strong>${top ? top.name : '—'}</strong>.</div></div></div>` : ''}
      ${status === 'WARNING' ? `<div class="sc-alert sc-alert-warn"><div class="sc-alert-icon">!</div><div><div class="sc-alert-title">Warning - Margin below safe floor</div><div class="sc-alert-body">Sell/cost ratio <strong>${ratio.toFixed(2)}</strong> (target &gt;= 1.10). Margin ${d.marginPct.toFixed(1)}%.<br>Little room for cost overrun; verify scrap and setup assumptions.</div></div></div>` : ''}
      ${status === 'PASS' ? `<div class="sc-alert sc-alert-pass"><div class="sc-alert-icon">OK</div><div><div class="sc-alert-title">Pass - Quote margin is safe</div><div class="sc-alert-body">Sell/cost ratio <strong>${ratio.toFixed(2)}</strong> above 1.10. Margin ${d.marginPct.toFixed(1)}%.<br>Unit price <strong>${d.unit > 0 ? d.unit.toFixed(2) : (d.sell / d.input.quantity).toFixed(2)}</strong>. Quote is defensible.</div></div></div>` : ''}
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Pricing Summary</div><div class="sc-cards">
      <div class="sc-card-res ${status === 'PASS' ? 'pass' : status === 'WARNING' ? 'warn' : 'crit'}"><div class="sc-card-res-label">Sell Price</div><div class="sc-card-res-val">${d.sell.toFixed(0)}</div><div class="sc-card-res-sub">total job</div><span class="sc-card-res-badge ${status === 'PASS' ? 'sc-badge-pass' : status === 'WARNING' ? 'sc-badge-warn' : 'sc-badge-crit'}">${status}</span></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Unit Price</div><div class="sc-card-res-val">${(d.unit > 0 ? d.unit : d.sell / d.input.quantity).toFixed(2)}</div><div class="sc-card-res-sub">per pc</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Total Cost</div><div class="sc-card-res-val">${d.total.toFixed(0)}</div><div class="sc-card-res-sub">full absorption</div></div>
      <div class="sc-card-res"><div class="sc-card-res-label">Margin</div><div class="sc-card-res-val">${d.marginPct.toFixed(1)}%</div><div class="sc-card-res-sub">on sell</div></div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Input Registry</div><div class="sc-card"><div class="sc-table-wrap"><table class="sc-table"><thead><tr><th>Parameter</th><th>Value</th><th>Unit</th></tr></thead><tbody>
      <tr><td class="td-name">Material cost</td><td class="td-val">${d.input.materialCost}</td><td>currency</td></tr>
      <tr><td class="td-name">Scrap rate</td><td class="td-val">${d.input.scrapRate}</td><td>ratio</td></tr>
      <tr><td class="td-name">Labor hours</td><td class="td-val">${d.input.laborHours}</td><td>h</td></tr>
      <tr><td class="td-name">Labor hourly cost</td><td class="td-val">${d.input.laborHourlyCost}</td><td>currency/h</td></tr>
      <tr><td class="td-name">Machine hours</td><td class="td-val">${d.input.machineHours}</td><td>h</td></tr>
      <tr><td class="td-name">Machine hourly cost</td><td class="td-val">${d.input.machineHourlyCost}</td><td>currency/h</td></tr>
      <tr><td class="td-name">Setup minutes</td><td class="td-val">${d.input.setupMinutes}</td><td>min</td></tr>
      <tr><td class="td-name">Setup hourly cost</td><td class="td-val">${d.input.setupHourlyCost}</td><td>currency/h</td></tr>
      <tr><td class="td-name">Overhead rate</td><td class="td-val">${d.input.overheadRate}</td><td>ratio</td></tr>
      <tr><td class="td-name">Financing rate</td><td class="td-val">${d.input.financingRate}</td><td>ratio</td></tr>
      <tr><td class="td-name">Target margin</td><td class="td-val">${d.input.targetMargin}</td><td>ratio</td></tr>
      <tr><td class="td-name">Quantity</td><td class="td-val">${d.input.quantity}</td><td>pcs</td></tr>
    </tbody></table></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Sell / Cost Ratio Gauge</div><div class="sc-card"><div style="display:flex;justify-content:center"><svg width="300" height="170" viewBox="0 0 300 170">
      <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="${P.track}" stroke-width="24" stroke-linecap="round"/>
      <path d="M 40 150 A 110 110 0 0 1 110 50" fill="none" stroke="rgba(155,36,35,0.25)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 110 50 A 110 110 0 0 1 190 50" fill="none" stroke="rgba(208,93,41,0.25)" stroke-width="24" stroke-linecap="round"/>
      <path d="M 190 50 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(35,127,82,0.25)" stroke-width="24" stroke-linecap="round"/>
      <line x1="150" y1="150" x2="${150 + 95 * Math.cos((gaugeAngle * Math.PI) / 180)}" y2="${150 + 95 * Math.sin((gaugeAngle * Math.PI) / 180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="150" cy="150" r="7" fill="${gCol}"/>
      <text x="150" y="135" text-anchor="middle" fill="${P.ink}" font-size="24" font-weight="700" font-family="IBM Plex Mono">${ratio.toFixed(2)}</text>
      <text x="150" y="155" text-anchor="middle" fill="${P.muted}" font-size="10">sell / cost</text>
      <text x="30" y="168" fill="${P.muted}" font-size="9">0</text><text x="262" y="168" fill="${P.muted}" font-size="9">2.0</text>
    </svg></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Cost Build-Up (Pareto)</div><div class="sc-card">
      ${d.engineRows.map((c, i) => `<div class="sc-pareto-row"><div class="sc-pareto-name">${c.name}</div><div class="sc-pareto-track"><div class="sc-pareto-fill" style="width:${Math.min(100, c.pct)}%;background:${paretoColors[i % paretoColors.length]}"><span>${c.amount.toFixed(0)}</span></div></div><div class="sc-pareto-pct">${c.pct.toFixed(1)}%</div></div>`).join('')}
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">What-If Sensitivity</div><div class="sc-card"><div style="font-size:11px;color:var(--text-muted);margin-bottom:14px;font-family:var(--font-mono)">Scenario impact on ${d.unit > 0 ? 'unit' : 'sell'} price.</div>
      <div class="sc-whatif">${whatIfs.map((w) => `<div class="sc-whatif-card"><div class="sc-whatif-lbl">${w.label}</div><div class="sc-whatif-val">${w.newUnit.toFixed(2)}</div><div class="sc-whatif-chg ${w.delta > 0 ? 'pos' : w.delta < 0 ? 'neg' : 'neu'}">${w.delta >= 0 ? '+' : ''}${w.delta.toFixed(2)}</div></div>`).join('')}</div>
    </div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommended Actions</div><div class="sc-card">${recHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards & References</div><div class="sc-card"><div class="sc-std">
      <span>GAAP / IFRS 15</span> - Revenue recognition on the quoted price<br>
      <span>Full absorption costing</span> - material + labor + machine + overhead + financing<br>
      <span>Margin gross-up</span> - sell = total / (1 - targetMargin)<br>
      <span>Unit price</span> - sell / quantity; setup amortized across the batch<br>
      <span>Deterministic</span> - same inputs always yield the same quote, client-side
    </div></div></div>
    <div class="sc-footer">Generated by SectorCalc.com - Client-Side Only - Core calc on-device; page analytics may still load<br>Engineering preview · Client-side · Deterministic · Not for production approval</div>`;
  $('reportArea').innerHTML = reportHTML;
}

function exportPDF() {
  const d = calcData;
  if (!d) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const calcId = window.calcId || 'SC-012';
  const ratio = d.total > 0 ? d.sell / d.total : 0;
  const status = overallStatus(ratio);
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
  line('SC-012 Quote Pricing Analysis', 16, '#111111', true);
  line(
    'Calc ID: ' + calcId + '   |   ' + new Date().toISOString().slice(0, 19) + ' UTC',
    9,
    '#666666'
  );
  line('Standard: GAAP revenue recognition | Full absorption costing', 9, '#666666');
  line('Client-Side Only - core calc on-device (page analytics may still load)', 9, '#1a7f37');
  y += 6;
  line(
    'VERDICT: ' +
      status +
      '    Sell ' +
      d.sell.toFixed(0) +
      '    Unit ' +
      (d.unit > 0 ? d.unit.toFixed(2) : (d.sell / d.input.quantity).toFixed(2)) +
      '    Cost ' +
      d.total.toFixed(0) +
      '    Margin ' +
      d.marginPct.toFixed(1) +
      '%',
    12,
    status === 'PASS' ? '#1a7f37' : status === 'WARNING' ? '#b8860b' : '#c0392b',
    true
  );
  y += 8;
  line('COST BUILD-UP', 11, '#111111', true);
  d.engineRows.forEach((c) =>
    line(c.name + ': ' + c.amount.toFixed(0) + '  (' + c.pct.toFixed(1) + '%)', 9)
  );
  y += 8;
  line(
    'Generated by SectorCalc.com - Engineering preview - Deterministic - Not for production approval',
    8,
    '#999999'
  );
  doc.save('SC-012-' + calcId + '.pdf');
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
          (window.calcId || 'SC-012') +
          ' | Deterministic | Client-Side | Page ' +
          i +
          '/' +
          pages,
        48,
        pageH - 16
      );
    }
    pdf.save('SC-012-' + (window.calcId || 'report') + '-graphic.pdf');
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
  const state = Object.fromEntries(FIELDS.map((f) => [f, d.input[f]]));
  navigator.clipboard
    .writeText(makeIntegrityShareURL(location.origin, '/calculator/quote-pricing', state))
    .then(() => alert('Shareable URL copied (integrity hash attached)'));
}

window.generateReport = generateReport;
onThemeChange(syncReportIfOpen);
window.exportPDF = exportPDF;
window.exportPDFGraphic = exportPDFGraphic;
window.shareReport = shareReport;
window.loadPreset = loadPreset;
if (window.SCStudy) {
  window.SCStudy.register('SC-012', {
    loadSample() {
      loadPreset('job');
    },
    startBlank() {
      startBlankStudy();
    }
  });
  window.SCStudy.resnapshot();
}
window.resetAll = resetAll;
window.validateAndCalc = validateAndCalc;

loadFromURL();
validateAndCalc();
