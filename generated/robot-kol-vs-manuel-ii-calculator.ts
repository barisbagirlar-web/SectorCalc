// Auto-generated premium calculator: robot-kol-vs-manuel-ii
import * as z from 'zod';

export interface RobotKolVsManuelIiInput {
  manuelRobot CevrimSuresiSn: number;
  operatorSayısı: number;
  saatlik UcretVeYanHaklar: number;
  robotCapex: number;
  OmurYıl: number;
  bakımEnerji: number;
  robotManuelVerimlilik: number;
}

export const RobotKolVsManuelIiInputSchema = z.object({
  manuelRobot CevrimSuresiSn: z.number().min(0).default(0),
  operatorSayısı: z.number().min(0).default(0),
  saatlik UcretVeYanHaklar: z.number().min(0).default(0),
  robotCapex: z.number().min(0).default(0),
  OmurYıl: z.number().min(0).default(0),
  bakımEnerji: z.number().min(0).default(0),
  robotManuelVerimlilik: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.operators * input.hourlyRate * input.hours * input.burden; results["manualCostAnnual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["manualCostAnnual"] = Number.NaN; }
  try { const v = input.robotCapex * input.depreciationLife * input.maintenance * input.energy * input.programmerCost; results["robotCostAnnual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["robotCostAnnual"] = Number.NaN; }
  try { const v = input.cycleTimeRobot * input.uptime; results["robotOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["robotOutput"] = Number.NaN; }
  try { const v = input.cycleTimeManual * input.efficiency; results["manualOutput"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["manualOutput"] = Number.NaN; }
  try { const v = input.manualCostAnnual * input.manualOutput; results["costPerUnitManual"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerUnitManual"] = Number.NaN; }
  try { const v = input.robotCostAnnual * input.robotOutput; results["costPerUnitRobot"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerUnitRobot"] = Number.NaN; }
  try { const v = input.manualCost * input.robotCost * input.robotCapex; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  try { const v = input.robotCapex * input.manualCostAnnual * input.robotCostAnnual; results["payback"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["payback"] = Number.NaN; }
  return results;
}

export function calculateRobotKolVsManuelIi(input) {
  return evaluateAllFormulas(input);
}
