import schema from './tools/SC-010-labor-cost/v1.0.0/schema.json';
import { calculate } from './tools/SC-010-labor-cost/v1.0.0/formula.js';
import { evaluateWarnings } from './tools/SC-010-labor-cost/v1.0.0/warnings.js';
import type { LaborCostInputs, LaborCostResult } from './tools/SC-010-labor-cost/v1.0.0/formula.js';
import type { FormSchema } from './components/sc-form-renderer.js';
import type { ResultData } from './components/sc-result-card.js';
import type { WarningData } from './components/sc-warning-panel.js';
import type { SensitivityValue } from './components/sc-sensitivity.js';
import type { PdfInput } from './lib/pdf-builder.js';
import './components/sc-form-renderer.js';
import './components/sc-result-card.js';
import './components/sc-warning-panel.js';
import './components/sc-chart.js';
import './components/sc-sensitivity.js';
import './components/sc-pdf-button.js';

type El<T> = HTMLElement & T;

const form = document.querySelector('sc-form-renderer') as El<{ schema: FormSchema }>;
const resultEl = document.querySelector('sc-result-card') as El<{ result: ResultData | null }>;
const warnEl = document.querySelector('sc-warning-panel') as El<{ warnings: WarningData[] }>;
const chartEl = document.querySelector('sc-chart') as El<{ breakdown: Array<{ item: string; pct: string }> }>;
const sensEl = document.querySelector('sc-sensitivity') as El<SensitivityValue>;
const pdfEl = document.querySelector('sc-pdf-button') as El<{ input: PdfInput | null }>;

form.schema = schema as unknown as FormSchema;

function renderFromInputs(inputs: LaborCostInputs) {
  try {
    const r: LaborCostResult = calculate(inputs);
    const w = evaluateWarnings(inputs, r);
    resultEl.result = r as unknown as ResultData;
    warnEl.warnings = w as unknown as WarningData[];
    chartEl.breakdown = r.breakdown;
    pdfEl.input = {
      toolCode: 'SC-010',
      trueMonthlyCost: r.trueMonthlyCost,
      currency: r.currency,
      costMultiplier: r.costMultiplier,
      hiddenCostPct: r.hiddenCostPct,
      breakdown: r.breakdown,
      warnings: w.map((x) => ({ severity: x.severity, message: x.message })),
      steps: r.steps
    };
  } catch (err) {
    warnEl.warnings = [{ code: 'CALC_ERROR', severity: 'CRITICAL', message: (err as Error).message, action: 'Check inputs and try again.' }];
  }
}

form.addEventListener('sc-submit', (e) => {
  const inputs = (e as CustomEvent).detail as LaborCostInputs;
  // sync sensitivity sliders to the submitted base values
  if (typeof inputs.netSalary === 'number') sensEl.netSalary = inputs.netSalary;
  renderFromInputs(inputs);
});

sensEl.addEventListener('sc-sensitivity', (e) => {
  const s = (e as CustomEvent).detail as SensitivityValue;
  // re-price using current country/frequency from the last submit if present;
  // fall back to US/monthly so the sliders always produce a live result.
  const base = (form as unknown as { _last?: LaborCostInputs })._last ?? { country: 'US', payFrequency: 'monthly' as const };
  renderFromInputs({ ...base, netSalary: s.netSalary, employerSSRate: s.employerSSRate, overtimeHoursMonthly: s.overtimeHoursMonthly });
});

// remember last submitted base for sensitivity re-pricing
form.addEventListener('sc-submit', (e) => {
  (form as unknown as { _last?: LaborCostInputs })._last = (e as CustomEvent).detail as LaborCostInputs;
});
