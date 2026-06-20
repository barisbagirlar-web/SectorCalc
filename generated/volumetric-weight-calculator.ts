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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Volumetric_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.length_cm * input.width_cm * input.height_cm / input.carrier_factor; results["volumetric_weight_kg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volumetric_weight_kg"] = Number.NaN; }
  try { const v = Math.max(input.actual_weight_kg, input.length_cm * input.width_cm * input.height_cm / input.carrier_factor); results["chargeable_weight_kg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["chargeable_weight_kg"] = Number.NaN; }
  try { const v = input.is_stackable === 'no' ? 0.15 : 0; results["stacking_penalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stacking_penalty"] = Number.NaN; }
  try { const v = input.hazardous_material === 'yes' ? 0.25 : 0; results["hazard_surcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hazard_surcharge"] = Number.NaN; }
  try { const v = input.package_type === 'box' ? 1.0 : input.package_type === 'pallet' ? 1.2 : 1.1; results["package_type_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["package_type_factor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["chargeable_weight_kg"])) * (1 + (toNumericFormulaValue(results["stacking_penalty"])) + (toNumericFormulaValue(results["hazard_surcharge"]))) * (toNumericFormulaValue(results["package_type_factor"])) * 2.5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateVolumetric_weight_calculator(input: Volumetric_weight_calculatorInput): Volumetric_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Incorrect carrier factor selection leading to overcharging","Non-stackable packages reducing truck fill rate"];
  const suggestedActions: string[] = ["Verify carrier DIM factor matches contract terms","Implement stackable packaging design to reduce penalties"];
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
