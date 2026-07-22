import { calculate } from './tools/SC-001-weld-thickness/v1.0.0/formula.js';
import type { WeldResult } from './tools/SC-001-weld-thickness/v1.0.0/formula.js';

type JointType = 'fillet' | 'butt';
type PresetKey = 'structural' | 'precision';

interface FieldState {
  designLoadN: string;
  weldLengthMm: string;
  weldStrengthMpa: string;
  safetyFactor: string;
  materialThicknessMm: string;
  jointType: JointType;
}

interface CalcData {
  result: WeldResult;
  fields: FieldState;
  overall: 'PASS' | 'WARNING' | 'CRITICAL';
  utilization: number;
}

declare global {
  interface Window {
    jspdf: { jsPDF: new (opts?: Record<string, unknown>) => {
      setFontSize: (n: number) => void;
      setTextColor: (c: string) => void;
      setFont: (name: string, style: string) => void;
      text: (t: string | string[], x: number, y: number) => void;
      splitTextToSize: (t: string, w: number) => string[];
      addPage: () => void;
      addImage: (data: string, format: string, x: number, y: number, w: number, h: number) => void;
      setPage: (n: number) => void;
      getNumberOfPages: () => number;
      save: (name: string) => void;
      internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    } };
    calcId?: string;
  }
}

const DEFAULTS: FieldState = {
  designLoadN: '50000',
  weldLengthMm: '200',
  weldStrengthMpa: '480',
  safetyFactor: '2',
  materialThicknessMm: '10',
  jointType: 'fillet'
};

const presets: Record<PresetKey, Partial<FieldState>> = {
  structural: {
    designLoadN: '50000',
    weldLengthMm: '200',
    weldStrengthMpa: '480',
    safetyFactor: '2',
    materialThicknessMm: '10'
  },
  precision: {
    designLoadN: '10000',
    weldLengthMm: '50',
    weldStrengthMpa: '480',
    safetyFactor: '2',
    materialThicknessMm: '6'
  }
};

let fields: FieldState = { ...DEFAULTS, ...presets.structural };
let calcData: CalcData | null = null;
let activePreset: PresetKey = 'structural';

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

function fieldHtml(id: string, label: string, tip: string, inputInner: string, unit: string): string {
  return `
    <div class="sc-field" id="fld-${id}">
      <div class="sc-field-label">${label}
        <span class="sc-info">i<span class="sc-tooltip"><strong>${label}</strong>${tip}</span></span>
      </div>
      <div class="sc-input-wrap">
        ${inputInner}
        <select class="sc-unit" disabled><option>${unit}</option></select>
      </div>
      <div class="sc-val" id="val-${id}"></div>
    </div>`;
}

