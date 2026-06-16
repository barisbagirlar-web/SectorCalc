// Auto-generated from barcode-generator-calculator-schema.json
import * as z from 'zod';

export interface Barcode_generator_calculatorInput {
  dataLength: number;
  moduleWidth: number;
  quietZoneLeft: number;
  quietZoneRight: number;
}

export const Barcode_generator_calculatorInputSchema = z.object({
  dataLength: z.number().default(10),
  moduleWidth: z.number().default(0.25),
  quietZoneLeft: z.number().default(10),
  quietZoneRight: z.number().default(10),
});

function evaluateAllFormulas(input: Barcode_generator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.quietZoneLeft + input.quietZoneRight + 11 + 11 * input.dataLength + 11 + 13; results["totalModules"] = Number.isFinite(v) ? v : 0; } catch { results["totalModules"] = 0; }
  try { const v = (results["totalModules"] ?? 0) * input.moduleWidth; results["barcodeWidth"] = Number.isFinite(v) ? v : 0; } catch { results["barcodeWidth"] = 0; }
  try { const v = input.quietZoneLeft * input.moduleWidth; results["leftQuietWidth"] = Number.isFinite(v) ? v : 0; } catch { results["leftQuietWidth"] = 0; }
  try { const v = input.quietZoneRight * input.moduleWidth; results["rightQuietWidth"] = Number.isFinite(v) ? v : 0; } catch { results["rightQuietWidth"] = 0; }
  try { const v = 11 * input.dataLength * input.moduleWidth; results["dataWidth"] = Number.isFinite(v) ? v : 0; } catch { results["dataWidth"] = 0; }
  try { const v = 11 * input.moduleWidth; results["startWidth"] = Number.isFinite(v) ? v : 0; } catch { results["startWidth"] = 0; }
  try { const v = 11 * input.moduleWidth; results["checkWidth"] = Number.isFinite(v) ? v : 0; } catch { results["checkWidth"] = 0; }
  try { const v = 13 * input.moduleWidth; results["stopWidth"] = Number.isFinite(v) ? v : 0; } catch { results["stopWidth"] = 0; }
  return results;
}


export function calculateBarcode_generator_calculator(input: Barcode_generator_calculatorInput): Barcode_generator_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["barcodeWidth"] ?? 0;
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


export interface Barcode_generator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
