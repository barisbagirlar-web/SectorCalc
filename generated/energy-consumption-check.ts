// Auto-generated from energy-consumption-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnergyConsumptionCheckInput {
  energyConsumed: number;
  productionOutput: number;
  operatingHours: number;
  energyCostPerKwh: number;
  baselineEnergyIntensity: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const EnergyConsumptionCheckInputSchema = z.object({
  energyConsumed: z.number().min(0).default(0),
  productionOutput: z.number().min(1).default(1),
  operatingHours: z.number().min(0).default(8),
  energyCostPerKwh: z.number().min(0).default(0.12),
  baselineEnergyIntensity: z.number().min(0).default(0.5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface EnergyConsumptionCheckOutput {
  energyIntensityRatio: number;
  breakdown: {
    energyIntensity: number;
    energyCost: number;
    energyCostPerUnit: number;
    baselineEnergyIntensity: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnergyConsumptionCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.energyIntensity = (() => { try { return input.energyConsumed / input.productionOutput; } catch { return 0; } })();
  results.energyCost = (() => { try { return input.energyConsumed * input.energyCostPerKwh; } catch { return 0; } })();
  results.energyIntensityRatio = (() => { try { return results.energyIntensity / input.baselineEnergyIntensity; } catch { return 0; } })();
  results.energyCostPerUnit = (() => { try { return results.energyCost / input.productionOutput; } catch { return 0; } })();
  results.dataConfidenceFactor = (() => { try { return input.dataConfidence == 'high' ? 1.0 : (input.dataConfidence == 'medium' ? 0.9 : 0.8); } catch { return 0; } })();
  results.adjustedEnergyIntensity = (() => { try { return results.energyIntensity * results.dataConfidenceFactor; } catch { return 0; } })();
  return results;
}

export function calculateEnergyConsumptionCheck(input: EnergyConsumptionCheckInput): EnergyConsumptionCheckOutput {
  const results = evaluateFormulas(input);
  const energyIntensityRatio = results.energyIntensityRatio ?? 0;
  const breakdown = {
    energyIntensity: results.energyIntensity,
    energyCost: results.energyCost,
    energyCostPerUnit: results.energyCostPerUnit,
    baselineEnergyIntensity: results.baselineEnergyIntensity,
  };

  // rule: energyConsumed >= 0
  // rule: productionOutput >= 1
  // rule: operatingHours >= 0
  // rule: energyCostPerKwh >= 0
  // rule: baselineEnergyIntensity >= 0
  // rule: dataConfidence in ['low','medium','high']
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): energyIntensityRatio

  const dataConfidenceAdjusted = (() => { try { return results.adjustedEnergyIntensity; } catch { return energyIntensityRatio; } })();

  return {
    energyIntensityRatio,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Comparison with historical data","Detailed report with breakdowns"],
  };
}
