// Auto-generated premium calculator: yakt-rota-sapma
import * as z from 'zod';

export interface YaktRotaSapmaInput {
  planlıGercekMesafeKm: number;
  planlıGercekTuketimLkm: number;
  rolantiSuresiSaat: number;
  rolantiTuketimLsaat: number;
  yakıtFiyatıCurrencyL: number;
}

export const YaktRotaSapmaInputSchema = z.object({
  planlıGercekMesafeKm: z.number().min(0).default(0),
  planlıGercekTuketimLkm: z.number().min(0).default(0),
  rolantiSuresiSaat: z.number().min(0).default(0),
  rolantiTuketimLsaat: z.number().min(0).default(0),
  yakıtFiyatıCurrencyL: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.plannedDistance * input.fuelEfficiency; results["plannedFuel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["plannedFuel"] = Number.NaN; }
  try { const v = input.actualDistance * input.actualFuelEfficiency; results["actualFuel"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["actualFuel"] = Number.NaN; }
  try { const v = input.actualDistance * input.plannedDistance; results["routeDrift"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["routeDrift"] = Number.NaN; }
  try { const v = input.routeDrift * input.fuelEfficiency * input.fuelPrice; results["fuelWasteDistance"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelWasteDistance"] = Number.NaN; }
  try { const v = input.plannedDistance * input.actualFuelEfficiency * input.fuelEfficiency * input.fuelPrice; results["fuelWasteEfficiency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fuelWasteEfficiency"] = Number.NaN; }
  try { const v = input.idleTime * input.idleConsumptionRate * input.fuelPrice; results["idleFuelCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["idleFuelCost"] = Number.NaN; }
  try { const v = input.fuelWasteDistance * input.fuelWasteEfficiency * input.idleFuelCost; results["totalDriftCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDriftCost"] = Number.NaN; }
  return results;
}

export function calculateYaktRotaSapma(input) {
  return evaluateAllFormulas(input);
}
