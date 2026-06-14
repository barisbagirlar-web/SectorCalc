// Auto-generated from irrigation-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IrrigationCostCheckInput {
  irrigationType: 'drip' | 'sprinkler' | 'flood' | 'centerPivot';
  areaHectares: number;
  waterSource: 'groundwater' | 'surfaceWater' | 'municipal' | 'recycled';
  waterVolumePerHectare: number;
  pumpHead: number;
  pumpEfficiency: number;
  energyCostPerKwh: number;
  waterCostPerM3: number;
  laborCostPerHour: number;
  laborHoursPerHectare: number;
  maintenanceCostPerHectare: number;
  systemLifeYears: number;
  capitalCostPerHectare: number;
  discountRate: number;
  dataConfidence: number;
}

export const IrrigationCostCheckInputSchema = z.object({
  irrigationType: z.enum(['drip', 'sprinkler', 'flood', 'centerPivot']).default('drip'),
  areaHectares: z.number().min(0.1).max(10000).default(10),
  waterSource: z.enum(['groundwater', 'surfaceWater', 'municipal', 'recycled']).default('groundwater'),
  waterVolumePerHectare: z.number().min(100).max(20000).default(5000),
  pumpHead: z.number().min(0).max(200).default(30),
  pumpEfficiency: z.number().min(30).max(95).default(70),
  energyCostPerKwh: z.number().min(0.01).max(0.5).default(0.12),
  waterCostPerM3: z.number().min(0).max(2).default(0.05),
  laborCostPerHour: z.number().min(0).max(100).default(15),
  laborHoursPerHectare: z.number().min(0).max(200).default(10),
  maintenanceCostPerHectare: z.number().min(0).max(1000).default(100),
  systemLifeYears: z.number().min(1).max(50).default(15),
  capitalCostPerHectare: z.number().min(100).max(10000).default(2000),
  discountRate: z.number().min(0).max(30).default(8),
  dataConfidence: z.number().min(0).max(1).default(0.9),
});

export interface IrrigationCostCheckOutput {
  costPerHectare: number;
  breakdown: {
    energyCostPerHectare: number;
    waterCostPerHectare: number;
    laborCostPerHectare: number;
    maintenanceCostPerHectare: number;
    capitalCostPerHectare: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IrrigationCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalAnnualWaterVolume = ((): number => { try { const __v = input.areaHectares * input.waterVolumePerHectare; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyKwh = ((): number => { try { const __v = results.totalAnnualWaterVolume * input.pumpHead * 2.725 / (input.pumpEfficiency / 100) / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCost = ((): number => { try { const __v = results.annualEnergyKwh * input.energyCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualWaterCost = ((): number => { try { const __v = results.totalAnnualWaterVolume * input.waterCostPerM3; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLaborCost = ((): number => { try { const __v = input.areaHectares * input.laborHoursPerHectare * input.laborCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualMaintenanceCost = ((): number => { try { const __v = input.areaHectares * input.maintenanceCostPerHectare; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualOperatingCost = ((): number => { try { const __v = results.annualEnergyCost + results.annualWaterCost + results.annualLaborCost + results.annualMaintenanceCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCapitalRecoveryFactor = ((): number => { try { const __v = input.discountRate / 100 * (1 + input.discountRate / 100) ^ input.systemLifeYears / ((1 + input.discountRate / 100) ^ input.systemLifeYears - 1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCapitalCost = ((): number => { try { const __v = input.areaHectares * input.capitalCostPerHectare * results.annualCapitalRecoveryFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualCost = ((): number => { try { const __v = results.totalAnnualOperatingCost + results.annualCapitalCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerHectare = ((): number => { try { const __v = results.totalAnnualCost / input.areaHectares; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerM3 = ((): number => { try { const __v = results.totalAnnualCost / results.totalAnnualWaterVolume; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyCostPerHectare = ((): number => { try { const __v = results.annualEnergyCost / input.areaHectares; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.waterCostPerHectare = ((): number => { try { const __v = results.annualWaterCost / input.areaHectares; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCostPerHectare = ((): number => { try { const __v = results.annualLaborCost / input.areaHectares; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.maintenanceCostPerHectareCalc = ((): number => { try { const __v = results.annualMaintenanceCost / input.areaHectares; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.capitalCostPerHectareCalc = ((): number => { try { const __v = results.annualCapitalCost / input.areaHectares; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalAnnualCost * (1 + (1 - input.dataConfidence) * 0.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIrrigationCostCheck(input: IrrigationCostCheckInput): IrrigationCostCheckOutput {
  const results = evaluateFormulas(input);
  const costPerHectare = results.costPerHectare ?? 0;
  const breakdown = {
    energyCostPerHectare: results.energyCostPerHectare,
    waterCostPerHectare: results.waterCostPerHectare,
    laborCostPerHectare: results.laborCostPerHectare,
    maintenanceCostPerHectare: results.maintenanceCostPerHectareCalc,
    capitalCostPerHectare: results.capitalCostPerHectareCalc,
  };

  // rule: areaHectares > 0
  // rule: waterVolumePerHectare > 0
  // rule: pumpHead >= 0
  // rule: pumpEfficiency between 30 and 95
  // rule: energyCostPerKwh > 0
  // rule: waterCostPerM3 >= 0
  // rule: laborCostPerHour >= 0
  // rule: laborHoursPerHectare >= 0
  // rule: maintenanceCostPerHectare >= 0
  // rule: systemLifeYears >= 1
  // rule: capitalCostPerHectare > 0
  // rule: discountRate >= 0
  // rule: dataConfidence between 0 and 1
  // rule: if waterSource='groundwater' then waterCostPerM3 = 0
  // rule: if irrigationType='drip' then waterVolumePerHectare <= 8000
  // rule: if irrigationType='flood' then waterVolumePerHectare >= 3000
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): energyCostPerHectare
  // threshold skipped (non-string): waterCostPerHectare
  // threshold skipped (non-string): totalAnnualCostPerHectare

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return costPerHectare; } })();

  return {
    costPerHectare,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over multiple years","Comparison with benchmark costs","Detailed breakdown report with charts"],
  };
}
