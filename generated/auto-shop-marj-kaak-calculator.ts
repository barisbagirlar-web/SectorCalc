// Auto-generated premium calculator: auto-shop-marj-kaak
import * as z from 'zod';

export interface AutoShopMarjKaakInput {
  parcaIscilikGeliri: number;
  cOGS: number;
  envanterFire: number;
  flagMevcutSaatler: number;
  benchmarkMarj: number;
}

export const AutoShopMarjKaakInputSchema = z.object({
  parcaIscilikGeliri: z.number().min(0).default(0),
  cOGS: z.number().min(0).default(0),
  envanterFire: z.number().min(0).default(0),
  flagMevcutSaatler: z.number().min(0).default(0),
  benchmarkMarj: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.partsRevenue * input.partsCOGS; results["grossMarginParts"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossMarginParts"] = Number.NaN; }
  try { const v = input.totalLaborRevenue * input.totalFlagHours; results["effectiveLaborRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["effectiveLaborRate"] = Number.NaN; }
  try { const v = input.totalFlagHours * input.totalAvailableHours; results["productivityRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["productivityRate"] = Number.NaN; }
  try { const v = input.discount * input.totalRevenue; results["marginLeakDiscount"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginLeakDiscount"] = Number.NaN; }
  try { const v = input.inventoryShrinkage * input.partsCOGS; results["marginLeakShrinkage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["marginLeakShrinkage"] = Number.NaN; }
  try { const v = input.totalRevenue * input.totalCOGS * input.totalOpEx; results["netMargin"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["netMargin"] = Number.NaN; }
  try { const v = input.totalRevenue * input.targetMargin * input.netMargin; results["annualLeakage"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualLeakage"] = Number.NaN; }
  return results;
}

export function calculateAutoShopMarjKaak(input) {
  return evaluateAllFormulas(input);
}
