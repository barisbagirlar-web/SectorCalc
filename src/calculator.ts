import schema from './tools/SC-010-labor-cost/v1.0.0/schema.json';
import { LatestCalculation, engineErrorMessage } from './engine-api/client.js';
import type { LaborCostInput, LaborCostResult } from './engine-api/types.js';
import type { FormSchema } from './components/sc-form-renderer.js';
import type { ResultData } from './components/sc-result-card.js';
import type { WarningData } from './components/sc-warning-panel.js';
import type { SensitivityValue } from './components/sc-sensitivity.js';
import type { PdfInput } from './lib/pdf-builder.js';
import { buildToolReport } from './lib/tool-report.js';
import type { ToolReport } from './lib/tool-report.js';
import './components/sc-form-renderer.js';
import './components/sc-result-card.js';
import './components/sc-warning-panel.js';
import './components/sc-chart.js';
import './components/sc-sensitivity.js';
import './components/sc-report-panel.js';
import './components/sc-pdf-button.js';

type El<T> = HTMLElement & T;

const form = document.querySelector('sc-form-renderer') as El<{ schema: FormSchema }>;
const resultEl = document.querySelector('sc-result-card') as El<{ result: ResultData | null }>;
const warnEl = document.querySelector('sc-warning-panel') as El<{ warnings: WarningData[] }>;
const chartEl = document.querySelector('sc-chart') as El<{
  breakdown: Array<{ item: string; pct: string }>;
}>;
const sensEl = document.querySelector('sc-sensitivity') as El<SensitivityValue>;
const reportEl = document.querySelector('#report') as El<{ report: ToolReport | null }>;
const pdfEl = document.querySelector('sc-pdf-button') as El<{ input: PdfInput | null }>;

form.schema = schema as unknown as FormSchema;
const requests = new LatestCalculation();

function setLoading(loading: boolean): void {
  form.toggleAttribute('aria-busy', loading);
  form.style.pointerEvents = loading ? 'none' : '';
}

async function renderFromInputs(inputs: LaborCostInput) {
  setLoading(true);
  try {
    const response = await requests.run('SC-010', inputs);
    if (!response) return;
    const r: LaborCostResult = response.result;
    const w = r.warnings;
    resultEl.result = r as unknown as ResultData;
    warnEl.warnings = w as unknown as WarningData[];
    chartEl.breakdown = r.breakdown;
    if (reportEl) {
      reportEl.report = buildToolReport({
        metricName: 'Cost multiplier',
        metricValue: String(r.costMultiplier),
        gaugeMax: 3,
        direction: 'low',
        warn: '1.5',
        crit: '2.0',
        insights: [
          'True cost includes employer taxes, benefits and severance — not just net salary.',
          'Compare this multiplier against your budgeted labor cost.'
        ],
        standards: [
          'IFRS — labor cost recognition',
          'Local labor law — statutory employer contributions'
        ]
      });
    }
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
    warnEl.warnings = [
      {
        code: 'CALC_ERROR',
        severity: 'CRITICAL',
        message: engineErrorMessage(err),
        action: 'Check your session and inputs, then try again.'
      }
    ];
  } finally {
    setLoading(false);
  }
}

form.addEventListener('sc-submit', (e) => {
  const inputs = (e as CustomEvent).detail as LaborCostInput;
  // sync sensitivity sliders to the submitted base values
  if (typeof inputs.netSalary === 'number') sensEl.netSalary = inputs.netSalary;
  void renderFromInputs(inputs);
});

sensEl.addEventListener('sc-sensitivity', (e) => {
  const s = (e as CustomEvent).detail as SensitivityValue;
  // re-price using current country/frequency from the last submit if present;
  // fall back to US/monthly so the sliders always produce a live result.
  const base = (form as unknown as { _last?: LaborCostInput })._last ?? {
    country: 'US',
    payFrequency: 'monthly' as const,
    netSalary: 0
  };
  void renderFromInputs({
    ...base,
    netSalary: s.netSalary,
    employerSSRate: s.employerSSRate,
    overtimeHoursMonthly: s.overtimeHoursMonthly
  });
});

// remember last submitted base for sensitivity re-pricing
form.addEventListener('sc-submit', (e) => {
  (form as unknown as { _last?: LaborCostInput })._last = (e as CustomEvent)
    .detail as LaborCostInput;
});
