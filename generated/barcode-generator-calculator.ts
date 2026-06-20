// Auto-generated from barcode-generator-calculator-schema.json
import * as z from 'zod';

export interface Barcode_generator_calculatorInput {
  dataLength: number;
  moduleWidth: number;
  quietZoneLeft: number;
  quietZoneRight: number;
  dataConfidence?: number;
}

export const Barcode_generator_calculatorInputSchema = z.object({
  dataLength: z.number().default(10),
  moduleWidth: z.number().default(0.25),
  quietZoneLeft: z.number().default(10),
  quietZoneRight: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Barcode_generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quietZoneLeft + input.quietZoneRight + 11 + 11 * input.dataLength + 11 + 13; results["totalModules"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalModules"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalModules"])) * input.moduleWidth; results["barcodeWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["barcodeWidth"] = Number.NaN; }
  try { const v = input.quietZoneLeft * input.moduleWidth; results["leftQuietWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leftQuietWidth"] = Number.NaN; }
  try { const v = input.quietZoneRight * input.moduleWidth; results["rightQuietWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rightQuietWidth"] = Number.NaN; }
  try { const v = 11 * input.dataLength * input.moduleWidth; results["dataWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dataWidth"] = Number.NaN; }
  try { const v = 11 * input.moduleWidth; results["startWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["startWidth"] = Number.NaN; }
  try { const v = 11 * input.moduleWidth; results["checkWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["checkWidth"] = Number.NaN; }
  try { const v = 13 * input.moduleWidth; results["stopWidth"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stopWidth"] = Number.NaN; }
  return results;
}


export function calculateBarcode_generator_calculator(input: Barcode_generator_calculatorInput): Barcode_generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["barcodeWidth"]);
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


export interface Barcode_generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
