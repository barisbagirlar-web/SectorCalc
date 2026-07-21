import schema from './tools/SC-010-labor-cost/v1.0.0/schema.json';
import { calculate } from './tools/SC-010-labor-cost/v1.0.0/formula.js';
import { evaluateWarnings } from './tools/SC-010-labor-cost/v1.0.0/warnings.js';
import type { LaborCostInputs } from './tools/SC-010-labor-cost/v1.0.0/formula.js';
import type { FormSchema } from './components/sc-form-renderer.js';
import type { ResultData } from './components/sc-result-card.js';
import type { WarningData } from './components/sc-warning-panel.js';
import './components/sc-form-renderer.js';
import './components/sc-result-card.js';
import './components/sc-warning-panel.js';

const form = document.querySelector('sc-form-renderer') as (HTMLElement & { schema: FormSchema });
const result = document.querySelector('sc-result-card') as (HTMLElement & { result: ResultData | null });
const warnings = document.querySelector('sc-warning-panel') as (HTMLElement & { warnings: WarningData[] });

form.schema = schema as unknown as FormSchema;

form.addEventListener('sc-submit', (e) => {
  const inputs = (e as CustomEvent).detail as LaborCostInputs;
  try {
    const r = calculate(inputs);
    result.result = r as unknown as ResultData;
    warnings.warnings = evaluateWarnings(inputs, r) as unknown as WarningData[];
  } catch (err) {
    warnings.warnings = [{ code: 'CALC_ERROR', severity: 'CRITICAL', message: (err as Error).message, action: 'Check inputs and try again.' }];
  }
});
