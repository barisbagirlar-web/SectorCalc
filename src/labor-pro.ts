import { calculate } from './tools/SC-010-labor-cost/v1.0.0/formula.js';
import type { LaborCostResult } from './tools/SC-010-labor-cost/v1.0.0/formula.js';

type PayFrequency = 'hourly' | 'weekly' | 'biweekly' | 'monthly';
type PresetKey = 'workshop' | 'factory';

interface FieldState {
  netSalary: string;
  payFrequency: PayFrequency;
  hoursPerWeek: string;
  employerSSRate: string;
  employerUnempRate: string;
  employeeRate: string;
  healthMonthly: string;
  mealMonthly: string;
  transportMonthly: string;
  annualBonus: string;
  severanceRate: string;
}

interface CalcData {
  result: LaborCostResult;
  fields: FieldState;
  overall: 'PASS' | 'WARNING' | 'CRITICAL';
  multiplier: number;
  hiddenPct: number;
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

const US_DEFAULTS: FieldState = {
  netSalary: '3500',
  payFrequency: 'monthly',
  hoursPerWeek: '40',
  employerSSRate: '0.0765',
  employerUnempRate: '0.06',
  employeeRate: '0.23',
  healthMonthly: '0',
  mealMonthly: '0',
  transportMonthly: '0',
  annualBonus: '0',
  severanceRate: '0'
};

const presets: Record<PresetKey, Partial<FieldState>> = {
  workshop: { netSalary: '2500', hoursPerWeek: '40', payFrequency: 'monthly', healthMonthly: '0' },
  factory: { netSalary: '4000', hoursPerWeek: '45', payFrequency: 'monthly', healthMonthly: '200' }
};

const PARETO_COLORS = ['#f5222d', '#faad14', '#5b8def', '#a855f7', '#4ecdc4', '#52c41a'];

let fields: FieldState = { ...US_DEFAULTS, ...presets.workshop };
let calcData: CalcData | null = null;
let activePreset: PresetKey = 'workshop';

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

function moneyFmt(s: string): string {
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fieldHtml(
  id: string,
  label: string,
  tip: string,
  inputInner: string,
  unitHtml: string,
  refHtml = ''
): string {
  return `
    <div class="sc-field" id="fld-${id}">
      <div class="sc-field-label">${label}
        <span class="sc-info">i<span class="sc-tooltip"><strong>${label}</strong>${tip}</span></span>
      </div>
      <div class="sc-input-wrap">
        ${inputInner}
        ${unitHtml}
      </div>
      ${refHtml}
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
          <div class="sc-header-title">SC-010 — True Labor Cost</div>
          <div class="sc-header-sub">Deterministic Engine v2.0 | Seeded Monte Carlo | Client-Side | Reproducible</div>
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
            <button class="sc-preset ${activePreset === 'workshop' ? 'active' : ''}" data-preset="workshop" type="button">Small workshop</button>
            <button class="sc-preset ${activePreset === 'factory' ? 'active' : ''}" data-preset="factory" type="button">Mid factory</button>
          </div>
          ${fieldHtml('netSalary', 'Net Salary', 'Take-home pay for the selected pay frequency.',
            `<input type="number" class="sc-input" id="netSalary" value="${fields.netSalary}" step="0.01" min="0">`,
            `<select class="sc-unit" disabled><option>USD</option></select>`,
            `<div class="sc-ref"><span class="sc-ref-tag ref">Ref</span><span class="sc-ref-text">US workshop ~2500-4000</span></div>`)}
          ${fieldHtml('payFrequency', 'Pay Frequency', 'How net salary is paid. Engine normalizes to monthly.',
            `<select class="sc-input" id="payFrequency">
              <option value="monthly"${fields.payFrequency === 'monthly' ? ' selected' : ''}>monthly</option>
              <option value="weekly"${fields.payFrequency === 'weekly' ? ' selected' : ''}>weekly</option>
              <option value="biweekly"${fields.payFrequency === 'biweekly' ? ' selected' : ''}>biweekly</option>
              <option value="hourly"${fields.payFrequency === 'hourly' ? ' selected' : ''}>hourly</option>
            </select>`,
            `<select class="sc-unit" disabled><option>--</option></select>`)}
          ${fieldHtml('hoursPerWeek', 'Hours / Week', 'Average worked hours per week.',
            `<input type="number" class="sc-input" id="hoursPerWeek" value="${fields.hoursPerWeek}" step="0.5" min="0.1" max="80">`,
            `<select class="sc-unit" disabled><option>h/wk</option></select>`)}
          ${fieldHtml('employerSSRate', 'Employer SS Rate', 'Employer social security rate (0-1). US FICA ~0.0765.',
            `<input type="number" class="sc-input" id="employerSSRate" value="${fields.employerSSRate}" step="0.0001" min="0" max="1">`,
            `<select class="sc-unit" disabled><option>ratio</option></select>`)}
          ${fieldHtml('employerUnempRate', 'Employer Unemp Rate', 'Employer unemployment insurance rate (0-1).',
            `<input type="number" class="sc-input" id="employerUnempRate" value="${fields.employerUnempRate}" step="0.0001" min="0" max="1">`,
            `<select class="sc-unit" disabled><option>ratio</option></select>`)}
          ${fieldHtml('employeeRate', 'Employee Rate', 'Employee contribution rate used to gross-up net (must be &lt; 1).',
            `<input type="number" class="sc-input" id="employeeRate" value="${fields.employeeRate}" step="0.0001" min="0" max="0.9999">`,
            `<select class="sc-unit" disabled><option>ratio</option></select>`)}
          ${fieldHtml('healthMonthly', 'Health Monthly', 'Monthly employer health insurance cost.',
            `<input type="number" class="sc-input" id="healthMonthly" value="${fields.healthMonthly}" step="0.01" min="0">`,
            `<select class="sc-unit" disabled><option>USD</option></select>`)}
          ${fieldHtml('mealMonthly', 'Meal Monthly', 'Monthly meal or food allowance.',
            `<input type="number" class="sc-input" id="mealMonthly" value="${fields.mealMonthly}" step="0.01" min="0">`,
            `<select class="sc-unit" disabled><option>USD</option></select>`)}
          ${fieldHtml('transportMonthly', 'Transport Monthly', 'Monthly transport allowance.',
            `<input type="number" class="sc-input" id="transportMonthly" value="${fields.transportMonthly}" step="0.01" min="0">`,
            `<select class="sc-unit" disabled><option>USD</option></select>`)}
          ${fieldHtml('annualBonus', 'Annual Bonus', 'Annual bonus amount (spread into monthly cost).',
            `<input type="number" class="sc-input" id="annualBonus" value="${fields.annualBonus}" step="0.01" min="0">`,
            `<select class="sc-unit" disabled><option>USD</option></select>`)}
          ${fieldHtml('severanceRate', 'Severance Rate', 'Severance accrual as fraction of gross (monthly).',
            `<input type="number" class="sc-input" id="severanceRate" value="${fields.severanceRate}" step="0.0001" min="0" max="0.5">`,
            `<select class="sc-unit" disabled><option>ratio</option></select>`)}
          <div class="sc-live">
            <div class="sc-live-hd"><span class="sc-live-dot"></span>Live Result — True Monthly Cost</div>
            <div class="sc-live-val" id="liveResult">—</div>
            <div class="sc-live-sub" id="liveSub"><span>Multiplier —</span><span>Hidden —</span></div>
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
    netSalary: $input('netSalary').value,
    payFrequency: $select('payFrequency').value as PayFrequency,
    hoursPerWeek: $input('hoursPerWeek').value,
    employerSSRate: $input('employerSSRate').value,
    employerUnempRate: $input('employerUnempRate').value,
    employeeRate: $input('employeeRate').value,
    healthMonthly: $input('healthMonthly').value,
    mealMonthly: $input('mealMonthly').value,
    transportMonthly: $input('transportMonthly').value,
    annualBonus: $input('annualBonus').value,
    severanceRate: $input('severanceRate').value
  };
}

function calc(): void {
  readFields();
  try {
    const result = calculate({
      country: 'US',
      netSalary: String(fields.netSalary),
      payFrequency: fields.payFrequency,
      hoursPerWeek: String(fields.hoursPerWeek),
      employerSSRate: String(fields.employerSSRate),
      employerUnempRate: String(fields.employerUnempRate),
      employeeRate: String(fields.employeeRate),
      healthMonthly: String(fields.healthMonthly),
      mealMonthly: String(fields.mealMonthly),
      transportMonthly: String(fields.transportMonthly),
      annualBonus: String(fields.annualBonus),
      severanceRate: String(fields.severanceRate)
    });
    const multiplier = Number(result.costMultiplier);
    const hiddenPct = Number(result.hiddenCostPct);
    const overall: CalcData['overall'] =
      multiplier >= 2 ? 'CRITICAL' : multiplier >= 1.5 ? 'WARNING' : 'PASS';
    calcData = { result, fields: { ...fields }, overall, multiplier, hiddenPct };
    (window as any).calcData = calcData;
    $('liveResult').textContent = '$' + moneyFmt(result.trueMonthlyCost);
    $('liveSub').innerHTML =
      `<span>Multiplier ${result.costMultiplier}x</span><span>Hidden ${result.hiddenCostPct}%</span>`;
  } catch {
    calcData = null;
    (window as any).calcData = null;
    $('liveResult').textContent = 'ERR';
    $('liveSub').innerHTML = '<span>Check inputs</span>';
  }
}

function loadPreset(key: PresetKey): void {
  activePreset = key;
  fields = { ...US_DEFAULTS, ...presets[key] };
  renderShell();
  document.querySelectorAll('.sc-preset').forEach((b) => {
    const btn = b as HTMLElement;
    btn.classList.toggle('active', btn.dataset.preset === key);
  });
}

function riskAlert(d: CalcData): string {
  if (d.overall === 'CRITICAL') {
    return `<div class="sc-alert sc-alert-crit"><div class="sc-alert-title">Critical — True Cost Multiplier Extreme</div><div class="sc-alert-body">Cost multiplier <strong>${d.result.costMultiplier}x</strong> (>= 2.0). Hidden burden <strong>${d.result.hiddenCostPct}%</strong>. Review benefits and employer rates immediately.</div></div>`;
  }
  if (d.overall === 'WARNING') {
    return `<div class="sc-alert sc-alert-warn"><div class="sc-alert-title">Warning — Elevated Labor Burden</div><div class="sc-alert-body">Cost multiplier <strong>${d.result.costMultiplier}x</strong> (>= 1.5). Hidden cost <strong>${d.result.hiddenCostPct}%</strong> of net. Monitor closely.</div></div>`;
  }
  return `<div class="sc-alert sc-alert-pass"><div class="sc-alert-title">Pass — Labor Burden Within Norm</div><div class="sc-alert-body">Multiplier <strong>${d.result.costMultiplier}x</strong>. True monthly cost <strong>$${moneyFmt(d.result.trueMonthlyCost)}</strong>. Hidden <strong>${d.result.hiddenCostPct}%</strong>.</div></div>`;
}

function gaugeSvg(d: CalcData): string {
  const angle = Math.max(-90, Math.min(90, (d.multiplier / 3) * 90));
  const gCol = d.overall === 'PASS' ? '#52c41a' : d.overall === 'WARNING' ? '#faad14' : '#f5222d';
  return `<div class="sc-gauge-wrap"><svg width="300" height="170" viewBox="0 0 300 170">
    <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="#111720" stroke-width="24" stroke-linecap="round"/>
    <path d="M 40 150 A 110 110 0 0 1 95 55" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 205 55 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 125 32 A 110 110 0 0 1 175 32" fill="none" stroke="rgba(245,34,45,0.2)" stroke-width="24" stroke-linecap="round"/>
    <line x1="150" y1="150" x2="${150 + 95 * Math.cos((angle - 90) * Math.PI / 180)}" y2="${150 + 95 * Math.sin((angle - 90) * Math.PI / 180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="150" cy="150" r="7" fill="${gCol}"/>
    <text x="150" y="135" text-anchor="middle" fill="#f0f4f8" font-size="24" font-weight="700" font-family="JetBrains Mono">${d.result.costMultiplier}x</text>
    <text x="150" y="155" text-anchor="middle" fill="#4a5568" font-size="10">Multiplier (0-3)</text>
    <text x="30" y="168" fill="#4a5568" font-size="9">0</text>
    <text x="270" y="168" fill="#4a5568" font-size="9">3.0</text>
  </svg></div>`;
}

function generateReport(): void {
  if (!calcData) calc();
  if (!calcData) return;
  const d = calcData;
  const calcId = 'SC-010-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  window.calcId = calcId;
  (window as any).calcData = d;

  const cardsHTML = `
    <div class="sc-card-res"><div class="sc-card-res-label">True Monthly Cost</div><div class="sc-card-res-val">$${moneyFmt(d.result.trueMonthlyCost)}</div><div class="sc-card-res-sub">${d.result.currency} | annual $${moneyFmt(d.result.annualTrueCost)}</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Multiplier</div><div class="sc-card-res-val">${d.result.costMultiplier}x</div><div class="sc-card-res-sub">vs net salary</div><span class="sc-card-res-badge ${d.overall === 'PASS' ? 'sc-badge-pass' : d.overall === 'WARNING' ? 'sc-badge-warn' : 'sc-badge-crit'}">${d.overall}</span></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Hidden Cost</div><div class="sc-card-res-val">${d.result.hiddenCostPct}%</div><div class="sc-card-res-sub">above net</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Gross Monthly</div><div class="sc-card-res-val">$${moneyFmt(d.result.grossMonthly)}</div><div class="sc-card-res-sub">estimated gross-up</div></div>`;

  const paretoHTML = d.result.breakdown.map((row, i) =>
    `<div class="sc-pareto-row"><div class="sc-pareto-name">${row.item}</div><div class="sc-pareto-track"><div class="sc-pareto-fill" style="width:${row.pct}%;background:${PARETO_COLORS[i % PARETO_COLORS.length]}"><span>${row.pct}%</span></div></div><div class="sc-pareto-pct">$${moneyFmt(row.amount)}</div></div>`
  ).join('');

  const top = d.result.breakdown[0];
  const recHTML = d.overall !== 'PASS'
    ? `<div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Review largest cost driver${top ? ': ' + top.item : ''}</span></div><div class="sc-rec-body">${top ? `Contributes <strong>${top.pct}%</strong> ($${moneyFmt(top.amount)}).` : ''} Negotiate benefits or restructure employer rates.</div></div>
       <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Model hiring with true hourly cost</span></div><div class="sc-rec-body">Use <strong>$${moneyFmt(d.result.trueHourlyCost)}/h</strong> in quotes — not net salary alone.</div></div>`
    : `<div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Burden within expected range — maintain controls</span></div><div class="sc-rec-body">Multiplier ${d.result.costMultiplier}x. Revisit when benefits or tax rates change.</div></div>`;

  $('reportArea').innerHTML = `
    <div class="sc-report-hd">
      <div class="sc-report-hd-left">
        <div class="sc-report-title">SC-010 True Labor Cost Analysis</div>
        <div class="sc-report-meta">Calc ID: <span>${calcId}</span> | ${new Date().toISOString().slice(0, 19)} UTC<br>
        Country: US | Frequency: ${d.fields.payFrequency} | Hours: ${d.fields.hoursPerWeek}/wk<br>
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
    <div class="sc-sec"><div class="sc-sec-hd">Cost Multiplier Gauge</div><div class="sc-chart">${gaugeSvg(d)}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Cost Breakdown (Pareto)</div><div class="sc-chart">${paretoHTML || '<div class="sc-ref-text">No positive breakdown rows</div>'}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommended Actions</div>${recHTML}</div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards & References</div><div class="sc-std">
      <span>IFRS labor cost guidance</span> — Employer obligations beyond net pay<br>
      <span>Local labor law</span> — Social security, unemployment, severance accrual
    </div></div>
    <div class="sc-footer">Generated by SectorCalc.com — Deterministic Engineering Calculators — Client-Side Only — Your data never leaves your browser<br>
    Deterministic Engine | Reproducible | Client-Side | Audit-Ready</div>`;

  $('pdfBtn').addEventListener('click', exportPDF);
  $('pdfGraphicBtn').addEventListener('click', (e) => { void exportPDFGraphic(e); });
  $('shareBtn').addEventListener('click', shareReport);
}

function exportPDF(): void {
  const d = (window as any).calcData as CalcData | null | undefined;
  if (!d) { calc(); }
  const data = (window as any).calcData as CalcData | null | undefined;
  if (!data) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const calcId = window.calcId || 'SC-010';
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
  line('SC-010 True Labor Cost Analysis Report', 16, '#111111', true);
  line('Calc ID: ' + calcId + '   |   ' + new Date().toISOString().slice(0, 19) + ' UTC', 9, '#666666');
  line('Country: US | Client-Side Only', 9, '#1a7f37');
  y += 6;
  line('VERDICT: ' + data.overall + '    Multiplier ' + data.result.costMultiplier + 'x    Hidden ' + data.result.hiddenCostPct + '%', 13,
    data.overall === 'PASS' ? '#1a7f37' : data.overall === 'WARNING' ? '#b8860b' : '#c0392b', true);
  y += 8;
  line('KEY RESULTS', 11, '#111111', true);
  line('True monthly cost: $' + data.result.trueMonthlyCost, 10);
  line('True hourly cost: $' + data.result.trueHourlyCost, 10);
  line('Gross monthly: $' + data.result.grossMonthly, 10);
  line('Annual true cost: $' + data.result.annualTrueCost, 10);
  y += 8;
  line('BREAKDOWN', 11, '#111111', true);
  data.result.breakdown.forEach((r) => line(r.item + ': $' + r.amount + ' (' + r.pct + '%)', 9));
  y += 8;
  line('STANDARDS', 11, '#111111', true);
  line('IFRS labor cost guidance', 8, '#666666');
  line('Local labor law — social security, unemployment, severance', 8, '#666666');
  y += 8;
  line('Generated by SectorCalc.com - Deterministic Engineering Calculators - Audit-Ready', 8, '#999999');
  doc.save('SC-010-' + calcId + '.pdf');
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
      pdf.text('SectorCalc.com | Calc ID ' + (window.calcId || 'SC-010') + ' | Client-Side | Page ' + i + '/' + pages, 48, pageH - 16);
    }
    pdf.save('SC-010-' + (window.calcId || 'report') + '-graphic.pdf');
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
  void navigator.clipboard.writeText(location.origin + '/labor-pro.html?s=' + s).then(() => alert('Shareable URL copied'));
}

function bindEvents(): void {
  document.querySelectorAll('.sc-preset').forEach((b) => {
    b.addEventListener('click', () => {
      const key = (b as HTMLElement).dataset.preset as PresetKey | undefined;
      if (key && presets[key]) loadPreset(key);
    });
  });
  const ids = [
    'netSalary', 'hoursPerWeek', 'employerSSRate', 'employerUnempRate', 'employeeRate',
    'healthMonthly', 'mealMonthly', 'transportMonthly', 'annualBonus', 'severanceRate'
  ] as const;
  ids.forEach((id) => $input(id).addEventListener('input', calc));
  $select('payFrequency').addEventListener('change', calc);
  $('genReport').addEventListener('click', generateReport);
  $('resetAll').addEventListener('click', () => loadPreset('workshop'));
}

function applyShareQuery(): void {
  const q = new URLSearchParams(location.search).get('s');
  if (!q) return;
  try {
    const parsed = JSON.parse(decodeURIComponent(q)) as Partial<FieldState>;
    fields = { ...US_DEFAULTS, ...parsed };
  } catch {
    /* ignore bad share payload */
  }
}

applyShareQuery();
renderShell();
