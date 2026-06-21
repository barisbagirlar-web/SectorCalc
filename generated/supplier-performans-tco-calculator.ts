// Auto-generated premium calculator: supplier-performans-tco
import * as z from 'zod';

export interface SupplierPerformansTcoInput {
  teklifFiyatı: number;
  siparisNakliyeMaliyeti: number;
  hataOranıPPM: number;
  hataMaliyeti: number;
  leadTimeGun: number;
  guvenlikStoguGun: number;
  kesintiOlasılıgı: number;
  etkiMaliyeti: number;
}

export const SupplierPerformansTcoInputSchema = z.object({
  teklifFiyatı: z.number().min(0).default(0),
  siparisNakliyeMaliyeti: z.number().min(0).default(0),
  hataOranıPPM: z.number().min(0).default(0),
  hataMaliyeti: z.number().min(0).default(0),
  leadTimeGun: z.number().min(0).default(0),
  guvenlikStoguGun: z.number().min(0).default(0),
  kesintiOlasılıgı: z.number().min(0).default(0),
  etkiMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.purchasePrice * input.orderingCost * input.transportCost * input.qualityCost * input.inventoryCost * input.riskCost; results["tCO"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCO"] = Number.NaN; }
  try { const v = input.defectRate * input.annualVolume * input.costPerDefect; results["qualityCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualityCost"] = Number.NaN; }
  try { const v = input.avgLeadTime * input.safetyStockDays * input.dailyDemand * input.holdingRate; results["inventoryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["inventoryCost"] = Number.NaN; }
  try { const v = input.probabilityOfDisruption * input.impactCost; results["riskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskCost"] = Number.NaN; }
  try { const v = input.qualityWeight * input.qualityScore * input.deliveryWeight * input.deliveryScore * input.costWeight * input.costScore; results["supplierScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["supplierScore"] = Number.NaN; }
  try { const v = input.tCOActual * input.tCOQuoted; results["tCOVariance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tCOVariance"] = Number.NaN; }
  return results;
}

export function calculateSupplierPerformansTco(input) {
  return evaluateAllFormulas(input);
}
