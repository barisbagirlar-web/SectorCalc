// Auto-generated premium calculator: kwh-maliyet
import * as z from 'zod';

export interface KwhMaliyetInput {
  aktifReaktifTuketim: number;
  CekilenGucKW: number;
  gucFaktoru: number;
  enerjiGucReaktifBirimFiyat: number;
  cezaEsigi: number;
  vergiFonOranı: number;
  tepeGucuTrafoKapasitesi: number;
}

export const KwhMaliyetInputSchema = z.object({
  aktifReaktifTuketim: z.number().min(0).default(0),
  CekilenGucKW: z.number().min(0).default(0),
  gucFaktoru: z.number().min(0).default(0),
  enerjiGucReaktifBirimFiyat: z.number().min(0).default(0),
  cezaEsigi: z.number().min(0).default(0),
  vergiFonOranı: z.number().min(0).default(0),
  tepeGucuTrafoKapasitesi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.activeEnergy * input.energyRate; results["energyCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["energyCharge"] = Number.NaN; }
  try { const v = input.peakDemand * input.demandRate; results["demandCharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["demandCharge"] = Number.NaN; }
  try { const v = input.powerFactor * input.threshold * input.reactiveEnergy * input.penaltyRate; results["reactivePenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["reactivePenalty"] = Number.NaN; }
  try { const v = input.energyCharge * input.demandCharge * input.taxRate; results["taxesAndFees"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["taxesAndFees"] = Number.NaN; }
  try { const v = input.energyCharge * input.demandCharge * input.reactivePenalty * input.taxesAndFees; results["totalBill"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBill"] = Number.NaN; }
  try { const v = input.totalBill * input.activeEnergy; results["unitCostKWh"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["unitCostKWh"] = Number.NaN; }
  try { const v = input.oldPeak * input.newPeak * input.demandRate; results["peakShavingSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["peakShavingSavings"] = Number.NaN; }
  return results;
}

export function calculateKwhMaliyet(input) {
  return evaluateAllFormulas(input);
}
