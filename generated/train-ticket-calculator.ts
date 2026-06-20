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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Train_ticket_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.adults * input.distance * input.baseFarePerKm; results["adultsFare"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adultsFare"] = Number.NaN; }
  try { const v = input.children * input.distance * input.baseFarePerKm * (1 - input.childDiscount/100); results["childrenFare"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["childrenFare"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adultsFare"])) + (toNumericFormulaValue(results["childrenFare"])); results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotal"] = Number.NaN; }
  try { const v = input.adults + input.children; results["totalPassengers"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalPassengers"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPassengers"])) >= 5 ? (toNumericFormulaValue(results["subtotal"])) * input.groupDiscount / 100 : 0; results["groupDiscountAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["groupDiscountAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotal"])) - (toNumericFormulaValue(results["groupDiscountAmount"])); results["subtotalAfterDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subtotalAfterDiscount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalPassengers"])) * input.serviceFee; results["serviceFeeTotal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["serviceFeeTotal"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["subtotalAfterDiscount"])) + (toNumericFormulaValue(results["serviceFeeTotal"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCost"] = Number.NaN; }
  return results;
}


export function calculateTrain_ticket_calculator(input: Train_ticket_calculatorInput): Train_ticket_calculatorOutput {
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


export interface Train_ticket_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
