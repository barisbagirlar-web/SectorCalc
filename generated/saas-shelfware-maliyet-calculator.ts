// Auto-generated premium calculator: saas-shelfware-maliyet
import * as z from 'zod';

export interface SaasShelfwareMaliyetInput {
  satınAlınanLisans: number;
  aktifKullanıcı: number;
  toplamSozlesmeBedeli: number;
  tierFiyatFarkı: number;
  kullanılanToplam Ozellik: number;
  asımKullanımBedeli: number;
}

export const SaasShelfwareMaliyetInputSchema = z.object({
  satınAlınanLisans: z.number().min(0).default(0),
  aktifKullanıcı: z.number().min(0).default(0),
  toplamSozlesmeBedeli: z.number().min(0).default(0),
  tierFiyatFarkı: z.number().min(0).default(0),
  kullanılanToplam Ozellik: z.number().min(0).default(0),
  asımKullanımBedeli: z.number().min(0).default(0),
});

function toNumericFormulaValue(value) {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input) {
  const results = {};
  try { const v = input.purchasedLicenses; results["totalLicenses"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalLicenses"] = Number.NaN; }
  try { const v = input.usersLoggedInLast30Days; results["activeUsers"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activeUsers"] = Number.NaN; }
  try { const v = input.totalLicenses * input.activeUsers; results["shelfwarePct"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shelfwarePct"] = Number.NaN; }
  try { const v = input.shelfwarePct * input.totalContractValue; results["shelfwareCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shelfwareCost"] = Number.NaN; }
  try { const v = input.activeUsers * input.totalLicenses; results["utilizationRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["utilizationRate"] = Number.NaN; }
  try { const v = input.featuresUsed * input.totalFeatures; results["featureAdoption"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["featureAdoption"] = Number.NaN; }
  try { const v = input.shelfwareCost * input.underutilizedTierPriceDiff * input.users; results["optimizationSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["optimizationSavings"] = Number.NaN; }
  try { const v = input.actualUsage * input.contractedUsage * input.overageRate; results["trueUpCost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["trueUpCost"] = Number.NaN; }
  return results;
}

export function calculateSaasShelfwareMaliyet(input) {
  return evaluateAllFormulas(input);
}
