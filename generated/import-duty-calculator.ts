// Auto-generated from import-duty-calculator-schema.json
import * as z from 'zod';

export interface Import_duty_calculatorInput {
  invoiceValue: number;
  insuranceCost: number;
  freightCost: number;
  dutyRate: number;
  vatRate: number;
  additionalFees: number;
}

export const Import_duty_calculatorInputSchema = z.object({
  invoiceValue: z.number().default(0),
  insuranceCost: z.number().default(0),
  freightCost: z.number().default(0),
  dutyRate: z.number().default(0),
  vatRate: z.number().default(0),
  additionalFees: z.number().default(0),
});

function evaluateAllFormulas(input: Import_duty_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.invoiceValue + input.insuranceCost + input.freightCost; results["cif"] = Number.isFinite(v) ? v : 0; } catch { results["cif"] = 0; }
  try { const v = (results["cif"] ?? 0) * input.dutyRate / 100; results["dutyAmount"] = Number.isFinite(v) ? v : 0; } catch { results["dutyAmount"] = 0; }
  try { const v = (results["cif"] ?? 0) + (results["dutyAmount"] ?? 0); results["taxableValue"] = Number.isFinite(v) ? v : 0; } catch { results["taxableValue"] = 0; }
  try { const v = (results["taxableValue"] ?? 0) * input.vatRate / 100; results["vatAmount"] = Number.isFinite(v) ? v : 0; } catch { results["vatAmount"] = 0; }
  try { const v = (results["taxableValue"] ?? 0) + (results["vatAmount"] ?? 0) + input.additionalFees; results["totalImportCost"] = Number.isFinite(v) ? v : 0; } catch { results["totalImportCost"] = 0; }
  return results;
}


export function calculateImport_duty_calculator(input: Import_duty_calculatorInput): Import_duty_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalImportCost"] ?? 0;
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


export interface Import_duty_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
