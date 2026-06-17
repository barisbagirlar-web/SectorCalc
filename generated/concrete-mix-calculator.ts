// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Concrete_mix_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.cementRatio + input.sandRatio + input.aggregateRatio; results["sumRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sumRatio"] = 0; }
  try { const v = input.concreteVolume * input.dryFactor; results["dryVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["dryVolume"] = 0; }
  try { const v = (input.cementRatio / (asFormulaNumber(results["sumRatio"]))) * (asFormulaNumber(results["dryVolume"])); results["cementVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cementVolume"] = 0; }
  try { const v = (asFormulaNumber(results["cementVolume"])) * 1440; results["cementWeightBase"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cementWeightBase"] = 0; }
  try { const v = (input.sandRatio / (asFormulaNumber(results["sumRatio"]))) * (asFormulaNumber(results["dryVolume"])); results["sandVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sandVolume"] = 0; }
  try { const v = (asFormulaNumber(results["sandVolume"])) * 1600; results["sandWeightBase"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sandWeightBase"] = 0; }
  try { const v = (input.aggregateRatio / (asFormulaNumber(results["sumRatio"]))) * (asFormulaNumber(results["dryVolume"])); results["aggregateVolume"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["aggregateVolume"] = 0; }
  try { const v = (asFormulaNumber(results["aggregateVolume"])) * 1500; results["aggregateWeightBase"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["aggregateWeightBase"] = 0; }
  try { const v = (asFormulaNumber(results["cementWeightBase"])) * input.waterCementRatio; results["waterWeightBase"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterWeightBase"] = 0; }
  try { const v = 1 + input.wastagePercent / 100; results["wastageFactor"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["wastageFactor"] = 0; }
  try { const v = (asFormulaNumber(results["cementWeightBase"])) * (asFormulaNumber(results["wastageFactor"])); results["cementWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["cementWeight"] = 0; }
  try { const v = (asFormulaNumber(results["sandWeightBase"])) * (asFormulaNumber(results["wastageFactor"])); results["sandWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sandWeight"] = 0; }
  try { const v = (asFormulaNumber(results["aggregateWeightBase"])) * (asFormulaNumber(results["wastageFactor"])); results["aggregateWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["aggregateWeight"] = 0; }
  try { const v = (asFormulaNumber(results["waterWeightBase"])) * (asFormulaNumber(results["wastageFactor"])); results["waterWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["waterWeight"] = 0; }
  try { const v = (asFormulaNumber(results["cementWeight"])) + (asFormulaNumber(results["sandWeight"])) + (asFormulaNumber(results["aggregateWeight"])); results["totalDryWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalDryWeight"] = 0; }
  try { const v = (asFormulaNumber(results["totalDryWeight"])) + (asFormulaNumber(results["waterWeight"])); results["totalMixWeight"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMixWeight"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateConcrete_mix_calculator(input: Concrete_mix_calculatorInput): Concrete_mix_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalMixWeight"]);
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


export interface Concrete_mix_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
