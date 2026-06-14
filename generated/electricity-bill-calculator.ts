// Auto-generated from electricity-bill-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ElectricityBillCalculatorInput {
  monthlyConsumption: number;
  tariffRate: number;
  peakConsumption: number;
  offPeakConsumption: number;
  peakRate: number;
  offPeakRate: number;
  fixedCharge: number;
  taxRate: number;
  dataConfidence: number;
}

export const ElectricityBillCalculatorInputSchema = z.object({
  monthlyConsumption: z.number().min(0).max(1000000).default(500),
  tariffRate: z.number().min(0).max(10).default(0.12),
  peakConsumption: z.number().min(0).max(1000000).default(200),
  offPeakConsumption: z.number().min(0).max(1000000).default(300),
  peakRate: z.number().min(0).max(10).default(0.15),
  offPeakRate: z.number().min(0).max(10).default(0.1),
  fixedCharge: z.number().min(0).max(1000).default(10),
  taxRate: z.number().min(0).max(100).default(5),
  dataConfidence: z.number().min(0).max(100).default(100),
});

export interface ElectricityBillCalculatorOutput {
  totalBill: number;
  breakdown: {
    energyCharge: number;
    fixedCharge: number;
    taxAmount: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ElectricityBillCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.energyCharge = (() => { try { return input.peakConsumption * input.peakRate + input.offPeakConsumption * input.offPeakRate; } catch { return 0; } })();
  results.totalBeforeTax = (() => { try { return results.energyCharge + input.fixedCharge; } catch { return 0; } })();
  results.taxAmount = (() => { try { return results.totalBeforeTax * (input.taxRate / 100); } catch { return 0; } })();
  results.totalBill = (() => { try { return results.totalBeforeTax + results.taxAmount; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return results.totalBill * (input.dataConfidence / 100); } catch { return 0; } })();
  return results;
}

export function calculateElectricityBillCalculator(input: ElectricityBillCalculatorInput): ElectricityBillCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalBill = results.totalBill ?? 0;
  const breakdown = {
    energyCharge: results.energyCharge,
    fixedCharge: results.fixedCharge,
    taxAmount: results.taxAmount,
  };

  // rule: monthlyConsumption must be >= 0
  // rule: tariffRate must be >= 0
  // rule: peakConsumption + offPeakConsumption must equal monthlyConsumption if time-of-use pricing is used
  // rule: peakRate must be >= offPeakRate
  // rule: fixedCharge must be >= 0
  // rule: taxRate must be between 0 and 100
  // rule: dataConfidence must be between 0 and 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High consumption alert
  // threshold skipped (non-JS): Peak load exceeds 50% of total
  // threshold skipped (non-JS): Tariff rate is above average

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalBill; } })();

  return {
    totalBill,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical bills","Detailed breakdown report"],
  };
}
