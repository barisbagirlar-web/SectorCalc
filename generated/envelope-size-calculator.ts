// Auto-generated from envelope-size-calculator-schema.json
import * as z from 'zod';

export interface Envelope_size_calculatorInput {
  width: number;
  height: number;
  flapLength: number;
  paperThickness: number;
  quantity: number;
}

export const Envelope_size_calculatorInputSchema = z.object({
  width: z.number().default(229),
  height: z.number().default(162),
  flapLength: z.number().default(30),
  paperThickness: z.number().default(0.1),
  quantity: z.number().default(1000),
});

function evaluateAllFormulas(input: Envelope_size_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.width + 2 * input.flapLength) * (input.height + input.flapLength)) * input.quantity; results["totalPaperArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaperArea"] = 0; }
  try { const v = (results["totalPaperArea"] ?? 0) * input.paperThickness; results["totalPaperVolume"] = Number.isFinite(v) ? v : 0; } catch { results["totalPaperVolume"] = 0; }
  try { const v = 2 * (input.width * input.height + input.width * input.flapLength + input.height * input.flapLength); results["envelopeSurfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["envelopeSurfaceArea"] = 0; }
  try { const v = (results["envelopeSurfaceArea"] ?? 0) * input.quantity; results["totalSurfaceArea"] = Number.isFinite(v) ? v : 0; } catch { results["totalSurfaceArea"] = 0; }
  return results;
}


export function calculateEnvelope_size_calculator(input: Envelope_size_calculatorInput): Envelope_size_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalPaperArea"] ?? 0;
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


export interface Envelope_size_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
