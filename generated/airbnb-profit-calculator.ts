// Auto-generated from airbnb-profit-calculator-schema.json
import * as z from 'zod';

export interface Airbnb_profit_calculatorInput {
  nightlyRate: number;
  occupancyRate: number;
  nightsAvailable: number;
  avgStay: number;
  cleaningFee: number;
  airbnbFeePercent: number;
  monthlyExpenses: number;
}

export const Airbnb_profit_calculatorInputSchema = z.object({
  nightlyRate: z.number().default(150),
  occupancyRate: z.number().default(60),
  nightsAvailable: z.number().default(30),
  avgStay: z.number().default(3),
  cleaningFee: z.number().default(50),
  airbnbFeePercent: z.number().default(3),
  monthlyExpenses: z.number().default(2000),
});

function evaluateAllFormulas(input: Airbnb_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.occupancyRate / 100 * input.nightsAvailable; results["bookedNights"] = Number.isFinite(v) ? v : 0; } catch { results["bookedNights"] = 0; }
  try { const v = (results["bookedNights"] ?? 0) / input.avgStay; results["totalBookings"] = Number.isFinite(v) ? v : 0; } catch { results["totalBookings"] = 0; }
  try { const v = input.nightlyRate * (results["bookedNights"] ?? 0) + input.cleaningFee * (results["totalBookings"] ?? 0); results["grossRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["grossRevenue"] = 0; }
  try { const v = input.airbnbFeePercent / 100 * (results["grossRevenue"] ?? 0); results["airbnbFee"] = Number.isFinite(v) ? v : 0; } catch { results["airbnbFee"] = 0; }
  try { const v = (results["grossRevenue"] ?? 0) - (results["airbnbFee"] ?? 0); results["netRevenue"] = Number.isFinite(v) ? v : 0; } catch { results["netRevenue"] = 0; }
  try { const v = (results["netRevenue"] ?? 0) - input.monthlyExpenses; results["monthlyProfit"] = Number.isFinite(v) ? v : 0; } catch { results["monthlyProfit"] = 0; }
  return results;
}


export function calculateAirbnb_profit_calculator(input: Airbnb_profit_calculatorInput): Airbnb_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["monthlyProfit"] ?? 0;
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


export interface Airbnb_profit_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
