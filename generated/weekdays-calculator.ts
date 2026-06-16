// Auto-generated from weekdays-calculator-schema.json
import * as z from 'zod';

export interface Weekdays_calculatorInput {
  startDay: number;
  startMonth: number;
  startYear: number;
  endDay: number;
  endMonth: number;
  endYear: number;
}

export const Weekdays_calculatorInputSchema = z.object({
  startDay: z.number().default(1),
  startMonth: z.number().default(1),
  startYear: z.number().default(2025),
  endDay: z.number().default(31),
  endMonth: z.number().default(12),
  endYear: z.number().default(2025),
});

function evaluateAllFormulas(input: Weekdays_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (() => { var start=new Date(input.startYear,input.startMonth-1,input.startDay);var end=new Date(input.endYear,input.endMonth-1,input.endDay);var count=0;var d=new Date(start);while(d<=end){if(d.getDay()!==0&&d.getDay()!==6)count++;d.setDate(d.getDate()+1);}return count; })(); results["weekdaysCount"] = Number.isFinite(v) ? v : 0; } catch { results["weekdaysCount"] = 0; }
  try { const v = (() => { var start=new Date(input.startYear,input.startMonth-1,input.startDay);var end=new Date(input.endYear,input.endMonth-1,input.endDay);return Math.floor((end-start)/(1000*60*60*24))+1; })(); results["totalDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalDays"] = 0; }
  try { const v = (() => { var start=new Date(input.startYear,input.startMonth-1,input.startDay);var end=new Date(input.endYear,input.endMonth-1,input.endDay);var total=Math.floor((end-start)/(1000*60*60*24))+1;var weekdays=0;var d=new Date(start);while(d<=end){if(d.getDay()!==0&&d.getDay()!==6)weekdays++;d.setDate(d.getDate()+1);}return total-weekdays; })(); results["weekendDays"] = Number.isFinite(v) ? v : 0; } catch { results["weekendDays"] = 0; }
  return results;
}


export function calculateWeekdays_calculator(input: Weekdays_calculatorInput): Weekdays_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["weekdaysCount"] ?? 0;
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


export interface Weekdays_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
