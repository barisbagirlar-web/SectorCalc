// Auto-generated from time-zone-converter-calculator-schema.json
import * as z from 'zod';

export interface Time_zone_converter_calculatorInput {
  inputHours: number;
  inputMinutes: number;
  sourceOffsetHours: number;
  sourceOffsetMinutes: number;
  targetOffsetHours: number;
  targetOffsetMinutes: number;
}

export const Time_zone_converter_calculatorInputSchema = z.object({
  inputHours: z.number().default(12),
  inputMinutes: z.number().default(0),
  sourceOffsetHours: z.number().default(0),
  sourceOffsetMinutes: z.number().default(0),
  targetOffsetHours: z.number().default(3),
  targetOffsetMinutes: z.number().default(0),
});

function evaluateAllFormulas(input: Time_zone_converter_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sourceOffsetHours * 60 + input.sourceOffsetMinutes; results["sourceOffsetTotalMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["sourceOffsetTotalMinutes"] = 0; }
  try { const v = input.targetOffsetHours * 60 + input.targetOffsetMinutes; results["targetOffsetTotalMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["targetOffsetTotalMinutes"] = 0; }
  try { const v = (input.inputHours * 60 + input.inputMinutes - (input.sourceOffsetHours * 60 + input.sourceOffsetMinutes) + 1440) % 1440; results["utcMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["utcMinutes"] = 0; }
  try { const v = (function(){ var tm = ((inputHours * 60 + inputMinutes - (sourceOffsetHours * 60 + sourceOffsetMinutes) + 1440) % 1440 + (targetOffsetHours * 60 + targetOffsetMinutes) + 1440) % 1440; var h = Math.floor(tm / 60); var m = tm % 60; return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m; })(); results["targetTime"] = Number.isFinite(v) ? v : 0; } catch { results["targetTime"] = 0; }
  return results;
}


export function calculateTime_zone_converter_calculator(input: Time_zone_converter_calculatorInput): Time_zone_converter_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["targetTime"] ?? 0;
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


export interface Time_zone_converter_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
