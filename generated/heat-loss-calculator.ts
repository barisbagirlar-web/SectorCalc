// Auto-generated from heat-loss-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface HeatLossCalculatorInput {
  surfaceArea: number;
  surfaceTemperature: number;
  ambientTemperature: number;
  windSpeed: number;
  emissivity: number;
  insulationThickness: number;
  insulationConductivity: number;
  operationHours: number;
  energyCost: number;
}

export const HeatLossCalculatorInputSchema = z.object({
  surfaceArea: z.number().min(0).default(100),
  surfaceTemperature: z.number().min(-273.15).default(200),
  ambientTemperature: z.number().min(-273.15).default(20),
  windSpeed: z.number().min(0).default(5),
  emissivity: z.number().min(0).max(1).default(0.8),
  insulationThickness: z.number().min(0).default(50),
  insulationConductivity: z.number().min(0).default(0.04),
  operationHours: z.number().min(0).max(8760).default(8760),
  energyCost: z.number().min(0).default(0.1),
});

export interface HeatLossCalculatorOutput {
  annualCost: number;
  breakdown: {
    totalHeatLoss: number;
    annualEnergyLoss: number;
    convectiveCoefficient: number;
    radiativeCoefficient: number;
    heatLossPerArea: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: HeatLossCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.convectiveCoefficient = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.radiativeCoefficient = ((): number => { try { const __v = 5.67e-8 * input.emissivity * ((input.surfaceTemperature+273.15)^4 - (input.ambientTemperature+273.15)^4) / (input.surfaceTemperature - input.ambientTemperature); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalHeatTransferCoefficient = ((): number => { try { const __v = results.convectiveCoefficient + results.radiativeCoefficient; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatLossPerArea = ((): number => { try { const __v = results.totalHeatTransferCoefficient * (input.surfaceTemperature - input.ambientTemperature); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.thermalResistanceInsulation = ((): number => { try { const __v = input.insulationThickness/1000 / input.insulationConductivity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.heatLossWithInsulation = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalHeatLoss = ((): number => { try { const __v = results.heatLossWithInsulation * input.surfaceArea; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyLoss = ((): number => { try { const __v = results.totalHeatLoss * input.operationHours / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualCost = ((): number => { try { const __v = results.annualEnergyLoss * input.energyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateHeatLossCalculator(input: HeatLossCalculatorInput): HeatLossCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualCost = results.annualCost ?? 0;
  const breakdown = {
    totalHeatLoss: results.totalHeatLoss,
    annualEnergyLoss: results.annualEnergyLoss,
    convectiveCoefficient: results.convectiveCoefficient,
    radiativeCoefficient: results.radiativeCoefficient,
    heatLossPerArea: results.heatLossPerArea,
  };

  // rule: surfaceArea > 0
  // rule: surfaceTemperature > ambientTemperature
  // rule: ambientTemperature >= -273.15
  // rule: windSpeed >= 0
  // rule: emissivity between 0 and 1
  // rule: insulationThickness >= 0
  // rule: insulationConductivity > 0
  // rule: operationHours between 0 and 8760
  // rule: energyCost > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): if > 1000 W/m² then 'High heat loss'
  // threshold skipped (non-JS): if > 10000 USD then 'Significant financial loss'

  const dataConfidenceAdjusted = (() => { try { return results.annualCost * (1 - 0.1*(1 - dataConfidence)); } catch { return annualCost; } })();

  return {
    annualCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with benchmarks","Detailed report with graphs"],
  };
}