function renderShell(): void {
  const app = document.getElementById('app');
  if (!app) throw new Error('Missing #app');
  app.innerHTML = `
    <div class="sc-header">
      <div class="sc-header-left">
        <div class="sc-logo">SC</div>
        <div class="sc-header-brand">
          <div class="sc-header-title">SC-001 — Weld Thickness</div>
          <div class="sc-header-sub">Deterministic Engine v2.0 | Client-Side | Reproducible</div>
        </div>
      </div>
      <div class="sc-header-right">
        <div class="sc-badge sc-badge-flagship">PRO</div>
      </div>
    </div>
    <div class="sc-layout">
      <div class="sc-sidebar">
        <div class="sc-sidebar-scroll">
          <div class="sc-section-hd">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            Configuration
          </div>
          <div class="sc-presets">
            <button class="sc-preset ${activePreset === 'structural' ? 'active' : ''}" data-preset="structural" type="button">Structural</button>
            <button class="sc-preset ${activePreset === 'precision' ? 'active' : ''}" data-preset="precision" type="button">Precision</button>
          </div>
          ${fieldHtml('designLoadN', 'Design Load', 'Design load in newtons (N).',
            `<input type="number" class="sc-input" id="designLoadN" value="${fields.designLoadN}" step="1" min="0">`, 'N')}
          ${fieldHtml('weldLengthMm', 'Weld Length', 'Total effective weld length.',
            `<input type="number" class="sc-input" id="weldLengthMm" value="${fields.weldLengthMm}" step="0.1" min="0.1">`, 'mm')}
          ${fieldHtml('weldStrengthMpa', 'Weld Strength', 'Allowable weld metal strength.',
            `<input type="number" class="sc-input" id="weldStrengthMpa" value="${fields.weldStrengthMpa}" step="1" min="0.1">`, 'MPa')}
          ${fieldHtml('safetyFactor', 'Safety Factor', 'Design safety factor applied to strength.',
            `<input type="number" class="sc-input" id="safetyFactor" value="${fields.safetyFactor}" step="0.1" min="0.1">`, 'x')}
          ${fieldHtml('materialThicknessMm', 'Material Thickness', 'Base material thickness for AWS min-leg table.',
            `<input type="number" class="sc-input" id="materialThicknessMm" value="${fields.materialThicknessMm}" step="0.1" min="0.1">`, 'mm')}
          ${fieldHtml('jointType', 'Joint Type', 'Fillet or butt — changes throat-to-leg factor.',
            `<select class="sc-input" id="jointType">
              <option value="fillet"${fields.jointType === 'fillet' ? ' selected' : ''}>fillet</option>
              <option value="butt"${fields.jointType === 'butt' ? ' selected' : ''}>butt</option>
            </select>`, '--')}
          <div class="sc-live">
            <div class="sc-live-hd"><span class="sc-live-dot"></span>Live Result — Final Leg</div>
            <div class="sc-live-val" id="liveResult">—</div>
            <div class="sc-live-sub" id="liveSub"><span>Utilization —</span><span>Throat —</span></div>
          </div>
        </div>
        <div class="sc-sidebar-ft">
          <button class="sc-btn sc-btn-primary" id="genReport" type="button">Generate Report</button>
          <button class="sc-btn sc-btn-ghost" id="resetAll" type="button">Reset</button>
        </div>
      </div>
      <div class="sc-main">
        <div class="sc-main-inner" id="reportArea">
          <div class="sc-empty">
            <div class="sc-empty-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div class="sc-empty-title">Engineering Report Ready</div>
            <div class="sc-empty-desc">Configure inputs on the left panel.<br>All values update in real-time.<br>Click "Generate Report" for full analysis.</div>
          </div>
        </div>
      </div>
    </div>`;
  bindEvents();
  calc();
}

function readFields(): void {
  fields = {
    designLoadN: $input('designLoadN').value,
    weldLengthMm: $input('weldLengthMm').value,
    weldStrengthMpa: $input('weldStrengthMpa').value,
    safetyFactor: $input('safetyFactor').value,
    materialThicknessMm: $input('materialThicknessMm').value,
    jointType: $select('jointType').value as JointType
  };
}

function calc(): void {
  readFields();
  try {
    const result = calculate({
      designLoadN: String(fields.designLoadN),
      weldLengthMm: String(fields.weldLengthMm),
      weldStrengthMpa: String(fields.weldStrengthMpa),
      safetyFactor: String(fields.safetyFactor),
      materialThicknessMm: String(fields.materialThicknessMm),
      jointType: fields.jointType
    });
    const utilization = Number(result.utilization);
    const overall: CalcData['overall'] =
      utilization >= 1 ? 'CRITICAL' : utilization >= 0.9 ? 'WARNING' : 'PASS';
    calcData = { result, fields: { ...fields }, overall, utilization };
    (window as any).calcData = calcData;
    $('liveResult').textContent = result.finalLegMm + ' mm';
    $('liveSub').innerHTML =
      `<span>Utilization ${result.utilization}</span><span>Throat ${result.requiredThroatMm} mm</span>`;
  } catch {
    calcData = null;
    (window as any).calcData = null;
    $('liveResult').textContent = 'ERR';
    $('liveSub').innerHTML = '<span>Check inputs</span>';
  }
}

