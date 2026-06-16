// Auto-generated from chain-drive-calculator-schema.json
import * as z from 'zod';

export interface Chain_drive_calculatorInput {
  driverTeeth: number;
  drivenTeeth: number;
  pitch: number;
  centerDistance: number;
}

export const Chain_drive_calculatorInputSchema = z.object({
  driverTeeth: z.number().default(17),
  drivenTeeth: z.number().default(34),
  pitch: z.number().default(12.7),
  centerDistance: z.number().default(500),
});

function evaluateAllFormulas(input: Chain_drive_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (2 * input.centerDistance / input.pitch + (input.driverTeeth + input.drivenTeeth) / 2 + ((input.drivenTeeth - input.driverTeeth) ** 2 * input.pitch) / (4 * Math.PI ** 2 * input.centerDistance)) * input.pitch; results["chainLengthMm"] = Number.isFinite(v) ? v : 0; } catch { results["chainLengthMm"] = 0; }
  try { const v = 2 * input.centerDistance / input.pitch + (input.driverTeeth + input.drivenTeeth) / 2 + ((input.drivenTeeth - input.driverTeeth) ** 2 * input.pitch) / (4 * Math.PI ** 2 * input.centerDistance); results["chainLengthPitches"] = Number.isFinite(v) ? v : 0; } catch { results["chainLengthPitches"] = 0; }
  try { const v = input.driverTeeth / input.drivenTeeth; results["speedRatio"] = Number.isFinite(v) ? v : 0; } catch { results["speedRatio"] = 0; }
  try { const v = input.pitch / Math.sin(Math.PI / input.driverTeeth); results["pitchDiameterDriver"] = Number.isFinite(v) ? v : 0; } catch { results["pitchDiameterDriver"] = 0; }
  try { const v = input.pitch / Math.sin(Math.PI / input.drivenTeeth); results["pitchDiameterDriven"] = Number.isFinite(v) ? v : 0; } catch { results["pitchDiameterDriven"] = 0; }
  return results;
}


export function calculateChain_drive_calculator(input: Chain_drive_calculatorInput): Chain_drive_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["chainLengthMm"] ?? 0;
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


export interface Chain_drive_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
