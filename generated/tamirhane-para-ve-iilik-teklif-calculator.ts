// Auto-generated premium calculator: tamirhane-para-ve-iilik-teklif
import * as z from 'zod';

export interface TamirhaneParaVeIilikTeklifInput {
  flatRateSaatleri: number;
  magazaSaatlik Ucreti: number;
  parcaListesiAdetDealerFiyat: number;
  parcaMarjOranı: number;
  sarfCevre Ucreti: number;
  gercekHarcananSaat: number;
}

export const TamirhaneParaVeIilikTeklifInputSchema = z.object({
  flatRateSaatleri: z.number().min(0).default(0),
  magazaSaatlik Ucreti: z.number().min(0).default(0),
  parcaListesiAdetDealerFiyat: z.number().min(0).default(0),
  parcaMarjOranı: z.number().min(0).default(0),
  sarfCevre Ucreti: z.number().min(0).default(0),
  gercekHarcananSaat: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.quantityI * input.dealerPriceI; results["partCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["partCost"] = Number.NaN; }
  try { const v = input.partCost * input.partMarkupPct; results["partMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["partMargin"] = Number.NaN; }
  try { const v = input.flatRateHours * input.shopHourlyRate; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = input.subletInvoices; results["subletCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["subletCost"] = Number.NaN; }
  try { const v = input.partCost * input.partMargin * input.laborCost * input.subletCost * input.shopSuppliesFee * input.environmentalFee; results["totalQuote"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalQuote"] = Number.NaN; }
  try { const v = input.laborCost * input.partMargin * input.actualHours; results["effectiveLaborRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveLaborRate"] = Number.NaN; }
  try { const v = input.totalQuote * input.partCost * input.actualLaborCost; results["grossProfitPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossProfitPct"] = Number.NaN; }
  return results;
}

export function calculateTamirhaneParaVeIilikTeklif(input) {
  return evaluateAllFormulas(input);
}
