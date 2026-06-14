// Auto-generated from kritiklik-risk-matrisi-ve-bakim-stratejisi-secim-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInput {
  assetCriticality: 'dusuk' | 'orta' | 'yuksek';
  failureProbability: 'dusuk' | 'orta' | 'yuksek';
  failureConsequence: 'dusuk' | 'orta' | 'yuksek';
  maintenanceCost: number;
  downtimeCost: number;
  meanTimeToRepair: number;
  meanTimeBetweenFailures: number;
  dataConfidence: 'dusuk' | 'orta' | 'yuksek';
}

export const KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInputSchema = z.object({
  assetCriticality: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
  failureProbability: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
  failureConsequence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
  maintenanceCost: z.number().min(0).default(10000),
  downtimeCost: z.number().min(0).default(500),
  meanTimeToRepair: z.number().min(0).default(4),
  meanTimeBetweenFailures: z.number().min(0).default(2000),
  dataConfidence: z.enum(['dusuk', 'orta', 'yuksek']).default('orta'),
});

export interface KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorOutput {
  maintenanceStrategy: number;
  breakdown: {
    riskScore: number;
    annualDowntimeCost: number;
    totalCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.criticalityScore = ((): number => { try { const __v = input.assetCriticality == 'yuksek' ? 3 : (input.assetCriticality == 'orta' ? 2 : 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.probabilityScore = ((): number => { try { const __v = input.failureProbability == 'yuksek' ? 3 : (input.failureProbability == 'orta' ? 2 : 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.consequenceScore = ((): number => { try { const __v = input.failureConsequence == 'yuksek' ? 3 : (input.failureConsequence == 'orta' ? 2 : 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.riskScore = ((): number => { try { const __v = results.criticalityScore * results.probabilityScore * results.consequenceScore; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDowntimeHours = ((): number => { try { const __v = (8760 / input.meanTimeBetweenFailures) * input.meanTimeToRepair; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualDowntimeCost = ((): number => { try { const __v = results.annualDowntimeHours * input.downtimeCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = input.maintenanceCost + results.annualDowntimeCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceStrategy = ((): number => { try { const __v = results.riskScore >= 7 ? 'Koruyucu Bakim' : (results.riskScore >= 4 ? 'Durum Bazli Bakim' : 'Ariza Bazli Bakim'); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedRisk = ((): number => { try { const __v = input.dataConfidence == 'yuksek' ? results.riskScore : (input.dataConfidence == 'orta' ? results.riskScore * 1.1 : results.riskScore * 1.25); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateKritiklikRiskMatrisiVeBakimStratejisiSecimCalculator(input: KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorInput): KritiklikRiskMatrisiVeBakimStratejisiSecimCalculatorOutput {
  const results = evaluateFormulas(input);
  const maintenanceStrategy = results.maintenanceStrategy ?? 0;
  const breakdown = {
    riskScore: results.riskScore,
    annualDowntimeCost: results.annualDowntimeCost,
    totalCost: results.totalCost,
  };

  // rule: maintenanceCost >= 0
  // rule: downtimeCost >= 0
  // rule: meanTimeToRepair > 0
  // rule: meanTimeBetweenFailures > 0
  // rule: meanTimeBetweenFailures > meanTimeToRepair
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (riskScore >= 7) hiddenLossDrivers.push("riskScoreHigh");
  if (riskScore >= 4 && riskScore < 7) hiddenLossDrivers.push("riskScoreMedium");
  if (riskScore < 4) hiddenLossDrivers.push("riskScoreLow");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedRisk; } catch { return maintenanceStrategy; } })();

  return {
    maintenanceStrategy,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi","Karsilastirma","Detayli rapor"],
  };
}
