// Auto-generated from pps-calculator-schema.json
import * as z from 'zod';

export interface Pps_calculatorInput {
  conveyorSpeed: number;
  pieceSpacing: number;
  numLanes: number;
  efficiency: number;
  shiftDuration: number;
}

export const Pps_calculatorInputSchema = z.object({
  conveyorSpeed: z.number().default(1),
  pieceSpacing: z.number().default(0.5),
  numLanes: z.number().default(1),
  efficiency: z.number().default(100),
  shiftDuration: z.number().default(8),
});

function evaluateAllFormulas(input: Pps_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.conveyorSpeed / input.pieceSpacing) * input.numLanes * (input.efficiency / 100); results["productionRate_pps"] = Number.isFinite(v) ? v : 0; } catch { results["productionRate_pps"] = 0; }
  try { const v = (results["productionRate_pps"] ?? 0) * 60; results["productionRate_pcsPerMinute"] = Number.isFinite(v) ? v : 0; } catch { results["productionRate_pcsPerMinute"] = 0; }
  try { const v = (results["productionRate_pps"] ?? 0) * 3600; results["productionRate_pcsPerHour"] = Number.isFinite(v) ? v : 0; } catch { results["productionRate_pcsPerHour"] = 0; }
  try { const v = (results["productionRate_pps"] ?? 0) * 3600 * input.shiftDuration; results["productionRate_pcsPerShift"] = Number.isFinite(v) ? v : 0; } catch { results["productionRate_pcsPerShift"] = 0; }
  results["productionRate_pcsPerMinute_pieces_minut"] = 0;
  results["productionRate_pcsPerHour_pieces_hour"] = 0;
  results["productionRate_pcsPerShift_pieces_shift_"] = 0;
  return results;
}


export function calculatePps_calculator(input: Pps_calculatorInput): Pps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["productionRate_pps"] ?? 0;
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


export interface Pps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
