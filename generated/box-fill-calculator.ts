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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Box_fill_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.number10AWG > 0 ? 2.5 : (input.number12AWG > 0 ? 2.25 : (input.number14AWG > 0 ? 2.0 : 0))); results["volumeLargest"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumeLargest"] = Number.NaN; }
  try { const v = input.number14AWG * 2.0 + input.number12AWG * 2.25 + input.number10AWG * 2.5; results["conductorVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["conductorVolume"] = Number.NaN; }
  try { const v = input.numberOfDevices * 2 * (toNumericFormulaValue(results["volumeLargest"])); results["deviceVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deviceVolume"] = Number.NaN; }
  try { const v = input.numberOfClamps * (toNumericFormulaValue(results["volumeLargest"])); results["clampVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["clampVolume"] = Number.NaN; }
  try { const v = input.equipmentGroundPresent * (toNumericFormulaValue(results["volumeLargest"])); results["groundVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["groundVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["conductorVolume"])) + (toNumericFormulaValue(results["deviceVolume"])) + (toNumericFormulaValue(results["clampVolume"])) + (toNumericFormulaValue(results["groundVolume"])); results["totalVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalVolume"] = Number.NaN; }
  return results;
}


export function calculateBox_fill_calculator(input: Box_fill_calculatorInput): Box_fill_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalVolume"]);
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


export interface Box_fill_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
