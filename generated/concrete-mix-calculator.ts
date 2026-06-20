// Auto-generated from concrete-mix-calculator-schema.json
import * as z from 'zod';

export interface Concrete_mix_calculatorInput {
  concreteVolume: number;
  cementRatio: number;
  sandRatio: number;
  aggregateRatio: number;
  waterCementRatio: number;
  dryFactor: number;
  wastagePercent: number;
  dataConfidence?: number;
}

export const Concrete_mix_calculatorInputSchema = z.object({
  concreteVolume: z.number().default(1),
  cementRatio: z.number().default(1),
  sandRatio: z.number().default(1.5),
  aggregateRatio: z.number().default(3),
  waterCementRatio: z.number().default(0.5),
  dryFactor: z.number().default(1.54),
  wastagePercent: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Concrete_mix_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.cementRatio + input.sandRatio + input.aggregateRatio; results["sumRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sumRatio"] = Number.NaN; }
  try { const v = input.concreteVolume * input.dryFactor; results["dryVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dryVolume"] = Number.NaN; }
  try { const v = (input.cementRatio / (toNumericFormulaValue(results["sumRatio"]))) * (toNumericFormulaValue(results["dryVolume"])); results["cementVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cementVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cementVolume"])) * 1440; results["cementWeightBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cementWeightBase"] = Number.NaN; }
  try { const v = (input.sandRatio / (toNumericFormulaValue(results["sumRatio"]))) * (toNumericFormulaValue(results["dryVolume"])); results["sandVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sandVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["sandVolume"])) * 1600; results["sandWeightBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sandWeightBase"] = Number.NaN; }
  try { const v = (input.aggregateRatio / (toNumericFormulaValue(results["sumRatio"]))) * (toNumericFormulaValue(results["dryVolume"])); results["aggregateVolume"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aggregateVolume"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["aggregateVolume"])) * 1500; results["aggregateWeightBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aggregateWeightBase"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cementWeightBase"])) * input.waterCementRatio; results["waterWeightBase"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterWeightBase"] = Number.NaN; }
  try { const v = 1 + input.wastagePercent / 100; results["wastageFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastageFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cementWeightBase"])) * (toNumericFormulaValue(results["wastageFactor"])); results["cementWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cementWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["sandWeightBase"])) * (toNumericFormulaValue(results["wastageFactor"])); results["sandWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sandWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["aggregateWeightBase"])) * (toNumericFormulaValue(results["wastageFactor"])); results["aggregateWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["aggregateWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["waterWeightBase"])) * (toNumericFormulaValue(results["wastageFactor"])); results["waterWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cementWeight"])) + (toNumericFormulaValue(results["sandWeight"])) + (toNumericFormulaValue(results["aggregateWeight"])); results["totalDryWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDryWeight"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalDryWeight"])) + (toNumericFormulaValue(results["waterWeight"])); results["totalMixWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalMixWeight"] = Number.NaN; }
  return results;
}


export function calculateConcrete_mix_calculator(input: Concrete_mix_calculatorInput): Concrete_mix_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMixWeight"]);
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


export interface Concrete_mix_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
