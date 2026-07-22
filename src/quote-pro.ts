import { calculate } from './tools/SC-012-quote-pricing/v1.0.0/formula.js';
import type { QuoteResult } from './tools/SC-012-quote-pricing/v1.0.0/formula.js';

type PresetKey = 'jobshop' | 'production';

interface FieldState {
  materialCost: string;
  scrapRate: string;
  laborHours: string;
  laborHourlyCost: string;
  machineHours: string;
  machineHourlyCost: string;
  setupCost: string;
  overheadRate: string;
  financingRate: string;
  targetMargin: string;
  quantity: string;
}

interface CalcData {
  result: QuoteResult;
  fields: FieldState;
  overall: 'PASS' | 'WARNING' | 'CRITICAL';
  profitRatio: number;
  marginRatio: number;
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
  materialCost: '1000',
  scrapRate: '0.1',
  laborHours: '5',
  laborHourlyCost: '40',
  machineHours: '3',
  machineHourlyCost: '60',
  setupCost: '0',
  overheadRate: '0.2',
  financingRate: '0.01',
  targetMargin: '0.2',
  quantity: '1'
};

const presets: Record<PresetKey, Partial<FieldState>> = {
  jobshop: {
    materialCost: '1000',
    targetMargin: '0.2',
    quantity: '1',
    laborHours: '5',
    laborHourlyCost: '40',
    machineHours: '3',
    machineHourlyCost: '60'
  },
  production: {
    materialCost: '5000',
    quantity: '100',
    targetMargin: '0.15'
  }
};

const PARETO_COLORS = ['#f5222d', '#faad14', '#5b8def', '#a855f7', '#4ecdc4', '#52c41a', '#6e7d8c', '#4a7de4', '#fa8c16'];

let fields: FieldState = { ...DEFAULTS, ...presets.jobshop };
let calcData: CalcData | null = null;
let activePreset: PresetKey = 'jobshop';

function $(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing #${id}`);
  return el;
}

function $input(id: string): HTMLInputElement {
  return $(id) as HTMLInputElement;
}