function loadPreset(key: PresetKey): void {
  activePreset = key;
  fields = { ...DEFAULTS, ...presets[key] };
  renderShell();
}

function riskAlert(d: CalcData): string {
  if (d.overall === 'CRITICAL') {
    return `<div class="sc-alert sc-alert-crit"><div class="sc-alert-title">Critical — Utilization Exceeds Capacity</div><div class="sc-alert-body">Utilization <strong>${d.result.utilization}</strong> (>= 1.0). Increase leg, length, or strength; reduce load or safety demand.</div></div>`;
  }
  if (d.overall === 'WARNING') {
    return `<div class="sc-alert sc-alert-warn"><div class="sc-alert-title">Warning — Near Capacity</div><div class="sc-alert-body">Utilization <strong>${d.result.utilization}</strong> (>= 0.9). Little design margin remaining.</div></div>`;
  }
  return `<div class="sc-alert sc-alert-pass"><div class="sc-alert-title">Pass — Weld Within Capacity</div><div class="sc-alert-body">Final leg <strong>${d.result.finalLegMm} mm</strong>. Utilization <strong>${d.result.utilization}</strong>.</div></div>`;
}

function gaugeSvg(d: CalcData): string {
  const angle = Math.max(-90, Math.min(90, (d.utilization / 1.5) * 90));
  const gCol = d.overall === 'PASS' ? '#52c41a' : d.overall === 'WARNING' ? '#faad14' : '#f5222d';
  return `<div class="sc-gauge-wrap"><svg width="300" height="170" viewBox="0 0 300 170">
    <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="#111720" stroke-width="24" stroke-linecap="round"/>
    <path d="M 40 150 A 110 110 0 0 1 95 55" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 205 55 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 125 32 A 110 110 0 0 1 175 32" fill="none" stroke="rgba(245,34,45,0.2)" stroke-width="24" stroke-linecap="round"/>
    <line x1="150" y1="150" x2="${150 + 95 * Math.cos((angle - 90) * Math.PI / 180)}" y2="${150 + 95 * Math.sin((angle - 90) * Math.PI / 180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="150" cy="150" r="7" fill="${gCol}"/>
    <text x="150" y="135" text-anchor="middle" fill="#f0f4f8" font-size="24" font-weight="700" font-family="JetBrains Mono">${d.result.utilization}</text>
    <text x="150" y="155" text-anchor="middle" fill="#4a5568" font-size="10">Utilization (0-1.5)</text>
    <text x="30" y="168" fill="#4a5568" font-size="9">0</text>
    <text x="270" y="168" fill="#4a5568" font-size="9">1.5</text>
  </svg></div>`;
}

