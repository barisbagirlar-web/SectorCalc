// @ts-nocheck
// Auto-generated from volumetric-weight-calculator-schema.json
import * as z from 'zod';

export interface Volumetric_weight_calculatorInput {
  length_cm: number;
  width_cm: number;
  height_cm: number;
  actual_weight_kg: number;
  carrier_factor: string;
  package_type: string;
  is_stackable: boolean;
  hazardous_material: boolean;
}

export const Volumetric_weight_calculatorInputSchema = z.object({
  length_cm: z.number().min(0).max(500).default(0),
  width_cm: z.number().min(0).max(500).default(0),
  height_cm: z.number().min(0).max(500).default(0),
  actual_weight_kg: z.number().min(0).max(1000).default(0),
  carrier_factor: z.enum(['4000', '5000', '6000', '7000']).default('5000'),
  package_type: z.enum(['box', 'cylinder', 'pallet', 'irregular']).default('box'),
  is_stackable: z.boolean().default(true),
  hazardous_material: z.boolean().default(false),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Volumetric_weight_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.length_cm * input.width_cm * input.height_cm * input.actual_weight_kg; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.length_cm * input.width_cm * input.height_cm * input.actual_weight_kg; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateVolumetric_weight_calculator(input: Volumetric_weight_calculatorInput): Volumetric_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-currency cost comparison","Real-time carrier rate integration","Batch processing","Customizable alert thresholds"],
  };
}


export interface Volumetric_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
