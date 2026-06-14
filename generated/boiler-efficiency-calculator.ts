// Auto-generated from boiler-efficiency-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface BoilerEfficiencyCalculatorInput {
  fuelType: 'naturalGas' | 'fuelOil' | 'coal' | 'biomass';
  fuelConsumption: number;
  fuelHeatingValue: number;
  steamFlow: number;
  steamEnthalpy: number;
  feedwaterEnthalpy: number;
  excessAir: number;
  flueGasTemperature: number;
  ambientTemperature: number;
  radiationLoss: number;
  blowdownRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const BoilerEfficiencyCalculatorInputSchema = z.object({
  fuelType: z.enum(['naturalGas', 'fuelOil', 'coal', 'biomass']).default('naturalGas'),
  fuelConsumption: z.number().min(0).max(100000).default(100),
  fuelHeatingValue: z.number().min(0).max(100000).default(50000),
  steamFlow: z.number().min(0).max(1000000).default(1000),
  steamEnthalpy: z.number().min(0).max(4000).default(2800),
  feedwaterEnthalpy: z.number().min(0).max(1000).default(420),
  excessAir: z.number().min(0).max(100).default(20),
  flueGasTemperature: z.number().min(50).max(500).default(200),
  ambientTemperature: z.number().min(-20).max(50).default(25),
  radiationLoss: z.number().min(0).max(10).default(2),
  blowdownRate: z.number().min(0).max(20).default(5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface BoilerEfficiencyCalculatorOutput {
  efficiency: number;
  breakdown: {
    heatInput: number;
    heatOutput: number;
    dryFlueGasLoss: number;
    moistureLoss: number;
    radiationLoss: number;
    blowdownLoss: number;
    totalLosses: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: BoilerEfficiencyCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.heatInput = (() => { try { return input.fuelConsumption * input.fuelHeatingValue; } catch { return 0; } })();
  results.heatOutput = (() => { try { return input.steamFlow * (input.steamEnthalpy - input.feedwaterEnthalpy); } catch { return 0; } })();
  results.dryFlueGasLoss = (() => { try { return input.excessAir * 0.001 * (input.flueGasTemperature - input.ambientTemperature) * input.fuelConsumption * input.fuelHeatingValue / 100; } catch { return 0; } })();
  results.moistureLoss = (() => { try { return 0.09 * (input.flueGasTemperature - input.ambientTemperature) * input.fuelConsumption * input.fuelHeatingValue / 100; } catch { return 0; } })();
  results.radiationLossPercent = (() => { try { return input.radiationLoss; } catch { return 0; } })();
  results.blowdownLoss = (() => { try { return input.blowdownRate / 100 * results.heatInput; } catch { return 0; } })();
  results.totalLosses = (() => { try { return results.dryFlueGasLoss + results.moistureLoss + results.radiationLossPercent / 100 * results.heatInput + results.blowdownLoss; } catch { return 0; } })();
  results.efficiency = (() => { try { return (results.heatOutput / results.heatInput) * 100; } catch { return 0; } })();
  results.efficiencyAdjusted = (() => { try { return results.efficiency * (1 - (1 - dataConfidenceFactor) * 0.1); } catch { return 0; } })();
  return results;
}

export function calculateBoilerEfficiencyCalculator(input: BoilerEfficiencyCalculatorInput): BoilerEfficiencyCalculatorOutput {
  const results = evaluateFormulas(input);
  const efficiency = results.efficiency ?? 0;
  const breakdown = {
    heatInput: results.heatInput,
    heatOutput: results.heatOutput,
    dryFlueGasLoss: results.dryFlueGasLoss,
    moistureLoss: results.moistureLoss,
    radiationLoss: results.radiationLossPercent,
    blowdownLoss: results.blowdownLoss,
    totalLosses: results.totalLosses,
  };

  // rule: fuelConsumption > 0
  // rule: fuelHeatingValue > 0
  // rule: steamFlow > 0
  // rule: steamEnthalpy > feedwaterEnthalpy
  // rule: flueGasTemperature > ambientTemperature
  // rule: excessAir >= 0
  // rule: radiationLoss >= 0
  // rule: blowdownRate >= 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): efficiency < 0.7 -> 'Critical: Boiler efficiency below 70%'
  // threshold skipped (non-JS): excessAir > 50 -> 'Warning: Excess air too high, increase heat loss'
  // threshold skipped (non-JS): flueGasTemperature > 300 -> 'Warning: High flue gas temperature, consider economizer'

  const dataConfidenceAdjusted = (() => { try { return results.efficiencyAdjusted; } catch { return efficiency; } })();

  return {
    efficiency,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmark","Detailed Report with Breakdown"],
  };
}
