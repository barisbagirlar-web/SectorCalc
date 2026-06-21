// Auto-generated premium calculator: dye-reete-maliyet
import * as z from 'zod';

export interface DyeReeteMaliyetInput {
  flotteOranı: number;
  kumasAgırlık: number;
  konsantrasyon: number;
  dozaj: number;
  isıtma: number;
  kOIEsik: number;
  rFT: number;
}

export const DyeReeteMaliyetInputSchema = z.object({
  flotteOranı: z.number().min(0).default(0),
  kumasAgırlık: z.number().min(0).default(0),
  konsantrasyon: z.number().min(0).default(0),
  dozaj: z.number().min(0).default(0),
  isıtma: z.number().min(0).default(0),
  kOIEsik: z.number().min(0).default(0),
  rFT: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.conc * input.price * input.bathRatio; results["costDye"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costDye"] = Number.NaN; }
  try { const v = input.dosage * input.price; results["costChem"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costChem"] = Number.NaN; }
  try { const v = input.liquorRatio * input.weight * input.waterTariff; results["costWater"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costWater"] = Number.NaN; }
  try { const v = input.heating * input.holding * input.drying; results["costEnergy"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costEnergy"] = Number.NaN; }
  try { const v = input.effluent * input.treatCost * input.surcharge; results["costWaste"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costWaste"] = Number.NaN; }
  try { const v = input.dye * input.chem * input.water * input.energy * input.waste; results["totalBatch"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalBatch"] = Number.NaN; }
  try { const v = input.rework * input.rFT; results["rFTSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rFTSavings"] = Number.NaN; }
  try { const v = input.totalBatch * input.rFTSavings * input.weight; results["costPerKg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costPerKg"] = Number.NaN; }
  return results;
}

export function calculateDyeReeteMaliyet(input) {
  return evaluateAllFormulas(input);
}
