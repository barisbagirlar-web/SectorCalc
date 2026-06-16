// Auto-generated from service-charge-calculator-schema.json
import * as z from 'zod';

export interface Service_charge_calculatorInput {
  baseAmount: number;
  serviceChargeRate: number;
  minServiceCharge: number;
  partySize: number;
  partyThreshold: number;
}

export const Service_charge_calculatorInputSchema = z.object({
  baseAmount: z.number().default(0),
  serviceChargeRate: z.number().default(18),
  minServiceCharge: z.number().default(5),
  partySize: z.number().default(1),
  partyThreshold: z.number().default(6),
});

function evaluateAllFormulas(input: Service_charge_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.partySize >= input.partyThreshold) ? Math.max(input.baseAmount * input.serviceChargeRate / 100, input.minServiceCharge) : 0; results["serviceChargeAmount"] = Number.isFinite(v) ? v : 0; } catch { results["serviceChargeAmount"] = 0; }
  try { const v = input.baseAmount + outputs.serviceChargeAmount; results["totalBill"] = Number.isFinite(v) ? v : 0; } catch { results["totalBill"] = 0; }
  try { const v = outputs.serviceChargeAmount / input.baseAmount * 100; results["effectiveRate"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveRate"] = 0; }
  return results;
}


export function calculateService_charge_calculator(input: Service_charge_calculatorInput): Service_charge_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["serviceChargeAmount"] ?? 0;
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


export interface Service_charge_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
