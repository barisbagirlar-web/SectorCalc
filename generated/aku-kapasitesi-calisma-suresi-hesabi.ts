// Auto-generated from aku-kapasitesi-calisma-suresi-hesabi-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AkuKapasitesiCalismaSuresiHesabiInput {
  batteryCapacityAh: number;
  batteryVoltage: number;
  loadPowerW: number;
  depthOfDischarge: number;
  inverterEfficiency: number;
  systemEfficiency: number;
  temperatureDerating: number;
  agingFactor: number;
}

export const AkuKapasitesiCalismaSuresiHesabiInputSchema = z.object({
  batteryCapacityAh: z.number().min(1).max(10000).default(100),
  batteryVoltage: z.number().min(1).max(1000).default(12),
  loadPowerW: z.number().min(0.1).max(100000).default(100),
  depthOfDischarge: z.number().min(10).max(100).default(80),
  inverterEfficiency: z.number().min(50).max(100).default(90),
  systemEfficiency: z.number().min(50).max(100).default(95),
  temperatureDerating: z.number().min(0.5).max(1.2).default(1),
  agingFactor: z.number().min(0.5).max(1).default(0.8),
});

export interface AkuKapasitesiCalismaSuresiHesabiOutput {
  runtimeHours: number;
  breakdown: {
    usableEnergyWh: number;
    effectiveLoadW: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AkuKapasitesiCalismaSuresiHesabiInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.usableEnergyWh = input.batteryCapacityAh * input.batteryVoltage * (input.depthOfDischarge / 100) * input.temperatureDerating * input.agingFactor;
  results.effectiveLoadW = input.loadPowerW / (input.inverterEfficiency / 100) / (input.systemEfficiency / 100);
  results.runtimeHours = results.usableEnergyWh / results.effectiveLoadW;
  return results;
}

export function calculateAkuKapasitesiCalismaSuresiHesabi(input: AkuKapasitesiCalismaSuresiHesabiInput): AkuKapasitesiCalismaSuresiHesabiOutput {
  const results = evaluateFormulas(input);
  const runtimeHours = results.runtimeHours;
  const breakdown = {
    usableEnergyWh: results.usableEnergyWh,
    effectiveLoadW: results.effectiveLoadW,
  };

  // rule: batteryCapacityAh must be > 0
  // rule: batteryVoltage must be > 0
  // rule: loadPowerW must be > 0
  // rule: depthOfDischarge must be between 10 and 100
  // rule: inverterEfficiency must be between 50 and 100
  // rule: systemEfficiency must be between 50 and 100
  // rule: temperatureDerating must be between 0.5 and 1.2
  // rule: agingFactor must be between 0.5 and 1
  // threshold depthOfDischarge > 80: High DoD may reduce battery cycle life significantly.
  // threshold inverterEfficiency < 85: Low inverter efficiency indicates potential energy waste.
  // threshold agingFactor < 0.7: Battery is near end of life; consider replacement.
  const hiddenLossDrivers: string[] = ["depthOfDischarge > 80 ? 'High DoD reduces cycle life' : ''","inverterEfficiency < 85 ? 'Low inverter efficiency' : ''","agingFactor < 0.7 ? 'Battery aging significant' : ''"];
  const suggestedActions: string[] = ["depthOfDischarge > 80 ? 'Reduce DoD to 50-80% for longer battery life' : ''","inverterEfficiency < 85 ? 'Consider upgrading inverter' : ''","agingFactor < 0.7 ? 'Plan battery replacement' : ''"];
  const dataConfidenceAdjusted = results.runtimeHours * (dataConfidence || 1);

  return {
    runtimeHours,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: false,
    premiumFeatures: ["PDF export of detailed report","CSV export of input/output data","Trend analysis over time with historical data","Comparison of different battery configurations","Detailed loss breakdown chart","Battery sizing recommendation based on runtime target"],
  };
}
