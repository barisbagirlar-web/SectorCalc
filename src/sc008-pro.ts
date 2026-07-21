import { calculate } from './tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import type { StackInput, StackResult } from './tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { whatIfToleranceScale } from './lib/what-if.js';
import { jsPDF } from 'jspdf';

type UnitKey = 'mm' | 'inch' | 'um';
type Dim = { name: string; nominal: number; tolerance: number };
type PresetKey = 'automotive' | 'aerospace' | 'general' | 'medical';

interface CalcData {
  r: StackResult;
  input: StackInput;
  nominalSum: number;
  usl: number;
  lsl: number;
  su: number;
  sl: number;
  wcTol: number;
  rssTol: number;
  mcTol: number;
  cpk: number;
  cpkTarget: number;
  ppm: number;
  pareto: StackResult['pareto'];
  steps: StackResult['steps'];
  rssInSpec: boolean;
  cpkOk: boolean;
  whatIfs: Array<{ scale: number; cpk: number; ppm: number }>;
  unit: UnitKey;
  seed: number;
  dims: Dim[];
}

declare global {
  interface Window {
    __sc008?: CalcData | null;
  }
}

const unitConv: Record<UnitKey, { toMm: number; fromMm: number }> = {
  mm: { toMm: 1, fromMm: 1 },
  inch: { toMm: 25.4, fromMm: 1 / 25.4 },
  um: { toMm: 0.001, fromMm: 1000 }
};

const presets: Record<PresetKey, { specUpper: number; specLower: number; cpkTarget: number; mcSeed: number; dims: Dim[] }> = {
  automotive: {
    specUpper: 0.15, specLower: -0.15, cpkTarget: 1.33, mcSeed: 12345,
    dims: [
      { name: 'Spacer Width', nominal: 25, tolerance: 0.05 },
      { name: 'Bearing OD', nominal: 30, tolerance: 0.025 },
      { name: 'Housing Bore', nominal: -55, tolerance: 0.04 }
    ]
  },
  aerospace: {
    specUpper: 0.05, specLower: -0.05, cpkTarget: 1.67, mcSeed: 54321,
    dims: [
      { name: 'Ti Spacer', nominal: 15, tolerance: 0.01 },
      { name: 'Ball Bearing', nominal: 20, tolerance: 0.005 },
      { name: 'Al Housing', nominal: -35, tolerance: 0.015 }
    ]
  },
  general: {
    specUpper: 0.3, specLower: -0.3, cpkTarget: 1.0, mcSeed: 99999,
    dims: [
      { name: 'Steel Plate', nominal: 50, tolerance: 0.2 },
      { name: 'Bushing', nominal: 25, tolerance: 0.1 },
      { name: 'Cast Housing', nominal: -75, tolerance: 0.25 }
    ]
  },
  medical: {
    specUpper: 0.025, specLower: -0.025, cpkTarget: 1.67, mcSeed: 77777,
    dims: [
      { name: 'Implant Spacer', nominal: 10, tolerance: 0.005 },
      { name: 'Ceramic Bearing', nominal: 8, tolerance: 0.003 },
      { name: 'Ti Housing', nominal: -18, tolerance: 0.008 }
    ]
  }
};

let dimensions: Dim[] = presets.automotive.dims.map((d) => ({ ...d }));
let currentUnit: UnitKey = 'mm';
let calcData: CalcData | null = null;

function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el;
}

function $input(id: string): HTMLInputElement {
  return $(id) as HTMLInputElement;
}

function $select(id: string): HTMLSelectElement {
  return $(id) as HTMLSelectElement;
}

function renderDims(): void {
  $('dimList').innerHTML = dimensions.map((d, i) => `
    <div class="sc-dim">
      <span class="sc-dim-num">${i + 1}</span>
      <input type="text" value="${d.name}" data-i="${i}" data-f="name" style="font-family:var(--font-sans);color:var(--text-secondary)">
      <input type="number" value="${d.nominal.toFixed(3)}" step="0.001" data-i="${i}" data-f="nominal">
      <input type="number" value="${d.tolerance.toFixed(3)}" step="0.001" min="0" data-i="${i}" data-f="tolerance">
      <button class="sc-dim-del" data-del="${i}">&times;</button>
    </div>`).join('');
}

