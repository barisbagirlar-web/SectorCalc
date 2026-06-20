// Auto-generated from contact-lens-calculator-schema.json
import * as z from 'zod';

export interface Contact_lens_calculatorInput {
  sphere: number;
  cylinder: number;
  axis: number;
  vertexDistance: number;
  dataConfidence?: number;
}

export const Contact_lens_calculatorInputSchema = z.object({
  sphere: z.number().default(0),
  cylinder: z.number().default(0),
  axis: z.number().default(0),
  vertexDistance: z.number().default(12),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Contact_lens_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sphere / (1 - (input.vertexDistance/1000) * input.sphere); results["contactSphere"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contactSphere"] = Number.NaN; }
  try { const v = ((input.sphere + input.cylinder) / (1 - (input.vertexDistance/1000) * (input.sphere + input.cylinder))) - (input.sphere / (1 - (input.vertexDistance/1000) * input.sphere)); results["contactCylinder"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contactCylinder"] = Number.NaN; }
  try { const v = input.axis; results["contactAxis"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contactAxis"] = Number.NaN; }
  return results;
}


export function calculateContact_lens_calculator(input: Contact_lens_calculatorInput): Contact_lens_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["contactSphere"]);
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


export interface Contact_lens_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
