// Auto-generated premium calculator: tama-mode-maliyet-risk
import * as z from 'zod';

export interface TamaModeMaliyetRiskInput {
  agırlıkKgHacimM3: number;
  mesafeKm: number;
  havaDenizKaraBirimFiyatları: number;
  gunlukStokTasımaMaliyeti: number;
  hasarGecikmeOlasılıkları: number;
  kargoDegeri: number;
}

export const TamaModeMaliyetRiskInputSchema = z.object({
  agırlıkKgHacimM3: z.number().min(0).default(0),
  mesafeKm: z.number().min(0).default(0),
  havaDenizKaraBirimFiyatları: z.number().min(0).default(0),
  gunlukStokTasımaMaliyeti: z.number().min(0).default(0),
  hasarGecikmeOlasılıkları: z.number().min(0).default(0),
  kargoDegeri: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.weight * input.airRate * input.handling; results["costAir"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costAir"] = Number.NaN; }
  try { const v = input.volume * input.seaRate * input.portFees * input.customs; results["costSea"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costSea"] = Number.NaN; }
  try { const v = input.distance * input.roadRate * input.tolls; results["costRoad"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costRoad"] = Number.NaN; }
  try { const v = input.transitDays * input.inventoryCarryingCostPerDay; results["transitTimeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["transitTimeCost"] = Number.NaN; }
  try { const v = input.probabilityOfDamage * input.cargoValue * input.probabilityOfDelay * input.delayPenalty; results["riskCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["riskCost"] = Number.NaN; }
  try { const v = input.transportCost * input.transitTimeCost * input.riskCost; results["totalModeCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalModeCost"] = Number.NaN; }
  try { const v = input.totalModeCostAir * input.totalModeCostSea * input.totalModeCostRoad; results["modeSelection"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["modeSelection"] = Number.NaN; }
  return results;
}

export function calculateTamaModeMaliyetRisk(input) {
  return evaluateAllFormulas(input);
}
