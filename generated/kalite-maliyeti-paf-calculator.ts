// Auto-generated premium calculator: kalite-maliyeti-paf
import * as z from 'zod';

export interface KaliteMaliyetiPafInput {
  egitimPlanlamaButcesi: number;
  muayeneTestMaliyeti: number;
  hurdaYeniden IslemeMaliyeti: number;
  durusMaliyeti: number;
  garantiIadeMaliyeti: number;
  kayıpSatısTahmini: number;
  toplamGelir: number;
}

export const KaliteMaliyetiPafInputSchema = z.object({
  egitimPlanlamaButcesi: z.number().min(0).default(0),
  muayeneTestMaliyeti: z.number().min(0).default(0),
  hurdaYeniden IslemeMaliyeti: z.number().min(0).default(0),
  durusMaliyeti: z.number().min(0).default(0),
  garantiIadeMaliyeti: z.number().min(0).default(0),
  kayıpSatısTahmini: z.number().min(0).default(0),
  toplamGelir: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.training * input.qualityPlanning * input.supplierEvaluation * input.designReview; results["preventionCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["preventionCost"] = Number.NaN; }
  try { const v = input.inspection * input.testing * input.calibration * input.audit; results["appraisalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["appraisalCost"] = Number.NaN; }
  try { const v = input.scrap * input.rework * input.reinspection * input.downtime; results["internalFailure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["internalFailure"] = Number.NaN; }
  try { const v = input.warranty * input.returns * input.recall * input.liability * input.lostSales; results["externalFailure"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["externalFailure"] = Number.NaN; }
  try { const v = input.preventionCost * input.appraisalCost * input.internalFailure * input.externalFailure; results["totalCOQ"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalCOQ"] = Number.NaN; }
  try { const v = input.totalCOQ * input.totalRevenue; results["cOQRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cOQRatio"] = Number.NaN; }
  try { const v = input.preventionCost * input.totalCOQ; results["pAFRatio"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pAFRatio"] = Number.NaN; }
  return results;
}

export function calculateKaliteMaliyetiPaf(input) {
  return evaluateAllFormulas(input);
}
