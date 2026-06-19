// Auto-generated from container-load-calculator-schema.json
import * as z from 'zod';

export interface Container_load_calculatorInput {
  container_type: string;
  cargo_length_cm: number;
  cargo_width_cm: number;
  cargo_height_cm: number;
  cargo_weight_kg: number;
  stacking_factor: number;
  load_secure_method: string;
  use_pallet: boolean;
  dataConfidence?: number;
}

export const Container_load_calculatorInputSchema = z.object({
  container_type: z.enum(['20ft_standard', '40ft_standard', '40ft_highcube', '20ft_open_top']).default('20ft_standard'),
  cargo_length_cm: z.number().min(10).max(1200).default(120),
  cargo_width_cm: z.number().min(10).max(240).default(100),
  cargo_height_cm: z.number().min(10).max(270).default(150),
  cargo_weight_kg: z.number().min(1).max(28000).default(500),
  stacking_factor: z.number().min(1).max(5).default(1),
  load_secure_method: z.enum(['blocking', 'lashing', 'shrink_wrap']).default('blocking'),
  use_pallet: z.boolean().default(true),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Container_load_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cargo_length_cm * input.cargo_width_cm * input.cargo_height_cm * input.cargo_weight_kg; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.cargo_length_cm * input.cargo_width_cm * input.cargo_height_cm * input.cargo_weight_kg * (input.stacking_factor); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.stacking_factor; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateContainer_load_calculator(input: Container_load_calculatorInput): Container_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-container optimization","Real-time carrier rate integration","3D load visualization"],
  };
}


export interface Container_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
