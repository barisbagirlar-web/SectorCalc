// Auto-generated from investment-payback-npv-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface InvestmentPaybackNpvCalculatorInput {
  initialInvestment: number;
  annualCashInflow: number;
  discountRate: number;
  projectLifeYears: number;
  salvageValue: number;
  annualOperatingCost: number;
  taxRate: number;
  depreciationMethod: 'straight-line' | 'double-declining' | 'sum-of-years-digits';
  inflationRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const InvestmentPaybackNpvCalculatorInputSchema = z.object({
  initialInvestment: z.number().min(0).default(100000),
  annualCashInflow: z.number().min(0).default(30000),
  discountRate: z.number().min(0).max(100).default(10),
  projectLifeYears: z.number().min(1).max(50).default(5),
  salvageValue: z.number().min(0).default(0),
  annualOperatingCost: z.number().min(0).default(5000),
  taxRate: z.number().min(0).max(100).default(25),
  depreciationMethod: z.enum(['straight-line', 'double-declining', 'sum-of-years-digits']).default('straight-line'),
  inflationRate: z.number().min(0).max(100).default(2),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface InvestmentPaybackNpvCalculatorOutput {
  npv: number;
  breakdown: {
    paybackPeriodYears: number;
    npv: number;
    irr: number;
    profitabilityIndex: number;
    annualDepreciation: number;
    annualNetCashFlow: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: InvestmentPaybackNpvCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.annualDepreciation = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualNetCashFlow = ((): number => { try { const __v = input.annualCashInflow - input.annualOperatingCost - (results.annualDepreciation * input.taxRate) + results.annualDepreciation; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cumulativeCashFlow = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriodYears = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.irr = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.profitabilityIndex = ((): number => { try { const __v = results.npv / input.initialInvestment + 1; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedNpv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateInvestmentPaybackNpvCalculator(input: InvestmentPaybackNpvCalculatorInput): InvestmentPaybackNpvCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    paybackPeriodYears: results.paybackPeriodYears,
    npv: results.npv,
    irr: results.irr,
    profitabilityIndex: results.profitabilityIndex,
    annualDepreciation: results.annualDepreciation,
    annualNetCashFlow: results.annualNetCashFlow,
  };

  // rule: initialInvestment > 0
  // rule: annualCashInflow >= 0
  // rule: discountRate >= 0 and discountRate <= 100
  // rule: projectLifeYears >= 1 and projectLifeYears <= 50
  // rule: salvageValue >= 0
  // rule: annualOperatingCost >= 0
  // rule: taxRate >= 0 and taxRate <= 100
  // rule: inflationRate >= 0 and inflationRate <= 100
  // rule: if depreciationMethod == 'double-declining' then projectLifeYears >= 2
  // rule: if dataConfidence == 'low' then discountRate >= discountRate * 1.2
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if paybackPeriodYears > projectLifeYears then 'Payback period exceeds project life; investment may not recover.'
  // threshold skipped (non-JS): if npv < 0 then 'Negative NPV; investment may not meet required return.'
  // threshold skipped (non-JS): if irr < discountRate then 'IRR below discount rate; project may not be viable.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedNpv; } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
