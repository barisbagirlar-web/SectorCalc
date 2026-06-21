// Auto-generated premium calculator: kompresr-kaa-maliyet
import * as z from 'zod';

export interface KompresrKaaMaliyetInput {
  kacak CapıD: number;
  hatBasıncı: number;
  kacakSayısı: number;
  kompresorVerimi: number;
  yıllık CalısmaSaati: number;
  elektrikTarifesi: number;
  tamirMaliyeti: number;
  emisyonFaktoru: number;
}

export const KompresrKaaMaliyetInputSchema = z.object({
  kacak CapıD: z.number().min(0).default(0),
  hatBasıncı: z.number().min(0).default(0),
  kacakSayısı: z.number().min(0).default(0),
  kompresorVerimi: z.number().min(0).default(0),
  yıllık CalısmaSaati: z.number().min(0).default(0),
  elektrikTarifesi: z.number().min(0).default(0),
  tamirMaliyeti: z.number().min(0).default(0),
  emisyonFaktoru: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.d * input.pLine * input.tAbs; results["leakFlowCFM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leakFlowCFM"] = Number.NaN; }
  try { const v = input.leakFlowCFM * input.pLine * input.effCompressor; results["powerLossKW"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["powerLossKW"] = Number.NaN; }
  try { const v = input.powerLossKW * input.operatingHours; results["annualEnergyLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualEnergyLoss"] = Number.NaN; }
  try { const v = input.annualEnergyLoss * input.electricityRate; results["costLeak"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costLeak"] = Number.NaN; }
  try { const v = input.costLeakI; results["totalLeakCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLeakCost"] = Number.NaN; }
  try { const v = input.annualEnergyLoss * input.gridEmissionFactor; results["carbonEmissions"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carbonEmissions"] = Number.NaN; }
  try { const v = input.repairCost * input.costLeak; results["paybackRepair"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["paybackRepair"] = Number.NaN; }
  return results;
}

export function calculateKompresrKaaMaliyet(input) {
  return evaluateAllFormulas(input);
}
