// Auto-generated from pneumonia-severity-index-calculator-schema.json
import * as z from 'zod';

export interface Pneumonia_severity_index_calculatorInput {
  age: number;
  respiratoryRate: number;
  systolicBP: number;
  bun: number;
  sodium: number;
  glucose: number;
  hematocrit: number;
  paO2: number;
}

export const Pneumonia_severity_index_calculatorInputSchema = z.object({
  age: z.number().default(60),
  respiratoryRate: z.number().default(20),
  systolicBP: z.number().default(120),
  bun: z.number().default(15),
  sodium: z.number().default(140),
  glucose: z.number().default(100),
  hematocrit: z.number().default(40),
  paO2: z.number().default(80),
});

function evaluateAllFormulas(input: Pneumonia_severity_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.age > 50 ? input.age - 50 : 0); results["agePoints"] = Number.isFinite(v) ? v : 0; } catch { results["agePoints"] = 0; }
  try { const v = (input.respiratoryRate > 30 ? 20 : 0); results["respiratoryRatePoints"] = Number.isFinite(v) ? v : 0; } catch { results["respiratoryRatePoints"] = 0; }
  try { const v = (input.systolicBP < 90 ? 20 : 0); results["systolicBPPoints"] = Number.isFinite(v) ? v : 0; } catch { results["systolicBPPoints"] = 0; }
  try { const v = (input.bun > 30 ? 20 : 0); results["bunPoints"] = Number.isFinite(v) ? v : 0; } catch { results["bunPoints"] = 0; }
  try { const v = (input.sodium < 130 ? 20 : 0); results["sodiumPoints"] = Number.isFinite(v) ? v : 0; } catch { results["sodiumPoints"] = 0; }
  try { const v = (input.glucose >= 250 ? 10 : 0); results["glucosePoints"] = Number.isFinite(v) ? v : 0; } catch { results["glucosePoints"] = 0; }
  try { const v = (input.hematocrit < 30 ? 10 : 0); results["hematocritPoints"] = Number.isFinite(v) ? v : 0; } catch { results["hematocritPoints"] = 0; }
  try { const v = (input.paO2 < 60 ? 10 : 0); results["paO2Points"] = Number.isFinite(v) ? v : 0; } catch { results["paO2Points"] = 0; }
  try { const v = (results["agePoints"] ?? 0) + (results["respiratoryRatePoints"] ?? 0) + (results["systolicBPPoints"] ?? 0) + (results["bunPoints"] ?? 0) + (results["sodiumPoints"] ?? 0) + (results["glucosePoints"] ?? 0) + (results["hematocritPoints"] ?? 0) + (results["paO2Points"] ?? 0); results["psiScore"] = Number.isFinite(v) ? v : 0; } catch { results["psiScore"] = 0; }
  try { const v = (results["psiScore"] ?? 0) <= 50 ? 'I' : ((results["psiScore"] ?? 0) <= 70 ? 'II' : ((results["psiScore"] ?? 0) <= 90 ? 'III' : ((results["psiScore"] ?? 0) <= 130 ? 'IV' : 'V'))); results["riskClass"] = Number.isFinite(v) ? v : 0; } catch { results["riskClass"] = 0; }
  try { const v = (results["psiScore"] ?? 0) <= 50 ? 0.1 : ((results["psiScore"] ?? 0) <= 70 ? 0.6 : ((results["psiScore"] ?? 0) <= 90 ? 0.9 : ((results["psiScore"] ?? 0) <= 130 ? 9.3 : 27))); results["mortalityRiskPercentage"] = Number.isFinite(v) ? v : 0; } catch { results["mortalityRiskPercentage"] = 0; }
  return results;
}


export function calculatePneumonia_severity_index_calculator(input: Pneumonia_severity_index_calculatorInput): Pneumonia_severity_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["psiScore"] ?? 0;
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


export interface Pneumonia_severity_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
