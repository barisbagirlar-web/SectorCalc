import schema from './tools/SC-012-quote-pricing/v1.0.0/schema.json';
import { calculate } from './tools/SC-012-quote-pricing/v1.0.0/formula.js';
import { evaluateWarnings } from './tools/SC-012-quote-pricing/v1.0.0/warnings.js';
import type { QuoteInputs, QuoteResult } from './tools/SC-012-quote-pricing/v1.0.0/formula.js';
import type { FormSchema } from './components/sc-form-renderer.js';
import type { QuoteResultData } from './components/sc-quote-result.js';
import type { WarningData } from './components/sc-warning-panel.js';
import type { QuoteSensitivityValue } from './components/sc-quote-sensitivity.js';
import type { QuotePdfInput } from './lib/quote-pdf-builder.js';
import './components/sc-form-renderer.js';
import './components/sc-quote-result.js';
import './components/sc-warning-panel.js';
import './components/sc-chart.js';
import './components/sc-quote-sensitivity.js';
import './components/sc-quote-pdf.js';

type El<T> = HTMLElement & T;

const form = document.querySelector('sc-form-renderer') as El<{ schema: FormSchema }>;
const resultEl = document.querySelector('sc-quote-result') as El<{ result: QuoteResultData | null }>;
const warnEl = document.querySelector('sc-warning-panel') as El<{ warnings: WarningData[] }>;
const chartEl = document.querySelector('sc-chart') as El<{ breakdown: Array<{ item: string; pct: string }> }>;
const sensEl = document.querySelector('sc-quote-sensitivity') as El<QuoteSensitivityValue>;
const pdfEl = document.querySelector('sc-quote-pdf') as El<{ input: QuotePdfInput | null }>;

form.schema = schema as unknown as FormSchema;

const DEFAULT_BASE: QuoteInputs = {
  materialCost: 1000, scrapRate: 0.1, laborHours: 5, laborHourlyCost: 40,
  machineHours: 3, machineHourlyCost: 60, targetMargin: 0.2, quantity: 10
};

function renderFromInputs(inputs: QuoteInputs) {
  try {
    const r: QuoteResult = calculate(inputs);
    const w = evaluateWarnings(inputs, r);
    resultEl.result = r as unknown as QuoteResultData;
    warnEl.warnings = w as unknown as WarningData[];
    chartEl.breakdown = r.breakdown;
    pdfEl.input = {
      toolCode: 'SC-012',
      sellPrice: r.sellPrice,
      unitPrice: r.unitPrice,
      totalCost: r.totalCost,
      profit: r.profit,
      currency: r.currency,
      breakdown: r.breakdown,
      warnings: w.map((x) => ({ severity: x.severity, message: x.message })),
      steps: r.steps
    };
  } catch (err) {
    warnEl.warnings = [{ code: 'CALC_ERROR', severity: 'CRITICAL', message: (err as Error).message, action: 'Check inputs and try again.' }];
  }
}

form.addEventListener('sc-submit', (e) => {
  const inputs = (e as CustomEvent).detail as QuoteInputs;
  (form as unknown as { _last?: QuoteInputs })._last = inputs;
  if (typeof inputs.materialCost === 'number') sensEl.materialCost = inputs.materialCost;
  if (typeof inputs.scrapRate === 'number') sensEl.scrapRate = inputs.scrapRate;
  if (typeof inputs.targetMargin === 'number') sensEl.targetMargin = inputs.targetMargin;
  renderFromInputs(inputs);
});

sensEl.addEventListener('sc-quote-sensitivity', (e) => {
  const s = (e as CustomEvent).detail as QuoteSensitivityValue;
  const base = (form as unknown as { _last?: QuoteInputs })._last ?? DEFAULT_BASE;
  renderFromInputs({ ...base, materialCost: s.materialCost, scrapRate: s.scrapRate, targetMargin: s.targetMargin });
});
