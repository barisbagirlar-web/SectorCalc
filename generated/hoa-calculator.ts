// @ts-nocheck
// Auto-generated from hoa-calculator-schema.json
import * as z from 'zod';

export interface Hoa_calculatorInput {
  mass: number;
  specificHeat: number;
  initialTemperature: number;
  finalTemperature: number;
  heatLossFactor: number;
}

export const Hoa_calculatorInputSchema = z.object({
  mass: z.number().default(1),
  specificHeat: z.number().default(4184),
  initialTemperature: z.number().default(20),
  finalTemperature: z.number().default(100),
  heatLossFactor: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Hoa_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.finalTemperature - input.initialTemperature; results["temperatureDifference"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["temperatureDifference"] = 0; }
  try { const v = input.mass * input.specificHeat * (input.finalTemperature - input.initialTemperature); results["idealHeat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["idealHeat"] = 0; }
  try { const v = input.mass * input.specificHeat * (input.finalTemperature - input.initialTemperature) * (1 - input.heatLossFactor / 100); results["actualHeat"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["actualHeat"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateHoa_calculator(input: Hoa_calculatorInput): Hoa_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["actualHeat"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Hoa_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
