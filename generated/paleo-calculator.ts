// Auto-generated from paleo-calculator-schema.json
import * as z from 'zod';

export interface Paleo_calculatorInput {
  palletLength: number;
  palletWidth: number;
  maxHeight: number;
  maxLoad: number;
  boxLength: number;
  boxWidth: number;
  boxHeight: number;
  boxWeight: number;
}

export const Paleo_calculatorInputSchema = z.object({
  palletLength: z.number().default(1200),
  palletWidth: z.number().default(800),
  maxHeight: z.number().default(1500),
  maxLoad: z.number().default(1000),
  boxLength: z.number().default(400),
  boxWidth: z.number().default(300),
  boxHeight: z.number().default(200),
  boxWeight: z.number().default(10),
});

function evaluateAllFormulas(input: Paleo_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.floor(input.palletLength / input.boxLength) * Math.floor(input.palletWidth / input.boxWidth); results["boxesPerLayer1"] = Number.isFinite(v) ? v : 0; } catch { results["boxesPerLayer1"] = 0; }
  try { const v = Math.floor(input.palletLength / input.boxWidth) * Math.floor(input.palletWidth / input.boxLength); results["boxesPerLayer2"] = Number.isFinite(v) ? v : 0; } catch { results["boxesPerLayer2"] = 0; }
  try { const v = Math.max((results["boxesPerLayer1"] ?? 0), (results["boxesPerLayer2"] ?? 0)); results["bestBoxesPerLayer"] = Number.isFinite(v) ? v : 0; } catch { results["bestBoxesPerLayer"] = 0; }
  try { const v = Math.floor(input.maxHeight / input.boxHeight); results["maxLayersByHeight"] = Number.isFinite(v) ? v : 0; } catch { results["maxLayersByHeight"] = 0; }
  try { const v = Math.floor(input.maxLoad / ((results["bestBoxesPerLayer"] ?? 0) * input.boxWeight)); results["maxLayersByWeight"] = Number.isFinite(v) ? v : 0; } catch { results["maxLayersByWeight"] = 0; }
  try { const v = Math.min((results["maxLayersByHeight"] ?? 0), (results["maxLayersByWeight"] ?? 0)); results["numberOfLayers"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfLayers"] = 0; }
  try { const v = (results["bestBoxesPerLayer"] ?? 0) * (results["numberOfLayers"] ?? 0); results["totalBoxes"] = Number.isFinite(v) ? v : 0; } catch { results["totalBoxes"] = 0; }
  try { const v = (results["totalBoxes"] ?? 0) * input.boxWeight; results["totalWeight"] = Number.isFinite(v) ? v : 0; } catch { results["totalWeight"] = 0; }
  return results;
}


export function calculatePaleo_calculator(input: Paleo_calculatorInput): Paleo_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalBoxes"] ?? 0;
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


export interface Paleo_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