function generateReport(): void {
  if (!calcData) calc();
  if (!calcData) return;
  const d = calcData;
  const calcId = 'SC-001-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  window.calcId = calcId;
  (window as any).calcData = d;

  const cardsHTML = `
    <div class="sc-card-res"><div class="sc-card-res-label">Final Leg</div><div class="sc-card-res-val">${d.result.finalLegMm}</div><div class="sc-card-res-sub">mm (${d.result.finalLegIn} in)</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Required Throat</div><div class="sc-card-res-val">${d.result.requiredThroatMm}</div><div class="sc-card-res-sub">mm</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Min Leg (table)</div><div class="sc-card-res-val">${d.result.minLegMm}</div><div class="sc-card-res-sub">mm AWS D1.1</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Utilization</div><div class="sc-card-res-val">${d.result.utilization}</div><span class="sc-card-res-badge ${d.overall === 'PASS' ? 'sc-badge-pass' : d.overall === 'WARNING' ? 'sc-badge-warn' : 'sc-badge-crit'}">${d.overall}</span></div>`;

  const stepsHTML = d.result.steps.map((s) =>
    `<tr><td>${s.step}</td><td>${s.description}</td><td>${s.formula}</td><td class="td-ok">${s.result}</td></tr>`
  ).join('');

  const recHTML = d.overall !== 'PASS'
    ? `<div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Increase leg or weld length</span></div><div class="sc-rec-body">Current utilization ${d.result.utilization}. Leg from load ${d.result.legFromLoadMm} mm vs min ${d.result.minLegMm} mm.</div></div>
       <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Verify joint type and safety factor</span></div><div class="sc-rec-body">Joint: <strong>${d.result.jointType}</strong>, SF ${d.fields.safetyFactor}.</div></div>`
    : `<div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Weld size adequate — document calc</span></div><div class="sc-rec-body">Attach Calc ID ${calcId} to drawing package / WPS.</div></div>`;

  $('reportArea').innerHTML = `
    <div class="sc-report-hd">
      <div class="sc-report-hd-left">
        <div class="sc-report-title">SC-001 Weld Thickness Analysis</div>
        <div class="sc-report-meta">Calc ID: <span>${calcId}</span> | ${new Date().toISOString().slice(0, 19)} UTC<br>
        Joint: ${d.result.jointType} | Load: ${d.fields.designLoadN} N | Length: ${d.fields.weldLengthMm} mm<br>
        <span class="ok">Client-Side Only - data never left your browser</span></div>
      </div>
      <div class="sc-report-hd-right">
        <button class="sc-btn sc-btn-ghost" id="pdfBtn" type="button">Export PDF</button>
        <button class="sc-btn sc-btn-ghost" id="pdfGraphicBtn" type="button">Export Graphic PDF</button>
        <button class="sc-btn sc-btn-primary" id="shareBtn" type="button">Share</button>
      </div>
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Risk Assessment</div>${riskAlert(d)}</div>
    <div class="sc-sec"><div class="sc-sec-hd">Key Results</div><div class="sc-cards">${cardsHTML}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Utilization Gauge</div><div class="sc-chart">${gaugeSvg(d)}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Calculation Steps</div>
      <table class="sc-table"><thead><tr><th>#</th><th>Description</th><th>Formula</th><th>Result</th></tr></thead><tbody>${stepsHTML}</tbody></table>
    </div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommended Actions</div>${recHTML}</div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards & References</div><div class="sc-std">
      <span>AWS D1.1</span> — Structural Welding Code — Steel (minimum fillet leg table)<br>
      <span>EN ISO 2553</span> — Welding and allied processes — Symbolic representation on drawings
    </div></div>
    <div class="sc-footer">Generated by SectorCalc.com — Deterministic Engineering Calculators — Client-Side Only — Your data never leaves your browser<br>
    Deterministic Engine | Reproducible | Client-Side | Audit-Ready</div>`;

  $('pdfBtn').addEventListener('click', exportPDF);
  $('pdfGraphicBtn').addEventListener('click', (e) => { void exportPDFGraphic(e); });
  $('shareBtn').addEventListener('click', shareReport);
}

