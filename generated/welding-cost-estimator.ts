// Auto-generated from welding-cost-estimator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface WeldingCostEstimatorInput {
  weldLength: number;
  weldThroatThickness: number;
  weldType: 'Fillet' | 'Groove' | 'Plug' | 'Slot';
  process: 'SMAW' | 'GMAW' | 'FCAW' | 'GTAW' | 'SAW';
  materialType: 'Carbon Steel' | 'Stainless Steel' | 'Aluminum' | 'Other';
  laborRate: number;
  fillerCostPerKg: number;
  depositionEfficiency: number;
  operatingFactor: number;
  powerCostPerKwh: number;
  arcVoltage: number;
  arcCurrent: number;
  gasCostPerHour: number;
  overheadRate: number;
  defectRate: number;
  dataConfidence: 'Low' | 'Medium' | 'High';
}

export const WeldingCostEstimatorInputSchema = z.object({
  weldLength: z.number().min(0).default(100),
  weldThroatThickness: z.number().min(0).default(5),
  weldType: z.enum(['Fillet', 'Groove', 'Plug', 'Slot']).default('Fillet'),
  process: z.enum(['SMAW', 'GMAW', 'FCAW', 'GTAW', 'SAW']).default('SMAW'),
  materialType: z.enum(['Carbon Steel', 'Stainless Steel', 'Aluminum', 'Other']).default('Carbon Steel'),
  laborRate: z.number().min(0).default(30),
  fillerCostPerKg: z.number().min(0).default(5),
  depositionEfficiency: z.number().min(0).max(100).default(65),
  operatingFactor: z.number().min(0).max(100).default(30),
  powerCostPerKwh: z.number().min(0).default(0.12),
  arcVoltage: z.number().min(0).default(25),
  arcCurrent: z.number().min(0).default(200),
  gasCostPerHour: z.number().min(0).default(2),
  overheadRate: z.number().min(0).default(100),
  defectRate: z.number().min(0).max(100).default(5),
  dataConfidence: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

export interface WeldingCostEstimatorOutput {
  totalCost: number;
  breakdown: {
    laborCost: number;
    fillerCost: number;
    powerCost: number;
    gasCost: number;
    overheadCost: number;
    reworkCost: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: WeldingCostEstimatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.weldVolume = ((): number => { try { const __v = input.weldLength * (input.weldThroatThickness^2) / 2; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.depositionRate = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fillerMass = ((): number => { try { const __v = results.weldVolume * (input.materialType == 'Carbon Steel' ? 7.85 : input.materialType == 'Stainless Steel' ? 7.95 : input.materialType == 'Aluminum' ? 2.70 : 7.85) / 1000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.fillerCost = ((): number => { try { const __v = results.fillerMass * input.fillerCostPerKg / (input.depositionEfficiency / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.arcTime = ((): number => { try { const __v = results.fillerMass / (results.depositionRate * (input.depositionEfficiency / 100)); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborTime = ((): number => { try { const __v = results.arcTime / (input.operatingFactor / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = results.laborTime * input.laborRate; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.powerCost = ((): number => { try { const __v = results.arcTime * (input.arcVoltage * input.arcCurrent / 1000) * input.powerCostPerKwh; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.gasCost = ((): number => { try { const __v = results.arcTime * input.gasCostPerHour; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.laborCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.reworkCost = ((): number => { try { const __v = (results.laborCost + results.fillerCost + results.powerCost + results.gasCost + results.overheadCost) * (input.defectRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.laborCost + results.fillerCost + results.powerCost + results.gasCost + results.overheadCost + results.reworkCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.costPerMeter = ((): number => { try { const __v = results.totalCost / (input.weldLength / 1000); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjusted = ((): number => { try { const __v = results.totalCost * (input.dataConfidence == 'Low' ? 1.2 : input.dataConfidence == 'Medium' ? 1.0 : 0.9); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateWeldingCostEstimator(input: WeldingCostEstimatorInput): WeldingCostEstimatorOutput {
  const results = evaluateFormulas(input);
  const totalCost = results.totalCost ?? 0;
  const breakdown = {
    laborCost: results.laborCost,
    fillerCost: results.fillerCost,
    powerCost: results.powerCost,
    gasCost: results.gasCost,
    overheadCost: results.overheadCost,
    reworkCost: results.reworkCost,
  };

  // rule: weldLength > 0
  // rule: weldThroatThickness > 0
  // rule: laborRate > 0
  // rule: fillerCostPerKg > 0
  // rule: depositionEfficiency > 0 && depositionEfficiency <= 100
  // rule: operatingFactor > 0 && operatingFactor <= 100
  // rule: powerCostPerKwh >= 0
  // rule: arcVoltage > 0
  // rule: arcCurrent > 0
  // rule: gasCostPerHour >= 0
  // rule: overheadRate >= 0
  // rule: defectRate >= 0 && defectRate <= 100
  // rule: if process == 'GMAW' || process == 'FCAW' || process == 'GTAW' then gasCostPerHour > 0
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High defect rate may significantly increase total cost.
  // threshold skipped (non-JS): Low operating factor indicates poor productivity.
  // threshold skipped (non-JS): Low deposition efficiency increases filler waste.

  const dataConfidenceAdjusted = (() => { try { return results.dataConfidenceAdjusted; } catch { return totalCost; } })();

  return {
    totalCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Benchmarks","Detailed Report with Graphs"],
  };
}
