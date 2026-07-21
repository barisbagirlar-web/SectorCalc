/**
 * SC-012 Quote Pricing Calculator — built ON the universal engine.
 * Version 1.0.0. Deterministic, Decimal-only, pure.
 * Conservation (totalCost == sum of 9 breakdown items) enforced at RUNTIME.
 * Guards close every divide-by-zero: scrapRate<1, targetMargin<1, quantity>0.
 */
import { D, Decimal } from '../../../core/engine.js';
import { requireNonNegative, requirePositive, requireLessThan } from '../../../core/guards.js';
import { assertConservation, assertAllNonNegative } from '../../../core/conservation.js';
import { roundHalfUp } from '../../../core/rounding.js';

const PLACES = 2;
function money(d: Decimal): string { return roundHalfUp(d, PLACES).toFixed(PLACES); }
function pct1(d: Decimal): string { return roundHalfUp(d, 1).toFixed(1); }

export interface QuoteInputs {
  materialCost: Decimal.Value;
  scrapRate: Decimal.Value;
  laborHours: Decimal.Value;
  laborHourlyCost: Decimal.Value;
  machineHours: Decimal.Value;
  machineHourlyCost: Decimal.Value;
  setupMinutes?: Decimal.Value;
  setupHourlyCost?: Decimal.Value;
  overheadRate?: Decimal.Value;
  energyCost?: Decimal.Value;
  consumablesCost?: Decimal.Value;
  shippingCost?: Decimal.Value;
  paymentDays?: Decimal.Value;
  monthlyInterestRate?: Decimal.Value;
  targetMargin: Decimal.Value;
  quantity: Decimal.Value;
  currency?: string;
}

export interface CostRow { item: string; amount: string; pct: string; }
export interface Step { step: number; description: string; formula: string; result: string; }
export interface QuoteResult {
  sellPrice: string;
  unitPrice: string;
  totalCost: string;
  profit: string;
  profitPerUnit: string;
  effectiveMaterial: string;
  financeCharge: string;
  currency: string;
  breakdown: CostRow[];
  steps: Step[];
}

function optNN(value: Decimal.Value | undefined, fallback: string, label: string): Decimal {
  return value === undefined || value === null || value === '' ? requireNonNegative(fallback, label) : requireNonNegative(value, label);
}

export function calculate(inputs: QuoteInputs): QuoteResult {
  const steps: Step[] = [];
  let n = 0;
  const currency = inputs.currency ?? 'USD';

  const material = requireNonNegative(inputs.materialCost, 'materialCost');
  const scrap = requireLessThan(inputs.scrapRate, 1, 'scrapRate');
  const margin = requireLessThan(inputs.targetMargin, 1, 'targetMargin');
  const qty = requirePositive(inputs.quantity, 'quantity');

  // 1. effective material (scrap included)
  const effMaterial = material.div(D(1).minus(scrap));
  steps.push({ step: ++n, description: 'Material cost with scrap', formula: `material / (1 - ${scrap.toString()})`, result: money(effMaterial) });

  // 2. labor / machine / setup
  const labor = requireNonNegative(inputs.laborHours, 'laborHours').times(requireNonNegative(inputs.laborHourlyCost, 'laborHourlyCost'));
  const machine = requireNonNegative(inputs.machineHours, 'machineHours').times(requireNonNegative(inputs.machineHourlyCost, 'machineHourlyCost'));
  const setupMin = optNN(inputs.setupMinutes, '0', 'setupMinutes');
  const setupRate = optNN(inputs.setupHourlyCost, '0', 'setupHourlyCost');
  const setup = setupMin.div(60).times(setupRate);
  steps.push({ step: ++n, description: 'Labor + machine + setup', formula: 'laborH*rate + machineH*rate + (setupMin/60)*setupRate', result: money(labor.plus(machine).plus(setup)) });

  // 3. direct cost
  const energy = optNN(inputs.energyCost, '0', 'energyCost');
  const consumables = optNN(inputs.consumablesCost, '0', 'consumablesCost');
  const shipping = optNN(inputs.shippingCost, '0', 'shippingCost');
  const direct = effMaterial.plus(labor).plus(machine).plus(setup).plus(energy).plus(consumables).plus(shipping);
  steps.push({ step: ++n, description: 'Direct cost', formula: 'effMaterial+labor+machine+setup+energy+consumables+shipping', result: money(direct) });

  // 4. overhead
  const overheadRate = optNN(inputs.overheadRate, '0', 'overheadRate');
  const overhead = direct.times(overheadRate);
  steps.push({ step: ++n, description: 'Overhead', formula: `direct * ${overheadRate.toString()}`, result: money(overhead) });

  // 5. finance charge (simple interest on payment terms)
  const costBeforeFinance = direct.plus(overhead);
  const days = optNN(inputs.paymentDays, '0', 'paymentDays');
  const monthRate = optNN(inputs.monthlyInterestRate, '0', 'monthlyInterestRate');
  const finance = costBeforeFinance.times(monthRate).times(days.div(30));
  steps.push({ step: ++n, description: 'Finance charge on payment terms', formula: `costBeforeFinance * ${monthRate.toString()} * (days/30)`, result: money(finance) });

  // 6. total cost + conservation lock
  const totalCost = costBeforeFinance.plus(finance);
  const amounts = [effMaterial, labor, machine, setup, energy, consumables, shipping, overhead, finance];
  assertAllNonNegative(amounts, 'breakdown');
  assertConservation(totalCost, amounts, '1e-9', 'totalCost');
  steps.push({ step: ++n, description: 'TOTAL COST (conservation-locked)', formula: 'sum of 9 components', result: money(totalCost) });

  // 7. sell price with margin + unit + profit
  const sellPrice = totalCost.div(D(1).minus(margin));
  const unitPrice = sellPrice.div(qty);
  const profit = sellPrice.minus(totalCost);
  const profitPerUnit = profit.div(qty);
  steps.push({ step: ++n, description: 'Sell price with target margin', formula: `totalCost / (1 - ${margin.toString()})`, result: money(sellPrice) });

  const rows: Array<{ item: string; amount: Decimal }> = [
    { item: 'Effective material (scrap incl.)', amount: effMaterial },
    { item: 'Labor', amount: labor },
    { item: 'Machine', amount: machine },
    { item: 'Setup', amount: setup },
    { item: 'Energy', amount: energy },
    { item: 'Consumables', amount: consumables },
    { item: 'Shipping', amount: shipping },
    { item: 'Overhead', amount: overhead },
    { item: 'Finance charge', amount: finance }
  ];
  const breakdown: CostRow[] = rows
    .filter((r) => r.amount.gt(0))
    .map((r) => ({
      item: r.item,
      amount: money(r.amount),
      pct: totalCost.gt(0) ? pct1(r.amount.div(totalCost).times(100)) : '0.0'
    }));

  return {
    sellPrice: money(sellPrice),
    unitPrice: money(unitPrice),
    totalCost: money(totalCost),
    profit: money(profit),
    profitPerUnit: money(profitPerUnit),
    effectiveMaterial: money(effMaterial),
    financeCharge: money(finance),
    currency,
    breakdown,
    steps
  };
}
