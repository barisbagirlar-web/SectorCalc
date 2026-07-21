import { D } from '../../../core/engine.js';
import type { LaborCostInputs, LaborCostResult } from './formula.js';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO' | 'TIP';
export interface Warning {
  code: string;
  severity: Severity;
  message: string;
  action: string;
  reference: string | null;
}

const MANDATORY_SEVERANCE = ['TR', 'FR', 'IN'];

export function evaluateWarnings(inputs: LaborCostInputs, result: LaborCostResult): Warning[] {
  const out: Warning[] = [];
  const mult = D(result.costMultiplier);
  const hidden = D(result.hiddenCostPct);

  if (mult.gt(2)) {
    out.push({
      code: 'HIGH_COST_MULTIPLIER', severity: 'CRITICAL',
      message: `True cost is ${result.costMultiplier}x the net salary. Every 1 of take-home costs you ${result.costMultiplier}.`,
      action: 'Review benefits package and tax optimization; consider contractor vs employee.',
      reference: inputs.country
    });
  }

  const sev = inputs.severanceRate;
  if ((sev === undefined || D(sev).isZero()) && MANDATORY_SEVERANCE.includes(inputs.country)) {
    out.push({
      code: 'NO_SEVERANCE_ACCRUAL', severity: 'WARNING',
      message: `No severance accrual set. In ${inputs.country} severance is commonly mandated.`,
      action: inputs.country === 'TR' ? 'Set severance rate to 0.0833 (1 month gross per year).' : 'Check local labor law for mandatory severance.',
      reference: inputs.country === 'TR' ? 'Turkish Labor Law 4857 Art.17' : 'ILO Convention 95'
    });
  }

  const ot = inputs.overtimeHoursMonthly;
  if (ot !== undefined && D(ot).gt(45)) {
    out.push({
      code: 'EXCESSIVE_OVERTIME', severity: 'WARNING',
      message: `${ot} overtime hours/month exceeds typical legal caps (~22.5h/month).`,
      action: 'Reduce overtime or hire; excessive overtime raises error and accident risk.',
      reference: 'ILO Convention 1'
    });
  }

  if (hidden.gt(40)) {
    out.push({
      code: 'UNDERPRICING_RISK', severity: 'WARNING',
      message: `Hidden costs are ${result.hiddenCostPct}% above net salary. Quotes using net rate underprice by this margin.`,
      action: `Use true hourly cost (${result.trueHourlyCost} ${result.currency}/h) in quotes, not net rate.`,
      reference: null
    });
  }

  out.push({
    code: 'COST_INSIGHT', severity: 'TIP',
    message: `You pay ${inputs.netSalary} net; true cost is ${result.trueMonthlyCost} ${result.currency}. The ${result.hiddenCostPct}% gap is what most quotes miss.`,
    action: 'Screenshot this; price your next job with the true cost.',
    reference: null
  });

  return out;
}
