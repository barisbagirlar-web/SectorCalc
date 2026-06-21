// Auto-generated from darcy-weisbach-pipe-flow-calculator-schema.json
import * as z from 'zod';

export interface Darcy_weisbach_pipe_flow_calculatorInput {
  flowRate: number;
  diameter: number;
  length: number;
  roughness: number;
  density: number;
  viscosity: number;
  kFactors: number;
  pumpEfficiency: number;
  dataConfidence?: number;
}

export const Darcy_weisbach_pipe_flow_calculatorInputSchema = z.object({
  flowRate: z.number().min(0).default(0),
  diameter: z.number().min(0).default(0),
  length: z.number().min(0).default(0),
  roughness: z.number().min(0).default(0),
  density: z.number().min(0).default(0),
  viscosity: z.number().min(0).default(0),
  kFactors: z.number().min(0).default(0),
  pumpEfficiency: z.number().min(0).default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Darcy_weisbach_pipe_flow_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flowRate * input.diameter * input.length * input.roughness; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.flowRate * input.diameter * input.length * input.roughness * (input.density * input.viscosity * input.kFactors * (input.pumpEfficiency / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.density * input.viscosity * input.kFactors * (input.pumpEfficiency / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateDarcy_weisbach_pipe_flow_calculator(input: Darcy_weisbach_pipe_flow_calculatorInput): Darcy_weisbach_pipe_flow_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    normalized_product: toNumericFormulaValue(values["normalized_product"]),
    adjustment_factor: toNumericFormulaValue(values["adjustment_factor"])
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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
    unit: "%",
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Verdict report"],
  };
}


export interface Darcy_weisbach_pipe_flow_calculatorOutput {
  totalWasteCost: number;
  unit: string;
  breakdown: { normalized_product: number; adjustment_factor: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
};

export const Darcy_weisbach_pipe_flow_calculatorOutputMeta = {
  primaryKey: "result",
  unit: "%",
  breakdownKeys: ["normalized_product","adjustment_factor"],
} as const;

