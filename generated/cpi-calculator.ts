// Auto-generated from cpi-calculator-schema.json
import * as z from 'zod';

export interface Cpi_calculatorInput {
  ev: number;
  ac: number;
  pv: number;
  bac: number;
  dataConfidence?: number;
}

export const Cpi_calculatorInputSchema = z.object({
  ev: z.number().default(0),
  ac: z.number().default(0),
  pv: z.number().default(0),
  bac: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Cpi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ev / input.ac; results["cpi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cpi"] = Number.NaN; }
  try { const v = input.ev - input.ac; results["cv"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cv"] = Number.NaN; }
  try { const v = input.ev / input.pv; results["spi"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["spi"] = Number.NaN; }
  try { const v = input.bac / (input.ev / input.ac); results["eac"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eac"] = Number.NaN; }
  return results;
}


export function calculateCpi_calculator(input: Cpi_calculatorInput): Cpi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["cpi"]);
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


export interface Cpi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
