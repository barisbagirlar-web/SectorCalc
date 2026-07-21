import { D } from '../../../core/engine.js';
import type { OeeResult } from './formula.js';
import { WORLD_CLASS_OEE, LOW_OEE } from './reference.js';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO' | 'TIP';
export interface Warning { code: string; severity: Severity; message: string; action: string; reference: string | null; }

/** Warnings derive from the result only; inputs are not needed. */
export function evaluateWarnings(result: OeeResult): Warning[] {
  const out: Warning[] = [];
  const oee = D(result.oeePct);
  const a = D(result.availabilityPct);
  const p = D(result.performancePct);
  const q = D(result.qualityPct);

  if (q.gt(100)) {
    out.push({
      code: 'QUALITY_OVER_100', severity: 'CRITICAL',
      message: `Quality ${result.qualityPct}% is impossible (good > total). The count data is wrong.`,
      action: 'Recount good vs total; good count cannot exceed total count.',
      reference: 'OEE definition'
    });
  }

  if (a.gt(100) || p.gt(100)) {
    out.push({
      code: 'RATE_OVER_100', severity: 'WARNING',
      message: `Availability ${result.availabilityPct}% / performance ${result.performancePct}% exceed 100% — a planning or cycle-time input is off.`,
      action: 'Check planned time vs run time, and ideal cycle time vs actual output.',
      reference: 'OEE definition'
    });
  }

  if (oee.lt(LOW_OEE)) {
    out.push({
      code: 'LOW_OEE', severity: 'WARNING',
      message: `OEE ${result.oeePct}% is below the ${LOW_OEE}% attention line.`,
      action: 'Decompose into availability / performance / quality to find the dominant loss.',
      reference: 'SEMI world-class benchmark'
    });
  }

  if (oee.gte(WORLD_CLASS_OEE)) {
    out.push({
      code: 'WORLD_CLASS', severity: 'INFO',
      message: `OEE ${result.oeePct}% is at or above the ${WORLD_CLASS_OEE}% world-class line.`,
      action: 'Sustain it: watch for hidden quality losses that high OEE can mask.',
      reference: 'SEMI world-class benchmark'
    });
  }

  out.push({
    code: 'OEE_INSIGHT', severity: 'TIP',
    message: `OEE ${result.oeePct}% = A ${result.availabilityPct}% x P ${result.performancePct}% x Q ${result.qualityPct}%.`,
    action: 'Track OEE per shift with calculateSeries to see the mean trend.',
    reference: null
  });

  return out;
}
