// Auto-generated premium calculator: tekstil-at-risk-deerlendirmesi
import * as z from 'zod';

export interface TekstilAtRiskDeerlendirmesiInput {
  girenKumasCıkan UrunKg: number;
  kesimDikimBoyaFireleri: number;
  kumasKgFiyatı: number;
  IslemeMaliyeti: number;
  depolama Ucreti: number;
  hurdaGeriKazanımDegeri: number;
}

export const TekstilAtRiskDeerlendirmesiInputSchema = z.object({
  girenKumasCıkan UrunKg: z.number().min(0).default(0),
  kesimDikimBoyaFireleri: z.number().min(0).default(0),
  kumasKgFiyatı: z.number().min(0).default(0),
  IslemeMaliyeti: z.number().min(0).default(0),
  depolama Ucreti: z.number().min(0).default(0),
  hurdaGeriKazanımDegeri: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.inputFabric * input.outputGarments; results["wasteRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wasteRate"] = Number.NaN; }
  try { const v = input.cuttingScrap * input.sewingDefects * input.dyeingRework; results["preConsumerWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["preConsumerWaste"] = Number.NaN; }
  try { const v = input.preConsumerWaste * input.fabricCostPerKg * input.processingCost; results["financialLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["financialLoss"] = Number.NaN; }
  try { const v = input.wasteWeight * input.landfillFee; results["disposalCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["disposalCost"] = Number.NaN; }
  try { const v = input.recycledWasteWeight * input.scrapValue; results["circularRevenue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["circularRevenue"] = Number.NaN; }
  try { const v = input.financialLoss * input.disposalCost * input.circularRevenue; results["netWasteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netWasteCost"] = Number.NaN; }
  try { const v = input.netWasteCost * input.totalRevenue; results["riskScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskScore"] = Number.NaN; }
  return results;
}

export function calculateTekstilAtRiskDeerlendirmesi(input) {
  return evaluateAllFormulas(input);
}
