// Auto-generated from solar-panel-output-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface SolarPanelOutputCalculatorInput {
  panelCapacity: number;
  numberOfPanels: number;
  irradiance: number;
  systemLosses: number;
  degradationRate: number;
  electricityPrice: number;
  systemCost: number;
  inverterEfficiency: number;
  tiltAngle: number;
  azimuthAngle: number;
  temperatureCoefficient: number;
  ambientTemperature: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const SolarPanelOutputCalculatorInputSchema = z.object({
  panelCapacity: z.number().min(100).max(600).default(300),
  numberOfPanels: z.number().min(1).max(1000).default(20),
  irradiance: z.number().min(0.5).max(8).default(5),
  systemLosses: z.number().min(0).max(50).default(14),
  degradationRate: z.number().min(0).max(2).default(0.5),
  electricityPrice: z.number().min(0.01).max(0.5).default(0.12),
  systemCost: z.number().min(1000).max(100000).default(15000),
  inverterEfficiency: z.number().min(80).max(99).default(96),
  tiltAngle: z.number().min(0).max(90).default(30),
  azimuthAngle: z.number().min(0).max(360).default(180),
  temperatureCoefficient: z.number().min(-0.6).max(-0.2).default(-0.4),
  ambientTemperature: z.number().min(-10).max(50).default(25),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface SolarPanelOutputCalculatorOutput {
  annualEnergyDegraded: number;
  breakdown: {
    dcCapacity: number;
    dailyEnergy: number;
    annualEnergy: number;
    annualSavings: number;
    paybackPeriod: number;
    roi: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: SolarPanelOutputCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dcCapacity = ((): number => { try { const __v = input.panelCapacity * input.numberOfPanels / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.temperatureLoss = ((): number => { try { const __v = input.temperatureCoefficient * (input.ambientTemperature - 25); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.effectiveIrradiance = ((): number => { try { const __v = input.irradiance * (1 + results.temperatureLoss / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dailyEnergy = ((): number => { try { const __v = results.dcCapacity * results.effectiveIrradiance * (1 - input.systemLosses / 100) * (input.inverterEfficiency / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergy = ((): number => { try { const __v = results.dailyEnergy * 365; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyDegraded = ((): number => { try { const __v = results.annualEnergy * (1 - input.degradationRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualSavings = ((): number => { try { const __v = results.annualEnergyDegraded * input.electricityPrice; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriod = ((): number => { try { const __v = input.systemCost / results.annualSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roi = ((): number => { try { const __v = (results.annualSavings * 25 - input.systemCost) / input.systemCost * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.annualEnergyDegraded * (input.dataConfidence == 'low' ? 0.8 : input.dataConfidence == 'medium' ? 1.0 : 1.1); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateSolarPanelOutputCalculator(input: SolarPanelOutputCalculatorInput): SolarPanelOutputCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualEnergyDegraded = results.annualEnergyDegraded ?? 0;
  const breakdown = {
    dcCapacity: results.dcCapacity,
    dailyEnergy: results.dailyEnergy,
    annualEnergy: results.annualEnergy,
    annualSavings: results.annualSavings,
    paybackPeriod: results.paybackPeriod,
    roi: results.roi,
  };

  // rule: systemLosses must be between 0 and 50
  // rule: degradationRate must be between 0 and 2
  // rule: inverterEfficiency must be between 80 and 99
  // rule: tiltAngle must be between 0 and 90
  // rule: azimuthAngle must be between 0 and 360
  // rule: temperatureCoefficient must be between -0.6 and -0.2
  // rule: ambientTemperature must be between -10 and 50
  // rule: electricityPrice must be greater than 0
  // rule: systemCost must be greater than 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High system losses detected. Consider reducing shading, soiling, or wiring losses.
  // threshold skipped (non-JS): Degradation rate exceeds typical warranty. Consider higher quality panels.
  // threshold skipped (non-JS): Inverter efficiency low. Consider upgrading inverter.
  // threshold skipped (non-JS): Low irradiance location. May not be economically viable.
  // threshold skipped (non-JS): Low electricity price. Payback period may be long.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return annualEnergyDegraded; } })();

  return {
    annualEnergyDegraded,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (multi-year projection)","Comparison (different panel configurations)","Detailed Report with charts"],
  };
}
