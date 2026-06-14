// Auto-generated from cabinet-cost-estimator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface CabinetCostEstimatorInput {
  cabinetWidth: number;
  cabinetHeight: number;
  cabinetDepth: number;
  materialType: 'Plywood' | 'MDF' | 'Particleboard' | 'Solid Wood';
  materialCostPerSqM: number;
  doorStyle: 'Flat' | 'Raised Panel' | 'Slab' | 'Shaker';
  finishType: 'Laminate' | 'Paint' | 'Veneer' | 'Thermofoil';
  hardwareGrade: 'Economy' | 'Standard' | 'Premium';
  laborRate: number;
  laborHoursPerCabinet: number;
  quantity: number;
  overheadRate: number;
  profitMargin: number;
  dataConfidence: 'Low' | 'Medium' | 'High';
}

export const CabinetCostEstimatorInputSchema = z.object({
  cabinetWidth: z.number().min(300).max(1200).default(600),
  cabinetHeight: z.number().min(300).max(1200).default(720),
  cabinetDepth: z.number().min(300).max(800).default(600),
  materialType: z.enum(['Plywood', 'MDF', 'Particleboard', 'Solid Wood']).default('MDF'),
  materialCostPerSqM: z.number().min(10).max(200).default(50),
  doorStyle: z.enum(['Flat', 'Raised Panel', 'Slab', 'Shaker']).default('Flat'),
  finishType: z.enum(['Laminate', 'Paint', 'Veneer', 'Thermofoil']).default('Laminate'),
  hardwareGrade: z.enum(['Economy', 'Standard', 'Premium']).default('Standard'),
  laborRate: z.number().min(15).max(80).default(30),
  laborHoursPerCabinet: z.number().min(1).max(10).default(4),
  quantity: z.number().min(1).max(1000).default(1),
  overheadRate: z.number().min(0).max(100).default(20),
  profitMargin: z.number().min(0).max(50).default(15),
  dataConfidence: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

export interface CabinetCostEstimatorOutput {
  totalSellingPrice: number;
  breakdown: {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    profit: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: CabinetCostEstimatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.surfaceArea = ((): number => { try { const __v = ((input.cabinetWidth * input.cabinetHeight) + (input.cabinetWidth * input.cabinetDepth) + (input.cabinetHeight * input.cabinetDepth)) * 2 / 1000000; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.materialCost = ((): number => { try { const __v = results.surfaceArea * input.materialCostPerSqM; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.doorCostMultiplier = ((): number => { try { const __v = input.doorStyle === 'Raised Panel' ? 1.5 : input.doorStyle === 'Shaker' ? 1.3 : input.doorStyle === 'Slab' ? 1.1 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.finishCostMultiplier = ((): number => { try { const __v = input.finishType === 'Paint' ? 1.4 : input.finishType === 'Veneer' ? 1.6 : input.finishType === 'Thermofoil' ? 1.2 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.hardwareCostMultiplier = ((): number => { try { const __v = input.hardwareGrade === 'Premium' ? 2.0 : input.hardwareGrade === 'Standard' ? 1.0 : 0.8; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedMaterialCost = ((): number => { try { const __v = results.materialCost * results.doorCostMultiplier * results.finishCostMultiplier * results.hardwareCostMultiplier; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.laborCost = ((): number => { try { const __v = input.laborRate * input.laborHoursPerCabinet; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.directCost = ((): number => { try { const __v = results.adjustedMaterialCost + results.laborCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.overheadCost = ((): number => { try { const __v = results.directCost * (input.overheadRate / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCostPerCabinet = ((): number => { try { const __v = results.directCost + results.overheadCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalCost = ((): number => { try { const __v = results.totalCostPerCabinet * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.sellingPricePerCabinet = ((): number => { try { const __v = results.totalCostPerCabinet * (1 + input.profitMargin / 100); return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.totalSellingPrice = ((): number => { try { const __v = results.sellingPricePerCabinet * input.quantity; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.dataConfidenceAdjustment = ((): number => { try { const __v = input.dataConfidence === 'Low' ? 1.15 : input.dataConfidence === 'Medium' ? 1.05 : 1.0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.adjustedTotalCost = ((): number => { try { const __v = results.totalCost * results.dataConfidenceAdjustment; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateCabinetCostEstimator(input: CabinetCostEstimatorInput): CabinetCostEstimatorOutput {
  const results = evaluateFormulas(input);
  const totalSellingPrice = results.totalSellingPrice ?? 0;
  const breakdown = {
    materialCost: results.materialCost,
    laborCost: results.laborCost,
    overheadCost: results.overheadCost,
    profit: results.profit,
  };

  // rule: cabinetWidth >= 300 && cabinetWidth <= 1200
  // rule: cabinetHeight >= 300 && cabinetHeight <= 1200
  // rule: cabinetDepth >= 300 && cabinetDepth <= 800
  // rule: materialCostPerSqM >= 10 && materialCostPerSqM <= 200
  // rule: laborRate >= 15 && laborRate <= 80
  // rule: laborHoursPerCabinet >= 1 && laborHoursPerCabinet <= 10
  // rule: quantity >= 1 && quantity <= 1000
  // rule: overheadRate >= 0 && overheadRate <= 100
  // rule: profitMargin >= 0 && profitMargin <= 50
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): High material cost warning
  // threshold skipped (non-JS): High labor rate warning
  // threshold skipped (non-JS): High overhead rate warning

  const dataConfidenceAdjusted = (() => { try { return results.adjustedTotalCost; } catch { return totalSellingPrice; } })();

  return {
    totalSellingPrice,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis","Comparison with Industry Benchmarks","Detailed Cost Breakdown Report"],
  };
}
