import { D } from '../../../core/engine.js';
import type { QuoteInputs, QuoteResult } from './formula.js';
import { HIGH_SCRAP_THRESHOLD, LONG_PAYMENT_DAYS, THIN_MARGIN_THRESHOLD } from './reference.js';

export type Severity = 'CRITICAL' | 'WARNING' | 'INFO' | 'TIP';
export interface Warning { code: string; severity: Severity; message: string; action: string; reference: string | null; }

export function evaluateWarnings(inputs: QuoteInputs, result: QuoteResult): Warning[] {
  const out: Warning[] = [];
  const margin = D(inputs.targetMargin);
  const scrap = D(inputs.scrapRate);
  const days = inputs.paymentDays === undefined ? D(0) : D(inputs.paymentDays);
  const finance = D(result.financeCharge);

  if (margin.lte(0)) {
    out.push({
      code: 'NO_MARGIN', severity: 'CRITICAL',
      message: `Target margin is ${margin.times(100).toFixed(1)}%. You are selling at cost or below — every unit loses money.`,
      action: 'Set a positive target margin before quoting.',
      reference: null
    });
  }

  if (scrap.gt(HIGH_SCRAP_THRESHOLD)) {
    out.push({
      code: 'HIGH_SCRAP', severity: 'WARNING',
      message: `Scrap rate ${scrap.times(100).toFixed(1)}% is above the ${D(HIGH_SCRAP_THRESHOLD).times(100).toFixed(0)}% benchmark.`,
      action: 'Improve nesting/cutting optimization; each percent scrap is pure waste in the price.',
      reference: 'SC-009 cutting optimization (planned)'
    });
  }

  if (days.gt(LONG_PAYMENT_DAYS)) {
    out.push({
      code: 'LONG_PAYMENT_TERMS', severity: 'WARNING',
      message: `Payment terms ${days.toString()} days tie up cash; finance charge is ${result.financeCharge} ${result.currency}.`,
      action: 'Negotiate shorter terms or raise the price to cover financing.',
      reference: null
    });
  }

  if (margin.gt(0) && margin.lt(THIN_MARGIN_THRESHOLD)) {
    out.push({
      code: 'THIN_MARGIN', severity: 'WARNING',
      message: `Margin ${margin.times(100).toFixed(1)}% is thin. A single cost increase flips this quote into a loss.`,
      action: 'Add a safety buffer or lock supplier prices before committing.',
      reference: null
    });
  }

  if (finance.gt(0)) {
    out.push({
      code: 'FINANCE_INCLUDED', severity: 'INFO',
      message: `Finance charge ${result.financeCharge} ${result.currency} is included in the price for ${days.toString()}-day terms.`,
      action: 'Confirm the interest rate reflects your real cost of capital.',
      reference: null
    });
  }

  out.push({
    code: 'QUOTE_INSIGHT', severity: 'TIP',
    message: `Sell ${result.sellPrice} ${result.currency} (unit ${result.unitPrice}); true cost ${result.totalCost}; profit ${result.profit}.`,
    action: 'Feed laborHourlyCost from SC-010 and machineHourlyCost from SC-011 for a fully grounded quote.',
    reference: 'SC-010 / SC-011'
  });

  return out;
}
