// Auto-generated premium calculator: teslimat-maliyeti
import * as z from 'zod';

export interface TeslimatMaliyetiInput {
  rotaToplamMaliyeti: number;
  durakSayısı: number;
  mesafeKm: number;
  basarısızTeslimatSayısı: number;
  IadeNavlunIstoklama Ucreti: number;
  yakıtEndeksi: number;
}

export const TeslimatMaliyetiInputSchema = z.object({
  rotaToplamMaliyeti: z.number().min(0).default(0),
  durakSayısı: z.number().min(0).default(0),
  mesafeKm: z.number().min(0).default(0),
  basarısızTeslimatSayısı: z.number().min(0).default(0),
  IadeNavlunIstoklama Ucreti: z.number().min(0).default(0),
  yakıtEndeksi: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalRouteCost * input.numberOfDrops; results["costPerDrop"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerDrop"] = Number.NaN; }
  try { const v = input.totalRouteCost * input.totalDistance; results["costPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerKm"] = Number.NaN; }
  try { const v = input.failedDrops * input.returnFreight * input.restockingFee * input.adminCost; results["failedDeliveryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["failedDeliveryCost"] = Number.NaN; }
  try { const v = input.baseFreight * input.fuelIndexPct; results["fuelSurcharge"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelSurcharge"] = Number.NaN; }
  try { const v = input.linehaul * input.lastMile * input.failedDeliveryCost * input.surcharges; results["totalDeliveryCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDeliveryCost"] = Number.NaN; }
  try { const v = input.successfulDrops * input.totalPlannedDrops; results["deliveryEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deliveryEfficiency"] = Number.NaN; }
  return results;
}

export function calculateTeslimatMaliyeti(input) {
  return evaluateAllFormulas(input);
}
