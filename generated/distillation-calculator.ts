// @ts-nocheck
// Auto-generated from distillation-calculator-schema.json
import * as z from 'zod';

export interface Distillation_calculatorInput {
  feedFlow: number;
  feedComposition: number;
  distillateComposition: number;
  bottomsComposition: number;
  relativeVolatility: number;
}

export const Distillation_calculatorInputSchema = z.object({
  feedFlow: z.number().default(100),
  feedComposition: z.number().default(0.5),
  distillateComposition: z.number().default(0.95),
  bottomsComposition: z.number().default(0.05),
  relativeVolatility: z.number().default(2.5),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Distillation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.feedFlow * (input.feedComposition - input.bottomsComposition) / (input.distillateComposition - input.bottomsComposition); results["distillateFlowRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["distillateFlowRate"] = 0; }
  try { const v = input.feedFlow * (input.distillateComposition - input.feedComposition) / (input.distillateComposition - input.bottomsComposition); results["bottomFlowRate"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["bottomFlowRate"] = 0; }
  try { const v = (1 / (input.relativeVolatility - 1)) * ((input.distillateComposition / input.feedComposition) - input.relativeVolatility * (1 - input.distillateComposition) / (1 - input.feedComposition)); results["minimumRefluxRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["minimumRefluxRatio"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDistillation_calculator(input: Distillation_calculatorInput): Distillation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["distillateFlowRate"]);
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


export interface Distillation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
