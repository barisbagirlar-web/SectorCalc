// @ts-nocheck
// Auto-generated from sweat-equity-calculator-schema.json
import * as z from 'zod';

export interface Sweat_equity_calculatorInput {
  preMoneyValuation: number;
  cashInvestment: number;
  hoursWorked: number;
  hourlyRate: number;
}

export const Sweat_equity_calculatorInputSchema = z.object({
  preMoneyValuation: z.number().default(1000000),
  cashInvestment: z.number().default(200000),
  hoursWorked: z.number().default(2000),
  hourlyRate: z.number().default(50),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sweat_equity_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.hoursWorked * input.hourlyRate; results["sweatValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["sweatValue"] = 0; }
  try { const v = input.preMoneyValuation + input.cashInvestment + (asFormulaNumber(results["sweatValue"])); results["postMoneyValuation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["postMoneyValuation"] = 0; }
  try { const v = ((asFormulaNumber(results["sweatValue"])) / (asFormulaNumber(results["postMoneyValuation"]))) * 100; results["equityPercentage"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["equityPercentage"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSweat_equity_calculator(input: Sweat_equity_calculatorInput): Sweat_equity_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["equityPercentage"]);
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


export interface Sweat_equity_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
