// Auto-generated from auto-repair-comeback-cost-schema.json by generate-from-schema.ts
import * as z from 'zod';

export interface AutoRepairComebackCostInput {
  totalJobs: number;
  comebackJobs: number;
  averageJobValue: number;
  diagnosticTimePerComeback: number;
  reworkTimePerComeback: number;
  laborRate: number;
  partsCostPerComeback: number;
  customerGoodwillCost: number;
  comebackRatePercent: number;
}

export const AutoRepairComebackCostInputSchema = z.object({
  totalJobs: z.number().min(1).max(100000).default(100),
  comebackJobs: z.number().min(0).max(100000).default(5),
  averageJobValue: z.number().min(0).max(100000).default(500),
  diagnosticTimePerComeback: z.number().min(0).max(40).default(1.5),
  reworkTimePerComeback: z.number().min(0).max(40).default(2),
  laborRate: z.number().min(0).max(500).default(100),
  partsCostPerComeback: z.number().min(0).max(10000).default(50),
  customerGoodwillCost: z.number().min(0).max(1000).default(25),
  comebackRatePercent: z.number().min(0).max(100).default(5),
});

export interface AutoRepairComebackCostOutput {
  totalExposure: number;
  breakdown: {
    comebackCost: number;
    diagnosticLeak: number;
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

function evaluateFormulas(input: AutoRepairComebackCostInput): Record<string, number> {
  const results: Record<string, number> = {};
  results.comebackCost = input.comebackJobs * ( (input.diagnosticTimePerComeback + input.reworkTimePerComeback) * input.laborRate + input.partsCostPerComeback + input.customerGoodwillCost );
  results.diagnosticLeak = input.comebackJobs * input.diagnosticTimePerComeback * input.laborRate;
  results.totalExposure = results.comebackCost + (input.comebackJobs * input.averageJobValue * 0.5);
  results.summaryLevel = input.comebackRatePercent >= 8 ? 'critical' : (input.comebackRatePercent >= 4 ? 'warning' : 'normal');
  results.primaryDriver = input.comebackJobs > 0 ? 'input.comebackJobs' : 'none';
  results.decisionVerdict = input.comebackRatePercent >= 8 ? 'Immediate action required' : (input.comebackRatePercent >= 4 ? 'Monitor closely' : 'Acceptable');
  return results;
}

export function calculateAutoRepairComebackCost(input: AutoRepairComebackCostInput): AutoRepairComebackCostOutput {
  const results = evaluateFormulas(input);
  const totalExposure = results.totalExposure;
  const breakdown = {
    comebackCost: results.comebackCost,
    diagnosticLeak: results.diagnosticLeak,
    summaryLevel: results.summaryLevel,
    primaryDriver: results.primaryDriver,
    decisionVerdict: results.decisionVerdict,
  };

  // rule: totalJobs must be >= 1
  // rule: comebackJobs must be >= 0 and <= totalJobs
  // rule: averageJobValue must be >= 0
  // rule: diagnosticTimePerComeback must be >= 0
  // rule: reworkTimePerComeback must be >= 0
  // rule: laborRate must be >= 0
  // rule: partsCostPerComeback must be >= 0
  // rule: customerGoodwillCost must be >= 0
  // rule: comebackRatePercent must be >= 0 and <= 100
  // threshold comebackRatePercent_warning: 4
  // threshold comebackRatePercent_critical: 8
  const hiddenLossDrivers: string[] = ["comebackRatePercent >= 8 ? 'Critical comeback rate: immediate process improvement needed' : null","comebackRatePercent >= 4 && comebackRatePercent < 8 ? 'Warning: comeback rate above industry benchmark (4%)' : null"];
  const suggestedActions: string[] = ["Implement root cause analysis for comebacks","Enhance technician training on first-time fix","Improve diagnostic procedures and checklists","Review parts quality and sourcing","Establish customer follow-up protocol"];
  const dataConfidenceAdjusted = results.totalExposure * (1 - (1 - dataConfidence) * 0.1);

  return {
    totalExposure,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis over time","Benchmarking against industry averages","Detailed breakdown report","Scenario simulation"],
  };
}
