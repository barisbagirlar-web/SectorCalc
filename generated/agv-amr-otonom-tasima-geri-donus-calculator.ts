// Auto-generated from agv-amr-otonom-tasima-geri-donus-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AgvAmrOtonomTasimaGeriDonusCalculatorInput {
  agvPurchaseCost: number;
  agvCount: number;
  annualOperatingHours: number;
  manualLaborCostPerHour: number;
  manualWorkersReplacedPerAGV: number;
  agvMaintenanceCostPerHour: number;
  agvEnergyCostPerHour: number;
  agvLifespanYears: number;
  discountRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AgvAmrOtonomTasimaGeriDonusCalculatorInputSchema = z.object({
  agvPurchaseCost: z.number().min(10000).max(200000).default(50000),
  agvCount: z.number().min(1).max(100).default(5),
  annualOperatingHours: z.number().min(1000).max(8760).default(4000),
  manualLaborCostPerHour: z.number().min(10).max(100).default(25),
  manualWorkersReplacedPerAGV: z.number().min(0.5).max(5).default(1.5),
  agvMaintenanceCostPerHour: z.number().min(1).max(20).default(5),
  agvEnergyCostPerHour: z.number().min(0.5).max(5).default(1.5),
  agvLifespanYears: z.number().min(3).max(15).default(8),
  discountRate: z.number().min(0).max(30).default(10),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AgvAmrOtonomTasimaGeriDonusCalculatorOutput {
  npv: number;
  breakdown: {
    totalInvestment: number;
    annualLaborSavings: number;
    annualMaintenanceCost: number;
    annualEnergyCost: number;
    annualNetSavings: number;
    paybackPeriodYears: number;
    roiPercent: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AgvAmrOtonomTasimaGeriDonusCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalInvestment = ((): number => { try { const __v = input.agvPurchaseCost * input.agvCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualLaborSavings = ((): number => { try { const __v = input.manualLaborCostPerHour * input.annualOperatingHours * input.manualWorkersReplacedPerAGV * input.agvCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualMaintenanceCost = ((): number => { try { const __v = input.agvMaintenanceCostPerHour * input.annualOperatingHours * input.agvCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualEnergyCost = ((): number => { try { const __v = input.agvEnergyCostPerHour * input.annualOperatingHours * input.agvCount; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.annualNetSavings = ((): number => { try { const __v = results.annualLaborSavings - results.annualMaintenanceCost - results.annualEnergyCost; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.paybackPeriodYears = ((): number => { try { const __v = results.totalInvestment / results.annualNetSavings; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.npv = ((): number => { try { const __v = 0; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  results.roiPercent = ((): number => { try { const __v = (results.annualNetSavings * input.agvLifespanYears - results.totalInvestment) / results.totalInvestment * 100; return typeof __v === "number" && Number.isFinite(__v) ? __v : 0; } catch { return 0; } })();
  return results;
}

export function calculateAgvAmrOtonomTasimaGeriDonusCalculator(input: AgvAmrOtonomTasimaGeriDonusCalculatorInput): AgvAmrOtonomTasimaGeriDonusCalculatorOutput {
  const results = evaluateFormulas(input);
  const npv = results.npv ?? 0;
  const breakdown = {
    totalInvestment: results.totalInvestment,
    annualLaborSavings: results.annualLaborSavings,
    annualMaintenanceCost: results.annualMaintenanceCost,
    annualEnergyCost: results.annualEnergyCost,
    annualNetSavings: results.annualNetSavings,
    paybackPeriodYears: results.paybackPeriodYears,
    roiPercent: results.roiPercent,
  };

  // rule: agvPurchaseCost must be >= 10000 and <= 200000
  // rule: agvCount must be >= 1 and <= 100
  // rule: annualOperatingHours must be >= 1000 and <= 8760
  // rule: manualLaborCostPerHour must be >= 10 and <= 100
  // rule: manualWorkersReplacedPerAGV must be >= 0.5 and <= 5
  // rule: agvMaintenanceCostPerHour must be >= 1 and <= 20
  // rule: agvEnergyCostPerHour must be >= 0.5 and <= 5
  // rule: agvLifespanYears must be >= 3 and <= 15
  // rule: discountRate must be >= 0 and <= 30
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  // threshold skipped (non-JS): > 5 -> 'Payback period exceeds 5 years; consider reducing costs or increasing utilization.'
  // threshold skipped (non-JS): < 15 -> 'ROI below 15%; investment may not meet hurdle rate.'

  const dataConfidenceAdjusted = (() => { try { return results.npv * (1 - (input.dataConfidence == 'low' ? 0.2 : input.dataConfidence == 'medium' ? 0.1 : 0)); } catch { return npv; } })();

  return {
    npv,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (multi-year projection)","Scenario Comparison (what-if analysis)","Detailed Report with charts"],
  };
}
