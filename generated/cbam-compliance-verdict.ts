// Auto-generated from cbam-compliance-verdict-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CbamComplianceVerdictInput {
  productCategory: 'cement' | 'aluminium' | 'fertilizers' | 'electricity' | 'hydrogen' | 'ironSteel';
  productionVolume: number;
  embeddedEmissions: number;
  carbonPriceOrigin: number;
  cbamCertificatePrice: number;
  freeAllowanceFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const CbamComplianceVerdictInputSchema = z.object({
  productCategory: z.enum(['cement', 'aluminium', 'fertilizers', 'electricity', 'hydrogen', 'ironSteel']).default('cement'),
  productionVolume: z.number().min(0).default(10000),
  embeddedEmissions: z.number().min(0).default(0.8),
  carbonPriceOrigin: z.number().min(0).default(30),
  cbamCertificatePrice: z.number().min(0).default(90),
  freeAllowanceFactor: z.number().min(0).max(100).default(0),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface CbamComplianceVerdictOutput {
  additionalCostDueToCBAM: number;
  breakdown: {
    totalEmbeddedEmissions: number;
    totalFreeAllowances: number;
    netEmissionsSubjectToCBAM: number;
    carbonCostInOrigin: number;
    cbamCertificateCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CbamComplianceVerdictInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalEmbeddedEmissions = (() => { try { return input.productionVolume * input.embeddedEmissions; } catch { return 0; } })();
  results.totalFreeAllowances = (() => { try { return results.totalEmbeddedEmissions * (input.freeAllowanceFactor / 100); } catch { return 0; } })();
  results.netEmissionsSubjectToCBAM = (() => { try { return results.totalEmbeddedEmissions - results.totalFreeAllowances; } catch { return 0; } })();
  results.carbonCostInOrigin = (() => { try { return results.totalEmbeddedEmissions * input.carbonPriceOrigin; } catch { return 0; } })();
  results.cbamCertificateCost = (() => { try { return results.netEmissionsSubjectToCBAM * input.cbamCertificatePrice; } catch { return 0; } })();
  results.additionalCostDueToCBAM = (() => { try { return results.cbamCertificateCost - results.carbonCostInOrigin; } catch { return 0; } })();
  results.complianceVerdict = (() => { try { return 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = (() => { try { return 0; } catch { return 0; } })();
  return results;
}

export function calculateCbamComplianceVerdict(input: CbamComplianceVerdictInput): CbamComplianceVerdictOutput {
  const results = evaluateFormulas(input);
  const additionalCostDueToCBAM = results.additionalCostDueToCBAM ?? 0;
  const breakdown = {
    totalEmbeddedEmissions: results.totalEmbeddedEmissions,
    totalFreeAllowances: results.totalFreeAllowances,
    netEmissionsSubjectToCBAM: results.netEmissionsSubjectToCBAM,
    carbonCostInOrigin: results.carbonCostInOrigin,
    cbamCertificateCost: results.cbamCertificateCost,
  };

  // rule: productionVolume > 0
  // rule: embeddedEmissions >= 0
  // rule: carbonPriceOrigin >= 0
  // rule: cbamCertificatePrice >= 0
  // rule: freeAllowanceFactor >= 0 and freeAllowanceFactor <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if embeddedEmissions > 1.0 then 'High embedded emissions'
  // threshold skipped (non-JS): if carbonPriceOrigin < 10 then 'Low carbon price in origin'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return additionalCostDueToCBAM; } })();

  return {
    additionalCostDueToCBAM,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Comparison with industry benchmarks","Detailed compliance report"],
  };
}