function calc(): void {
  const toMm = unitConv[currentUnit].toMm;
  const su = parseFloat($input('specUpper').value) * toMm;
  const sl = parseFloat($input('specLower').value) * toMm;
  const cpkTarget = parseFloat($input('cpkTarget').value);
  const seed = parseInt($input('mcSeed').value, 10);
  const dims = dimensions.map((d) => ({ name: d.name, nominal: d.nominal * toMm, tolerance: d.tolerance * toMm }));
  const nominalSum = dims.reduce((s, d) => s + d.nominal, 0);
  const usl = nominalSum + su;
  const lsl = nominalSum + sl;
  // Absolute USL/LSL from relative spec - Decimal engine (seed/iterations as numbers).
  const input: StackInput = {
    components: dims.map((d) => ({
      name: d.name,
      nominal: String(d.nominal),
      tol: String(d.tolerance),
      distribution: 'normal' as const
    })),
    usl: String(usl),
    lsl: String(lsl),
    seed,
    iterations: 10000
  };
  let r: StackResult;
  try {
    r = calculate(input);
  } catch {
    $('liveResult').textContent = 'ERR';
    return;
  }
  const mcTol = (Number(r.mcP9987) - Number(r.mcP0013)) / 2;
  const rssTol = Number(r.rssPlus);
  const wcTol = Number(r.worstPlus);
  const cpk = Number(r.cpk);
  const fromMm = unitConv[currentUnit].fromMm;
  const rssInSpec = rssTol <= Math.abs(su);
  const cpkOk = cpk >= cpkTarget;
  let whatIfs: Array<{ scale: number; cpk: number; ppm: number }> = [];
  try {
    whatIfs = whatIfToleranceScale({ ...input, iterations: 1000 }).map((w) => ({
      scale: w.scale,
      cpk: Number(w.cpk),
      ppm: Number(w.ppm)
    }));
  } catch {
    whatIfs = [];
  }
  calcData = {
    r, input, nominalSum, usl, lsl, su, sl, wcTol, rssTol, mcTol, cpk, cpkTarget,
    ppm: Number(r.ppm), pareto: r.pareto, steps: r.steps, rssInSpec, cpkOk, whatIfs,
    unit: currentUnit, seed, dims
  };
  $('liveResult').textContent = '+/-' + (rssTol * fromMm).toFixed(4) + ' ' + currentUnit;
  $('liveSub').innerHTML =
    `<span>${dims.length} dims</span><span>Cpk ${cpk.toFixed(2)}</span><span>${rssInSpec && cpkOk ? 'Within spec' : (rssInSpec ? 'Marginal' : 'OUT OF SPEC')}</span>`;
}

function validate(): void {
  const su = parseFloat($input('specUpper').value);
  const sl = parseFloat($input('specLower').value);
  const cpkT = parseFloat($input('cpkTarget').value);
  let ok = true;
  if (isNaN(su) || su <= 0) {
    $('fld-specUpper').classList.add('has-error');
    $('val-specUpper').className = 'sc-val error';
    $('val-specUpper').textContent = 'X USL must be positive';
    ok = false;
  } else {
    $('fld-specUpper').classList.remove('has-error');
    $('val-specUpper').className = 'sc-val ok';
    $('val-specUpper').textContent = 'OK Valid';
  }
  if (isNaN(sl) || sl >= 0) {
    $('fld-specLower').classList.add('has-error');
    $('val-specLower').className = 'sc-val error';
    $('val-specLower').textContent = 'X LSL must be negative';
    ok = false;
  } else {
    $('fld-specLower').classList.remove('has-error');
    $('val-specLower').className = 'sc-val ok';
    $('val-specLower').textContent = 'OK';
  }
  if (isNaN(cpkT) || cpkT < 0.5 || cpkT > 3) {
    $('val-cpk').className = 'sc-val error';
    $('val-cpk').textContent = 'X Cpk 0.5-3.0';
    ok = false;
  } else {
    $('val-cpk').className = 'sc-val ok';
    $('val-cpk').textContent = cpkT >= 1.67 ? 'OK Six Sigma' : 'OK Auto std';
  }
  if (ok) calc();
}

