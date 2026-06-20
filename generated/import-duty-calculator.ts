// Auto-generated from import-duty-calculator-schema.json
import * as z from 'zod';

export interface Import_duty_calculatorInput {
  invoiceValue: number;
  insuranceCost: number;
  freightCost: number;
  dutyRate: number;
  vatRate: number;
  additionalFees: number;
  dataConfidence?: number;
}

export const Import_duty_calculatorInputSchema = z.object({
  invoiceValue: z.number().default(0),
  insuranceCost: z.number().default(0),
  freightCost: z.number().default(0),
  dutyRate: z.number().default(0),
  vatRate: z.number().default(0),
  additionalFees: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Import_duty_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.invoiceValue + input.insuranceCost + input.freightCost; results["cif"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cif"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cif"])) * input.dutyRate / 100; results["dutyAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dutyAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cif"])) + (toNumericFormulaValue(results["dutyAmount"])); results["taxableValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxableValue"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableValue"])) * input.vatRate / 100; results["vatAmount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vatAmount"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["taxableValue"])) + (toNumericFormulaValue(results["vatAmount"])) + input.additionalFees; results["totalImportCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalImportCost"] = Number.NaN; }
  return results;
}


export function calculateImport_duty_calculator(input: Import_duty_calculatorInput): Import_duty_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalImportCost"]);
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


export interface Import_duty_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
