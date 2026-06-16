// Auto-generated from supply-chain-disruption-risk-calculator-schema.json
import * as z from 'zod';

export interface Supply_chain_disruption_risk_calculatorInput {
  supplier_reliability_score: number;
  inventory_buffer_days: number;
  lead_time_variability: number;
  single_source_dependency: number;
  geopolitical_risk_index: number;
  demand_volatility: number;
  transportation_disruption_probability: number;
  quality_defect_rate: number;
  cyber_risk_score: number;
  use_advanced_hedging: boolean;
}

export const Supply_chain_disruption_risk_calculatorInputSchema = z.object({
  supplier_reliability_score: z.number().min(0).max(100).default(85),
  inventory_buffer_days: z.number().min(0).max(365).default(30),
  lead_time_variability: z.number().min(0).max(2).default(0.25),
  single_source_dependency: z.number().min(0).max(100).default(40),
  geopolitical_risk_index: z.number().min(0).max(100).default(20),
  demand_volatility: z.number().min(0).max(3).default(0.3),
  transportation_disruption_probability: z.number().min(0).max(1).default(0.05),
  quality_defect_rate: z.number().min(0).max(100000).default(500),
  cyber_risk_score: z.number().min(0).max(100).default(15),
  use_advanced_hedging: z.boolean().default(false),
});

function evaluateAllFormulas(input: Supply_chain_disruption_risk_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((100 - input.supplier_reliability_score) / 100) * (input.single_source_dependency / 100); results["supplier_risk_factor"] = Number.isFinite(v) ? v : 0; } catch { results["supplier_risk_factor"] = 0; }
  try { const v = Math.max(0, (input.lead_time_variability * 100) / (input.inventory_buffer_days + 1)); results["inventory_risk_factor"] = Number.isFinite(v) ? v : 0; } catch { results["inventory_risk_factor"] = 0; }
  try { const v = (input.geopolitical_risk_index / 100) * 0.4 + input.transportation_disruption_probability * 0.35 + (input.cyber_risk_score / 100) * 0.25; results["external_risk_factor"] = Number.isFinite(v) ? v : 0; } catch { results["external_risk_factor"] = 0; }
  try { const v = input.demand_volatility * 0.5 + (input.quality_defect_rate / 100000) * 0.5; results["demand_quality_risk_factor"] = Number.isFinite(v) ? v : 0; } catch { results["demand_quality_risk_factor"] = 0; }
  try { const v = input.use_advanced_hedging ? 0.85 : 1.0; results["hedging_adjustment"] = Number.isFinite(v) ? v : 0; } catch { results["hedging_adjustment"] = 0; }
  try { const v = ((results["supplier_risk_factor"] ?? 0) * 30 + (results["inventory_risk_factor"] ?? 0) * 20 + (results["external_risk_factor"] ?? 0) * 25 + (results["demand_quality_risk_factor"] ?? 0) * 25) * (results["hedging_adjustment"] ?? 0); results["raw_disruption_risk"] = Number.isFinite(v) ? v : 0; } catch { results["raw_disruption_risk"] = 0; }
  try { const v = Math.min(100, Math.max(0, (results["raw_disruption_risk"] ?? 0))); results["primary_result"] = Number.isFinite(v) ? v : 0; } catch { results["primary_result"] = 0; }
  return results;
}


export function calculateSupply_chain_disruption_risk_calculator(input: Supply_chain_disruption_risk_calculatorInput): Supply_chain_disruption_risk_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["disruption_risk_score"] ?? values["primary_result"] ?? 0;
  const breakdown = {
    supplierRiskComponent: values["supplierRiskComponent"] ?? 0,
    inventoryRiskComponent: values["inventoryRiskComponent"] ?? 0,
    externalRiskComponent: values["externalRiskComponent"] ?? 0,
    demandQualityRiskComponent: values["demandQualityRiskComponent"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Single Source Dependency Loss","Quality Defect Loss","Transportation Disruption Loss"];
  const suggestedActions: string[] = ["Implement supplier diversification program to reduce single source dependency below 30%.","Increase inventory buffer to at least 30 days to absorb lead time variability.","Initiate Six Sigma DMAIC project to reduce defect rate below 500 ppm.","Conduct comprehensive cybersecurity audit and implement NIST framework controls.","Enable advanced hedging strategies to mitigate currency and commodity risks."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Real-time dashboard","Multi-echelon simulation","Benchmarking against industry peers"],
  };
}


export interface Supply_chain_disruption_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: { supplierRiskComponent: number; inventoryRiskComponent: number; externalRiskComponent: number; demandQualityRiskComponent: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
