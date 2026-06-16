// Auto-generated from liters-to-gallons-converter-schema.json
import * as z from 'zod';

export interface Liters_to_gallons_converterInput {
  liters: number;
  conversionStandard: string;
  temperatureAdjustment: number;
  batchLossFactor: number;
  includeEvaporation: boolean;
}

export const Liters_to_gallons_converterInputSchema = z.object({
  liters: z.number().min(0).max(1000000).default(100),
  conversionStandard: z.enum(['US', 'UK']).default('US'),
  temperatureAdjustment: z.number().min(0.9).max(1.1).default(1),
  batchLossFactor: z.number().min(0).max(10).default(0.5),
  includeEvaporation: z.boolean().default(false),
});

function evaluateAllFormulas(input: Liters_to_gallons_converterInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.liters / conversionFactor; results["baseGallons"] = Number.isFinite(v) ? v : 0; } catch { results["baseGallons"] = 0; }
  try { const v = (results["baseGallons"] ?? 0) * input.temperatureAdjustment; results["temperatureCorrectedGallons"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureCorrectedGallons"] = 0; }
  try { const v = (results["temperatureCorrectedGallons"] ?? 0) * (input.batchLossFactor / 100); results["batchLossGallons"] = Number.isFinite(v) ? v : 0; } catch { results["batchLossGallons"] = 0; }
  try { const v = input.includeEvaporation ? ((results["temperatureCorrectedGallons"] ?? 0) * 0.002) : 0; results["evaporationLossGallons"] = Number.isFinite(v) ? v : 0; } catch { results["evaporationLossGallons"] = 0; }
  try { const v = (results["temperatureCorrectedGallons"] ?? 0) - (results["batchLossGallons"] ?? 0) - (results["evaporationLossGallons"] ?? 0); results["netGallons"] = Number.isFinite(v) ? v : 0; } catch { results["netGallons"] = 0; }
  try { const v = (results["netGallons"] ?? 0) * 0.98; results["dataConfidenceAdjusted"] = Number.isFinite(v) ? v : 0; } catch { results["dataConfidenceAdjusted"] = 0; }
  return results;
}


export function calculateLiters_to_gallons_converter(input: Liters_to_gallons_converterInput): Liters_to_gallons_converterOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["primaryResult"] ?? 0;
  const breakdown = {
    baseGallons: values["baseGallons"] ?? 0,
    temperatureCorrectedGallons: values["temperatureCorrectedGallons"] ?? 0,
    batchLossGallons: values["batchLossGallons"] ?? 0,
    evaporationLossGallons: values["evaporationLossGallons"] ?? 0,
    netGallons: values["netGallons"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Conversion Standard Mismatch","Temperature Variation","Batch Loss Uncertainty","Evaporation Rate Assumption"];
  const suggestedActions: string[] = ["Calibrate Flow Meters","Reduce Batch Loss","Monitor Temperature Continuously","Verify Conversion Standard"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis"],
  };
}


export interface Liters_to_gallons_converterOutput {
  totalWasteCost: number;
  breakdown: { baseGallons: number; temperatureCorrectedGallons: number; batchLossGallons: number; evaporationLossGallons: number; netGallons: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
