// Auto-generated from electrical-panel-rework-cost-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface ElectricalPanelReworkCostInput {
  panelType: 'standard' | 'custom' | 'high-voltage';
  reworkScope: 'minor' | 'moderate' | 'major';
  laborRate: number;
  numPanels: number;
  materialCostPerPanel: number;
  defectRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const ElectricalPanelReworkCostInputSchema = z.object({
  panelType: z.enum(['standard', 'custom', 'high-voltage']).default('standard'),
  reworkScope: z.enum(['minor', 'moderate', 'major']).default('minor'),
  laborRate: z.number().min(15).max(150).default(50),
  numPanels: z.number().min(1).max(1000).default(1),
  materialCostPerPanel: z.number().min(0).max(10000).default(200),
  defectRate: z.number().min(0).max(100).default(5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface ElectricalPanelReworkCostOutput {
  totalReworkCost: number;
  breakdown: {
    totalLaborCost: number;
    totalMaterialCost: number;
    costPerPanel: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: ElectricalPanelReworkCostInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.reworkTimePerPanel = (() => { try { return 0; } catch { return 0; } })();
  results.totalLaborHours = (() => { try { return input.numPanels * results.reworkTimePerPanel; } catch { return 0; } })();
  results.totalLaborCost = (() => { try { return results.totalLaborHours * input.laborRate; } catch { return 0; } })();
  results.totalMaterialCost = (() => { try { return input.numPanels * input.materialCostPerPanel; } catch { return 0; } })();
  results.totalReworkCost = (() => { try { return results.totalLaborCost + results.totalMaterialCost; } catch { return 0; } })();
  results.costPerPanel = (() => { try { return results.totalReworkCost / input.numPanels; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = (() => { try { return 0; } catch { return 0; } })();
  return results;
}

export function calculateElectricalPanelReworkCost(input: ElectricalPanelReworkCostInput): ElectricalPanelReworkCostOutput {
  const results = evaluateFormulas(input);
  const totalReworkCost = results.totalReworkCost ?? 0;
  const breakdown = {
    totalLaborCost: results.totalLaborCost,
    totalMaterialCost: results.totalMaterialCost,
    costPerPanel: results.costPerPanel,
  };

  // rule: laborRate must be > 0
  // rule: numPanels must be integer >= 1
  // rule: materialCostPerPanel must be >= 0
  // rule: defectRate must be between 0 and 100
  // rule: if reworkScope == 'major' then laborRate >= 40
  // rule: if panelType == 'high-voltage' then materialCostPerPanel >= 500
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High defect rate indicates process issues; consider root cause analysis.
  // threshold skipped (non-JS): Material cost exceeds typical budget; review sourcing.
  // threshold skipped (non-JS): Labor rate is above average; verify market rates.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalReworkCost; } })();

  return {
    totalReworkCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmark comparison","Detailed report with charts"],
  };
}
