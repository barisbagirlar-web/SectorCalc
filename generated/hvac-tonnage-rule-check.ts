// Auto-generated from hvac-tonnage-rule-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HvacTonnageRuleCheckInput {
  coolingLoad: number;
  sensibleHeatRatio: number;
  designTemperatureDifference: number;
  airflowRate: number;
  efficiencyCOP: number;
  operatingHours: number;
  electricityRate: number;
  systemType: 'air-cooled' | 'water-cooled' | 'chilled-water' | 'heat-pump';
  maintenanceFactor: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const HvacTonnageRuleCheckInputSchema = z.object({
  coolingLoad: z.number().min(0).default(120000),
  sensibleHeatRatio: z.number().min(0.5).max(1).default(0.75),
  designTemperatureDifference: z.number().min(10).max(40).default(20),
  airflowRate: z.number().min(0).default(4000),
  efficiencyCOP: z.number().min(1).max(10).default(3.5),
  operatingHours: z.number().min(0).max(8760).default(2000),
  electricityRate: z.number().min(0).default(0.12),
  systemType: z.enum(['air-cooled', 'water-cooled', 'chilled-water', 'heat-pump']).default('air-cooled'),
  maintenanceFactor: z.number().min(0.7).max(1).default(0.95),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface HvacTonnageRuleCheckOutput {
  tonnage: number;
  breakdown: {
    sensibleCoolingLoad: number;
    latentCoolingLoad: number;
    requiredAirflow: number;
    airflowCheck: number;
    annualEnergyCost: number;
    maintenanceAdjustedCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HvacTonnageRuleCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.tonnage = ((): number => { try { const __v = input.coolingLoad / 12000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sensibleCoolingLoad = ((): number => { try { const __v = input.coolingLoad * input.sensibleHeatRatio; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.latentCoolingLoad = ((): number => { try { const __v = input.coolingLoad * (1 - input.sensibleHeatRatio); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.requiredAirflow = ((): number => { try { const __v = results.sensibleCoolingLoad / (1.08 * input.designTemperatureDifference); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.airflowCheck = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyConsumption = ((): number => { try { const __v = (input.coolingLoad / 12000) * (12 / input.efficiencyCOP) * input.operatingHours * 0.293071; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCost = ((): number => { try { const __v = results.energyConsumption * input.electricityRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceAdjustedCost = ((): number => { try { const __v = results.annualEnergyCost / input.maintenanceFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceFactor = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.maintenanceAdjustedCost * results.dataConfidenceFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHvacTonnageRuleCheck(input: HvacTonnageRuleCheckInput): HvacTonnageRuleCheckOutput {
  const results = evaluateFormulas(input);
  const tonnage = results.tonnage ?? 0;
  const breakdown = {
    sensibleCoolingLoad: results.sensibleCoolingLoad,
    latentCoolingLoad: results.latentCoolingLoad,
    requiredAirflow: results.requiredAirflow,
    airflowCheck: results.airflowCheck,
    annualEnergyCost: results.annualEnergyCost,
    maintenanceAdjustedCost: results.maintenanceAdjustedCost,
  };

  // rule: coolingLoad > 0
  // rule: sensibleHeatRatio >= 0.5 and sensibleHeatRatio <= 1.0
  // rule: designTemperatureDifference >= 10 and designTemperatureDifference <= 40
  // rule: airflowRate > 0
  // rule: efficiencyCOP >= 1.0
  // rule: operatingHours >= 0 and operatingHours <= 8760
  // rule: electricityRate >= 0
  // rule: maintenanceFactor >= 0.7 and maintenanceFactor <= 1.0
  // rule: if systemType == 'water-cooled' then efficiencyCOP >= 4.0 else efficiencyCOP >= 3.0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if sensibleHeatRatio < 0.7 then 'Low SHR may indicate dehumidification issues'
  // threshold skipped (non-JS): if efficiencyCOP < 3.0 then 'Low COP; consider equipment upgrade'
  // threshold skipped (non-JS): if maintenanceFactor < 0.85 then 'Poor maintenance; schedule service'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return tonnage; } })();

  return {
    tonnage,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Charts"],
  };
}
