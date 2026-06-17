// @ts-nocheck
// Auto-generated from pump-head-calculator-schema.json
import * as z from 'zod';

export interface Pump_head_calculatorInput {
  suctionHead: number;
  dischargeHead: number;
  flowRate: number;
  pipeLength: number;
  pipeDiameter: number;
  roughnessCoefficient: number;
}

export const Pump_head_calculatorInputSchema = z.object({
  suctionHead: z.number().default(0),
  dischargeHead: z.number().default(10),
  flowRate: z.number().default(10),
  pipeLength: z.number().default(50),
  pipeDiameter: z.number().default(100),
  roughnessCoefficient: z.number().default(120),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pump_head_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.dischargeHead - input.suctionHead; results["staticHead"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["staticHead"] = 0; }
  try { const v = input.flowRate / 1000; results["Q"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["Q"] = 0; }
  try { const v = input.pipeDiameter / 1000; results["d"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["d"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePump_head_calculator(input: Pump_head_calculatorInput): Pump_head_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["d"]);
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


export interface Pump_head_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
