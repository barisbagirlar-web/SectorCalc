// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pps_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.conveyorSpeed / input.pieceSpacing) * input.numLanes * (input.efficiency / 100); results["productionRate_pps"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["productionRate_pps"] = 0; }
  try { const v = (asFormulaNumber(results["productionRate_pps"])) * 60; results["productionRate_pcsPerMinute"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["productionRate_pcsPerMinute"] = 0; }
  try { const v = (asFormulaNumber(results["productionRate_pps"])) * 3600; results["productionRate_pcsPerHour"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["productionRate_pcsPerHour"] = 0; }
  try { const v = (asFormulaNumber(results["productionRate_pps"])) * 3600 * input.shiftDuration; results["productionRate_pcsPerShift"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["productionRate_pcsPerShift"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePps_calculator(input: Pps_calculatorInput): Pps_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["productionRate_pps"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Pps_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
