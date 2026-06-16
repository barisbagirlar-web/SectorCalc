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

function evaluateAllFormulas(input: Airbnb_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.nightlyRate * input.numNights; results["nightlyTotal"] = Number.isFinite(v) ? v : 0; } catch { results["nightlyTotal"] = 0; }
  try { const v = input.extraGuestFee * input.extraGuests * input.numNights; results["extraGuestCost"] = Number.isFinite(v) ? v : 0; } catch { results["extraGuestCost"] = 0; }
  try { const v = (results["nightlyTotal"] ?? 0) + input.cleaningFee + (results["extraGuestCost"] ?? 0); results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * (input.serviceFeeRate / 100); results["serviceFee"] = Number.isFinite(v) ? v : 0; } catch { results["serviceFee"] = 0; }
  try { const v = (results["subtotal"] ?? 0) + (results["serviceFee"] ?? 0); results["taxableAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxableAmount"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) * (input.occupancyTaxRate / 100); results["tax"] = Number.isFinite(v) ? v : 0; } catch { results["tax"] = 0; }
  try { const v = (results["taxableAmount"] ?? 0) + (results["tax"] ?? 0); results["totalBeforeDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["totalBeforeDiscount"] = 0; }
  try { const v = (results["totalBeforeDiscount"] ?? 0) * (input.discountRate / 100); results["discountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["discountAmount"] = 0; }
  try { const v = (results["totalBeforeDiscount"] ?? 0) - (results["discountAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateAirbnb_cost_calculator(input: Airbnb_cost_calculatorInput): Airbnb_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalCost"] ?? 0;
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


export interface Airbnb_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
