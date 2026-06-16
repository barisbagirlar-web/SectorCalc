// Auto-generated from safety-stock-calculator-schema.json
import * as z from 'zod';

export interface Safety_stock_calculatorInput {
  serviceLevelZ: number;
  demandAvg: number;
  demandStdDev: number;
  leadTime: number;
  leadTimeStdDev: number;
}

export const Safety_stock_calculatorInputSchema = z.object({
  serviceLevelZ: z.number().default(1.65),
  demandAvg: z.number().default(100),
  demandStdDev: z.number().default(20),
  leadTime: z.number().default(5),
  leadTimeStdDev: z.number().default(1),
});

function evaluateAllFormulas(input: Safety_stock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.serviceLevelZ * Math.sqrt( input.leadTime * Math.pow(input.demandStdDev,2) + Math.pow(input.demandAvg,2) * Math.pow(input.leadTimeStdDev,2) ); results["safetyStock"] = Number.isFinite(v) ? v : 0; } catch { results["safetyStock"] = 0; }
  try { const v = input.serviceLevelZ * input.demandStdDev * Math.sqrt(input.leadTime); results["demandVariabilityComponent"] = Number.isFinite(v) ? v : 0; } catch { results["demandVariabilityComponent"] = 0; }
  try { const v = input.serviceLevelZ * input.demandAvg * input.leadTimeStdDev; results["leadTimeVariabilityComponent"] = Number.isFinite(v) ? v : 0; } catch { results["leadTimeVariabilityComponent"] = 0; }
  return results;
}


export function calculateSafety_stock_calculator(input: Safety_stock_calculatorInput): Safety_stock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["safetyStock"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Safety_stock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
