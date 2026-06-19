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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gdt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.tolerance_value + input.bonus_tolerance + input.datum_shift; results["total_tolerance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["total_tolerance"] = 0; }
  try { const v = input.nominal_size + input.feature_tolerance; results["mmc_size"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["mmc_size"] = 0; }
  try { const v = input.nominal_size - input.feature_tolerance; results["lmc_size"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["lmc_size"] = 0; }
  try { const v = (asFormulaNumber(results["mmc_size"])) + (asFormulaNumber(results["total_tolerance"])); results["virtual_condition"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["virtual_condition"] = 0; }
  try { const v = (asFormulaNumber(results["lmc_size"])) - (asFormulaNumber(results["total_tolerance"])); results["resultant_condition"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["resultant_condition"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGdt_calculator(input: Gdt_calculatorInput): Gdt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["total_tolerance"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
