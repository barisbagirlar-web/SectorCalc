// Auto-generated from chair-rail-calculator-schema.json
import * as z from 'zod';

export interface Chair_rail_calculatorInput {
  roomLength: number;
  roomWidth: number;
  doorCount: number;
  doorWidth: number;
  windowCount: number;
  windowWidth: number;
  wasteFactor: number;
  pricePerFoot: number;
  dataConfidence?: number;
}

export const Chair_rail_calculatorInputSchema = z.object({
  roomLength: z.number().default(0),
  roomWidth: z.number().default(0),
  doorCount: z.number().default(0),
  doorWidth: z.number().default(3),
  windowCount: z.number().default(0),
  windowWidth: z.number().default(4),
  wasteFactor: z.number().default(10),
  pricePerFoot: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Chair_rail_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 2 * (input.roomLength + input.roomWidth); results["perimeter"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["perimeter"] = Number.NaN; }
  try { const v = input.doorCount * input.doorWidth + input.windowCount * input.windowWidth; results["openings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["openings"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["perimeter"])) - (toNumericFormulaValue(results["openings"])); results["netLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netLength"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netLength"])) * (input.wasteFactor / 100); results["wasteAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["netLength"])) + (toNumericFormulaValue(results["wasteAmount"])); results["totalLength"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLength"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalLength"])) * input.pricePerFoot; results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateChair_rail_calculator(input: Chair_rail_calculatorInput): Chair_rail_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalLength"]);
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


export interface Chair_rail_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
