// Auto-generated premium calculator: ofis-malzemeleri-maliyet
import * as z from 'zod';

export interface OfisMalzemeleriMaliyetInput {
  CalısanSayısı: number;
  tuketimMiktarları: number;
  birimFiyatlar: number;
  siparisMaliyeti: number;
  acilKargoMaliyeti: number;
  stokTasımaOranı: number;
  fireIsrafOranı: number;
}

export const OfisMalzemeleriMaliyetInputSchema = z.object({
  CalısanSayısı: z.number().min(0).default(0),
  tuketimMiktarları: z.number().min(0).default(0),
  birimFiyatlar: z.number().min(0).default(0),
  siparisMaliyeti: z.number().min(0).default(0),
  acilKargoMaliyeti: z.number().min(0).default(0),
  stokTasımaOranı: z.number().min(0).default(0),
  fireIsrafOranı: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.totalConsumed * input.employeeCount; results["consumptionRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["consumptionRate"] = Number.NaN; }
  try { const v = input.itemI * input.unitPriceI * input.annualUsageI; results["annualCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["annualCost"] = Number.NaN; }
  try { const v = input.averageInventory * input.holdingRate; results["carryingCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["carryingCost"] = Number.NaN; }
  try { const v = input.emergencyOrders * input.premiumFreight; results["stockoutCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stockoutCost"] = Number.NaN; }
  try { const v = input.annualUsage * input.orderCost * input.holdingCost; results["eOQOffice"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["eOQOffice"] = Number.NaN; }
  try { const v = input.purchased * input.consumed; results["wastePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["wastePct"] = Number.NaN; }
  try { const v = input.currentCost * input.eOQCost * input.wastePct; results["optimizationSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimizationSavings"] = Number.NaN; }
  return results;
}

export function calculateOfisMalzemeleriMaliyet(input) {
  return evaluateAllFormulas(input);
}
