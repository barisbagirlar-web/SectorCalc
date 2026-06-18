// @ts-nocheck
// Auto-generated from compression-ratio-calculator-schema.json
import * as z from 'zod';

export interface Compression_ratio_calculatorInput {
  bore: number;
  stroke: number;
  combustionChamberVolume: number;
  gasketThickness: number;
  gasketBore: number;
  deckClearance: number;
  pistonDishVolume: number;
}

export const Compression_ratio_calculatorInputSchema = z.object({
  bore: z.number().default(86),
  stroke: z.number().default(86),
  combustionChamberVolume: z.number().default(60),
  gasketThickness: z.number().default(1.2),
  gasketBore: z.number().default(87),
  deckClearance: z.number().default(0.5),
  pistonDishVolume: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Compression_ratio_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.bore * input.stroke * input.combustionChamberVolume * input.gasketThickness; results["normalized_product"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.bore * input.stroke * input.combustionChamberVolume * input.gasketThickness * (input.gasketBore * input.deckClearance * input.pistonDishVolume); results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.gasketBore * input.deckClearance * input.pistonDishVolume; results["adjustment_factor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCompression_ratio_calculator(input: Compression_ratio_calculatorInput): Compression_ratio_calculatorOutput {
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Compression_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
