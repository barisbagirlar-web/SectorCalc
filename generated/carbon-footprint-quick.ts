// Auto-generated from carbon-footprint-quick-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CarbonFootprintQuickInput {
  activityType: 'electricity' | 'naturalGas' | 'diesel' | 'gasoline' | 'propane' | 'coal' | 'waste' | 'water' | 'businessTravel' | 'commuting';
  quantity: number;
  unit: 'kWh' | 'therms' | 'gallons' | 'liters' | 'miles' | 'km' | 'tons' | 'kg' | 'cubicMeters';
  emissionFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
  includeOffset: boolean;
  offsetAmount: number;
}

export const CarbonFootprintQuickInputSchema = z.object({
  activityType: z.enum(['electricity', 'naturalGas', 'diesel', 'gasoline', 'propane', 'coal', 'waste', 'water', 'businessTravel', 'commuting']).default('electricity'),
  quantity: z.number().min(0).default(0),
  unit: z.enum(['kWh', 'therms', 'gallons', 'liters', 'miles', 'km', 'tons', 'kg', 'cubicMeters']).default('kWh'),
  emissionFactor: z.number().min(0).default(0.5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
  includeOffset: z.boolean().default(false),
  offsetAmount: z.number().min(0).default(0),
});

export interface CarbonFootprintQuickOutput {
  totalEmissions: number;
  breakdown: {
    rawEmissions: number;
    confidenceMultiplier: number;
    adjustedEmissions: number;
    offsetAmount: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CarbonFootprintQuickInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.rawEmissions = (() => { try { return input.quantity * input.emissionFactor; } catch { return 0; } })();
  results.confidenceMultiplier = (() => { try { return input.dataConfidence == 'low' ? 1.2 : (input.dataConfidence == 'medium' ? 1.0 : 0.9); } catch { return 0; } })();
  results.adjustedEmissions = (() => { try { return results.rawEmissions * results.confidenceMultiplier; } catch { return 0; } })();
  results.netEmissions = (() => { try { return input.includeOffset ? Math.max(0, results.adjustedEmissions - input.offsetAmount) : results.adjustedEmissions; } catch { return 0; } })();
  results.totalEmissions = (() => { try { return results.netEmissions; } catch { return 0; } })();
  return results;
}

export function calculateCarbonFootprintQuick(input: CarbonFootprintQuickInput): CarbonFootprintQuickOutput {
  const results = evaluateFormulas(input);
  const totalEmissions = results.totalEmissions ?? 0;
  const breakdown = {
    rawEmissions: results.rawEmissions,
    confidenceMultiplier: results.confidenceMultiplier,
    adjustedEmissions: results.adjustedEmissions,
    offsetAmount: results.offsetAmount,
  };

  // rule: quantity must be >= 0
  // rule: if activityType is 'electricity' then unit must be 'kWh'
  // rule: if activityType is 'naturalGas' then unit must be 'therms' or 'cubicMeters'
  // rule: if activityType is 'diesel' or 'gasoline' or 'propane' then unit must be 'gallons' or 'liters'
  // rule: if activityType is 'businessTravel' or 'commuting' then unit must be 'miles' or 'km'
  // rule: if includeOffset is true then offsetAmount must be > 0
  // rule: emissionFactor must be > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): totalEmissions

  const dataConfidenceAdjusted = (() => { try { return results.adjustedEmissions; } catch { return totalEmissions; } })();

  return {
    totalEmissions,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry averages","Detailed report with breakdown by activity type","Scenario modeling for reduction strategies"],
  };
}
