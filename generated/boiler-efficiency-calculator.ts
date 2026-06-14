// Auto-generated from boiler-efficiency-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoilerEfficiencyCalculatorInput {
  fuelType: 'naturalGas' | 'oil' | 'coal' | 'biomass' | 'electricity';
  fuelConsumption: number;
  fuelHeatingValue: number;
  steamFlow: number;
  steamEnthalpy: number;
  feedwaterEnthalpy: number;
  excessAir: number;
  flueGasTemperature: number;
  ambientTemperature: number;
  blowdownRate: number;
  radiationLoss: number;
  operatingHours: number;
  fuelCost: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const BoilerEfficiencyCalculatorInputSchema = z.object({
  fuelType: z.enum(['naturalGas', 'oil', 'coal', 'biomass', 'electricity']).default('naturalGas'),
  fuelConsumption: z.number().min(0).max(100000).default(100),
  fuelHeatingValue: z.number().min(0).max(100000).default(50000),
  steamFlow: z.number().min(0).max(1000000).default(1000),
  steamEnthalpy: z.number().min(0).max(4000).default(2800),
  feedwaterEnthalpy: z.number().min(0).max(1000).default(420),
  excessAir: z.number().min(0).max(100).default(20),
  flueGasTemperature: z.number().min(50).max(500).default(200),
  ambientTemperature: z.number().min(-20).max(50).default(25),
  blowdownRate: z.number().min(0).max(20).default(2),
  radiationLoss: z.number().min(0).max(10).default(1.5),
  operatingHours: z.number().min(0).max(8760).default(8000),
  fuelCost: z.number().min(0).max(100).default(0.5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface BoilerEfficiencyCalculatorOutput {
  efficiency: number;
  breakdown: {
    energyInput: number;
    energyOutput: number;
    dryFlueGasLoss: number;
    moistureLoss: number;
    blowdownLoss: number;
    radiationLossPercent: number;
    totalLosses: number;
    efficiencyIndirect: number;
    annualFuelConsumption: number;
    annualFuelCost: number;
    annualEnergyInput: number;
    annualEnergyOutput: number;
    annualSavingsPotential: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoilerEfficiencyCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.energyInput = input.fuelConsumption * input.fuelHeatingValue;
  results.energyOutput = input.steamFlow * (input.steamEnthalpy - input.feedwaterEnthalpy);
  results.efficiency = (results.energyOutput / results.energyInput) * 100;
  results.dryFlueGasLoss = input.excessAir * 0.001 * (input.flueGasTemperature - input.ambientTemperature) * (input.fuelConsumption / input.steamFlow);
  results.moistureLoss = 0.09 * (input.flueGasTemperature - input.ambientTemperature) * (input.fuelConsumption / input.steamFlow);
  results.blowdownLoss = input.blowdownRate / 100 * results.energyInput;
  results.radiationLossPercent = input.radiationLoss;
  results.totalLosses = results.dryFlueGasLoss + results.moistureLoss + results.blowdownLoss + results.radiationLossPercent / 100 * results.energyInput;
  results.efficiencyIndirect = 100 - (results.totalLosses / results.energyInput * 100);
  results.annualFuelConsumption = input.fuelConsumption * input.operatingHours;
  results.annualFuelCost = results.annualFuelConsumption * input.fuelCost;
  results.annualEnergyInput = results.annualFuelConsumption * input.fuelHeatingValue;
  results.annualEnergyOutput = results.annualFuelConsumption * input.fuelHeatingValue * (results.efficiency / 100);
  results.annualSavingsPotential = results.annualFuelCost * (1 - (results.efficiency / 100) / (results.efficiencyIndirect / 100));
  results.totalExposure = results.annualFuelCost * (1 - results.efficiency / 100);
  results.variancePercent = abs(results.efficiency - results.efficiencyIndirect) / results.efficiency * 100;
  results.summaryLevel = results.efficiency >= 80 ? 'low' : (results.efficiency >= 70 ? 'warning' : 'critical');
  results.primaryDriver = results.efficiency < 80 ? 'results.efficiency' : 'none';
  results.decisionVerdict = results.summaryLevel === 'critical' ? 'reject' : (results.summaryLevel === 'warning' ? 'review' : 'accept');
  results.dataConfidenceAdjusted = input.dataConfidence === 'high' ? results.efficiency : (input.dataConfidence === 'medium' ? results.efficiency * 0.95 : results.efficiency * 0.9);
  return results;
}

export function calculateBoilerEfficiencyCalculator(input: BoilerEfficiencyCalculatorInput): BoilerEfficiencyCalculatorOutput {
  const results = evaluateFormulas(input);
  const efficiency = results.efficiency;
  const breakdown = {
    energyInput: results.energyInput,
    energyOutput: results.energyOutput,
    dryFlueGasLoss: results.dryFlueGasLoss,
    moistureLoss: results.moistureLoss,
    blowdownLoss: results.blowdownLoss,
    radiationLossPercent: results.radiationLossPercent,
    totalLosses: results.totalLosses,
    efficiencyIndirect: results.efficiencyIndirect,
    annualFuelConsumption: results.annualFuelConsumption,
    annualFuelCost: results.annualFuelCost,
    annualEnergyInput: results.annualEnergyInput,
    annualEnergyOutput: results.annualEnergyOutput,
    annualSavingsPotential: results.annualSavingsPotential,
  };

  // rule: fuelConsumption > 0
  // rule: fuelHeatingValue > 0
  // rule: steamFlow > 0
  // rule: steamEnthalpy > feedwaterEnthalpy
  // rule: excessAir >= 0
  // rule: flueGasTemperature > ambientTemperature
  // rule: blowdownRate >= 0
  // rule: radiationLoss >= 0
  // rule: operatingHours >= 0 and <= 8760
  // rule: fuelCost >= 0
  // rule: If fuelType is 'electricity', fuelHeatingValue should be 3600 kJ/kWh (conversion).
  // threshold efficiency: [object Object]
  // threshold excessAir: [object Object]
  // threshold flueGasTemperature: [object Object]
  // threshold blowdownRate: [object Object]
  const hiddenLossDrivers: string[] = ["excessAir > 40 ? 'High excess air increases dry flue gas loss' : ''","flueGasTemperature > 250 ? 'High flue gas temperature indicates fouling or poor heat transfer' : ''","blowdownRate > 5 ? 'High blowdown rate increases water and heat loss' : ''","radiationLoss > 3 ? 'High radiation loss suggests insulation issues' : ''"];
  const suggestedActions: string[] = ["efficiency < 80 ? 'Optimize excess air to reduce dry flue gas loss' : ''","flueGasTemperature > 250 ? 'Clean heat transfer surfaces and check for scaling' : ''","blowdownRate > 5 ? 'Review blowdown schedule and consider automatic blowdown control' : ''","radiationLoss > 3 ? 'Inspect and improve boiler insulation' : ''","annualSavingsPotential > 0 ? 'Implement efficiency improvements to realize savings' : ''"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    efficiency,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export of detailed efficiency report","CSV export of input and output data","Trend analysis over multiple calculations","Comparison with benchmark efficiency","Detailed breakdown of losses with charts","Scenario analysis (what-if for different parameters)"],
  };
}
