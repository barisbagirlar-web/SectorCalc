// Auto-generated from cbam-compliance-verdict-schema.json
import * as z from 'zod';

export interface Cbam_compliance_verdictInput {
  total_imported_tonnes: number;
  embedded_emissions_per_tonne: number;
  carbon_price_origin: number;
  cbam_certificate_price: number;
  free_allocation_factor: number;
  verification_status: string;
  compliance_deadline_met: boolean;
}

export const Cbam_compliance_verdictInputSchema = z.object({
  total_imported_tonnes: z.number().min(0).max(1000000).default(1000),
  embedded_emissions_per_tonne: z.number().min(0).max(20).default(1.5),
  carbon_price_origin: z.number().min(0).max(200).default(0),
  cbam_certificate_price: z.number().min(0).max(300).default(85),
  free_allocation_factor: z.number().min(0).max(1).default(0.9),
  verification_status: z.enum(['verified', 'self-declared', 'default_values']).default('verified'),
  compliance_deadline_met: z.boolean().default(true),
});

function evaluateAllFormulas(input: Cbam_compliance_verdictInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { results["adjusted_embedded_emissions"] = input.total_imported_tonnes * input.embedded_emissions_per_tonne * (1 + (input.verification_status == 'self-declared' ? 0.2 : 0)); } catch { results["adjusted_embedded_emissions"] = 0; }
  try { results["free_allocation_emissions"] = (results["adjusted_embedded_emissions"] ?? 0) * input.free_allocation_factor; } catch { results["free_allocation_emissions"] = 0; }
  try { results["cbam_liable_emissions"] = (results["adjusted_embedded_emissions"] ?? 0) - (results["free_allocation_emissions"] ?? 0); } catch { results["cbam_liable_emissions"] = 0; }
  try { results["carbon_price_deduction"] = (results["cbam_liable_emissions"] ?? 0) * input.carbon_price_origin; } catch { results["carbon_price_deduction"] = 0; }
  try { results["gross_cbam_cost"] = (results["cbam_liable_emissions"] ?? 0) * input.cbam_certificate_price; } catch { results["gross_cbam_cost"] = 0; }
  try { results["net_cbam_cost"] = Math.max(0, (results["gross_cbam_cost"] ?? 0) - (results["carbon_price_deduction"] ?? 0)); } catch { results["net_cbam_cost"] = 0; }
  results["compliance_verdict"] = 0;
  return results;
}


export function calculateCbam_compliance_verdict(input: Cbam_compliance_verdictInput): Cbam_compliance_verdictOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["compliance_verdict"] ?? 0;
  const breakdown = {
    id: values["id"] ?? 0,
    label: values["label"] ?? 0,
    type: values["type"] ?? 0,
    properties: values["properties"] ?? 0
  };
  const hiddenLossDrivers: string[] = ["Verification Penalty Cost","Late Submission Fee","Inefficient Free Allocation Gap"];
  const suggestedActions: string[] = ["Obtain third-party verification of embedded emissions","Review free allocation factor eligibility","Source from suppliers with lower embedded emissions","Set up automated quarterly reporting to avoid late fees"];
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Multi-plant aggregation"],
  };
}


export interface Cbam_compliance_verdictOutput {
  totalWasteCost: number;
  breakdown: { id: number; label: number; type: number; properties: number };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
