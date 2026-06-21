// Auto-generated premium calculator: rota-optimizasyonu-analizr
import * as z from 'zod';

export interface RotaOptimizasyonuAnalizrInput {
  durakSayısıKoordinatlar: number;
  depoKonumu: number;
  aracKapasitesi: number;
  zamanPencereleri: number;
  gecikmeCezaOranı: number;
  bazRotaMaliyeti: number;
}

export const RotaOptimizasyonuAnalizrInputSchema = z.object({
  durakSayısıKoordinatlar: z.number().min(0).default(0),
  depoKonumu: z.number().min(0).default(0),
  aracKapasitesi: z.number().min(0).default(0),
  zamanPencereleri: z.number().min(0).default(0),
  gecikmeCezaOranı: z.number().min(0).default(0),
  bazRotaMaliyeti: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.minDistanceI; results["nearestNeighborDist"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["nearestNeighborDist"] = Number.NaN; }
  try { const v = input.distanceDepotI * input.distanceDepotJ * input.distanceIJ; results["savingsClarkeWright"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["savingsClarkeWright"] = Number.NaN; }
  try { const v = input.theoreticalMinDistance * input.actualRouteDistance; results["routeEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["routeEfficiency"] = Number.NaN; }
  try { const v = input.numberOfDrops * input.routeArea; results["dropDensity"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["dropDensity"] = Number.NaN; }
  try { const v = input.arrivalTime * input.lateWindow * input.penaltyRate; results["timeWindowPenalty"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timeWindowPenalty"] = Number.NaN; }
  try { const v = input.totalLoad * input.vehicleCapacity; results["vehicleUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vehicleUtilization"] = Number.NaN; }
  try { const v = input.baselineCost * input.optimizedCost; results["totalSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSavings"] = Number.NaN; }
  return results;
}

export function calculateRotaOptimizasyonuAnalizr(input) {
  return evaluateAllFormulas(input);
}
