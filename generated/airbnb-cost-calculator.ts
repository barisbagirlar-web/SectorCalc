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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Airbnb_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nightlyRate * input.numNights; results["nightlyTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nightlyTotal"] = Number.NaN; }
  try { const v = input.extraGuestFee * input.extraGuests * input.numNights; results["extraGuestCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["extraGuestCost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["nightlyTotal"])) + input.cleaningFee + (toNumericFormulaValue(results["extraGuestCost"])); results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) * (input.serviceFeeRate / 100); results["serviceFee"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["serviceFee"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) + (toNumericFormulaValue(results["serviceFee"])); results["taxableAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxableAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableAmount"])) * (input.occupancyTaxRate / 100); results["tax"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tax"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableAmount"])) + (toNumericFormulaValue(results["tax"])); results["totalBeforeDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBeforeDiscount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBeforeDiscount"])) * (input.discountRate / 100); results["discountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["discountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalBeforeDiscount"])) - (toNumericFormulaValue(results["discountAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateAirbnb_cost_calculator(input: Airbnb_cost_calculatorInput): Airbnb_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalCost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
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
