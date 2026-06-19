// Auto-generated from box-fill-calculator-schema.json
import * as z from 'zod';

export interface Box_fill_calculatorInput {
  number14AWG: number;
  number12AWG: number;
  number10AWG: number;
  numberOfDevices: number;
  numberOfClamps: number;
  equipmentGroundPresent: number;
  dataConfidence?: number;
}

export const Box_fill_calculatorInputSchema = z.object({
  number14AWG: z.number().default(0),
  number12AWG: z.number().default(0),
  number10AWG: z.number().default(0),
  numberOfDevices: z.number().default(0),
  numberOfClamps: z.number().default(0),
  equipmentGroundPresent: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Box_fill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.number10AWG > 0 ? 2.5 : (input.number12AWG > 0 ? 2.25 : (input.number14AWG > 0 ? 2.0 : 0))); results["volumeLargest"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["volumeLargest"] = 0; }
  try { const v = input.number14AWG * 2.0 + input.number12AWG * 2.25 + input.number10AWG * 2.5; results["conductorVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conductorVolume"] = 0; }
  try { const v = input.numberOfDevices * 2 * (asFormulaNumber(results["volumeLargest"])); results["deviceVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deviceVolume"] = 0; }
  try { const v = input.numberOfClamps * (asFormulaNumber(results["volumeLargest"])); results["clampVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["clampVolume"] = 0; }
  try { const v = input.equipmentGroundPresent * (asFormulaNumber(results["volumeLargest"])); results["groundVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["groundVolume"] = 0; }
  try { const v = (asFormulaNumber(results["conductorVolume"])) + (asFormulaNumber(results["deviceVolume"])) + (asFormulaNumber(results["clampVolume"])) + (asFormulaNumber(results["groundVolume"])); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVolume"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBox_fill_calculator(input: Box_fill_calculatorInput): Box_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalVolume"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Box_fill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
