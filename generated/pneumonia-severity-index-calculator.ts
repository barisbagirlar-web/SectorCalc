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
  dataConfidence?: number;
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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pneumonia_severity_index_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.age > 50 ? input.age - 50 : 0); results["agePoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["agePoints"] = Number.NaN; }
  try { const v = (input.respiratoryRate > 30 ? 20 : 0); results["respiratoryRatePoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["respiratoryRatePoints"] = Number.NaN; }
  try { const v = (input.systolicBP < 90 ? 20 : 0); results["systolicBPPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["systolicBPPoints"] = Number.NaN; }
  try { const v = (input.bun > 30 ? 20 : 0); results["bunPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bunPoints"] = Number.NaN; }
  try { const v = (input.sodium < 130 ? 20 : 0); results["sodiumPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sodiumPoints"] = Number.NaN; }
  try { const v = (input.glucose >= 250 ? 10 : 0); results["glucosePoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["glucosePoints"] = Number.NaN; }
  try { const v = (input.hematocrit < 30 ? 10 : 0); results["hematocritPoints"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["hematocritPoints"] = Number.NaN; }
  try { const v = (input.paO2 < 60 ? 10 : 0); results["paO2Points"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paO2Points"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["agePoints"])) + (toNumericFormulaValue(results["respiratoryRatePoints"])) + (toNumericFormulaValue(results["systolicBPPoints"])) + (toNumericFormulaValue(results["bunPoints"])) + (toNumericFormulaValue(results["sodiumPoints"])) + (toNumericFormulaValue(results["glucosePoints"])) + (toNumericFormulaValue(results["hematocritPoints"])) + (toNumericFormulaValue(results["paO2Points"])); results["psiScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["psiScore"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["psiScore"])) <= 50 ? 0.1 : ((toNumericFormulaValue(results["psiScore"])) <= 70 ? 0.6 : ((toNumericFormulaValue(results["psiScore"])) <= 90 ? 0.9 : ((toNumericFormulaValue(results["psiScore"])) <= 130 ? 9.3 : 27))); results["mortalityRiskPercentage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["mortalityRiskPercentage"] = Number.NaN; }
  return results;
}


export function calculatePneumonia_severity_index_calculator(input: Pneumonia_severity_index_calculatorInput): Pneumonia_severity_index_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["psiScore"]);
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


export interface Pneumonia_severity_index_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
