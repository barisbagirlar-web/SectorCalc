// Auto-generated from evm-cost-forecast-calculator-schema.json
import * as z from 'zod';

export interface Evm_cost_forecast_calculatorInput {
  bac: number;
  ev: number;
  ac: number;
  pv: number;
  percentComplete: number;
  cpi: number;
  spi: number;
  useWeightedMethod: boolean;
  managementReserve: number;
  contingencyDraw: number;
}

export const Evm_cost_forecast_calculatorInputSchema = z.object({
  bac: z.number().min(0).max(1000000000).default(1000000),
  ev: z.number().min(0).max(1000000000).default(400000),
  ac: z.number().min(0).max(1000000000).default(500000),
  pv: z.number().min(0).max(1000000000).default(600000),
  percentComplete: z.number().min(0).max(100).default(40),
  cpi: z.number().min(0.01).max(10).default(0.8),
  spi: z.number().min(0.01).max(10).default(0.67),
  useWeightedMethod: z.boolean().default(false),
  managementReserve: z.number().min(0).max(1000000000).default(50000),
  contingencyDraw: z.number().min(0).max(1000000000).default(20000),
});

function evaluateAllFormulas(input: Evm_cost_forecast_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.ac === 0 ? 1 : input.ev / input.ac; results["calculated_cpi"] = Number.isFinite(v) ? v : 0; } catch { results["calculated_cpi"] = 0; }
  try { const v = input.pv === 0 ? 1 : input.ev / input.pv; results["calculated_spi"] = Number.isFinite(v) ? v : 0; } catch { results["calculated_spi"] = 0; }
  try { const v = input.cpi !== undefined && input.cpi !== null ? input.cpi : (results["calculated_cpi"] ?? 0); results["effective_cpi"] = Number.isFinite(v) ? v : 0; } catch { results["effective_cpi"] = 0; }
  try { const v = input.spi !== undefined && input.spi !== null ? input.spi : (results["calculated_spi"] ?? 0); results["effective_spi"] = Number.isFinite(v) ? v : 0; } catch { results["effective_spi"] = 0; }
  try { const v = input.useWeightedMethod ? (0.8 * (results["effective_cpi"] ?? 0) + 0.2 * (results["effective_spi"] ?? 0)) : (results["effective_cpi"] ?? 0); results["weighted_performance_factor"] = Number.isFinite(v) ? v : 0; } catch { results["weighted_performance_factor"] = 0; }
  try { const v = input.bac / (results["weighted_performance_factor"] ?? 0) + input.managementReserve - input.contingencyDraw; results["eac"] = Number.isFinite(v) ? v : 0; } catch { results["eac"] = 0; }
  try { const v = (results["eac"] ?? 0) - input.ac; results["etc"] = Number.isFinite(v) ? v : 0; } catch { results["etc"] = 0; }
  try { const v = input.bac - (results["eac"] ?? 0); results["variance_at_completion"] = Number.isFinite(v) ? v : 0; } catch { results["variance_at_completion"] = 0; }
  try { const v = (input.bac - input.ev) / ((results["eac"] ?? 0) - input.ac); results["tcpi_eac"] = Number.isFinite(v) ? v : 0; } catch { results["tcpi_eac"] = 0; }
  try { const v = (results["eac"] ?? 0) * ((results["effective_cpi"] ?? 0) > 0.8 ? 0.95 : 0.85); results["data_confidence_adjusted"] = Number.isFinite(v) ? v : 0; } catch { results["data_confidence_adjusted"] = 0; }
  return results;
}


export function calculateEvm_cost_forecast_calculator(input: Evm_cost_forecast_calculatorInput): Evm_cost_forecast_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["eac"] ?? 0;
  const breakdown = {
    eac: values["eac"] ?? 0,
    etc: values["etc"] ?? 0,
    vac: values["vac"] ?? 0,
    tcpi_eac: values["tcpi_eac"] ?? 0,
    effective_cpi: values["effective_cpi"] ?? 0,
    effective_spi: values["effective_spi"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["CPI degradation trend","Rework cost hidden in AC","Unapproved scope changes"];
  const suggestedActions: string[] = ["Initiate formal root cause analysis for CPI < 0.8 – use Six Sigma DMAIC.","Rebaseline schedule if SPI < 0.7 – apply critical chain buffer management.","Request management reserve release if contingency draw > 80%.","Implement Lean waste reduction (7 wastes) on top cost activities."];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Monte Carlo simulation","Multi-project roll-up"],
  };
}


export interface Evm_cost_forecast_calculatorOutput {
  totalWasteCost: number;
  breakdown: { eac: number; etc: number; vac: number; tcpi_eac: number; effective_cpi: number; effective_spi: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
