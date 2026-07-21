/**
 * SC-010 True Labor Cost Calculator — built ON the universal engine.
 * Version 1.0.0. Deterministic, Decimal-only, pure.
 * Conservation (total == sum of parts) is enforced at RUNTIME via the engine,
 * so an accounting error throws E_CONSERVATION instead of silently shipping.
 */
import { D, Decimal } from '../../../core/engine.js';
import { CalcError, requireNonNegative, requirePositive, requireLessThan } from '../../../core/guards.js';
import { assertConservation, assertAllNonNegative } from '../../../core/conservation.js';
import { roundHalfUp } from '../../../core/rounding.js';
import { COUNTRIES, WEEKS_PER_MONTH } from './reference.js';

const PLACES = 2;
function money(d: Decimal): string {
  return roundHalfUp(d, PLACES).toFixed(PLACES);
}
function pct1(d: Decimal): string {
  return roundHalfUp(d, 1).toFixed(1);
}

export interface LaborCostInputs {
  country: string;
  netSalary: Decimal.Value;
  payFrequency: 'hourly' | 'weekly' | 'biweekly' | 'monthly';
  hoursPerWeek?: Decimal.Value;
  employeeRate?: Decimal.Value;
  employerSSRate?: Decimal.Value;
  employerUnempRate?: Decimal.Value;
  healthMonthly?: Decimal.Value;
  mealMonthly?: Decimal.Value;
  transportMonthly?: Decimal.Value;
  annualBonus?: Decimal.Value;
  severanceRate?: Decimal.Value;
  overtimeHoursMonthly?: Decimal.Value;
  overtimeMultiplier?: Decimal.Value;
  recruitmentCost?: Decimal.Value;
  tenureYears?: Decimal.Value;
  currency?: string;
}

export interface CostRow { item: string; amount: string; pct: string; }
export interface Step { step: number; description: string; formula: string; result: string; }
export interface LaborCostResult {
  trueMonthlyCost: string;
  trueHourlyCost: string;
  costMultiplier: string;
  hiddenCostPct: string;
  annualTrueCost: string;
  grossMonthly: string;
  currency: string;
  breakdown: CostRow[];
  steps: Step[];
}

function optNN(value: Decimal.Value | undefined, fallback: string, label: string): Decimal {
  return value === undefined || value === null || value === '' ? requireNonNegative(fallback, label) : requireNonNegative(value, label);
}

