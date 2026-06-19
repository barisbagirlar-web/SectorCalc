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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Airbnb_profit_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.occupancyRate / 100 * input.nightsAvailable; results["bookedNights"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bookedNights"] = 0; }
  try { const v = (asFormulaNumber(results["bookedNights"])) / input.avgStay; results["totalBookings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalBookings"] = 0; }
  try { const v = input.nightlyRate * (asFormulaNumber(results["bookedNights"])) + input.cleaningFee * (asFormulaNumber(results["totalBookings"])); results["grossRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossRevenue"] = 0; }
  try { const v = input.airbnbFeePercent / 100 * (asFormulaNumber(results["grossRevenue"])); results["airbnbFee"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["airbnbFee"] = 0; }
  try { const v = (asFormulaNumber(results["grossRevenue"])) - (asFormulaNumber(results["airbnbFee"])); results["netRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netRevenue"] = 0; }
  try { const v = (asFormulaNumber(results["netRevenue"])) - input.monthlyExpenses; results["monthlyProfit"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["monthlyProfit"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateAirbnb_profit_calculator(input: Airbnb_profit_calculatorInput): Airbnb_profit_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["bookedNights"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
