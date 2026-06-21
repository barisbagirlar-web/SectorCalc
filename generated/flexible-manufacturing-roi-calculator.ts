// Auto-generated premium calculator: flexible-manufacturing-roi
import * as z from 'zod';

export interface FlexibleManufacturingRoiInput {
  dedicatedFMSBedel: number;
  setupSayısı: number;
  wIPHurdaAzalma: number;
  tTMKazanc: number;
  primMarj: number;
  tasıma: number;
}

export const FlexibleManufacturingRoiInputSchema = z.object({
  dedicatedFMSBedel: z.number().min(0).default(0),
  setupSayısı: z.number().min(0).default(0),
  wIPHurdaAzalma: z.number().min(0).default(0),
  tTMKazanc: z.number().min(0).default(0),
  primMarj: z.number().min(0).default(0),
  tasıma: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.machDed * input.setupDed * input.changeovers * input.invHigh; results["costDed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costDed"] = Number.NaN; }
  try { const v = input.machFMS * input.toolFMS * input.prog * input.maint; results["costFlex"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costFlex"] = Number.NaN; }
  try { const v = input.tTMRed * input.revGain * input.custPrem * input.vol; results["flexVal"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["flexVal"] = Number.NaN; }
  try { const v = input.wIPDed * input.wIPFlex * input.carryCost; results["invSav"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["invSav"] = Number.NaN; }
  try { const v = input.scrapDed * input.scrapFlex * input.vol * input.unitCost; results["scrapRed"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["scrapRed"] = Number.NaN; }
  try { const v = input.costDed * input.costFlex * input.flexVal * input.invSav * input.scrapRed * input.capex; results["rOI"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["rOI"] = Number.NaN; }
  return results;
}

export function calculateFlexibleManufacturingRoi(input) {
  return evaluateAllFormulas(input);
}
