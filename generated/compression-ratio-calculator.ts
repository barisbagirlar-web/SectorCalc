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

function evaluateAllFormulas(input: Compression_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (Math.PI/4) * Math.pow(input.bore, 2) * input.stroke / 1000; results["displacement"] = Number.isFinite(v) ? v : 0; } catch { results["displacement"] = 0; }
  try { const v = (Math.PI/4) * Math.pow(input.gasketBore, 2) * input.gasketThickness / 1000; results["gasketVolume"] = Number.isFinite(v) ? v : 0; } catch { results["gasketVolume"] = 0; }
  try { const v = (Math.PI/4) * Math.pow(input.bore, 2) * input.deckClearance / 1000; results["deckVolume"] = Number.isFinite(v) ? v : 0; } catch { results["deckVolume"] = 0; }
  try { const v = input.combustionChamberVolume + (results["gasketVolume"] ?? 0) + (results["deckVolume"] ?? 0) + input.pistonDishVolume; results["clearanceVolume"] = Number.isFinite(v) ? v : 0; } catch { results["clearanceVolume"] = 0; }
  try { const v = ((results["displacement"] ?? 0) + (results["clearanceVolume"] ?? 0)) / (results["clearanceVolume"] ?? 0); results["compressionRatio"] = Number.isFinite(v) ? v : 0; } catch { results["compressionRatio"] = 0; }
  return results;
}


export function calculateCompression_ratio_calculator(input: Compression_ratio_calculatorInput): Compression_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["compressionRatio"] ?? 0;
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


export interface Compression_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