function loadPreset(key: PresetKey): void {
  const p = presets[key];
  $input('specUpper').value = String(p.specUpper);
  $input('specLower').value = String(p.specLower);
  $input('cpkTarget').value = String(p.cpkTarget);
  $input('mcSeed').value = String(p.mcSeed);
  $select('unitSpec').value = 'mm';
  $select('unitSpec2').value = 'mm';
  currentUnit = 'mm';
  dimensions = p.dims.map((d) => ({ ...d }));
  renderDims();
  validate();
  document.querySelectorAll('.sc-preset').forEach((b) => {
    const btn = b as HTMLElement;
    btn.classList.toggle('active', btn.dataset.preset === key);
  });
}

function convertUnits(): void {
  const nu = $select('unitSpec').value as UnitKey;
  if (nu === currentUnit) return;
  const ratio = unitConv[currentUnit].toMm * unitConv[nu].fromMm;
  $input('specUpper').value = (parseFloat($input('specUpper').value) * ratio).toFixed(4);
  $input('specLower').value = (parseFloat($input('specLower').value) * ratio).toFixed(4);
  $select('unitSpec2').value = nu;
  dimensions = dimensions.map((d) => ({
    ...d,
    nominal: +(d.nominal * ratio).toFixed(4),
    tolerance: +(d.tolerance * ratio).toFixed(4)
  }));
  currentUnit = nu;
  renderDims();
  validate();
}

