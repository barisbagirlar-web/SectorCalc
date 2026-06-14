// Auto-generated from electrical-labor-estimator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ElectricalLaborEstimatorInput {
  projectType: 'new-installation' | 'retrofit' | 'maintenance' | 'emergency-repair';
  totalCircuitLength: number;
  numberOfDevices: number;
  laborRate: number;
  efficiencyFactor: number;
  complexityFactor: number;
  dataConfidence: number;
}

export const ElectricalLaborEstimatorInputSchema = z.object({
  projectType: z.enum(['new-installation', 'retrofit', 'maintenance', 'emergency-repair']).default('new-installation'),
  totalCircuitLength: z.number().min(0).max(100000).default(100),
  numberOfDevices: z.number().min(0).max(10000).default(10),
  laborRate: z.number().min(15).max(150).default(45),
  efficiencyFactor: z.number().min(0.5).max(1.5).default(1),
  complexityFactor: z.number().min(0.8).max(2).default(1),
  dataConfidence: z.number().min(0.5).max(1).default(0.9),
});

export interface ElectricalLaborEstimatorOutput {
  totalLaborCost: number;
  breakdown: {
    baseLaborHours: number;
    adjustedLaborHours: number;
    laborRate: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ElectricalLaborEstimatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.baseLaborHours = (() => { try { return ((input.totalCircuitLength * 0.05) + (input.numberOfDevices * 0.5)) * input.complexityFactor; } catch { return 0; } })();
  results.adjustedLaborHours = (() => { try { return results.baseLaborHours / input.efficiencyFactor; } catch { return 0; } })();
  results.totalLaborCost = (() => { try { return results.adjustedLaborHours * input.laborRate; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = (() => { try { return results.totalLaborCost / input.dataConfidence; } catch { return 0; } })();
  return results;
}

export function calculateElectricalLaborEstimator(input: ElectricalLaborEstimatorInput): ElectricalLaborEstimatorOutput {
  const results = evaluateFormulas(input);
  const totalLaborCost = results.totalLaborCost ?? 0;
  const breakdown = {
    baseLaborHours: results.baseLaborHours,
    adjustedLaborHours: results.adjustedLaborHours,
    laborRate: results.laborRate,
  };

  // rule: If projectType is 'emergency-repair', then laborRate must be >= 1.5 * standard laborRate (minimum 60).
  // rule: If projectType is 'maintenance', then totalCircuitLength must be > 0.
  // rule: efficiencyFactor must be between 0.5 and 1.5.
  // rule: complexityFactor must be between 0.8 and 2.0.
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): Low efficiency may indicate training or tool issues.
  // threshold skipped (non-JS): High complexity may require specialized crew.
  // threshold skipped (non-JS): Low data confidence; consider sensitivity analysis.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalLaborCost; } })();

  return {
    totalLaborCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Historical Data","Detailed Report with Charts"],
  };
}
