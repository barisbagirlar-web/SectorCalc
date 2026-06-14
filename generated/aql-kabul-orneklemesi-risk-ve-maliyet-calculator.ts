// Auto-generated from aql-kabul-orneklemesi-risk-ve-maliyet-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AqlKabulOrneklemesiRiskVeMaliyetCalculatorInput {
  lotSize: number;
  aqlLevel: number;
  inspectionLevel: 'I' | 'II' | 'III';
  sampleSize: number;
  acceptNumber: number;
  defectRate: number;
  unitCost: number;
  inspectionCostPerUnit: number;
  reworkCostPerUnit: number;
  rejectionCostPerUnit: number;
  dataConfidence: number;
}

export const AqlKabulOrneklemesiRiskVeMaliyetCalculatorInputSchema = z.object({
  lotSize: z.number().min(1).max(1000000).default(1000),
  aqlLevel: z.number().min(0.01).max(10).default(1),
  inspectionLevel: z.enum(['I', 'II', 'III']).default('II'),
  sampleSize: z.number().min(1).max(10000).default(80),
  acceptNumber: z.number().min(0).max(100).default(2),
  defectRate: z.number().min(0).max(100).default(2),
  unitCost: z.number().min(0).max(100000).default(10),
  inspectionCostPerUnit: z.number().min(0).max(1000).default(1),
  reworkCostPerUnit: z.number().min(0).max(1000).default(5),
  rejectionCostPerUnit: z.number().min(0).max(10000).default(20),
  dataConfidence: z.number().min(0).max(100).default(90),
});

export interface AqlKabulOrneklemesiRiskVeMaliyetCalculatorOutput {
  totalCost: number;
  breakdown: {
    inspectionCost: number;
    reworkCost: number;
    rejectionCost: number;
    probabilityOfAcceptance: number;
    producerRisk: number;
    consumerRisk: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.probabilityOfAcceptance = (() => { try { return 0; } catch { return 0; } })();
  results.producerRisk = (() => { try { return 1 - results.probabilityOfAcceptance; } catch { return 0; } })();
  results.consumerRisk = (() => { try { return 0; } catch { return 0; } })();
  results.expectedDefectsInLot = (() => { try { return input.lotSize * input.defectRate / 100; } catch { return 0; } })();
  results.expectedDefectsAccepted = (() => { try { return results.expectedDefectsInLot * results.probabilityOfAcceptance; } catch { return 0; } })();
  results.expectedDefectsRejected = (() => { try { return results.expectedDefectsInLot * (1 - results.probabilityOfAcceptance); } catch { return 0; } })();
  results.inspectionCost = (() => { try { return input.sampleSize * input.inspectionCostPerUnit; } catch { return 0; } })();
  results.reworkCost = (() => { try { return results.expectedDefectsAccepted * input.reworkCostPerUnit; } catch { return 0; } })();
  results.rejectionCost = (() => { try { return results.expectedDefectsRejected * input.rejectionCostPerUnit; } catch { return 0; } })();
  results.totalCost = (() => { try { return results.inspectionCost + results.reworkCost + results.rejectionCost; } catch { return 0; } })();
  results.costPerUnit = (() => { try { return results.totalCost / input.lotSize; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = (() => { try { return results.totalCost * (100 / input.dataConfidence); } catch { return 0; } })();
  return results;
}

export function calculateAqlKabulOrneklemesiRiskVeMaliyetCalculator(input: AqlKabulOrneklemesiRiskVeMaliyetCalculatorInput): AqlKabulOrneklemesiRiskVeMaliyetCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    inspectionCost: results.inspectionCost,
    reworkCost: results.reworkCost,
    rejectionCost: results.rejectionCost,
    probabilityOfAcceptance: results.probabilityOfAcceptance,
    producerRisk: results.producerRisk,
    consumerRisk: results.consumerRisk,
  };

  // rule: lotSize > 0
  // rule: aqlLevel > 0 and aqlLevel <= 10
  // rule: sampleSize > 0 and sampleSize <= lotSize
  // rule: acceptNumber >= 0
  // rule: defectRate >= 0 and defectRate <= 100
  // rule: unitCost >= 0
  // rule: inspectionCostPerUnit >= 0
  // rule: reworkCostPerUnit >= 0
  // rule: rejectionCostPerUnit >= 0
  // rule: dataConfidence >= 0 and dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): UYARI: Gercek kusur orani AQL seviyesini asiyor, parti reddedilme riski yuksek.
  // threshold skipped (non-JS): KRITIK: Kusur orani %5'in uzerinde, surec iyilestirme gerekli.
  // threshold skipped (non-JS): UYARI: Orneklem buyuklugu kucuk, istatistiksel guven dusuk.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Data","Detailed Report with OC Curve"],
  };
}
