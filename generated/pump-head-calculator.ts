// Auto-generated from pump-head-calculator-schema.json
import * as z from 'zod';

export interface Pump_head_calculatorInput {
  suctionHead: number;
  dischargeHead: number;
  flowRate: number;
  pipeLength: number;
  pipeDiameter: number;
  roughnessCoefficient: number;
  dataConfidence?: number;
}

export const Pump_head_calculatorInputSchema = z.object({
  suctionHead: z.number().default(0),
  dischargeHead: z.number().default(10),
  flowRate: z.number().default(10),
  pipeLength: z.number().default(50),
  pipeDiameter: z.number().default(100),
  roughnessCoefficient: z.number().default(120),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pump_head_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dischargeHead - input.suctionHead; results["staticHead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["staticHead"] = Number.NaN; }
  try { const v = input.flowRate / 1000; results["Q"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["Q"] = Number.NaN; }
  try { const v = input.pipeDiameter / 1000; results["d"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["d"] = Number.NaN; }
  return results;
}


export function calculatePump_head_calculator(input: Pump_head_calculatorInput): Pump_head_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["d"]);
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


export interface Pump_head_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
