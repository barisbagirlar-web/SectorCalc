// Auto-generated from fuel-emission-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface FuelEmissionCalculatorInput {
  fuelType: 'diesel' | 'gasoline' | 'natural_gas' | 'lpg' | 'biomass';
  fuelConsumption: number;
  emissionFactor: number;
  operatingHours: number;
  daysPerYear: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const FuelEmissionCalculatorInputSchema = z.object({
  fuelType: z.enum(['diesel', 'gasoline', 'natural_gas', 'lpg', 'biomass']).default('diesel'),
  fuelConsumption: z.number().min(0).default(100),
  emissionFactor: z.number().min(0).default(2.68),
  operatingHours: z.number().min(0).default(8),
  daysPerYear: z.number().min(1).max(365).default(250),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface FuelEmissionCalculatorOutput {
  annualEmissions: number;
  breakdown: {
    dailyEmissions: number;
    emissionsPerHour: number;
    annualEmissions: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: FuelEmissionCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.dailyEmissions = ((): number => { try { const __v = input.fuelConsumption * input.emissionFactor; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEmissions = ((): number => { try { const __v = results.dailyEmissions * input.daysPerYear; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.emissionsPerHour = ((): number => { try { const __v = results.dailyEmissions / input.operatingHours; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.annualEmissions * (input.dataConfidence === 'low' ? 1.2 : input.dataConfidence === 'medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateFuelEmissionCalculator(input: FuelEmissionCalculatorInput): FuelEmissionCalculatorOutput {
  const results = evaluateFormulas(input);
  const annualEmissions = results.annualEmissions ?? 0;
  const breakdown = {
    dailyEmissions: results.dailyEmissions,
    emissionsPerHour: results.emissionsPerHour,
    annualEmissions: results.annualEmissions,
  };

  // rule: fuelConsumption >= 0
  // rule: emissionFactor >= 0
  // rule: operatingHours >= 0
  // rule: daysPerYear >= 1 && daysPerYear <= 365
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): If fuelConsumption > 10000, warning: 'High fuel consumption detected, consider efficiency audit.'
  // threshold skipped (non-JS): If emissionFactor > 3.0, warning: 'Emission factor unusually high, verify fuel type.'

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return annualEmissions; } })();

  return {
    annualEmissions,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF/CSV export","Trend analysis over time","Benchmarking against industry standards","Detailed report with breakdowns"],
  };
}
