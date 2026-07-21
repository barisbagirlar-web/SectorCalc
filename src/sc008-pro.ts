import { calculate } from './tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import type { StackInput, StackResult } from './tools/SC-008-tolerance-stack/v1.0.0/formula.js';
import { whatIfToleranceScale } from './lib/what-if.js';

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
  window.__sc008 = calcData;
  $('reportArea').innerHTML =
    '<div class="sc-empty"><div class="sc-empty-title">360 Report</div><div class="sc-empty-desc">Report sections render in RM-015B.<br>calcData ready: Cpk ' +
    calcData.cpk.toFixed(2) + ', ' + calcData.ppm.toFixed(0) + ' PPM.</div></div>';
});

renderDims();
validate();
