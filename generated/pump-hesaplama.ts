// Auto-generated from pump-hesaplama-schema.json
import * as z from 'zod';

export interface Pump_hesaplamaInput {
  flowRate: number;
  dataConfidence?: number;
}

export const Pump_hesaplamaInputSchema = z.object({
  flowRate: z.number().min(0).default(50),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pump_hesaplamaInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate * (1 + input.flowRate/500) + Math.sqrt(input.flowRate) * 5; results["main"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["main"] = Number.NaN; }
  try { const v = input.flowRate * (1 + input.flowRate/500) + Math.sqrt(input.flowRate) * 5; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  return results;
}


export function calculatePump_hesaplama(input: Pump_hesaplamaInput): Pump_hesaplamaOutput {
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
    unit: "L/min",
    premiumRequired: false,
    premiumFeatures: ["PDF report","Scenario comparison"],
  };
}


export interface Pump_hesaplamaOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { result: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Pump_hesaplamaOutputMeta = {
  primaryKey: "result",
  unit: "L/min",
  breakdownKeys: ["result"],
} as const;

