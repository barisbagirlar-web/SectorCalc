// Auto-generated from cpi-calculator-schema.json
import * as z from 'zod';

export interface Cpi_calculatorInput {
  ev: number;
  ac: number;
  pv: number;
  bac: number;
}

export const Cpi_calculatorInputSchema = z.object({
  ev: z.number().default(0),
  ac: z.number().default(0),
  pv: z.number().default(0),
  bac: z.number().default(0),
});

function evaluateAllFormulas(input: Cpi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ev / input.ac; results["cpi"] = Number.isFinite(v) ? v : 0; } catch { results["cpi"] = 0; }
  try { const v = input.ev - input.ac; results["cv"] = Number.isFinite(v) ? v : 0; } catch { results["cv"] = 0; }
  try { const v = input.ev / input.pv; results["spi"] = Number.isFinite(v) ? v : 0; } catch { results["spi"] = 0; }
  try { const v = input.bac / (input.ev / input.ac); results["eac"] = Number.isFinite(v) ? v : 0; } catch { results["eac"] = 0; }
  return results;
}


export function calculateCpi_calculator(input: Cpi_calculatorInput): Cpi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["cpi"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
