// Auto-generated from plumbing-fixture-cost-check-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface PlumbingFixtureCostCheckInput {
  fixtureType: 'toilet' | 'sink' | 'shower' | 'bathtub' | 'faucet';
  materialCost: number;
  laborHours: number;
  hourlyRate: number;
  quantity: number;
  warrantyYears: number;
  annualMaintenanceCost: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const PlumbingFixtureCostCheckInputSchema = z.object({
  fixtureType: z.enum(['toilet', 'sink', 'shower', 'bathtub', 'faucet']).default('toilet'),
  materialCost: z.number().min(0).max(10000).default(100),
  laborHours: z.number().min(0.1).max(40).default(2),
  hourlyRate: z.number().min(10).max(200).default(50),
  quantity: z.number().min(1).max(1000).default(1),
  warrantyYears: z.number().min(0).max(25).default(5),
  annualMaintenanceCost: z.number().min(0).max(500).default(20),
  discountRate: z.number().min(0).max(20).default(5),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface PlumbingFixtureCostCheckOutput {
  totalCostPerUnit: number;
  breakdown: {
    totalMaterialCost: number;
    totalLaborCost: number;
    totalInitialCost: number;
    totalAnnualMaintenance: number;
    npvPerUnit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: PlumbingFixtureCostCheckInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalMaterialCost = ((): number => { try { const __v = input.materialCost * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalLaborCost = ((): number => { try { const __v = input.laborHours * input.hourlyRate * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalInitialCost = ((): number => { try { const __v = results.totalMaterialCost + results.totalLaborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalAnnualMaintenance = ((): number => { try { const __v = input.annualMaintenanceCost * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npvPerUnit = ((): number => { try { const __v = -results.totalInitialCost/input.quantity + (input.annualMaintenanceCost * (1 - (1 + input.discountRate/100)^(-input.warrantyYears)) / (input.discountRate/100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerUnit = ((): number => { try { const __v = results.totalInitialCost / input.quantity + input.annualMaintenanceCost * input.warrantyYears; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCostPerUnit * (1 + (input.dataConfidence == 'low' ? 0.15 : input.dataConfidence == 'medium' ? 0.05 : 0)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculatePlumbingFixtureCostCheck(input: PlumbingFixtureCostCheckInput): PlumbingFixtureCostCheckOutput {
  const results = evaluateFormulas(input);
  const totalCostPerUnit = results.totalCostPerUnit ?? 0;
  const breakdown = {
    totalMaterialCost: results.totalMaterialCost,
    totalLaborCost: results.totalLaborCost,
    totalInitialCost: results.totalInitialCost,
    totalAnnualMaintenance: results.totalAnnualMaintenance,
    npvPerUnit: results.npvPerUnit,
  };

  // rule: materialCost must be >= 0
  // rule: laborHours must be >= 0.1
  // rule: hourlyRate must be >= 10
  // rule: quantity must be >= 1
  // rule: warrantyYears must be >= 0
  // rule: annualMaintenanceCost must be >= 0
  // rule: discountRate must be between 0 and 20
  // rule: if fixtureType is 'toilet' then materialCost >= 50 (typical minimum)
  // rule: if fixtureType is 'bathtub' then laborHours >= 3 (complex installation)
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-string): totalCostPerUnit
  // threshold skipped (non-string): npvPerUnit

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCostPerUnit; } })();

  return {
    totalCostPerUnit,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Comparison with industry benchmarks","Detailed report with breakdown charts"],
  };
}
