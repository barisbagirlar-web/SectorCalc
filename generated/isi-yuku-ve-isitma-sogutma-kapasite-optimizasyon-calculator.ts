// Auto-generated from isi-yuku-ve-isitma-sogutma-kapasite-optimizasyon-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInput {
  buildingArea: number;
  ceilingHeight: number;
  occupancy: number;
  lightingPowerDensity: number;
  equipmentPowerDensity: number;
  wallUValue: number;
  windowUValue: number;
  windowToWallRatio: number;
  outdoorDesignTemp: number;
  indoorDesignTemp: number;
  infiltrationRate: number;
  ventilationRate: number;
  solarHeatGainCoefficient: number;
  efficiencyCOP: number;
  heatingEfficiency: number;
  electricityCost: number;
  fuelCost: number;
  operatingHours: number;
  operatingDays: number;
  dataConfidence: number;
}

export const IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInputSchema = z.object({
  buildingArea: z.number().min(10).max(100000).default(1000),
  ceilingHeight: z.number().min(2).max(20).default(3),
  occupancy: z.number().min(0).max(10000).default(50),
  lightingPowerDensity: z.number().min(0).max(50).default(10),
  equipmentPowerDensity: z.number().min(0).max(100).default(15),
  wallUValue: z.number().min(0.1).max(5).default(0.5),
  windowUValue: z.number().min(0.5).max(6).default(2.5),
  windowToWallRatio: z.number().min(0).max(100).default(30),
  outdoorDesignTemp: z.number().min(-20).max(50).default(35),
  indoorDesignTemp: z.number().min(18).max(30).default(24),
  infiltrationRate: z.number().min(0).max(5).default(0.5),
  ventilationRate: z.number().min(0).max(10).default(1),
  solarHeatGainCoefficient: z.number().min(0).max(1).default(0.4),
  efficiencyCOP: z.number().min(1).max(10).default(3.5),
  heatingEfficiency: z.number().min(50).max(100).default(90),
  electricityCost: z.number().min(0).max(10).default(1.5),
  fuelCost: z.number().min(0).max(10).default(0.8),
  operatingHours: z.number().min(0).max(24).default(10),
  operatingDays: z.number().min(1).max(365).default(300),
  dataConfidence: z.number().min(0).max(100).default(80),
});

