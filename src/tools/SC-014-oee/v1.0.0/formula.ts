/**
 * SC-014 OEE Calculator — built ON the universal engine.
 * Version 1.0.0. Deterministic, Decimal-only, pure.
 * OEE = availability * performance * quality. No clamping: rates above 100%
 * surface as warnings (hiding bad data would be an illusion). Degenerate
 * cases (runTime 0, totalCount 0) yield 0 without divide-by-zero.
 * calculateSeries exercises stats.mean — first real tool use of the stats module.
 */
import { D, Decimal } from '../../../core/engine.js';
import { CalcError, requirePositive, requireNonNegative } from '../../../core/guards.js';
import { roundHalfUp } from '../../../core/rounding.js';
import { mean } from '../../../core/stats.js';

function pct1(d: Decimal): string { return roundHalfUp(d, 1).toFixed(1); }

export interface OeeInputs {
  plannedProductionTime: Decimal.Value;
  runTime: Decimal.Value;
  idealCycleTime: Decimal.Value;
  totalCount: Decimal.Value;
  goodCount: Decimal.Value;
}

export interface Step { step: number; description: string; formula: string; result: string; }
export interface OeeResult {
  oeePct: string;
  availabilityPct: string;
  performancePct: string;
  qualityPct: string;
  steps: Step[];
}

export interface OeeSeriesResult { meanOeePct: string; count: number; }

export function calculate(inputs: OeeInputs): OeeResult {
  const steps: Step[] = [];
  let n = 0;

  const planned = requirePositive(inputs.plannedProductionTime, 'plannedProductionTime');
  const run = requireNonNegative(inputs.runTime, 'runTime');
  const ideal = requireNonNegative(inputs.idealCycleTime, 'idealCycleTime');
  const total = requireNonNegative(inputs.totalCount, 'totalCount');
  const good = requireNonNegative(inputs.goodCount, 'goodCount');

  // 1. availability (planned > 0 guaranteed)
  const availability = run.div(planned);
  steps.push({ step: ++n, description: 'Availability', formula: 'runTime / plannedProductionTime', result: pct1(availability.times(100)) });

  // 2. performance (runTime 0 -> 0, no divide-by-zero)
  const performance = run.gt(0) ? ideal.times(total).div(run) : D(0);
  steps.push({ step: ++n, description: 'Performance', formula: '(idealCycleTime * totalCount) / runTime', result: pct1(performance.times(100)) });

  // 3. quality (totalCount 0 -> 0, no divide-by-zero)
  const quality = total.gt(0) ? good.div(total) : D(0);
  steps.push({ step: ++n, description: 'Quality', formula: 'goodCount / totalCount', result: pct1(quality.times(100)) });

  // 4. OEE
  const oee = availability.times(performance).times(quality);
  steps.push({ step: ++n, description: 'OEE', formula: 'availability * performance * quality', result: pct1(oee.times(100)) });

  return {
    oeePct: pct1(oee.times(100)),
    availabilityPct: pct1(availability.times(100)),
    performancePct: pct1(performance.times(100)),
    qualityPct: pct1(quality.times(100)),
    steps
  };
}

/** Mean OEE over a series of records (stats.mean — first real tool use). */
export function calculateSeries(records: OeeInputs[]): OeeSeriesResult {
  if (records.length === 0) throw new CalcError('E_INVALID_INPUT', 'calculateSeries needs >= 1 record');
  const oees = records.map((r) => D(calculate(r).oeePct));
  return { meanOeePct: pct1(mean(oees)), count: records.length };
}
