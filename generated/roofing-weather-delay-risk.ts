// Auto-generated from roofing-weather-delay-risk-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface RoofingWeatherDelayRiskInput {
  projectDurationDays: number;
  historicalWeatherDelayRate: number;
  seasonalFactor: 'low' | 'moderate' | 'high';
  criticalPathRatio: number;
  dailyCostRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const RoofingWeatherDelayRiskInputSchema = z.object({
  projectDurationDays: z.number().min(1).max(365).default(30),
  historicalWeatherDelayRate: z.number().min(0).max(1).default(0.15),
  seasonalFactor: z.enum(['low', 'moderate', 'high']).default('moderate'),
  criticalPathRatio: z.number().min(0).max(1).default(0.4),
  dailyCostRate: z.number().min(0).default(5000),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface RoofingWeatherDelayRiskOutput {
  expectedCostImpact: number;
  breakdown: {
    expectedDelayDays: number;
    delayRiskIndex: number;
    seasonalMultiplier: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: RoofingWeatherDelayRiskInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.seasonalMultiplier = ((): number => { try { const __v = input.seasonalFactor == 'low' ? 0.7 : (input.seasonalFactor == 'moderate' ? 1.0 : 1.5); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedDelayDays = ((): number => { try { const __v = input.projectDurationDays * input.historicalWeatherDelayRate * results.seasonalMultiplier * input.criticalPathRatio; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.expectedCostImpact = ((): number => { try { const __v = results.expectedDelayDays * input.dailyCostRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.delayRiskIndex = ((): number => { try { const __v = results.expectedDelayDays / input.projectDurationDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.expectedCostImpact * (input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateRoofingWeatherDelayRisk(input: RoofingWeatherDelayRiskInput): RoofingWeatherDelayRiskOutput {
  const results = evaluateFormulas(input);
  const expectedCostImpact = results.expectedCostImpact ?? 0;
  const breakdown = {
    expectedDelayDays: results.expectedDelayDays,
    delayRiskIndex: results.delayRiskIndex,
    seasonalMultiplier: results.seasonalMultiplier,
  };

  // rule: projectDurationDays must be >= 1 and <= 365
  // rule: historicalWeatherDelayRate must be between 0 and 1
  // rule: criticalPathRatio must be between 0 and 1
  // rule: dailyCostRate must be >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if expectedDelayDays > projectDurationDays * 0.2 then 'HIGH_DELAY_RISK'
  // threshold skipped (non-JS): if expectedCostImpact > 100000 then 'HIGH_COST_IMPACT'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return expectedCostImpact; } })();

  return {
    expectedCostImpact,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
