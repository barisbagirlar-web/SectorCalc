// Auto-generated from agv-amr-otonom-tasima-geri-donus-calculator-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AgvAmrOtonomTasimaGeriDonusCalculatorInput {
  vehicleCount: number;
  purchasePricePerVehicle: number;
  annualMaintenanceCostPerVehicle: number;
  annualEnergyCostPerVehicle: number;
  operatorLaborCostPerHour: number;
  manualOperationHoursPerDay: number;
  automatedOperationHoursPerDay: number;
  operatingDaysPerYear: number;
  systemLifespanYears: number;
  discountRate: number;
  productivityImprovementPercent: number;
  errorReductionPercent: number;
  safetyIncidentReductionPercent: number;
  costOfCapital: number;
  inflationRate: number;
  dataConfidence: 'low' | 'medium' | 'high';
}

export const AgvAmrOtonomTasimaGeriDonusCalculatorInputSchema = z.object({
  vehicleCount: z.number().min(1).max(100).default(1),
  purchasePricePerVehicle: z.number().min(1000).max(500000).default(50000),
  annualMaintenanceCostPerVehicle: z.number().min(0).max(50000).default(5000),
  annualEnergyCostPerVehicle: z.number().min(0).max(20000).default(2000),
  operatorLaborCostPerHour: z.number().min(0).max(100).default(25),
  manualOperationHoursPerDay: z.number().min(0).max(24).default(8),
  automatedOperationHoursPerDay: z.number().min(0).max(24).default(16),
  operatingDaysPerYear: z.number().min(1).max(365).default(300),
  systemLifespanYears: z.number().min(1).max(20).default(5),
  discountRate: z.number().min(0).max(30).default(10),
  productivityImprovementPercent: z.number().min(0).max(100).default(20),
  errorReductionPercent: z.number().min(0).max(100).default(90),
  safetyIncidentReductionPercent: z.number().min(0).max(100).default(50),
  costOfCapital: z.number().min(0).max(20).default(8),
  inflationRate: z.number().min(0).max(10).default(2),
  dataConfidence: z.enum(['low', 'medium', 'high']).default('medium'),
});

export interface AgvAmrOtonomTasimaGeriDonusCalculatorOutput {
  totalExposure: number;
  breakdown: {
    totalInvestment: number;
    annualOperatingCostAutomated: number;
    annualLaborSavings: number;
    annualTotalBenefit: number;
    annualNetCashFlow: number;
    npv: number;
    paybackPeriod: number;
    roi: number;
    variancePercent: number;
    summaryLevel: number;
    primaryDriver: number;
    decisionVerdict: number;
  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}

function evaluateFormulas(input: AgvAmrOtonomTasimaGeriDonusCalculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.totalInvestment = input.vehicleCount * input.purchasePricePerVehicle;
  results.annualOperatingCostAutomated = input.vehicleCount * (input.annualMaintenanceCostPerVehicle + input.annualEnergyCostPerVehicle);
  results.annualLaborCostManual = input.vehicleCount * input.operatorLaborCostPerHour * input.manualOperationHoursPerDay * input.operatingDaysPerYear;
  results.annualLaborCostAutomated = 0;
  results.annualLaborSavings = results.annualLaborCostManual - results.annualLaborCostAutomated;
  results.annualProductivityBenefit = results.annualLaborCostManual * (input.productivityImprovementPercent / 100);
  results.annualErrorReductionBenefit = results.annualLaborCostManual * (input.errorReductionPercent / 100) * 0.1;
  results.annualSafetyBenefit = results.annualLaborCostManual * (input.safetyIncidentReductionPercent / 100) * 0.05;
  results.annualTotalBenefit = results.annualLaborSavings + results.annualProductivityBenefit + results.annualErrorReductionBenefit + results.annualSafetyBenefit;
  results.annualNetCashFlow = results.annualTotalBenefit - results.annualOperatingCostAutomated;
  results.npv = -results.totalInvestment + sum_{t=1}^{input.systemLifespanYears} (results.annualNetCashFlow / (1 + input.discountRate/100)^t);
  results.paybackPeriod = results.totalInvestment / results.annualNetCashFlow;
  results.roi = (results.npv / results.totalInvestment) * 100;
  results.totalExposure = results.totalInvestment;
  results.variancePercent = abs((results.annualNetCashFlow - results.annualLaborCostManual) / results.annualLaborCostManual) * 100;
  results.summaryLevel = results.totalExposure > 500000 ? 'critical' : results.totalExposure > 100000 ? 'warning' : 'normal';
  results.primaryDriver = results.annualNetCashFlow > 0 ? 'positive' : 'negative';
  results.decisionVerdict = results.roi > 0 ? 'invest' : 'reject';
  results.dataConfidenceAdjusted = input.dataConfidence === 'low' ? results.totalExposure * 1.2 : input.dataConfidence === 'medium' ? results.totalExposure * 1.05 : results.totalExposure;
  return results;
}

export function calculateAgvAmrOtonomTasimaGeriDonusCalculator(input: AgvAmrOtonomTasimaGeriDonusCalculatorInput): AgvAmrOtonomTasimaGeriDonusCalculatorOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    totalInvestment: results.totalInvestment,
    annualOperatingCostAutomated: results.annualOperatingCostAutomated,
    annualLaborSavings: results.annualLaborSavings,
    annualTotalBenefit: results.annualTotalBenefit,
    annualNetCashFlow: results.annualNetCashFlow,
    npv: results.npv,
    paybackPeriod: results.paybackPeriod,
    roi: results.roi,
    variancePercent: results.variancePercent,
    summaryLevel: results.summaryLevel,
    primaryDriver: results.primaryDriver,
    decisionVerdict: results.decisionVerdict,
  };

  // rule: All numeric inputs must be finite and non-negative.
  // rule: automatedOperationHoursPerDay must be >= manualOperationHoursPerDay if comparing.
  // rule: operatingDaysPerYear must be between 1 and 365.
  // rule: discountRate and costOfCapital must be between 0 and 100.
  // rule: productivityImprovementPercent, errorReductionPercent, safetyIncidentReductionPercent must be between 0 and 100.
  // rule: If dataConfidence is 'low', apply a 20% penalty to benefits.
  // threshold totalExposure: [object Object]
  // threshold variancePercent: [object Object]
  const hiddenLossDrivers: string[] = ["If annualNetCashFlow < 0: 'Negative cash flow indicates potential loss.'","If paybackPeriod > systemLifespanYears: 'Payback period exceeds system lifespan.'","If variancePercent > 20: 'High variance from manual baseline.'"];
  const suggestedActions: string[] = ["If roi < 0: 'Consider reducing purchase price or increasing utilization.'","If paybackPeriod > 3: 'Explore leasing options or government incentives.'","If dataConfidence is low: 'Gather more accurate operational data.'"];
  const dataConfidenceAdjusted = results.dataConfidenceAdjusted;

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF Export","CSV Export","Trend Analysis (multi-year comparison)","Scenario Comparison (what-if)","Detailed Breakdown Report","Sensitivity Analysis"],
  };
}
