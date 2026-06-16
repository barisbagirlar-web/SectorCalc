// Auto-generated from event-catering-calculator-schema.json
import * as z from 'zod';

export interface Event_catering_calculatorInput {
  numberOfGuests: number;
  costPerPlate: number;
  serviceStaff: number;
  staffHourlyRate: number;
  eventDurationHours: number;
  overheadFixed: number;
  profitMarginPercent: number;
  taxRatePercent: number;
}

export const Event_catering_calculatorInputSchema = z.object({
  numberOfGuests: z.number().default(100),
  costPerPlate: z.number().default(15),
  serviceStaff: z.number().default(5),
  staffHourlyRate: z.number().default(20),
  eventDurationHours: z.number().default(4),
  overheadFixed: z.number().default(500),
  profitMarginPercent: z.number().default(20),
  taxRatePercent: z.number().default(8),
});

function evaluateAllFormulas(input: Event_catering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.costPerPlate; results["totalFoodCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = input.serviceStaff * input.staffHourlyRate * input.eventDurationHours; results["totalStaffCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalStaffCost"] = 0; }
  try { const v = (results["totalFoodCost"] ?? 0) + (results["totalStaffCost"] ?? 0); results["totalVariableCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalVariableCost"] = 0; }
  try { const v = input.overheadFixed; results["totalFixedCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalFixedCost"] = 0; }
  try { const v = (results["totalVariableCost"] ?? 0) + (results["totalFixedCost"] ?? 0); results["subtotal"] = Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (results["subtotal"] ?? 0) * (input.taxRatePercent / 100); results["taxAmount"] = Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (results["subtotal"] ?? 0) + (results["taxAmount"] ?? 0); results["totalCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (results["totalCost"] ?? 0) * (1 + input.profitMarginPercent / 100); results["revenueRequired"] = Number.isFinite(v) ? v : 0; } catch { results["revenueRequired"] = 0; }
  try { const v = (results["revenueRequired"] ?? 0) / input.numberOfGuests; results["pricePerPlate"] = Number.isFinite(v) ? v : 0; } catch { results["pricePerPlate"] = 0; }
  return results;
}


export function calculateEvent_catering_calculator(input: Event_catering_calculatorInput): Event_catering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["pricePerPlate"] ?? 0;
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


export interface Event_catering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
