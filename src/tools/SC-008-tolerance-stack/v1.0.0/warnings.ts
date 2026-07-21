import { D } from '../../../core/engine.js';
import type { StackInput, StackResult } from './formula.js';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO' | 'TIP';
export interface Warning { code: string; severity: Severity; message: string; action: string; reference: string | null; }

export function evaluateWarnings(input: StackInput, result: StackResult): Warning[] {
  const out: Warning[] = [];
  const usl = D(input.usl);
  const lsl = D(input.lsl);
  const nominal = D(result.nominalSum);
  const worstPlus = D(result.worstPlus);
  const cpk = D(result.cpk);
  const mcRange = D(result.mcP9987).minus(result.mcP0013);
  const top = result.pareto[0];

  if (cpk.lt(1)) {
    out.push({
      code: 'INCAPABLE', severity: 'CRITICAL',
      message: `Cpk ${result.cpk} < 1.0 — the accumulated stack will not hold the spec at 3-sigma.`,
      action: 'Tighten the dominant contributor (see pareto) or widen the assembly spec.',
      reference: 'AIAG SPC'
    });
  }

  if (nominal.plus(worstPlus).gt(usl) || nominal.minus(worstPlus).lt(lsl)) {
    out.push({
      code: 'WORST_CASE_OUT', severity: 'WARNING',
      message: `Worst-case stack (${result.nominalSum} +/- ${result.worstPlus}) exceeds the spec [${lsl.toString()}, ${usl.toString()}].`,
      action: 'Worst-case is pessimistic but real; verify the RSS/Monte Carlo result is acceptable for your risk.',
      reference: 'ASME Y14.5'
    });
  }

  if (top && D(top.pct).gt(50)) {
    out.push({
      code: 'DOMINANT_CONTRIBUTOR', severity: 'WARNING',
      message: `"${top.name}" drives ${top.pct}% of the RSS variation.`,
      action: `Focus tolerance improvement on ${top.name} first — it has the largest leverage.`,
      reference: null
    });
  }

  if (mcRange.lt(worstPlus.times(2).times('0.5'))) {
    out.push({
      code: 'STATISTICAL_GAIN', severity: 'INFO',
      message: `Monte Carlo spread (${result.mcP0013}..${result.mcP9987}) is well inside worst-case +/- ${result.worstPlus}.`,
      action: 'Statistical tolerancing is justified if contributors are independent and capable.',
      reference: 'NIST SEMATECH e-Handbook'
    });
  }

  out.push({
    code: 'STACK_INSIGHT', severity: 'TIP',
    message: `Stack ${result.nominalSum}; worst +/-${result.worstPlus}, RSS +/-${result.rssPlus}, Monte Carlo Cpk ${result.cpk}, ${result.ppm} ppm.`,
    action: 'Report all three methods; let the customer risk profile pick the governing one.',
    reference: null
  });

  return out;
}
