// Auto-generated premium calculator: lojistik-rota-kayb
import * as z from 'zod';

export interface LojistikRotaKaybInput {
  IdealGercekMesafeKm: number;
  ortalamaHızKms: number;
  yakıtTuketimOranıLkm: number;
  yakıtFiyatı: number;
  surucuSaatlik Ucreti: number;
  aracKmAsınmaMaliyetiCurrencykm: number;
}

export const LojistikRotaKaybInputSchema = z.object({
  IdealGercekMesafeKm: z.number().min(0).default(0),
  ortalamaHızKms: z.number().min(0).default(0),
  yakıtTuketimOranıLkm: z.number().min(0).default(0),
  yakıtFiyatı: z.number().min(0).default(0),
  surucuSaatlik Ucreti: z.number().min(0).default(0),
  aracKmAsınmaMaliyetiCurrencykm: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.pointToPointDistance; results["idealDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idealDistance"] = Number.NaN; }
  try { const v = input.routeDistance; results["actualDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualDistance"] = Number.NaN; }
  try { const v = input.actualDistance * input.idealDistance; results["driftPct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["driftPct"] = Number.NaN; }
  try { const v = input.actualDistance * input.idealDistance * input.fuelConsumptionRate * input.fuelPrice; results["fuelWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelWaste"] = Number.NaN; }
  try { const v = input.actualDistance * input.idealDistance * input.avgSpeed * input.driverHourlyRate; results["timeWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timeWaste"] = Number.NaN; }
  try { const v = input.fuelWaste * input.timeWaste * input.vehicleWearCost; results["totalRouteLoss"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalRouteLoss"] = Number.NaN; }
  try { const v = input.idealDistance * input.actualDistance; results["efficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["efficiency"] = Number.NaN; }
  return results;
}

export function calculateLojistikRotaKayb(input) {
  return evaluateAllFormulas(input);
}
