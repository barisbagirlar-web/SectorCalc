// Auto-generated from enjeksiyon-sogutma-suresi-ve-cevrim-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInput {
  partThickness: number;
  thermalDiffusivity: number;
  moldTemperature: number;
  meltTemperature: number;
  ejectionTemperature: number;
  injectionTime: number;
  packingTime: number;
  moldOpenCloseTime: number;
  ejectionTime: number;
  cycleTimeTarget: number;
  materialCostPerKg: number;
  partWeight: number;
  machineHourlyRate: number;
  laborCostPerHour: number;
  cavityCount: number;
  scrapRate: number;
  energyCostPerKwh: number;
  machinePower: number;
}

export const EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInputSchema = z.object({
  partThickness: z.number().min(0.5).max(20).default(3),
  thermalDiffusivity: z.number().min(0.05).max(0.3).default(0.1),
  moldTemperature: z.number().min(10).max(120).default(40),
  meltTemperature: z.number().min(150).max(350).default(230),
  ejectionTemperature: z.number().min(40).max(150).default(90),
  injectionTime: z.number().min(0.1).max(10).default(1),
  packingTime: z.number().min(0).max(20).default(2),
  moldOpenCloseTime: z.number().min(0.5).max(20).default(3),
  ejectionTime: z.number().min(0.2).max(10).default(1),
  cycleTimeTarget: z.number().min(5).max(120).default(30),
  materialCostPerKg: z.number().min(0.1).max(100).default(2.5),
  partWeight: z.number().min(1).max(5000).default(50),
  machineHourlyRate: z.number().min(10).max(500).default(50),
  laborCostPerHour: z.number().min(0).max(100).default(20),
  cavityCount: z.number().min(1).max(128).default(1),
  scrapRate: z.number().min(0).max(50).default(2),
  energyCostPerKwh: z.number().min(0.01).max(1).default(0.12),
  machinePower: z.number().min(5).max(500).default(50),
});

export interface EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorOutput {
  totalCostPerPartWithScrap: number;
  breakdown: {
    coolingTime: number;
    cycleTime: number;
    partsPerHour: number;
    materialCostPerPart: number;
    machineCostPerPart: number;
    laborCostPerPart: number;
    energyCostPerPart: number;
    totalCostPerPart: number;
    annualProductionVolume: number;
    annualCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.coolingTime = (() => { try { return ((input.partThickness^2) / (input.thermalDiffusivity * pi^2)) * ln((4/pi) * ((input.meltTemperature - input.moldTemperature) / (input.ejectionTemperature - input.moldTemperature))); } catch { return 0; } })();
  results.cycleTime = (() => { try { return input.injectionTime + input.packingTime + results.coolingTime + input.moldOpenCloseTime + input.ejectionTime; } catch { return 0; } })();
  results.cycleTimePerPart = (() => { try { return results.cycleTime / input.cavityCount; } catch { return 0; } })();
  results.partsPerHour = (() => { try { return 3600 / results.cycleTimePerPart; } catch { return 0; } })();
  results.materialCostPerPart = (() => { try { return (input.partWeight / 1000) * input.materialCostPerKg; } catch { return 0; } })();
  results.machineCostPerPart = (() => { try { return (input.machineHourlyRate / 3600) * results.cycleTimePerPart; } catch { return 0; } })();
  results.laborCostPerPart = (() => { try { return (input.laborCostPerHour / 3600) * results.cycleTimePerPart; } catch { return 0; } })();
  results.energyCostPerPart = (() => { try { return (input.machinePower * (results.cycleTimePerPart / 3600)) * input.energyCostPerKwh; } catch { return 0; } })();
  results.totalCostPerPart = (() => { try { return results.materialCostPerPart + results.machineCostPerPart + results.laborCostPerPart + results.energyCostPerPart; } catch { return 0; } })();
  results.totalCostPerPartWithScrap = (() => { try { return results.totalCostPerPart / (1 - input.scrapRate/100); } catch { return 0; } })();
  results.annualProductionVolume = (() => { try { return results.partsPerHour * 24 * 365 * 0.85; } catch { return 0; } })();
  results.annualCost = (() => { try { return results.totalCostPerPartWithScrap * results.annualProductionVolume; } catch { return 0; } })();
  return results;
}

export function calculateEnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculator(input: EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorInput): EnjeksiyonSogutmaSuresiVeCevrimOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalCostPerPartWithScrap = results.totalCostPerPartWithScrap ?? 0;
  const breakdown = {
    coolingTime: results.coolingTime,
    cycleTime: results.cycleTime,
    partsPerHour: results.partsPerHour,
    materialCostPerPart: results.materialCostPerPart,
    machineCostPerPart: results.machineCostPerPart,
    laborCostPerPart: results.laborCostPerPart,
    energyCostPerPart: results.energyCostPerPart,
    totalCostPerPart: results.totalCostPerPart,
    annualProductionVolume: results.annualProductionVolume,
    annualCost: results.annualCost,
  };

  // rule: ejectionTemperature must be less than meltTemperature
  // rule: moldTemperature must be less than ejectionTemperature
  // rule: injectionTime must be positive
  // rule: packingTime must be non-negative
  // rule: partThickness must be positive
  // rule: thermalDiffusivity must be positive
  // rule: cycleTimeTarget must be greater than sum of injectionTime, packingTime, coolingTime, moldOpenCloseTime, ejectionTime
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (coolingTime > input.cycleTimeTarget * 0.5) hiddenLossDrivers.push("coolingTimeExceedsTarget");
  if (input.scrapRate > 5) hiddenLossDrivers.push("scrapRateHigh");
  if (cycleTime > input.cycleTimeTarget * 1.2) hiddenLossDrivers.push("cycleTimeHigh");

  const dataConfidenceAdjusted = (() => { try { return results.totalCostPerPartWithScrap * (1 + (1 - dataConfidence) * 0.1); } catch { return totalCostPerPartWithScrap; } })();

  return {
    totalCostPerPartWithScrap,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Scenario Comparison","Detailed Report with Charts"],
  };
}
