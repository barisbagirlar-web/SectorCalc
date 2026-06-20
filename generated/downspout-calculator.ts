// Auto-generated from downspout-calculator-schema.json
import * as z from 'zod';

export interface Downspout_calculatorInput {
  roofLength: number;
  roofWidth: number;
  rainfallIntensity: number;
  downspoutDiameter: number;
  efficiencyFactor: number;
  dataConfidence?: number;
}

export const Downspout_calculatorInputSchema = z.object({
  roofLength: z.number().default(10),
  roofWidth: z.number().default(10),
  rainfallIntensity: z.number().default(50),
  downspoutDiameter: z.number().default(100),
  efficiencyFactor: z.number().default(85),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Downspout_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roofWidth * input.roofLength * input.rainfallIntensity / 3600; results["totalFlow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalFlow"] = Number.NaN; }
  try { const v = (Math.PI * input.efficiencyFactor * input.downspoutDiameter ** 2) / 400000; results["downspoutCapacity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["downspoutCapacity"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalFlow"])) / (toNumericFormulaValue(results["downspoutCapacity"])); results["requiredDownspoutsFloat"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredDownspoutsFloat"] = Number.NaN; }
  return results;
}


export function calculateDownspout_calculator(input: Downspout_calculatorInput): Downspout_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["requiredDownspoutsFloat"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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


export interface Downspout_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