function exportPDF(): void {
  const data = (window as any).calcData as CalcData | null | undefined;
  if (!data) { calc(); }
  const d = (window as any).calcData as CalcData | null | undefined;
  if (!d) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const calcId = window.calcId || 'SC-001';
  let y = 48;
  const line = (txt: string, size?: number, color?: string, bold?: boolean) => {
    doc.setFontSize(size || 10);
    doc.setTextColor(color || '#222222');
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(txt, 500);
    doc.text(lines, 48, y);
    y += lines.length * ((size || 10) + 4) + 2;
    if (y > 780) { doc.addPage(); y = 48; }
  };
  line('SC-001 Weld Thickness Analysis Report', 16, '#111111', true);
  line('Calc ID: ' + calcId + '   |   ' + new Date().toISOString().slice(0, 19) + ' UTC', 9, '#666666');
  line('Standard: AWS D1.1 | EN ISO 2553 | Client-Side Only', 9, '#1a7f37');
  y += 6;
  line('VERDICT: ' + d.overall + '    Utilization ' + d.result.utilization + '    Leg ' + d.result.finalLegMm + ' mm', 13,
    d.overall === 'PASS' ? '#1a7f37' : d.overall === 'WARNING' ? '#b8860b' : '#c0392b', true);
  y += 8;
  line('KEY RESULTS', 11, '#111111', true);
  line('Final leg: ' + d.result.finalLegMm + ' mm (' + d.result.finalLegIn + ' in)', 10);
  line('Required throat: ' + d.result.requiredThroatMm + ' mm', 10);
  line('Min leg (table): ' + d.result.minLegMm + ' mm', 10);
  line('Leg from load: ' + d.result.legFromLoadMm + ' mm', 10);
  line('Joint type: ' + d.result.jointType, 10);
  y += 8;
  line('CALCULATION STEPS', 11, '#111111', true);
  d.result.steps.forEach((s) => line(s.step + '. ' + s.description + ' | ' + s.formula + ' = ' + s.result, 9));
  y += 8;
  line('STANDARDS', 11, '#111111', true);
  line('AWS D1.1 — Structural Welding Code — Steel', 8, '#666666');
  line('EN ISO 2553 — Symbolic representation on drawings', 8, '#666666');
  y += 8;
  line('Generated by SectorCalc.com - Deterministic Engineering Calculators - Audit-Ready', 8, '#999999');
  doc.save('SC-001-' + calcId + '.pdf');
}

async function exportPDFGraphic(e?: Event): Promise<void> {
  const el = document.getElementById('reportArea');
  if (!el || !(window as any).calcData) { alert('Generate the report first.'); return; }
  const btn = e?.target as HTMLButtonElement | undefined;
  if (btn) { btn.textContent = 'Rendering...'; btn.disabled = true; }
  try {
    const html2canvas = (window as any).html2canvas as (el: HTMLElement, opts: Record<string, unknown>) => Promise<HTMLCanvasElement>;
    const canvas = await html2canvas(el, {
      scale: 1.5,
      backgroundColor: '#070a0f',
      useCORS: true,
      logging: false
    });
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * pageW) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.82);
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }
    const pages = pdf.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7);
      pdf.setTextColor('#787878');
      pdf.text('SectorCalc.com | Calc ID ' + (window.calcId || 'SC-001') + ' | Client-Side | Page ' + i + '/' + pages, 48, pageH - 16);
    }
    pdf.save('SC-001-' + (window.calcId || 'report') + '-graphic.pdf');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    alert('Graphic PDF failed: ' + msg + '. Use Export PDF (text) instead.');
  } finally {
    if (btn) { btn.textContent = 'Export Graphic PDF'; btn.disabled = false; }
  }
}

function shareReport(): void {
  const d = (window as any).calcData as CalcData | null | undefined;
  if (!d) { alert('Generate the report first.'); return; }
  const s = encodeURIComponent(JSON.stringify(d.fields));
  void navigator.clipboard.writeText(location.origin + '/weld-pro.html?s=' + s).then(() => alert('Shareable URL copied'));
}

function bindEvents(): void {
  document.querySelectorAll('.sc-preset').forEach((b) => {
    b.addEventListener('click', () => {
      const key = (b as HTMLElement).dataset.preset as PresetKey | undefined;
      if (key && presets[key]) loadPreset(key);
    });
  });
  (['designLoadN', 'weldLengthMm', 'weldStrengthMpa', 'safetyFactor', 'materialThicknessMm'] as const)
    .forEach((id) => $input(id).addEventListener('input', calc));
  $select('jointType').addEventListener('change', calc);
  $('genReport').addEventListener('click', generateReport);
  $('resetAll').addEventListener('click', () => loadPreset('structural'));
}

function applyShareQuery(): void {
  const q = new URLSearchParams(location.search).get('s');
  if (!q) return;
  try {
    const parsed = JSON.parse(decodeURIComponent(q)) as Partial<FieldState>;
    fields = { ...DEFAULTS, ...parsed };
  } catch {
    /* ignore */
  }
}

applyShareQuery();
renderShell();
