// Auto-generated from inherited-ira-calculator-schema.json
import * as z from 'zod';

export interface Inherited_ira_calculatorInput {
  currentBalance: number;
  beneficiaryAge: number;
  lifeExpectancyFactor: number;
  expectedAnnualReturn: number;
}

export const Inherited_ira_calculatorInputSchema = z.object({
  currentBalance: z.number().default(100000),
  beneficiaryAge: z.number().default(50),
  lifeExpectancyFactor: z.number().default(34.2),
  expectedAnnualReturn: z.number().default(6),
});

function evaluateAllFormulas(input: Inherited_ira_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentBalance / input.lifeExpectancyFactor; results["rmdAmount"] = Number.isFinite(v) ? v : 0; } catch { results["rmdAmount"] = 0; }
  try { const v = (1 / input.lifeExpectancyFactor) * 100; results["rmdPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["rmdPercentage"] = 0; }
  try { const v = input.currentBalance - (results["rmdAmount"] ?? 0); results["remainingBalance"] = Number.isFinite(v) ? v : 0; } catch { results["remainingBalance"] = 0; }
  try { const v = (results["remainingBalance"] ?? 0) * (1 + input.expectedAnnualReturn / 100); results["projectedBalanceNextYear"] = Number.isFinite(v) ? v : 0; } catch { results["projectedBalanceNextYear"] = 0; }
  return results;
}


export function calculateInherited_ira_calculator(input: Inherited_ira_calculatorInput): Inherited_ira_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rmdAmount"] ?? 0;
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


export interface Inherited_ira_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
