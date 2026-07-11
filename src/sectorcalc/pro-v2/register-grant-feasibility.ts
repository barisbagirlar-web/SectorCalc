// SectorCalc PRO V2 — Energy Efficiency Grant / Incentive Feasibility Pack Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { GRANT_FEASIBILITY_GROUPS } from "./contracts/energy-efficiency-grant-incentive-feasibility-pack.contract";
import { GRANT_FEASIBILITY_PRESETS } from "./presets/energy-efficiency-grant-incentive-feasibility-pack.presets";
import { grantFeasibilityBuildExecutePayload } from "./adapters/energy-efficiency-grant-incentive-feasibility-pack.adapter";
import { buildGrantFeasibilityReport } from "./insights/energy-efficiency-grant-incentive-feasibility-pack.insight";

const SLUG = "energy-efficiency-grant-incentive-feasibility-pack";

export function registerGrantFeasibilityTool(): void {
  registerTool({
    slug: SLUG,
    title: "Energy Efficiency Grant / Incentive Feasibility Pack",
    category: "Energy Efficiency",

    fieldContract: GRANT_FEASIBILITY_GROUPS,
    presets: GRANT_FEASIBILITY_PRESETS,

    serverContract: {
      toolKey: SLUG,
      toolId: "PRO_033",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_baseline_energy_consumption_kwh",
        "n_baseline_energy_price_per_kwh",
        "n_projected_saving_pct",
        "n_gross_project_cost",
        "n_eligible_project_cost",
        "n_grant_incentive_amount",
        "n_annual_maintenance_cost",
        "n_useful_life_years",
        "n_discount_rate",
        "n_energy_price_escalation_pct",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_baseline_energy_cost", "out_projected_energy_saving",
        "out_gross_project_cost", "out_eligible_project_cost",
        "out_grant_amount", "out_net_investment",
        "out_annual_saving", "out_simple_payback_years",
        "out_roi_percent", "out_npv",
        "out_grant_dependency_pct", "out_energy_price_sensitivity",
        "out_implementation_risk_score", "out_final_decision_state",
      ],
    },

    buildExecutePayload: grantFeasibilityBuildExecutePayload,
    buildReport: buildGrantFeasibilityReport,

    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
