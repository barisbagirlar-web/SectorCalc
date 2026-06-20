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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Beam_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flange_width * input.flange_thickness * 2 + input.web_height * input.web_thickness; results["cross_section_area"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cross_section_area"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cross_section_area"])) * input.length * 1e-6; results["volume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["volume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["volume"])) * input.material_density; results["weight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weight"])) * input.quantity; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateBeam_weight_calculator(input: Beam_weight_calculatorInput): Beam_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    cross_section_area: toNumericFormulaValue(values["cross_section_area"]),
    volume: toNumericFormulaValue(values["volume"]),
    weight: toNumericFormulaValue(values["weight"])
  };
  const hiddenLossDrivers: string[] = ["Flange/web thickness variation due to mill tolerances","Length measurement errors from thermal expansion"];
  const suggestedActions: string[] = ["Verify actual dimensions with calipers before cutting","Apply material density correction based on mill certificate"];
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
    unit: "kg",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-beam comparison","Custom material database","API integration"],
  };
}


export interface Beam_weight_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { cross_section_area: number; volume: number; weight: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Beam_weight_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "kg",
  breakdownKeys: ["cross_section_area","volume","weight"],
} as const;

