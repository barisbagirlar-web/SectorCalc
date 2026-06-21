// Auto-generated premium calculator: project-maliyet-tahmin
import * as z from 'zod';

export interface ProjectMaliyetTahminInput {
  IscilikSaatleriUcretleri: number;
  malzemeListesi: number;
  ekipmanKiralama: number;
  taseronTeklifleri: number;
  overheadOranı: number;
  riskKontenjansı: number;
  onaylanmısButce: number;
}

export const ProjectMaliyetTahminInputSchema = z.object({
  IscilikSaatleriUcretleri: z.number().min(0).default(0),
  malzemeListesi: z.number().min(0).default(0),
  ekipmanKiralama: z.number().min(0).default(0),
  taseronTeklifleri: z.number().min(0).default(0),
  overheadOranı: z.number().min(0).default(0),
  riskKontenjansı: z.number().min(0).default(0),
  onaylanmısButce: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.hoursI * input.rateI; results["directLabor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directLabor"] = Number.NaN; }
  try { const v = input.quantityJ * input.priceJ; results["directMaterial"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["directMaterial"] = Number.NaN; }
  try { const v = input.rentalDaysK * input.dailyRateK; results["equipment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["equipment"] = Number.NaN; }
  try { const v = input.lumpSumM; results["subcontractor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subcontractor"] = Number.NaN; }
  try { const v = input.directLabor * input.directMaterial * input.overheadRate; results["overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overhead"] = Number.NaN; }
  try { const v = input.direct * input.overhead * input.riskFactor; results["contingency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["contingency"] = Number.NaN; }
  try { const v = input.directLabor * input.directMaterial * input.equipment * input.subcontractor * input.overhead * input.contingency; results["totalEstimate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalEstimate"] = Number.NaN; }
  try { const v = input.totalEstimate * input.budget; results["costVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costVariance"] = Number.NaN; }
  return results;
}

export function calculateProjectMaliyetTahmin(input) {
  return evaluateAllFormulas(input);
}
