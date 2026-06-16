// Auto-generated from mass-percent-calculator-schema.json
import * as z from 'zod';

export interface Mass_percent_calculatorInput {
  componentMass: number;
  otherComponentMass: number;
  totalMass: number;
  precision: number;
}

export const Mass_percent_calculatorInputSchema = z.object({
  componentMass: z.number().default(0),
  otherComponentMass: z.number().default(0),
  totalMass: z.number().default(0),
  precision: z.number().default(2),
});

function evaluateAllFormulas(input: Mass_percent_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalMass > 0 ? input.totalMass : input.componentMass + input.otherComponentMass; results["totalMassCalc"] = Number.isFinite(v) ? v : 0; } catch { results["totalMassCalc"] = 0; }
  try { const v = (input.componentMass / (results["totalMassCalc"] ?? 0)) * 100; results["massPercent"] = Number.isFinite(v) ? v : 0; } catch { results["massPercent"] = 0; }
  try { const v = parseFloat((results["massPercent"] ?? 0).toFixed(input.precision)); results["massPercentRounded"] = Number.isFinite(v) ? v : 0; } catch { results["massPercentRounded"] = 0; }
  try { const v = input.totalMass > 0 ? ((input.totalMass - input.componentMass) / input.totalMass) * 100 : (input.otherComponentMass / (results["totalMassCalc"] ?? 0)) * 100; results["otherMassPercent"] = Number.isFinite(v) ? v : 0; } catch { results["otherMassPercent"] = 0; }
  try { const v = parseFloat((results["otherMassPercent"] ?? 0).toFixed(input.precision)); results["otherMassPercentRounded"] = Number.isFinite(v) ? v : 0; } catch { results["otherMassPercentRounded"] = 0; }
  return results;
}


export function calculateMass_percent_calculator(input: Mass_percent_calculatorInput): Mass_percent_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["massPercentRounded"] ?? 0;
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


export interface Mass_percent_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
