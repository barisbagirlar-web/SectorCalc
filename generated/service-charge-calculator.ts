// @ts-nocheck
// Auto-generated from service-charge-calculator-schema.json
import * as z from 'zod';

export interface Service_charge_calculatorInput {
  baseAmount: number;
  serviceChargeRate: number;
  minServiceCharge: number;
  partySize: number;
  partyThreshold: number;
}

export const Service_charge_calculatorInputSchema = z.object({
  baseAmount: z.number().default(0),
  serviceChargeRate: z.number().default(18),
  minServiceCharge: z.number().default(5),
  partySize: z.number().default(1),
  partyThreshold: z.number().default(6),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Service_charge_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.baseAmount + input.serviceChargeRate + input.minServiceCharge; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.baseAmount + input.serviceChargeRate + input.minServiceCharge; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateService_charge_calculator(input: Service_charge_calculatorInput): Service_charge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Service_charge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