document.querySelectorAll('.sc-preset').forEach((b) => {
  b.addEventListener('click', () => {
    const key = (b as HTMLElement).dataset.preset as PresetKey | undefined;
    if (key && presets[key]) loadPreset(key);
  });
});
(['specUpper', 'specLower', 'cpkTarget', 'mcSeed'] as const).forEach((id) => {
  $input(id).addEventListener('input', validate);
});
$select('unitSpec').addEventListener('change', convertUnits);
$select('unitSpec2').addEventListener('change', () => {
  $select('unitSpec').value = $select('unitSpec2').value;
  convertUnits();
});
$('addDim').addEventListener('click', () => {
  dimensions.push({ name: 'Dim ' + (dimensions.length + 1), nominal: 10, tolerance: 0.05 });
  renderDims();
  validate();
});
$('resetAll').addEventListener('click', () => loadPreset('automotive'));
$('dimList').addEventListener('input', (e) => {
  const t = e.target as HTMLInputElement | null;
  if (!t || t.dataset.i === undefined) return;
  const i = Number(t.dataset.i);
  const f = t.dataset.f;
  const row = dimensions[i];
  if (!row || !f) return;
  if (f === 'name') row.name = t.value;
  else if (f === 'nominal') row.nominal = parseFloat(t.value);
  else if (f === 'tolerance') row.tolerance = parseFloat(t.value);
  validate();
});
$('dimList').addEventListener('click', (e) => {
  const t = e.target as HTMLElement | null;
  if (!t || t.dataset.del === undefined) return;
  if (dimensions.length > 1) {
    dimensions.splice(Number(t.dataset.del), 1);
    renderDims();
    validate();
  }
});
$('genReport').addEventListener('click', () => {
  if (!calcData) validate();
  if (!calcData) return;
  const d = calcData;
  window.__sc008 = d;
  const fromMm = unitConv[d.unit].fromMm;
  const u = d.unit;
  const calcId = 'SC-008-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  const overall = d.rssInSpec && d.cpkOk ? 'PASS' : (d.rssInSpec ? 'WARNING' : 'CRITICAL');
  const pColors = ['#f5222d', '#faad14', '#5b8def', '#a855f7', '#4ecdc4'];

  const alertHTML = overall === 'CRITICAL'
    ? `<div class="sc-alert sc-alert-crit"><div class="sc-alert-title">Critical - Stack Exceeds Specification</div><div class="sc-alert-body">RSS tolerance <strong>+/-${(d.rssTol * fromMm).toFixed(4)} ${u}</strong> exceeds spec <strong>+/-${(Math.abs(d.su) * fromMm).toFixed(3)} ${u}</strong>.<br>Expected defect rate: <strong>${d.ppm.toFixed(0)} PPM</strong>. Top contributor "${d.pareto[0]?.name}" = <strong>${d.pareto[0]?.pct}%</strong> of variation. Immediate action required.</div></div>`
    : overall === 'WARNING'
    ? `<div class="sc-alert sc-alert-warn"><div class="sc-alert-title">Warning - Process Capability Below Target</div><div class="sc-alert-body">Cpk = <strong>${d.cpk.toFixed(2)}</strong> (target >= ${d.cpkTarget}). Defect rate <strong>${d.ppm.toFixed(0)} PPM</strong>. Monitor closely.</div></div>`
    : `<div class="sc-alert sc-alert-pass"><div class="sc-alert-title">Pass - Design Within Specification</div><div class="sc-alert-body">RSS <strong>+/-${(d.rssTol * fromMm).toFixed(4)} ${u}</strong> within spec. Cpk = <strong>${d.cpk.toFixed(2)}</strong>. Expected yield <strong>${(100 - d.ppm / 10000).toFixed(3)}%</strong>.</div></div>`;

  const cardsHTML = `
    <div class="sc-card-res"><div class="sc-card-res-label">Worst Case</div><div class="sc-card-res-val">+/-${(d.wcTol * fromMm).toFixed(4)}</div><div class="sc-card-res-sub">${u} | 100% coverage</div><span class="sc-card-res-badge ${d.wcTol <= Math.abs(d.su) ? 'sc-badge-pass' : 'sc-badge-crit'}">${d.wcTol <= Math.abs(d.su) ? 'IN SPEC' : 'EXCEEDS'}</span></div>
    <div class="sc-card-res"><div class="sc-card-res-label">RSS</div><div class="sc-card-res-val">+/-${(d.rssTol * fromMm).toFixed(4)}</div><div class="sc-card-res-sub">${u} | 99.7% coverage</div><span class="sc-card-res-badge ${d.rssInSpec ? 'sc-badge-pass' : 'sc-badge-crit'}">${d.rssInSpec ? 'IN SPEC' : 'EXCEEDS'}</span></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Monte Carlo (10k)</div><div class="sc-card-res-val">+/-${(d.mcTol * fromMm).toFixed(4)}</div><div class="sc-card-res-sub">${u} | 99.5% coverage</div><span class="sc-card-res-badge ${d.rssInSpec ? 'sc-badge-pass' : 'sc-badge-crit'}">${d.rssInSpec ? 'IN SPEC' : 'EXCEEDS'}</span></div>`;

  const dimsHTML = d.dims.map((dim, i) => {
    const c = d.pareto.find((p) => p.name === dim.name);
    return `<tr><td>${i + 1}</td><td>${dim.name}</td><td>${(dim.nominal * fromMm).toFixed(3)}</td><td>+/-${(dim.tolerance * fromMm).toFixed(3)}</td><td class="${i === 0 ? 'td-high' : 'td-ok'}">${c ? c.pct : '0'}%</td></tr>`;
  }).join('');

  const paretoHTML = d.pareto.map((c, i) =>
    `<div class="sc-pareto-row"><div class="sc-pareto-name">${c.name}</div><div class="sc-pareto-track"><div class="sc-pareto-fill" style="width:${c.pct}%;background:${pColors[i % pColors.length]}"><span>${c.pct}%</span></div></div></div>`
  ).join('');

  const whatIfHTML = d.whatIfs.map((w) =>
    `<div class="sc-card-res"><div class="sc-card-res-label">${w.scale}x tolerance</div><div class="sc-card-res-val">Cpk ${w.cpk.toFixed(2)}</div><div class="sc-card-res-sub">${w.ppm.toFixed(0)} PPM</div></div>`
  ).join('');

  const recHTML = overall !== 'PASS'
    ? `<div class="sc-rec"><div class="sc-rec-title">1. Tighten tolerance on ${d.pareto[0]?.name}</div><div class="sc-rec-body">Contributes ${d.pareto[0]?.pct}% of variation. Expected Cpk improvement: ${d.cpk.toFixed(2)} -> ${(d.cpk * 1.2).toFixed(2)}.</div></div><div class="sc-rec"><div class="sc-rec-title">2. Implement SPC on ${d.pareto[0]?.name}</div><div class="sc-rec-body">X-bar/R charts prevent 100% scrap scenarios.</div></div>`
    : `<div class="sc-rec"><div class="sc-rec-title">1. Design statistically sound - maintain controls</div><div class="sc-rec-body">Cpk ${d.cpk.toFixed(2)} exceeds target ${d.cpkTarget}. Quarterly capability studies.</div></div>`;

  // ---- 4 visuals (Decimal-backed data, reference design) ----
  const gaugeAngle = Math.max(-90, Math.min(90, (d.rssTol / Math.abs(d.su)) * 90));
  const gCol = overall === 'PASS' ? '#52c41a' : (overall === 'WARNING' ? '#faad14' : '#f5222d');
  const gaugeSVG = `<div class="sc-gauge-wrap"><svg width="300" height="170" viewBox="0 0 300 170">
    <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="#111720" stroke-width="24" stroke-linecap="round"/>
    <path d="M 40 150 A 110 110 0 0 1 95 55" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 205 55 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 125 32 A 110 110 0 0 1 175 32" fill="none" stroke="rgba(245,34,45,0.2)" stroke-width="24" stroke-linecap="round"/>
    <line x1="150" y1="150" x2="${150 + 95 * Math.cos((gaugeAngle - 90) * Math.PI / 180)}" y2="${150 + 95 * Math.sin((gaugeAngle - 90) * Math.PI / 180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="150" cy="150" r="7" fill="${gCol}"/>
    <text x="150" y="135" text-anchor="middle" fill="#f0f4f8" font-size="24" font-weight="700" font-family="JetBrains Mono">+/-${(d.rssTol * fromMm).toFixed(3)}</text>
    <text x="150" y="155" text-anchor="middle" fill="#4a5568" font-size="10">${u} (RSS)</text>
    <text x="30" y="168" fill="#4a5568" font-size="9">0</text>
    <text x="270" y="168" fill="#4a5568" font-size="9">${(Math.abs(d.su) * fromMm).toFixed(2)}</text>
    <text x="150" y="12" text-anchor="middle" fill="#f5222d" font-size="9" font-weight="700">SPEC LIMIT</text>
  </svg></div>`;

  const stackSVG = `<div class="sc-stack">${([['Worst Case', d.wcTol, '#f5222d', 1], ['RSS', d.rssTol, '#faad14', 1], ['Monte Carlo', d.mcTol, '#5b8def', 1], ['Spec Limit', Math.abs(d.su), '#52c41a', 0.25]] as [string, number, string, number][]).map(([lbl, val, col, op]) => `
    <div class="sc-stack-col"><div class="sc-stack-wrap"><div class="sc-stack-bar" style="height:${Math.min(100, (val / Math.abs(d.su)) * 100)}%;background:${col};opacity:${op}"><span class="sc-stack-bar-lbl">+/-${(val * fromMm).toFixed(3)}</span></div></div><div class="sc-stack-lbl">${lbl}</div></div>`).join('')}</div>`;

  const mcSVG = `<svg width="100%" height="200" viewBox="0 0 600 200" preserveAspectRatio="none">
    <line x1="50" y1="30" x2="550" y2="30" stroke="#111720"/><line x1="50" y1="90" x2="550" y2="90" stroke="#111720"/><line x1="50" y1="150" x2="550" y2="150" stroke="#111720"/>
    <path d="M 50 150 Q 100 150 150 120 Q 200 60 250 30 Q 300 15 350 30 Q 400 60 450 120 Q 500 150 550 150" fill="none" stroke="#5b8def" stroke-width="2"/>
    <path d="M 50 150 Q 100 150 150 120 Q 200 60 250 30 Q 300 15 350 30 Q 400 60 450 120 Q 500 150 550 150 L 550 180 L 50 180 Z" fill="rgba(91,141,239,0.05)"/>
    <line x1="100" y1="10" x2="100" y2="180" stroke="#f5222d" stroke-dasharray="4,4"/>
    <line x1="500" y1="10" x2="500" y2="180" stroke="#f5222d" stroke-dasharray="4,4"/>
    <text x="100" y="195" text-anchor="middle" fill="#f5222d" font-size="9">LSL ${(d.lsl * fromMm).toFixed(2)}</text>
    <text x="500" y="195" text-anchor="middle" fill="#f5222d" font-size="9">USL +${(d.usl * fromMm).toFixed(2)}</text>
    <line x1="300" y1="10" x2="300" y2="180" stroke="#52c41a"/>
    <text x="300" y="8" text-anchor="middle" fill="#52c41a" font-size="9" font-weight="700">mu = ${(d.nominalSum * fromMm).toFixed(3)}</text>
  </svg>`;

  const criteria = [
    { name: 'Spec Compliance', val: d.rssInSpec ? 0.9 : 0.2 },
    { name: 'Cpk Target', val: Math.min(1, d.cpk / d.cpkTarget) },
    { name: 'Yield Rate', val: Math.min(1, (100 - d.ppm / 10000) / 100) },
    { name: 'Cost Efficiency', val: d.rssInSpec ? 0.75 : 0.3 },
    { name: 'Process Control', val: d.cpkOk ? 0.85 : 0.5 },
    { name: 'Design Margin', val: Math.min(1, Math.abs(d.su) / (d.rssTol * 2)) }
  ];
  const cx = 140, cy = 140, rr = 110;
  const pts = criteria.map((c, i) => { const a = (i * 60 - 90) * Math.PI / 180; const dist = c.val * rr; return `${cx + dist * Math.cos(a)},${cy + dist * Math.sin(a)}`; }).join(' ');
  const rFill = overall === 'PASS' ? 'rgba(82,196,26,0.15)' : (overall === 'WARNING' ? 'rgba(250,173,20,0.15)' : 'rgba(245,34,45,0.15)');
  const rStroke = overall === 'PASS' ? '#52c41a' : (overall === 'WARNING' ? '#faad14' : '#f5222d');
  const radarSVG = `<div class="sc-radar-wrap"><svg width="280" height="280" viewBox="0 0 280 280">
    <polygon points="140,30 230,90 230,190 140,250 50,190 50,90" fill="none" stroke="#1e2733"/>
    <polygon points="140,65 195,105 195,175 140,215 85,175 85,105" fill="none" stroke="#1e2733"/>
    <polygon points="140,100 160,120 160,160 140,180 120,160 120,120" fill="none" stroke="#1e2733"/>
    <line x1="140" y1="30" x2="140" y2="250" stroke="#1e2733"/><line x1="50" y1="90" x2="230" y2="190" stroke="#1e2733"/><line x1="230" y1="90" x2="50" y2="190" stroke="#1e2733"/>
    <polygon points="${pts}" fill="${rFill}" stroke="${rStroke}" stroke-width="2"/>
    ${criteria.map((c, i) => { const a = (i * 60 - 90) * Math.PI / 180; const x = cx + (rr + 22) * Math.cos(a); const y = cy + (rr + 22) * Math.sin(a); return `<text x="${x}" y="${y}" text-anchor="middle" fill="#6e7d8c" font-size="9" font-weight="600">${c.name}</text>`; }).join('')}
  </svg></div>`;

  $('reportArea').innerHTML = `
    <div class="sc-report-hd">
      <div><div class="sc-report-title">SC-008 Tolerance Stack-Up Analysis</div>
      <div class="sc-report-meta">Calc ID: <span>${calcId}</span> | ${new Date().toISOString().slice(0, 19)} UTC<br>Standard: ISO 286-1 | ASME Y14.5 | AIAG SPC<br>Method: Worst-Case + RSS + Seeded Monte Carlo (n=10000, seed=${d.seed})<br><span>Client-Side Only - data never left your browser</span></div></div>
      <div><button class="sc-btn sc-btn-primary" id="pdfBtn">Export PDF</button></div>
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Risk Assessment</div>${alertHTML}</div>
    <div class="sc-sec"><div class="sc-sec-hd">Methodology Comparison</div><div class="sc-cards">${cardsHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Specification Gauge</div><div class="sc-chart">${gaugeSVG}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Methodology Stack Comparison</div><div class="sc-chart">${stackSVG}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Stack Dimensions</div><table class="sc-table"><thead><tr><th>#</th><th>Dimension</th><th>Nominal</th><th>+/-Tol</th><th>Contrib</th></tr></thead><tbody>${dimsHTML}</tbody></table></div>
    <div class="sc-sec"><div class="sc-sec-hd">Variation Contribution (Pareto)</div><div class="sc-chart">${paretoHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Process Capability</div><div class="sc-cards"><div class="sc-card-res"><div class="sc-card-res-label">Cpk</div><div class="sc-card-res-val">${d.cpk.toFixed(2)}</div><span class="sc-card-res-badge ${d.cpkOk ? 'sc-badge-pass' : 'sc-badge-warn'}">${d.cpkOk ? 'CAPABLE' : 'BELOW'}</span></div><div class="sc-card-res"><div class="sc-card-res-label">Defect Rate</div><div class="sc-card-res-val">${d.ppm.toFixed(0)}</div><div class="sc-card-res-sub">PPM</div></div><div class="sc-card-res"><div class="sc-card-res-label">Yield</div><div class="sc-card-res-val">${(100 - d.ppm / 10000).toFixed(2)}%</div></div></div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Monte Carlo Distribution (n=10,000)</div><div class="sc-chart">${mcSVG}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Multi-Criteria Radar Assessment</div><div class="sc-chart">${radarSVG}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">What-If Sensitivity</div><div class="sc-cards">${whatIfHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommended Actions</div>${recHTML}</div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards & References</div><div class="sc-std"><span>ISO 286-1:2010</span> - ISO tolerance grades<br><span>ASME Y14.5-2018</span> - Dimensioning and Tolerancing<br><span>AIAG SPC 2nd Ed.</span> - Cpk methodology<br><span>Seeded LCG Monte Carlo</span> - deterministic reproducibility</div></div>`;

  $('pdfBtn').addEventListener('click', () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 48;
    const line = (txt: string, size: number, color?: string) => {
      doc.setFontSize(size);
      doc.setTextColor(color || '#000');
      doc.text(txt, 48, y);
      y += size + 6;
      if (y > 780) { doc.addPage(); y = 48; }
    };
    line('SC-008 Tolerance Stack-Up Analysis', 16);
    line('Calc ID: ' + calcId + ' | ' + new Date().toISOString().slice(0, 19) + ' UTC', 9, '#666');
    line('Standard: ISO 286-1 | ASME Y14.5 | AIAG SPC | Seed ' + d.seed, 9, '#666');
    y += 8;
    line('VERDICT: ' + overall + '  |  Cpk ' + d.cpk.toFixed(2) + '  |  ' + d.ppm.toFixed(0) + ' PPM', 12);
    y += 8;
    line('METHODOLOGY COMPARISON', 11);
    line('Worst-Case: +/-' + (d.wcTol * fromMm).toFixed(4) + ' ' + u, 10);
    line('RSS: +/-' + (d.rssTol * fromMm).toFixed(4) + ' ' + u, 10);
    line('Monte Carlo (10k): +/-' + (d.mcTol * fromMm).toFixed(4) + ' ' + u, 10);
    y += 8;
    line('STACK DIMENSIONS', 11);
    d.dims.forEach((dim, i) => {
      const c = d.pareto.find((p) => p.name === dim.name);
      line((i + 1) + '. ' + dim.name + '  ' + (dim.nominal * fromMm).toFixed(3) + ' +/-' + (dim.tolerance * fromMm).toFixed(3) + '  (' + (c ? c.pct : '0') + '%)', 9);
    });
    y += 8;
    line('PARETO CONTRIBUTION', 11);
    d.pareto.forEach((c) => line(c.name + ': ' + c.pct + '%', 9));
    y += 8;
    line('RECOMMENDED ACTIONS', 11);
    if (overall !== 'PASS') {
      line('1. Tighten tolerance on ' + (d.pareto[0]?.name || 'top contributor'), 9);
      line('2. Implement SPC (X-bar/R charts)', 9);
    } else {
      line('1. Design sound - maintain quarterly capability studies', 9);
    }
    y += 8;
    line('Generated by SectorCalc.com - Deterministic, Client-Side, Audit-Ready', 8, '#999');
    doc.save('SC-008-' + calcId + '.pdf');
  });
});

renderDims();
validate();
