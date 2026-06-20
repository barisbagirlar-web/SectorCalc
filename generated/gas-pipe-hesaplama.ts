// Auto-generated from gas-pipe-hesaplama-schema.json
import * as z from 'zod';

export interface Gas_pipe_hesaplamaInput {
  innerPressure: number;
  dataConfidence?: number;
}

export const Gas_pipe_hesaplamaInputSchema = z.object({
  innerPressure: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Gas_pipe_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.innerPressure * (1 + input.innerPressure/500) + Math.sqrt(input.innerPressure) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.innerPressure * (1 + input.innerPressure/500) + Math.sqrt(input.innerPressure) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculateGas_pipe_hesaplama(input: Gas_pipe_hesaplamaInput): Gas_pipe_hesaplamaOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    result: toNumericFormulaValue(values["result"])
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review assumptions."];
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
    unit: "Pa",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Gas_pipe_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Gas_pipe_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "Pa",
  breakdownKeys: ["result"],
} as const;

