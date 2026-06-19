// Auto-generated from beam-weight-calculator-schema.json
import * as z from 'zod';

export interface Beam_weight_calculatorInput {
  beam_type: string;
  material_density: number;
  length: number;
  flange_width: number;
  flange_thickness: number;
  web_height: number;
  web_thickness: number;
  quantity: number;
  dataConfidence?: number;
}

export const Beam_weight_calculatorInputSchema = z.object({
  beam_type: z.enum(['I-beam', 'H-beam', 'C-channel', 'Angle', 'T-beam']).default('I-beam'),
  material_density: z.number().min(7000).max(9000).default(7850),
  length: z.number().min(0.5).max(30).default(6),
  flange_width: z.number().min(50).max(1000).default(200),
  flange_thickness: z.number().min(4).max(100).default(12),
  web_height: z.number().min(100).max(1200).default(300),
  web_thickness: z.number().min(3).max(50).default(8),
  quantity: z.number().min(1).max(10000).default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Beam_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.material_density * input.length * input.flange_width * input.flange_thickness; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.material_density * input.length * input.flange_width * input.flange_thickness * (input.web_height * input.web_thickness * input.quantity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.web_height * input.web_thickness * input.quantity; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBeam_weight_calculator(input: Beam_weight_calculatorInput): Beam_weight_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-beam comparison","Custom material database","API integration"],
  };
}


export interface Beam_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