export function calculate(inputs: LaborCostInputs): LaborCostResult {
  const steps: Step[] = [];
  let n = 0;

  const country = COUNTRIES[inputs.country];
  if (!country) throw new CalcError('E_INVALID_INPUT', `unknown country: ${inputs.country}`);
  const currency = inputs.currency ?? country.currency;

  const net = requireNonNegative(inputs.netSalary, 'netSalary');
  const hours = requirePositive(inputs.hoursPerWeek ?? 40, 'hoursPerWeek');

  // 1. normalize to monthly net
  let netMonthly: Decimal;
  switch (inputs.payFrequency) {
    case 'hourly': netMonthly = net.times(hours).times(WEEKS_PER_MONTH); break;
    case 'weekly': netMonthly = net.times(WEEKS_PER_MONTH); break;
    case 'biweekly': netMonthly = net.times(WEEKS_PER_MONTH).div(2); break;
    case 'monthly': netMonthly = net; break;
    default: throw new CalcError('E_INVALID_INPUT', `unknown payFrequency: ${String(inputs.payFrequency)}`);
  }
  steps.push({ step: ++n, description: 'Normalize net salary to monthly', formula: `netMonthly from ${inputs.payFrequency}`, result: money(netMonthly) });

  // 2. gross up (employeeRate < 1)
  const empRate = inputs.employeeRate === undefined ? D(country.employeeRate) : requireLessThan(inputs.employeeRate, 1, 'employeeRate');
  const gross = netMonthly.div(D(1).minus(empRate));
  steps.push({ step: ++n, description: 'Gross up net by employee burden', formula: `gross = net / (1 - ${empRate.toString()})`, result: money(gross) });

  // 3. employer contributions
  const ssRate = inputs.employerSSRate === undefined ? D(country.employerSSRate) : requireNonNegative(inputs.employerSSRate, 'employerSSRate');
  const unempRate = inputs.employerUnempRate === undefined ? D(country.employerUnempRate) : requireNonNegative(inputs.employerUnempRate, 'employerUnempRate');
  const employerSS = gross.times(ssRate);
  const employerUnemp = gross.times(unempRate);
  steps.push({ step: ++n, description: 'Employer social security + unemployment', formula: `gross * (${ssRate.toString()} + ${unempRate.toString()})`, result: money(employerSS.plus(employerUnemp)) });

  // 4. benefits
  const health = optNN(inputs.healthMonthly, '0', 'healthMonthly');
  const meal = optNN(inputs.mealMonthly, '0', 'mealMonthly');
  const transport = optNN(inputs.transportMonthly, '0', 'transportMonthly');
  const bonusMonthly = optNN(inputs.annualBonus, '0', 'annualBonus').div(12);
  const benefits = health.plus(meal).plus(transport).plus(bonusMonthly);
  steps.push({ step: ++n, description: 'Monthly benefits + bonus/12', formula: 'health+meal+transport+bonus/12', result: money(benefits) });

  // 5. severance
  const sevRate = inputs.severanceRate === undefined ? D(country.severanceRate) : requireNonNegative(inputs.severanceRate, 'severanceRate');
  const severance = gross.times(sevRate);
  steps.push({ step: ++n, description: 'Severance accrual', formula: `gross * ${sevRate.toString()}`, result: money(severance) });

  // 6. overtime (otMultiplier >= 1 — local guard; see debt #3)
  const otHours = optNN(inputs.overtimeHoursMonthly, '0', 'overtimeHoursMonthly');
  const otMult = inputs.overtimeMultiplier === undefined ? D('1.5') : D(inputs.overtimeMultiplier);
  if (otMult.lt(1)) throw new CalcError('E_OUT_OF_RANGE', `otMultiplier must be >= 1, got ${otMult.toString()}`);
  const hourlyRate = gross.div(hours.times(WEEKS_PER_MONTH));
  const overtime = otHours.times(hourlyRate).times(otMult);
  steps.push({ step: ++n, description: 'Overtime cost', formula: `otHours * hourlyRate * ${otMult.toString()}`, result: money(overtime) });

  // 7. recruitment amortization (tenure > 0)
  const recCost = optNN(inputs.recruitmentCost, '0', 'recruitmentCost');
  const tenure = inputs.tenureYears === undefined ? D(3) : requirePositive(inputs.tenureYears, 'tenureYears');
  const recMonthly = recCost.div(tenure.times(12));
  steps.push({ step: ++n, description: 'Recruitment amortized monthly', formula: 'cost / (tenure*12)', result: money(recMonthly) });

  // 8. TRUE MONTHLY COST + conservation lock
  const total = gross.plus(employerSS).plus(employerUnemp).plus(benefits).plus(severance).plus(overtime).plus(recMonthly);
  const amounts = [gross, employerSS, employerUnemp, benefits, severance, overtime, recMonthly];
  assertAllNonNegative(amounts, 'breakdown');
  assertConservation(total, amounts, '1e-9', 'trueMonthlyCost');
  steps.push({ step: ++n, description: 'TRUE MONTHLY COST (conservation-locked)', formula: 'sum of all components', result: money(total) });

  // derived (degenerate-safe)
  const workHoursMonth = hours.times(WEEKS_PER_MONTH);
  const hourlyCost = total.div(workHoursMonth);
  const multiplier = netMonthly.gt(0) ? total.div(netMonthly) : D(0);
  const hiddenPct = netMonthly.gt(0) ? total.minus(netMonthly).div(netMonthly).times(100) : D(0);
  const annual = total.times(12);

  const rows: Array<{ item: string; amount: Decimal }> = [
    { item: 'Gross salary (estimated)', amount: gross },
    { item: 'Employer social security', amount: employerSS },
    { item: 'Employer unemployment', amount: employerUnemp },
    { item: 'Health insurance', amount: health },
    { item: 'Meal allowance', amount: meal },
    { item: 'Transport', amount: transport },
    { item: 'Bonus (monthly)', amount: bonusMonthly },
    { item: 'Severance accrual', amount: severance },
    { item: 'Overtime', amount: overtime },
    { item: 'Recruitment (amortized)', amount: recMonthly }
  ];
  const breakdown: CostRow[] = rows
    .filter((r) => r.amount.gt(0))
    .map((r) => ({
      item: r.item,
      amount: money(r.amount),
      pct: total.gt(0) ? pct1(r.amount.div(total).times(100)) : '0.0'
    }));

  return {
    trueMonthlyCost: money(total),
    trueHourlyCost: money(hourlyCost),
    costMultiplier: multiplier.toFixed(2),
    hiddenCostPct: pct1(hiddenPct),
    annualTrueCost: money(annual),
    grossMonthly: money(gross),
    currency,
    breakdown,
    steps
  };
}
