// Auto-generated from pooled-cohort-equations-schema.json
import * as z from 'zod';

export interface Pooled_cohort_equationsInput {
  age: number;
  sex: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  systolicBP: number;
  treatedHypertension: number;
  diabetes: number;
  smoker: number;
}

export const Pooled_cohort_equationsInputSchema = z.object({
  age: z.number().default(55),
  sex: z.number().default(0),
  totalCholesterol: z.number().default(200),
  hdlCholesterol: z.number().default(50),
  systolicBP: z.number().default(120),
  treatedHypertension: z.number().default(0),
  diabetes: z.number().default(0),
  smoker: z.number().default(0),
});

function evaluateAllFormulas(input: Pooled_cohort_equationsInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(input.age); results["lnAge"] = Number.isFinite(v) ? v : 0; } catch { results["lnAge"] = 0; }
  try { const v = (results["lnAge"] ?? 0) * (results["lnAge"] ?? 0); results["lnAgeSq"] = Number.isFinite(v) ? v : 0; } catch { results["lnAgeSq"] = 0; }
  try { const v = Math.log(input.totalCholesterol); results["lnTotalChol"] = Number.isFinite(v) ? v : 0; } catch { results["lnTotalChol"] = 0; }
  try { const v = Math.log(input.hdlCholesterol); results["lnHdl"] = Number.isFinite(v) ? v : 0; } catch { results["lnHdl"] = 0; }
  try { const v = Math.log(input.systolicBP); results["lnSystolicBP"] = Number.isFinite(v) ? v : 0; } catch { results["lnSystolicBP"] = 0; }
  try { const v = input.treatedHypertension; results["treated"] = Number.isFinite(v) ? v : 0; } catch { results["treated"] = 0; }
  try { const v = (results["lnAge"] ?? 0) * (results["lnTotalChol"] ?? 0); results["ageTotalChol"] = Number.isFinite(v) ? v : 0; } catch { results["ageTotalChol"] = 0; }
  try { const v = (results["lnAge"] ?? 0) * (results["lnHdl"] ?? 0); results["ageHdl"] = Number.isFinite(v) ? v : 0; } catch { results["ageHdl"] = 0; }
  try { const v = (results["lnAge"] ?? 0) * (results["lnSystolicBP"] ?? 0); results["ageSystolicBP"] = Number.isFinite(v) ? v : 0; } catch { results["ageSystolicBP"] = 0; }
  try { const v = (results["lnAge"] ?? 0) * input.smoker; results["ageSmoker"] = Number.isFinite(v) ? v : 0; } catch { results["ageSmoker"] = 0; }
  try { const v = (results["lnAge"] ?? 0) * input.diabetes; results["ageDiabetes"] = Number.isFinite(v) ? v : 0; } catch { results["ageDiabetes"] = 0; }
  try { const v = (-29.799 * (results["lnAge"] ?? 0)) + (4.884 * (results["lnAgeSq"] ?? 0)) + (13.540 * (results["lnTotalChol"] ?? 0)) + (-3.114 * (results["ageTotalChol"] ?? 0)) + (-13.578 * (results["lnHdl"] ?? 0)) + (3.149 * (results["ageHdl"] ?? 0)) + (2.019 * (results["lnSystolicBP"] ?? 0) * (1 - (results["treated"] ?? 0))) + (1.957 * (results["lnSystolicBP"] ?? 0) * (results["treated"] ?? 0)) + (7.574 * input.smoker) + (-1.665 * (results["ageSmoker"] ?? 0)) + (0.661 * input.diabetes) + (0.0 * (results["ageDiabetes"] ?? 0)); results["sumFemale"] = Number.isFinite(v) ? v : 0; } catch { results["sumFemale"] = 0; }
  try { const v = (12.344 * (results["lnAge"] ?? 0)) + (0.0 * (results["lnAgeSq"] ?? 0)) + (11.853 * (results["lnTotalChol"] ?? 0)) + (-2.664 * (results["ageTotalChol"] ?? 0)) + (-7.990 * (results["lnHdl"] ?? 0)) + (1.769 * (results["ageHdl"] ?? 0)) + (1.797 * (results["lnSystolicBP"] ?? 0) * (1 - (results["treated"] ?? 0))) + (1.764 * (results["lnSystolicBP"] ?? 0) * (results["treated"] ?? 0)) + (7.837 * input.smoker) + (-1.795 * (results["ageSmoker"] ?? 0)) + (0.658 * input.diabetes) + (0.0 * (results["ageDiabetes"] ?? 0)); results["sumMale"] = Number.isFinite(v) ? v : 0; } catch { results["sumMale"] = 0; }
  try { const v = 0.9665; results["baselineSurvivalFemale"] = Number.isFinite(v) ? v : 0; } catch { results["baselineSurvivalFemale"] = 0; }
  try { const v = 0.9144; results["baselineSurvivalMale"] = Number.isFinite(v) ? v : 0; } catch { results["baselineSurvivalMale"] = 0; }
  try { const v = -29.1817; results["meanSumFemale"] = Number.isFinite(v) ? v : 0; } catch { results["meanSumFemale"] = 0; }
  try { const v = 61.1816; results["meanSumMale"] = Number.isFinite(v) ? v : 0; } catch { results["meanSumMale"] = 0; }
  try { const v = 1 - Math.pow((results["baselineSurvivalFemale"] ?? 0), Math.exp((results["sumFemale"] ?? 0) - (results["meanSumFemale"] ?? 0))); results["riskScoreFemale"] = Number.isFinite(v) ? v : 0; } catch { results["riskScoreFemale"] = 0; }
  try { const v = 1 - Math.pow((results["baselineSurvivalMale"] ?? 0), Math.exp((results["sumMale"] ?? 0) - (results["meanSumMale"] ?? 0))); results["riskScoreMale"] = Number.isFinite(v) ? v : 0; } catch { results["riskScoreMale"] = 0; }
  try { const v = input.sex === 0 ? (results["riskScoreFemale"] ?? 0) : (results["riskScoreMale"] ?? 0); results["riskScore"] = Number.isFinite(v) ? v : 0; } catch { results["riskScore"] = 0; }
  return results;
}


export function calculatePooled_cohort_equations(input: Pooled_cohort_equationsInput): Pooled_cohort_equationsOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["riskScore"] ?? 0;
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


export interface Pooled_cohort_equationsOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
