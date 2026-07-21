import schema from './tools/SC-001-weld-thickness/v1.0.0/schema.json';
import { calculate } from './tools/SC-001-weld-thickness/v1.0.0/formula.js';
import { evaluateWarnings } from './tools/SC-001-weld-thickness/v1.0.0/warnings.js';
import type { WeldInputs, WeldResult } from './tools/SC-001-weld-thickness/v1.0.0/formula.js';
import type { FormSchema } from './components/sc-form-renderer.js';
import type { WeldResultData } from './components/sc-weld-result.js';
import type { WarningData } from './components/sc-warning-panel.js';
import type { WeldSensitivityValue } from './components/sc-weld-sensitivity.js';
import type { WeldPdfInput } from './lib/weld-pdf-builder.js';
import { buildToolReport } from './lib/tool-report.js';
import type { ToolReport } from './lib/tool-report.js';
import './components/sc-form-renderer.js';
import './components/sc-weld-result.js';
import './components/sc-warning-panel.js';
import './components/sc-weld-sensitivity.js';
import './components/sc-report-panel.js';
import './components/sc-weld-pdf.js';

type El<T> = HTMLElement & T;

const form = document.querySelector('sc-form-renderer') as El<{ schema: FormSchema }>;
const resultEl = document.querySelector('sc-weld-result') as El<{ result: WeldResultData | null }>;
const warnEl = document.querySelector('sc-warning-panel') as El<{ warnings: WarningData[] }>;
const sensEl = document.querySelector('sc-weld-sensitivity') as El<WeldSensitivityValue>;
const reportEl = document.querySelector('#report') as El<{ report: ToolReport | null }>;
const pdfEl = document.querySelector('sc-weld-pdf') as El<{ input: WeldPdfInput | null }>;

form.schema = schema as unknown as FormSchema;

const DEFAULT_BASE: WeldInputs = {
  designLoadN: 50000, weldLengthMm: 200, weldStrengthMpa: 480, safetyFactor: 2, materialThicknessMm: 10
};

function renderFromInputs(inputs: WeldInputs) {
  try {
    const r: WeldResult = calculate(inputs);
    const w = evaluateWarnings(inputs, r);
    resultEl.result = r as unknown as WeldResultData;
    warnEl.warnings = w as unknown as WarningData[];
    if (reportEl) {
      reportEl.report = buildToolReport({
        metricName: 'Weld utilization', metricValue: String(r.utilization), gaugeMax: 1.5, direction: 'low',
        warn: '0.9', crit: '1.0',
        insights: ['Utilization above 1.0 means the weld is undersized for the load.', 'Increase weld length or leg size to reduce utilization.'],
        standards: ['AWS D1.1 — structural welding', 'EN ISO 2553 — weld representation']
      });
    }
    pdfEl.input = {
      toolCode: 'SC-001',
      finalLegMm: r.finalLegMm, finalLegIn: r.finalLegIn, utilization: r.utilization,
      jointType: r.jointType, requiredThroatMm: r.requiredThroatMm, minLegMm: r.minLegMm,
      warnings: w.map((x) => ({ severity: x.severity, message: x.message })),
      steps: r.steps
    };
  } catch (err) {
    warnEl.warnings = [{ code: 'CALC_ERROR', severity: 'CRITICAL', message: (err as Error).message, action: 'Check inputs and try again.' }];
  }
}

form.addEventListener('sc-submit', (e) => {
  const inputs = (e as CustomEvent).detail as WeldInputs;
  (form as unknown as { _last?: WeldInputs })._last = inputs;
  if (typeof inputs.designLoadN === 'number') sensEl.designLoadN = inputs.designLoadN;
  if (typeof inputs.materialThicknessMm === 'number') sensEl.materialThicknessMm = inputs.materialThicknessMm;
  if (typeof inputs.safetyFactor === 'number') sensEl.safetyFactor = inputs.safetyFactor;
  renderFromInputs(inputs);
});

sensEl.addEventListener('sc-weld-sensitivity', (e) => {
  const s = (e as CustomEvent).detail as WeldSensitivityValue;
  const base = (form as unknown as { _last?: WeldInputs })._last ?? DEFAULT_BASE;
  renderFromInputs({ ...base, designLoadN: s.designLoadN, materialThicknessMm: s.materialThicknessMm, safetyFactor: s.safetyFactor });
});
