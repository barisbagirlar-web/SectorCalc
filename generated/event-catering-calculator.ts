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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Event_catering_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfGuests * input.costPerPlate; results["totalFoodCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFoodCost"] = 0; }
  try { const v = input.serviceStaff * input.staffHourlyRate * input.eventDurationHours; results["totalStaffCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalStaffCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalFoodCost"])) + (asFormulaNumber(results["totalStaffCost"])); results["totalVariableCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVariableCost"] = 0; }
  try { const v = input.overheadFixed; results["totalFixedCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalFixedCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalVariableCost"])) + (asFormulaNumber(results["totalFixedCost"])); results["subtotal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["subtotal"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) * (input.taxRatePercent / 100); results["taxAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["taxAmount"] = 0; }
  try { const v = (asFormulaNumber(results["subtotal"])) + (asFormulaNumber(results["taxAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["totalCost"])) * (1 + input.profitMarginPercent / 100); results["revenueRequired"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["revenueRequired"] = 0; }
  try { const v = (asFormulaNumber(results["revenueRequired"])) / input.numberOfGuests; results["pricePerPlate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pricePerPlate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateEvent_catering_calculator(input: Event_catering_calculatorInput): Event_catering_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["pricePerPlate"]);
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


export interface Event_catering_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