export interface IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorOutput {
  totalEnergyCostAnnual: number;
  breakdown: {
    coolingLoadPerArea: number;
    heatingLoadPerArea: number;
    coolingCapacity: number;
    heatingCapacity: number;
    coolingEnergyAnnual: number;
    heatingEnergyAnnual: number;
    coolingCostAnnual: number;
    heatingCostAnnual: number;
    energyCostPerArea: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.volume = ((): number => { try { const __v = input.buildingArea * input.ceilingHeight; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.wallArea = ((): number => { try { const __v = input.buildingArea * 4 * input.ceilingHeight * (1 - input.windowToWallRatio / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.windowArea = ((): number => { try { const __v = input.buildingArea * 4 * input.ceilingHeight * (input.windowToWallRatio / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.transmissionCoolingLoad = ((): number => { try { const __v = (results.wallArea * input.wallUValue + results.windowArea * input.windowUValue) * (input.outdoorDesignTemp - input.indoorDesignTemp); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.solarCoolingLoad = ((): number => { try { const __v = results.windowArea * input.solarHeatGainCoefficient * 300; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.infiltrationCoolingLoad = ((): number => { try { const __v = results.volume * input.infiltrationRate * 1.2 * 1005 * (input.outdoorDesignTemp - input.indoorDesignTemp) / 3600; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ventilationCoolingLoad = ((): number => { try { const __v = results.volume * input.ventilationRate * 1.2 * 1005 * (input.outdoorDesignTemp - input.indoorDesignTemp) / 3600; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.internalCoolingLoad = ((): number => { try { const __v = (input.lightingPowerDensity + input.equipmentPowerDensity) * input.buildingArea + input.occupancy * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCoolingLoad = ((): number => { try { const __v = results.transmissionCoolingLoad + results.solarCoolingLoad + results.infiltrationCoolingLoad + results.ventilationCoolingLoad + results.internalCoolingLoad; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coolingLoadPerArea = ((): number => { try { const __v = results.totalCoolingLoad / input.buildingArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coolingCapacity = ((): number => { try { const __v = results.totalCoolingLoad / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coolingPowerInput = ((): number => { try { const __v = results.coolingCapacity / input.efficiencyCOP; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coolingEnergyAnnual = ((): number => { try { const __v = results.coolingPowerInput * input.operatingHours * input.operatingDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.coolingCostAnnual = ((): number => { try { const __v = results.coolingEnergyAnnual * input.electricityCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.transmissionHeatingLoad = ((): number => { try { const __v = (results.wallArea * input.wallUValue + results.windowArea * input.windowUValue) * (input.indoorDesignTemp - input.outdoorDesignTemp); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.infiltrationHeatingLoad = ((): number => { try { const __v = results.volume * input.infiltrationRate * 1.2 * 1005 * (input.indoorDesignTemp - input.outdoorDesignTemp) / 3600; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.ventilationHeatingLoad = ((): number => { try { const __v = results.volume * input.ventilationRate * 1.2 * 1005 * (input.indoorDesignTemp - input.outdoorDesignTemp) / 3600; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalHeatingLoad = ((): number => { try { const __v = results.transmissionHeatingLoad + results.infiltrationHeatingLoad + results.ventilationHeatingLoad; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatingLoadPerArea = ((): number => { try { const __v = results.totalHeatingLoad / input.buildingArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatingCapacity = ((): number => { try { const __v = results.totalHeatingLoad / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatingPowerInput = ((): number => { try { const __v = results.heatingCapacity / (input.heatingEfficiency / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatingEnergyAnnual = ((): number => { try { const __v = results.heatingPowerInput * input.operatingHours * input.operatingDays; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatingCostAnnual = ((): number => { try { const __v = results.heatingEnergyAnnual * input.fuelCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalEnergyCostAnnual = ((): number => { try { const __v = results.coolingCostAnnual + results.heatingCostAnnual; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.energyCostPerArea = ((): number => { try { const __v = results.totalEnergyCostAnnual / input.buildingArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustedCost = ((): number => { try { const __v = results.totalEnergyCostAnnual * (1 + (100 - input.dataConfidence) / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateIsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculator(input: IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorInput): IsiYukuVeIsitmaSogutmaKapasiteOptimizasyonCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalEnergyCostAnnual = results.totalEnergyCostAnnual ?? 0;
  const breakdown = {
    coolingLoadPerArea: results.coolingLoadPerArea,
    heatingLoadPerArea: results.heatingLoadPerArea,
    coolingCapacity: results.coolingCapacity,
    heatingCapacity: results.heatingCapacity,
    coolingEnergyAnnual: results.coolingEnergyAnnual,
    heatingEnergyAnnual: results.heatingEnergyAnnual,
    coolingCostAnnual: results.coolingCostAnnual,
    heatingCostAnnual: results.heatingCostAnnual,
    energyCostPerArea: results.energyCostPerArea,
  };

  // rule: buildingArea > 0
  // rule: ceilingHeight > 0
  // rule: occupancy >= 0
  // rule: lightingPowerDensity >= 0
  // rule: equipmentPowerDensity >= 0
  // rule: wallUValue > 0
  // rule: windowUValue > 0
  // rule: windowToWallRatio >= 0 && windowToWallRatio <= 100
  // rule: outdoorDesignTemp > indoorDesignTemp (sogutma icin)
  // rule: indoorDesignTemp > outdoorDesignTemp (isitma icin)
  // rule: infiltrationRate >= 0
  // rule: ventilationRate >= 0
  // rule: solarHeatGainCoefficient >= 0 && solarHeatGainCoefficient <= 1
  // rule: efficiencyCOP > 0
  // rule: heatingEfficiency > 0 && heatingEfficiency <= 100
  // rule: electricityCost > 0
  // rule: fuelCost > 0
  // rule: operatingHours >= 0 && operatingHours <= 24
  // rule: operatingDays >= 1 && operatingDays <= 365
  // rule: dataConfidence >= 0 && dataConfidence <= 100
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  if (coolingLoadPerArea > 200) hiddenLossDrivers.push("Yuksek sogutma yuku, izolasyon iyilestirilmeli");
  if (heatingLoadPerArea > 150) hiddenLossDrivers.push("Yuksek isitma yuku, izolasyon iyilestirilmeli");
  if (energyCostPerArea > 100) hiddenLossDrivers.push("Enerji maliyeti yuksek, verimlilik onlemleri alinmali");

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjustedCost; } catch { return totalEnergyCostAnnual; } })();

  return {
    totalEnergyCostAnnual,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analizi (zaman serisi)","Karsilastirma (farkli senaryolar)","Detayli rapor (bilesen bazinda)"],
  };
}