function moneyFmt(s: string): string {
  const n = Number(s);
  if (!Number.isFinite(n)) return s;
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pctLabel(ratioStr: string): string {
  const n = Number(ratioStr);
  if (!Number.isFinite(n)) return ratioStr;
  return (n * 100).toFixed(1) + '%';
}

function fieldHtml(id: string, label: string, tip: string, inputInner: string, unit: string, refHtml = ''): string {
  return `
    <div class="sc-field" id="fld-${id}">
      <div class="sc-field-label">${label}
        <span class="sc-info">i<span class="sc-tooltip"><strong>${label}</strong>${tip}</span></span>
      </div>
      <div class="sc-input-wrap">
        ${inputInner}
        <select class="sc-unit" disabled><option>${unit}</option></select>
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
          <div class="sc-header-title">SC-012 — Quote Pricing</div>
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
            <button class="sc-preset ${activePreset === 'jobshop' ? 'active' : ''}" data-preset="jobshop" type="button">Job shop</button>
            <button class="sc-preset ${activePreset === 'production' ? 'active' : ''}" data-preset="production" type="button">Production run</button>
          </div>
          ${fieldHtml('materialCost', 'Material Cost', 'Raw material cost for the job.',
            `<input type="number" class="sc-input" id="materialCost" value="${fields.materialCost}" step="0.01" min="0">`, 'USD')}
          ${fieldHtml('scrapRate', 'Scrap Rate', 'Expected scrap fraction (0.1 = 10%). Must be &lt; 1.',
            `<input type="number" class="sc-input" id="scrapRate" value="${fields.scrapRate}" step="0.01" min="0" max="0.99">`, 'ratio')}
          ${fieldHtml('laborHours', 'Labor Hours', 'Direct labor hours.',
            `<input type="number" class="sc-input" id="laborHours" value="${fields.laborHours}" step="0.1" min="0">`, 'h')}
          ${fieldHtml('laborHourlyCost', 'Labor Hourly Cost', 'Fully burdened labor cost per hour.',
            `<input type="number" class="sc-input" id="laborHourlyCost" value="${fields.laborHourlyCost}" step="0.01" min="0">`, 'USD/h')}
          ${fieldHtml('machineHours', 'Machine Hours', 'Machine hours for the job.',
            `<input type="number" class="sc-input" id="machineHours" value="${fields.machineHours}" step="0.1" min="0">`, 'h')}
          ${fieldHtml('machineHourlyCost', 'Machine Hourly Cost', 'Machine burden rate per hour.',
            `<input type="number" class="sc-input" id="machineHourlyCost" value="${fields.machineHourlyCost}" step="0.01" min="0">`, 'USD/h')}
          ${fieldHtml('setupCost', 'Setup Cost', 'Mapped to setupMinutes=60 and setupHourlyCost=setupCost (setup dollars = setupCost).',
            `<input type="number" class="sc-input" id="setupCost" value="${fields.setupCost}" step="0.01" min="0">`, 'USD')}
          ${fieldHtml('overheadRate', 'Overhead Rate', 'Overhead applied to direct cost (ratio).',
            `<input type="number" class="sc-input" id="overheadRate" value="${fields.overheadRate}" step="0.01" min="0">`, 'ratio')}
          ${fieldHtml('financingRate', 'Financing Rate', 'Mapped to monthlyInterestRate. paymentDays default 30.',
            `<input type="number" class="sc-input" id="financingRate" value="${fields.financingRate}" step="0.001" min="0">`, 'ratio/mo')}
          ${fieldHtml('targetMargin', 'Target Margin', 'Target profit margin on sell price (must be &lt; 1).',
            `<input type="number" class="sc-input" id="targetMargin" value="${fields.targetMargin}" step="0.01" min="0" max="0.99">`, 'ratio')}
          ${fieldHtml('quantity', 'Quantity', 'Lot quantity.',
            `<input type="number" class="sc-input" id="quantity" value="${fields.quantity}" step="1" min="1">`, 'pcs')}
          <div class="sc-live">
            <div class="sc-live-hd"><span class="sc-live-dot"></span>Live Result — Sell Price</div>
            <div class="sc-live-val" id="liveResult">—</div>
            <div class="sc-live-sub" id="liveSub"><span>Unit —</span><span>Margin —</span></div>
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
    materialCost: $input('materialCost').value,
    scrapRate: $input('scrapRate').value,
    laborHours: $input('laborHours').value,
    laborHourlyCost: $input('laborHourlyCost').value,
    machineHours: $input('machineHours').value,
    machineHourlyCost: $input('machineHourlyCost').value,
    setupCost: $input('setupCost').value,
    overheadRate: $input('overheadRate').value,
    financingRate: $input('financingRate').value,
    targetMargin: $input('targetMargin').value,
    quantity: $input('quantity').value
  };
}

function calc(): void {
  readFields();
  try {
    const result = calculate({
      materialCost: String(fields.materialCost),
      scrapRate: String(fields.scrapRate),
      laborHours: String(fields.laborHours),
      laborHourlyCost: String(fields.laborHourlyCost),
      machineHours: String(fields.machineHours),
      machineHourlyCost: String(fields.machineHourlyCost),
      setupMinutes: '60',
      setupHourlyCost: String(fields.setupCost),
      overheadRate: String(fields.overheadRate),
      paymentDays: '30',
      monthlyInterestRate: String(fields.financingRate),
      targetMargin: String(fields.targetMargin),
      quantity: String(fields.quantity)
    });
    const profit = Number(result.profit);
    const totalCost = Number(result.totalCost);
    const sellPrice = Number(result.sellPrice);
    const profitRatio = totalCost > 0 ? profit / totalCost : 0;
    const marginRatio = totalCost > 0 ? Math.min(sellPrice / totalCost, 3) : 0;
    let overall: CalcData['overall'] = 'PASS';
    if (profit <= 0) overall = 'CRITICAL';
    else if (profitRatio < 0.1) overall = 'WARNING';
    calcData = { result, fields: { ...fields }, overall, profitRatio, marginRatio };
    (window as any).calcData = calcData;
    $('liveResult').textContent = '$' + moneyFmt(result.sellPrice);
    $('liveSub').innerHTML =
      `<span>Unit $${moneyFmt(result.unitPrice)}</span><span>Margin ${pctLabel(fields.targetMargin)}</span>`;
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
    return `<div class="sc-alert sc-alert-crit"><div class="sc-alert-title">Critical — Quote Not Profitable</div><div class="sc-alert-body">Profit <strong>$${moneyFmt(d.result.profit)}</strong> is &lt;= 0. Sell price <strong>$${moneyFmt(d.result.sellPrice)}</strong> vs total cost <strong>$${moneyFmt(d.result.totalCost)}</strong>.</div></div>`;
  }
  if (d.overall === 'WARNING') {
    return `<div class="sc-alert sc-alert-warn"><div class="sc-alert-title">Warning — Thin Margin</div><div class="sc-alert-body">Profit / total cost = <strong>${(d.profitRatio * 100).toFixed(1)}%</strong> (&lt; 10%). Monitor scrap, overhead, and financing.</div></div>`;
  }
  return `<div class="sc-alert sc-alert-pass"><div class="sc-alert-title">Pass — Quote Meets Margin Target</div><div class="sc-alert-body">Sell <strong>$${moneyFmt(d.result.sellPrice)}</strong>, profit <strong>$${moneyFmt(d.result.profit)}</strong> (${(d.profitRatio * 100).toFixed(1)}% of cost).</div></div>`;
}

function gaugeSvg(d: CalcData): string {
  const capped = Math.min(d.marginRatio, 3);
  const angle = Math.max(-90, Math.min(90, (capped / 3) * 90));
  const gCol = d.overall === 'PASS' ? '#52c41a' : d.overall === 'WARNING' ? '#faad14' : '#f5222d';
  return `<div class="sc-gauge-wrap"><svg width="300" height="170" viewBox="0 0 300 170">
    <path d="M 40 150 A 110 110 0 0 1 260 150" fill="none" stroke="#111720" stroke-width="24" stroke-linecap="round"/>
    <path d="M 40 150 A 110 110 0 0 1 95 55" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 205 55 A 110 110 0 0 1 260 150" fill="none" stroke="rgba(82,196,26,0.2)" stroke-width="24" stroke-linecap="round"/>
    <path d="M 125 32 A 110 110 0 0 1 175 32" fill="none" stroke="rgba(245,34,45,0.2)" stroke-width="24" stroke-linecap="round"/>
    <line x1="150" y1="150" x2="${150 + 95 * Math.cos((angle - 90) * Math.PI / 180)}" y2="${150 + 95 * Math.sin((angle - 90) * Math.PI / 180)}" stroke="${gCol}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="150" cy="150" r="7" fill="${gCol}"/>
    <text x="150" y="135" text-anchor="middle" fill="#f0f4f8" font-size="22" font-weight="700" font-family="JetBrains Mono">${d.marginRatio.toFixed(2)}x</text>
    <text x="150" y="155" text-anchor="middle" fill="#4a5568" font-size="10">Sell / Total Cost</text>
    <text x="30" y="168" fill="#4a5568" font-size="9">0</text>
    <text x="270" y="168" fill="#4a5568" font-size="9">3.0</text>
  </svg></div>`;
}

function generateReport(): void {
  if (!calcData) calc();
  if (!calcData) return;
  const d = calcData;
  const calcId = 'SC-012-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  window.calcId = calcId;
  (window as any).calcData = d;

  const cardsHTML = `
    <div class="sc-card-res"><div class="sc-card-res-label">Sell Price</div><div class="sc-card-res-val">$${moneyFmt(d.result.sellPrice)}</div><div class="sc-card-res-sub">${d.result.currency}</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Unit Price</div><div class="sc-card-res-val">$${moneyFmt(d.result.unitPrice)}</div><div class="sc-card-res-sub">qty ${d.fields.quantity}</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Total Cost</div><div class="sc-card-res-val">$${moneyFmt(d.result.totalCost)}</div><div class="sc-card-res-sub">incl. finance $${moneyFmt(d.result.financeCharge)}</div></div>
    <div class="sc-card-res"><div class="sc-card-res-label">Profit</div><div class="sc-card-res-val">$${moneyFmt(d.result.profit)}</div><span class="sc-card-res-badge ${d.overall === 'PASS' ? 'sc-badge-pass' : d.overall === 'WARNING' ? 'sc-badge-warn' : 'sc-badge-crit'}">${d.overall}</span></div>`;

  const paretoHTML = d.result.breakdown.map((row, i) =>
    `<div class="sc-pareto-row"><div class="sc-pareto-name">${row.item}</div><div class="sc-pareto-track"><div class="sc-pareto-fill" style="width:${row.pct}%;background:${PARETO_COLORS[i % PARETO_COLORS.length]}"><span>${row.pct}%</span></div></div><div class="sc-pareto-pct">$${moneyFmt(row.amount)}</div></div>`
  ).join('');

  const top = d.result.breakdown[0];
  const recHTML = d.overall !== 'PASS'
    ? `<div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Raise margin or cut ${top ? top.item : 'largest cost'}</span></div><div class="sc-rec-body">${top ? `${top.item} is <strong>${top.pct}%</strong> of cost.` : ''} Target margin ${pctLabel(d.fields.targetMargin)}.</div></div>
       <div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">2</span><span class="sc-rec-title">Recheck scrap and payment terms</span></div><div class="sc-rec-body">Scrap ${pctLabel(d.fields.scrapRate)}, financing ${pctLabel(d.fields.financingRate)}/mo at 30 days.</div></div>`
    : `<div class="sc-rec"><div class="sc-rec-hd"><span class="sc-rec-num">1</span><span class="sc-rec-title">Quote structurally sound — lock assumptions</span></div><div class="sc-rec-body">Document scrap, rates, and margin for audit trail (Calc ID ${calcId}).</div></div>`;

  $('reportArea').innerHTML = `
    <div class="sc-report-hd">
      <div class="sc-report-hd-left">
        <div class="sc-report-title">SC-012 Quote Pricing Analysis</div>
        <div class="sc-report-meta">Calc ID: <span>${calcId}</span> | ${new Date().toISOString().slice(0, 19)} UTC<br>
        Target margin: ${pctLabel(d.fields.targetMargin)} | Qty: ${d.fields.quantity} | Setup mapped 60 min @ $${d.fields.setupCost}/h<br>
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
    <div class="sc-sec"><div class="sc-sec-hd">Price / Cost Gauge</div><div class="sc-chart">${gaugeSvg(d)}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Cost Breakdown (Pareto)</div><div class="sc-chart">${paretoHTML || '<div class="sc-ref-text">No positive breakdown rows</div>'}</div></div>
    <div class="sc-sec"><div class="sc-sec-hd">Recommended Actions</div>${recHTML}</div>
    <div class="sc-sec"><div class="sc-sec-hd">Standards & References</div><div class="sc-std">
      <span>GAAP</span> — Revenue and cost recognition principles for quotes<br>
      <span>Cost accounting</span> — Direct, overhead, and financing allocation
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
  const calcId = window.calcId || 'SC-012';
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
  line('SC-012 Quote Pricing Analysis Report', 16, '#111111', true);
  line('Calc ID: ' + calcId + '   |   ' + new Date().toISOString().slice(0, 19) + ' UTC', 9, '#666666');
  line('Client-Side Only - your data never left your browser', 9, '#1a7f37');
  y += 6;
  line('VERDICT: ' + d.overall + '    Sell $' + d.result.sellPrice + '    Profit $' + d.result.profit, 13,
    d.overall === 'PASS' ? '#1a7f37' : d.overall === 'WARNING' ? '#b8860b' : '#c0392b', true);
  y += 8;
  line('KEY RESULTS', 11, '#111111', true);
  line('Sell price: $' + d.result.sellPrice, 10);
  line('Unit price: $' + d.result.unitPrice, 10);
  line('Total cost: $' + d.result.totalCost, 10);
  line('Profit: $' + d.result.profit, 10);
  y += 8;
  line('BREAKDOWN', 11, '#111111', true);
  d.result.breakdown.forEach((r) => line(r.item + ': $' + r.amount + ' (' + r.pct + '%)', 9));
  y += 8;
  line('STANDARDS', 11, '#111111', true);
  line('GAAP — revenue and cost recognition', 8, '#666666');
  line('Cost accounting — direct, overhead, financing', 8, '#666666');
  y += 8;
  line('Generated by SectorCalc.com - Deterministic Engineering Calculators - Audit-Ready', 8, '#999999');
  doc.save('SC-012-' + calcId + '.pdf');
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
      pdf.text('SectorCalc.com | Calc ID ' + (window.calcId || 'SC-012') + ' | Client-Side | Page ' + i + '/' + pages, 48, pageH - 16);
    }
    pdf.save('SC-012-' + (window.calcId || 'report') + '-graphic.pdf');
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
  void navigator.clipboard.writeText(location.origin + '/quote-pro.html?s=' + s).then(() => alert('Shareable URL copied'));
}

function bindEvents(): void {
  document.querySelectorAll('.sc-preset').forEach((b) => {
    b.addEventListener('click', () => {
      const key = (b as HTMLElement).dataset.preset as PresetKey | undefined;
      if (key && presets[key]) loadPreset(key);
    });
  });
  ([
    'materialCost', 'scrapRate', 'laborHours', 'laborHourlyCost', 'machineHours',
    'machineHourlyCost', 'setupCost', 'overheadRate', 'financingRate', 'targetMargin', 'quantity'
  ] as const).forEach((id) => $input(id).addEventListener('input', calc));
  $('genReport').addEventListener('click', generateReport);
  $('resetAll').addEventListener('click', () => loadPreset('jobshop'));
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
