// Auto-generated from beam-reaction-calculator-schema.json
import * as z from 'zod';

export interface Beam_reaction_calculatorInput {
  beamLength: number;
  load1: number;
  pos1: number;
  load2: number;
  pos2: number;
  load3: number;
  pos3: number;
}

export const Beam_reaction_calculatorInputSchema = z.object({
  beamLength: z.number().default(5),
  load1: z.number().default(10),
  pos1: z.number().default(2),
  load2: z.number().default(0),
  pos2: z.number().default(3),
  load3: z.number().default(0),
  pos3: z.number().default(4),
});

function evaluateAllFormulas(input: Beam_reaction_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.load1*(input.beamLength-input.pos1) + input.load2*(input.beamLength-input.pos2) + input.load3*(input.beamLength-input.pos3)) / input.beamLength; results["solMesnetTepkisi"] = Number.isFinite(v) ? v : 0; } catch { results["solMesnetTepkisi"] = 0; }
  try { const v = (input.load1*input.pos1 + input.load2*input.pos2 + input.load3*input.pos3) / input.beamLength; results["sagMesnetTepkisi"] = Number.isFinite(v) ? v : 0; } catch { results["sagMesnetTepkisi"] = 0; }
  return results;
}


export function calculateBeam_reaction_calculator(input: Beam_reaction_calculatorInput): Beam_reaction_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["solMesnetTepkisi"] ?? 0;
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


export interface Beam_reaction_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
