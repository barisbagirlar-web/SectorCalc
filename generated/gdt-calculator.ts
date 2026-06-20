// Auto-generated from gdt-calculator-schema.json
import * as z from 'zod';

export interface Gdt_calculatorInput {
  nominal_size: number;
  tolerance_value: number;
  feature_tolerance: number;
  datum_shift: number;
  bonus_tolerance: number;
  angle: number;
  dataConfidence?: number;
}

export const Gdt_calculatorInputSchema = z.object({
  nominal_size: z.number().default(50),
  tolerance_value: z.number().default(0.1),
  feature_tolerance: z.number().default(0.05),
  datum_shift: z.number().default(0),
  bonus_tolerance: z.number().default(0),
  angle: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gdt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tolerance_value + input.bonus_tolerance + input.datum_shift; results["total_tolerance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_tolerance"] = Number.NaN; }
  try { const v = input.nominal_size + input.feature_tolerance; results["mmc_size"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mmc_size"] = Number.NaN; }
  try { const v = input.nominal_size - input.feature_tolerance; results["lmc_size"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["lmc_size"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["mmc_size"])) + (toNumericFormulaValue(results["total_tolerance"])); results["virtual_condition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["virtual_condition"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["lmc_size"])) - (toNumericFormulaValue(results["total_tolerance"])); results["resultant_condition"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["resultant_condition"] = Number.NaN; }
  return results;
}


export function calculateGdt_calculator(input: Gdt_calculatorInput): Gdt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_tolerance"]);
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


export interface Gdt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
