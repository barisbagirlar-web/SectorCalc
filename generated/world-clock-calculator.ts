// @ts-nocheck
// Auto-generated from world-clock-calculator-schema.json
import * as z from 'zod';

export interface World_clock_calculatorInput {
  localHour: number;
  localMinute: number;
  sourceUTCOffset: number;
  targetUTCOffset: number;
}

export const World_clock_calculatorInputSchema = z.object({
  localHour: z.number().default(12),
  localMinute: z.number().default(0),
  sourceUTCOffset: z.number().default(0),
  targetUTCOffset: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: World_clock_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.localHour * 60 + input.localMinute; results["totalLocalMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalLocalMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["totalLocalMinutes"])) - input.sourceUTCOffset * 60; results["totalUTCMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalUTCMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["totalUTCMinutes"])) + input.targetUTCOffset * 60; results["totalTargetMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalTargetMinutes"] = 0; }
  try { const v = (((asFormulaNumber(results["totalTargetMinutes"])) % 1440) + 1440) % 1440; results["targetTotalMinutesMod"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["targetTotalMinutesMod"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateWorld_clock_calculator(input: World_clock_calculatorInput): World_clock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["targetTotalMinutesMod"]);
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


export interface World_clock_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
