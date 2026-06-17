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

function evaluateAllFormulas(input: World_clock_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.localHour * 60 + input.localMinute; results["totalLocalMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalLocalMinutes"] = 0; }
  try { const v = (results["totalLocalMinutes"] ?? 0) - input.sourceUTCOffset * 60; results["totalUTCMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalUTCMinutes"] = 0; }
  try { const v = (results["totalUTCMinutes"] ?? 0) + input.targetUTCOffset * 60; results["totalTargetMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalTargetMinutes"] = 0; }
  try { const v = (((results["totalTargetMinutes"] ?? 0) % 1440) + 1440) % 1440; results["targetTotalMinutesMod"] = Number.isFinite(v) ? v : 0; } catch { results["targetTotalMinutesMod"] = 0; }
  try { const v = Math.floor((results["targetTotalMinutesMod"] ?? 0) / 60); results["targetHour"] = Number.isFinite(v) ? v : 0; } catch { results["targetHour"] = 0; }
  try { const v = (results["targetTotalMinutesMod"] ?? 0) % 60; results["targetMinute"] = Number.isFinite(v) ? v : 0; } catch { results["targetMinute"] = 0; }
  try { const v = Math.floor((results["totalTargetMinutes"] ?? 0) / 1440); results["dayDiff"] = Number.isFinite(v) ? v : 0; } catch { results["dayDiff"] = 0; }
  try { const v = (results["dayDiff"] ?? 0) > 0 ? '+' + (results["dayDiff"] ?? 0) + ' day(s)' : (results["dayDiff"] ?? 0) < 0 ? (results["dayDiff"] ?? 0) + ' day(s)' : 'Same day'; results["dayChange"] = Number.isFinite(v) ? v : 0; } catch { results["dayChange"] = 0; }
  try { const v = (results["targetHour"] ?? 0).toString().padStart(2,'0') + ':' + (results["targetMinute"] ?? 0).toString().padStart(2,'0'); results["targetTimeString"] = Number.isFinite(v) ? v : 0; } catch { results["targetTimeString"] = 0; }
  try { const v = input.localHour.toString().padStart(2,'0') + ':' + input.localMinute.toString().padStart(2,'0') + ' (UTC' + (input.sourceUTCOffset >= 0 ? '+' + input.sourceUTCOffset : input.sourceUTCOffset) + ')'; results["sourceString"] = Number.isFinite(v) ? v : 0; } catch { results["sourceString"] = 0; }
  try { const v = (results["targetTimeString"] ?? 0) + ' (UTC' + (input.targetUTCOffset >= 0 ? '+' + input.targetUTCOffset : input.targetUTCOffset) + ')'; results["targetString"] = Number.isFinite(v) ? v : 0; } catch { results["targetString"] = 0; }
  results["____sourceString"] = 0;
  results["____targetString"] = 0;
  results["____dayChange"] = 0;
  try { const v = (results["targetTimeString"] ?? 0) + ' (' + (results["dayChange"] ?? 0) + ')'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateWorld_clock_calculator(input: World_clock_calculatorInput): World_clock_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
