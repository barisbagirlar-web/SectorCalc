// Auto-generated from contact-lens-calculator-schema.json
import * as z from 'zod';

export interface Contact_lens_calculatorInput {
  sphere: number;
  cylinder: number;
  axis: number;
  vertexDistance: number;
}

export const Contact_lens_calculatorInputSchema = z.object({
  sphere: z.number().default(0),
  cylinder: z.number().default(0),
  axis: z.number().default(0),
  vertexDistance: z.number().default(12),
});

function evaluateAllFormulas(input: Contact_lens_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sphere / (1 - (input.vertexDistance/1000) * input.sphere); results["contactSphere"] = Number.isFinite(v) ? v : 0; } catch { results["contactSphere"] = 0; }
  try { const v = ((input.sphere + input.cylinder) / (1 - (input.vertexDistance/1000) * (input.sphere + input.cylinder))) - (input.sphere / (1 - (input.vertexDistance/1000) * input.sphere)); results["contactCylinder"] = Number.isFinite(v) ? v : 0; } catch { results["contactCylinder"] = 0; }
  try { const v = input.axis; results["contactAxis"] = Number.isFinite(v) ? v : 0; } catch { results["contactAxis"] = 0; }
  return results;
}


export function calculateContact_lens_calculator(input: Contact_lens_calculatorInput): Contact_lens_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["contactSphere"] ?? 0;
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


export interface Contact_lens_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
