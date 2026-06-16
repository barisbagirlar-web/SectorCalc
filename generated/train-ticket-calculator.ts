// Auto-generated from train-ticket-calculator-schema.json
import * as z from 'zod';

export interface Train_ticket_calculatorInput {
  adults: number;
  children: number;
  distance: number;
  baseFarePerKm: number;
  childDiscount: number;
  groupDiscount: number;
  serviceFee: number;
}

export const Train_ticket_calculatorInputSchema = z.object({
  adults: z.number().default(1),
  children: z.number().default(0),
  distance: z.number().default(100),
  baseFarePerKm: z.number().default(0.5),
  childDiscount: z.number().default(50),
  groupDiscount: z.number().default(10),
  serviceFee: z.number().default(2),
});

function evaluateAllFormulas(input: Train_ticket_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adults * input.distance * input.baseFarePerKm; results["adultsFare"] = Number.isFinite(v) ? v : 0; } catch { results["adultsFare"] = 0; }
  try { const v = input.children * input.distance * input.baseFarePerKm * (1 - input.childDiscount/100); results["childrenFare"] = Number.isFinite(v) ? v : 0; } catch { results["childrenFare"] = 0; }
  try { const v = (results["adultsFare"] ?? 0) + (results["childrenFare"] ?? 0); results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = input.adults + input.children; results["totalPassengers"] = Number.isFinite(v) ? v : 0; } catch { results["totalPassengers"] = 0; }
  try { const v = (results["totalPassengers"] ?? 0) >= 5 ? (results["subtotal"] ?? 0) * input.groupDiscount / 100 : 0; results["groupDiscountAmount"] = Number.isFinite(v) ? v : 0; } catch { results["groupDiscountAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) - (results["groupDiscountAmount"] ?? 0); results["subtotalAfterDiscount"] = Number.isFinite(v) ? v : 0; } catch { results["subtotalAfterDiscount"] = 0; }
  try { const v = (results["totalPassengers"] ?? 0) * input.serviceFee; results["serviceFeeTotal"] = Number.isFinite(v) ? v : 0; } catch { results["serviceFeeTotal"] = 0; }
  try { const v = (results["subtotalAfterDiscount"] ?? 0) + (results["serviceFeeTotal"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  return results;
}


export function calculateTrain_ticket_calculator(input: Train_ticket_calculatorInput): Train_ticket_calculatorOutput {
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


export interface Train_ticket_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
