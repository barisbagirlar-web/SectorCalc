// Auto-generated from fertilizer-dosage-calculator-schema.json
import * as z from 'zod';

export interface Fertilizer_dosage_calculatorInput {
  crop_type: string;
  target_yield: number;
  soil_nitrogen: number;
  soil_phosphorus: number;
  soil_potassium: number;
  application_efficiency: number;
  fertilizer_type_n: string;
  fertilizer_type_p: string;
  dataConfidence?: number;
}

export const Fertilizer_dosage_calculatorInputSchema = z.object({
  crop_type: z.enum(['corn', 'wheat', 'soybean', 'rice', 'cotton']).default('corn'),
  target_yield: z.number().min(1000).max(20000).default(8000),
  soil_nitrogen: z.number().min(0).max(100).default(15),
  soil_phosphorus: z.number().min(0).max(80).default(10),
  soil_potassium: z.number().min(0).max(400).default(120),
  application_efficiency: z.number().min(30).max(95).default(70),
  fertilizer_type_n: z.enum(['urea', 'ammonium_nitrate', 'ammonium_sulfate', 'anhydrous_ammonia']).default('urea'),
  fertilizer_type_p: z.enum(['dap', 'map', 'superphosphate', 'tsp']).default('dap'),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fertilizer_dosage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.target_yield * input.soil_nitrogen * input.soil_phosphorus * input.soil_potassium; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.target_yield * input.soil_nitrogen * input.soil_phosphorus * input.soil_potassium * ((input.application_efficiency / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = (input.application_efficiency / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFertilizer_dosage_calculator(input: Fertilizer_dosage_calculatorInput): Fertilizer_dosage_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-field comparison","Customizable reporting dashboard"],
  };
}


export interface Fertilizer_dosage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
