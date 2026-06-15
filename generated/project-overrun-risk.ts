// Auto-generated from project-overrun-risk-schema.json
import * as z from 'zod';

export interface Project_overrun_riskInput {
  plannedDuration: number;
  actualDuration: number;
  plannedCost: number;
  actualCost: number;
  percentComplete: number;
  scopeChangeFrequency: string;
  teamExperience: string;
  qualityDefectRate: number;
  supplierReliability: number;
  riskExposure: number;
}

export const Project_overrun_riskInputSchema = z.object({
  plannedDuration: z.number().min(1).max(120).default(12),
  actualDuration: z.number().min(0).max(120).default(6),
  plannedCost: z.number().min(1000).max(1000000000).default(1000000),
  actualCost: z.number().min(0).max(1000000000).default(600000),
  percentComplete: z.number().min(0).max(100).default(50),
  scopeChangeFrequency: z.enum(['low', 'moderate', 'high']).default('moderate'),
  teamExperience: z.enum(['junior', 'intermediate', 'senior']).default('intermediate'),
  qualityDefectRate: z.number().min(0).max(1).default(0.05),
  supplierReliability: z.number().min(0).max(1).default(0.9),
  riskExposure: z.number().min(0).max(100000000).default(200000),
});

function evaluateAllFormulas(input: Project_overrun_riskInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["schedulePerformanceIndex"] = input.percentComplete / (input.actualDuration / input.plannedDuration * 100); } catch { results["schedulePerformanceIndex"] = 0; }
  try { results["costPerformanceIndex"] = (input.percentComplete / 100 * input.plannedCost) / input.actualCost; } catch { results["costPerformanceIndex"] = 0; }
  try { results["scopeChangeFactor"] = (input.scopeChangeFrequency === 'low' ? 0.8 : (input.scopeChangeFrequency === 'moderate' ? 1.0 : (input.scopeChangeFrequency === 'high' ? 1.3 : 0))); } catch { results["scopeChangeFactor"] = 0; }
  try { results["teamExperienceFactor"] = (input.teamExperience === 'junior' ? 1.3 : (input.teamExperience === 'intermediate' ? 1.0 : (input.teamExperience === 'senior' ? 0.8 : 0))); } catch { results["teamExperienceFactor"] = 0; }
  try { results["qualityAndSupplyRisk"] = (1 + input.qualityDefectRate) * (2 - input.supplierReliability); } catch { results["qualityAndSupplyRisk"] = 0; }
  try { results["overrunRiskIndex"] = ( (1 - (results["schedulePerformanceIndex"] ?? 0)) + (1 - (results["costPerformanceIndex"] ?? 0)) ) / 2 * (results["scopeChangeFactor"] ?? 0) * (results["teamExperienceFactor"] ?? 0) * (results["qualityAndSupplyRisk"] ?? 0) + (input.riskExposure / input.plannedCost); } catch { results["overrunRiskIndex"] = 0; }
  try { results["dataConfidenceAdjusted"] = (results["overrunRiskIndex"] ?? 0) * (1 - 0.1 * (1 - input.supplierReliability)); } catch { results["dataConfidenceAdjusted"] = 0; }
  return results;
}


export function calculateProject_overrun_risk(input: Project_overrun_riskInput): Project_overrun_riskOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["overrunRiskIndex"] ?? 0;
  const breakdown = {
    schedulePerformanceIndex: values["schedulePerformanceIndex"] ?? 0,
    costPerformanceIndex: values["costPerformanceIndex"] ?? 0,
    scopeChangeFactor: values["scopeChangeFactor"] ?? 0,
    teamExperienceFactor: values["teamExperienceFactor"] ?? 0,
    qualityAndSupplyRisk: values["qualityAndSupplyRisk"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Schedule Slippage","Rework Cost","Scope Creep","Resource Attrition"];
  const suggestedActions: string[] = ["Implement Earned Value Management (EVM)","Scope Change Control Board","Quality Improvement Program","Supplier Development Initiative","Risk Mitigation Reserve"];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-project comparison"],
  };
}


export interface Project_overrun_riskOutput {
  totalWasteCost: number;
  breakdown: { schedulePerformanceIndex: number; costPerformanceIndex: number; scopeChangeFactor: number; teamExperienceFactor: number; qualityAndSupplyRisk: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
