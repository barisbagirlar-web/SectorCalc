// Auto-generated from cbam-exposure-quick-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CbamExposureQuickCheckInput {
  sector: 'cement' | 'iron_steel' | 'aluminum' | 'fertilizers' | 'electricity' | 'hydrogen';
  productionVolume: number;
  embeddedEmissionsPerTon: number;
  carbonPriceOrigin: number;
  cbamCertificatePrice: number;
  freeAllowanceFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CbamExposureQuickCheckInputSchema = z.object({
  sector: z.enum(['cement', 'iron_steel', 'aluminum', 'fertilizers', 'electricity', 'hydrogen']).default('cement'),
  productionVolume: z.number().min(0).default(100000),
  embeddedEmissionsPerTon: z.number().min(0).default(0.8),
  carbonPriceOrigin: z.number().min(0).default(30),
  cbamCertificatePrice: z.number().min(0).default(80),
  freeAllowanceFactor: z.number().min(0).max(100).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CbamExposureQuickCheckOutput {
  cbamExposureCost: number;
  breakdown: {
    totalEmbeddedEmissions: number;
    totalCarbonCostOrigin: number;
    totalCarbonCostCBAM: number;
    freeAllowanceEmissions: number;
    exposurePerTon: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CbamExposureQuickCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalEmbeddedEmissions = ((): number => { try { const __v = input.productionVolume * input.embeddedEmissionsPerTon; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCarbonCostOrigin = ((): number => { try { const __v = results.totalEmbeddedEmissions * input.carbonPriceOrigin; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCarbonCostCBAM = ((): number => { try { const __v = results.totalEmbeddedEmissions * input.cbamCertificatePrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.freeAllowanceEmissions = ((): number => { try { const __v = results.totalEmbeddedEmissions * (input.freeAllowanceFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.cbamExposureCost = ((): number => { try { const __v = results.totalCarbonCostCBAM - results.totalCarbonCostOrigin - (results.freeAllowanceEmissions * input.cbamCertificatePrice); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.exposurePerTon = ((): number => { try { const __v = results.cbamExposureCost / input.productionVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.cbamExposureCost * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCbamExposureQuickCheck(input: CbamExposureQuickCheckInput): CbamExposureQuickCheckOutput {
  const results = evaluateFormulas(input);
  const cbamExposureCost = results.cbamExposureCost ?? 0;
  const breakdown = {
    totalEmbeddedEmissions: results.totalEmbeddedEmissions,
    totalCarbonCostOrigin: results.totalCarbonCostOrigin,
    totalCarbonCostCBAM: results.totalCarbonCostCBAM,
    freeAllowanceEmissions: results.freeAllowanceEmissions,
    exposurePerTon: results.exposurePerTon,
  };

  // rule: productionVolume > 0
  // rule: embeddedEmissionsPerTon >= 0
  // rule: carbonPriceOrigin >= 0
  // rule: cbamCertificatePrice >= 0
  // rule: freeAllowanceFactor >= 0 and freeAllowanceFactor <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if embeddedEmissionsPerTon > sectorBenchmark then 'High emissions relative to sector benchmark'
  // threshold skipped (non-JS): if carbonPriceOrigin < 10 then 'Low carbon price in origin country, high exposure'
  // threshold skipped (non-JS): if freeAllowanceFactor < 20 then 'Limited free allowances, full exposure'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return cbamExposureCost; } })();

  return {
    cbamExposureCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against sector averages","Detailed breakdown report"],
  };
}
