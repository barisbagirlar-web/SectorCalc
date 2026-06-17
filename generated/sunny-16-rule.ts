// @ts-nocheck
// Auto-generated from sunny-16-rule-schema.json
import * as z from 'zod';

export interface Sunny_16_ruleInput {
  aperture: number;
  iso: number;
  lightCondition: number;
  ndFilter: number;
}

export const Sunny_16_ruleInputSchema = z.object({
  aperture: z.number().default(16),
  iso: z.number().default(100),
  lightCondition: z.number().default(0),
  ndFilter: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sunny_16_ruleInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = 1 / (input.iso / 100); results["baseShutterSpeed"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseShutterSpeed"] = 0; }
  try { const v = 1 / (input.iso / 100); results["baseShutterSpeed_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["baseShutterSpeed_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSunny_16_rule(input: Sunny_16_ruleInput): Sunny_16_ruleOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["baseShutterSpeed_aux"]);
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


export interface Sunny_16_ruleOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
