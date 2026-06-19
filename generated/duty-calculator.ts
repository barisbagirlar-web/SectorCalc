// Auto-generated from duty-calculator-schema.json
import * as z from 'zod';

export interface Duty_calculatorInput {
  productValue: number;
  insurance: number;
  freight: number;
  dutyRate: number;
  vatRate: number;
  dataConfidence?: number;
}

export const Duty_calculatorInputSchema = z.object({
  productValue: z.number().default(1000),
  insurance: z.number().default(100),
  freight: z.number().default(200),
  dutyRate: z.number().default(10),
  vatRate: z.number().default(18),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Duty_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productValue + input.insurance + input.freight; results["cifValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cifValue"] = 0; }
  try { const v = (asFormulaNumber(results["cifValue"])) * input.dutyRate / 100; results["dutyAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dutyAmount"] = 0; }
  try { const v = ((asFormulaNumber(results["cifValue"])) + (asFormulaNumber(results["dutyAmount"]))) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (asFormulaNumber(results["cifValue"])) + (asFormulaNumber(results["dutyAmount"])) + (asFormulaNumber(results["vatAmount"])); results["totalCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCost"] = 0; }
  try { const v = (asFormulaNumber(results["dutyAmount"])); results["totalDuty"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDuty"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDuty_calculator(input: Duty_calculatorInput): Duty_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDuty"]);
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


export interface Duty_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
