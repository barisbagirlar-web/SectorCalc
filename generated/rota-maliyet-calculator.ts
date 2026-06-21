// Auto-generated premium calculator: rota-maliyet
import * as z from 'zod';

export interface RotaMaliyetInput {
  toplamMesafeSure: number;
  yakıtTuketimFiyat: number;
  surucu Ucreti: number;
  otoyolKopruGecisleri: number;
  bakımKmMaliyeti: number;
  amortismanVeOverhead: number;
}

export const RotaMaliyetInputSchema = z.object({
  toplamMesafeSure: z.number().min(0).default(0),
  yakıtTuketimFiyat: z.number().min(0).default(0),
  surucu Ucreti: z.number().min(0).default(0),
  otoyolKopruGecisleri: z.number().min(0).default(0),
  bakımKmMaliyeti: z.number().min(0).default(0),
  amortismanVeOverhead: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalDistance * input.fuelConsumption * input.fuelPrice; results["distanceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["distanceCost"] = Number.NaN; }
  try { const v = input.totalTime * input.driverWage * input.vehicleDepreciation; results["timeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timeCost"] = Number.NaN; }
  try { const v = input.tollsI; results["tollCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["tollCost"] = Number.NaN; }
  try { const v = input.totalDistance * input.maintRatePerKm; results["maintenanceCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maintenanceCost"] = Number.NaN; }
  try { const v = input.distanceCost * input.timeCost * input.overheadPct; results["overhead"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overhead"] = Number.NaN; }
  try { const v = input.distanceCost * input.timeCost * input.tollCost * input.maintenanceCost * input.overhead; results["totalRouteCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRouteCost"] = Number.NaN; }
  try { const v = input.totalRouteCost * input.totalDistance; results["costPerKm"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerKm"] = Number.NaN; }
  try { const v = input.totalRouteCost * input.numberOfDrops; results["costPerDrop"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerDrop"] = Number.NaN; }
  return results;
}

export function calculateRotaMaliyet(input) {
  return evaluateAllFormulas(input);
}
