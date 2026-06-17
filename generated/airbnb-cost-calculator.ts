// @ts-nocheck
// Auto-generated from airbnb-cost-calculator-schema.json
import * as z from 'zod';

export interface Airbnb_cost_calculatorInput {
  nightlyRate: number;
  numNights: number;
  cleaningFee: number;
  serviceFeeRate: number;
  occupancyTaxRate: number;
  extraGuestFee: number;
  extraGuests: number;
  discountRate: number;
}

export const Airbnb_cost_calculatorInputSchema = z.object({
  nightlyRate: z.number().default(100),
  numNights: z.number().default(1),
  cleaningFee: z.number().default(50),
  serviceFeeRate: z.number().default(14),
  occupancyTaxRate: z.number().default(10),
  extraGuestFee: z.number().default(20),
  extraGuests: z.number().default(0),
  discountRate: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Airbnb_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.nightlyRate * input.numNights; results["nightlyTotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["nightlyTotal"] = 0; }
  try { const v = input.extraGuestFee * input.extraGuests * input.numNights; results["extraGuestCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["extraGuestCost"] = 0; }
  try { const v = (asFormulaNumber(results["nightlyTotal"])) + input.cleaningFee + (asFormulaNumber(results["extraGuestCost"])); results["subtotal"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (input.serviceFeeRate / 100); results["serviceFee"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["serviceFee"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) + (asFormulaNumber(results["serviceFee"])); results["taxableAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) * (input.occupancyTaxRate / 100); results["tax"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["tax"] = 0; }
  try { const v = (asFormulaNumber(results["taxableAmount"])) + (asFormulaNumber(results["tax"])); results["totalBeforeDiscount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalBeforeDiscount"] = 0; }
  try { const v = (asFormulaNumber(results["totalBeforeDiscount"])) * (input.discountRate / 100); results["discountAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (asFormulaNumber(results["totalBeforeDiscount"])) - (asFormulaNumber(results["discountAmount"])); results["totalCost"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateAirbnb_cost_calculator(input: Airbnb_cost_calculatorInput): Airbnb_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
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


export interface Airbnb_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
