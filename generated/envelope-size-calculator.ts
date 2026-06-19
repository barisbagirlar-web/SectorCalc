// Auto-generated from envelope-size-calculator-schema.json
import * as z from 'zod';

export interface Envelope_size_calculatorInput {
  width: number;
  height: number;
  flapLength: number;
  paperThickness: number;
  quantity: number;
  dataConfidence?: number;
}

export const Envelope_size_calculatorInputSchema = z.object({
  width: z.number().default(229),
  height: z.number().default(162),
  flapLength: z.number().default(30),
  paperThickness: z.number().default(0.1),
  quantity: z.number().default(1000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Envelope_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.width + 2 * input.flapLength) * (input.height + input.flapLength)) * input.quantity; results["totalPaperArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPaperArea"] = 0; }
  try { const v = (asFormulaNumber(results["totalPaperArea"])) * input.paperThickness; results["totalPaperVolume"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalPaperVolume"] = 0; }
  try { const v = 2 * (input.width * input.height + input.width * input.flapLength + input.height * input.flapLength); results["envelopeSurfaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["envelopeSurfaceArea"] = 0; }
  try { const v = (asFormulaNumber(results["envelopeSurfaceArea"])) * input.quantity; results["totalSurfaceArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEnvelope_size_calculator(input: Envelope_size_calculatorInput): Envelope_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalPaperArea"]));
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


export interface Envelope_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
