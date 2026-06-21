// Auto-generated premium calculator: temizlik-teklifi-optimize-edici
import * as z from 'zod';

export interface TemizlikTeklifiOptimizeEdiciInput {
  temizlenebilirAlanM2: number;
  UretimHızıM2saat: number;
  saatlik UcretVeYanHaklar: number;
  sarfMalzemeM2Maliyeti: number;
  makineSaati: number;
  overheadOranı: number;
  hedefMarj: number;
}

export const TemizlikTeklifiOptimizeEdiciInputSchema = z.object({
  temizlenebilirAlanM2: z.number().min(0).default(0),
  UretimHızıM2saat: z.number().min(0).default(0),
  saatlik UcretVeYanHaklar: z.number().min(0).default(0),
  sarfMalzemeM2Maliyeti: z.number().min(0).default(0),
  makineSaati: z.number().min(0).default(0),
  overheadOranı: z.number().min(0).default(0),
  hedefMarj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalSqM * input.cleanablePct; results["areaToClean"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["areaToClean"] = Number.NaN; }
  try { const v = input.areaToClean * input.productionRatePerHour; results["laborHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborHours"] = Number.NaN; }
  try { const v = input.laborHours * input.hourlyWage * input.burden; results["laborCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["laborCost"] = Number.NaN; }
  try { const v = input.areaToClean * input.consumableCostPerSqM; results["materialCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["materialCost"] = Number.NaN; }
  try { const v = input.machineHours * input.depreciationRate; results["equipmentCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["equipmentCost"] = Number.NaN; }
  try { const v = input.laborCost * input.materialCost * input.overheadPct; results["overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overhead"] = Number.NaN; }
  try { const v = input.laborCost * input.materialCost * input.equipmentCost * input.overhead * input.targetMargin; results["bidPrice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bidPrice"] = Number.NaN; }
  return results;
}

export function calculateTemizlikTeklifiOptimizeEdici(input) {
  return evaluateAllFormulas(input);
}
