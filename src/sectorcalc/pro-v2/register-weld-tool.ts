// SectorCalc PRO V2 — Weld Tool Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { WELD_GROUPS } from "./contracts/weld-procedure-cost-consumable-estimation-suite.contract";
import { WELD_PRESETS } from "./presets/weld-procedure-cost-consumable-estimation-suite.presets";
import { weldBuildExecutePayload } from "./adapters/weld-procedure-cost-consumable-estimation-suite.adapter";
import { buildWeldReport } from "./insights/weld-procedure-cost-consumable-estimation-suite.insight";

const WELD_SLUG = "weld-procedure-cost-consumable-estimation-suite";

export function registerWeldTool(): void {
  registerTool({
    slug: WELD_SLUG,
    title: "Weld Procedure Cost & Consumable Estimation Suite",
    category: "Manufacturing / Welding",

    fieldContract: WELD_GROUPS,
    presets: WELD_PRESETS,

    serverContract: {
      toolKey: WELD_SLUG,
      toolId: "PRO_027",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "weld_length_m", "weld_throat_mm", "weld_density",
        "wire_cost_per_kg", "gas_cost_per_min",
        "arc_time_min", "weld_time_min", "labor_rate", "overhead_rate",
        "deposition_efficiency", "source_confidence",
      ],
      optionalInputKeys: ["planned_quote", "contingency"],
      expectedOutputKeys: [
        "out_evidence_completeness", "out_normalized_demand", "out_reference_deviation",
        "out_derating_factor", "out_demand_metric", "out_capacity_metric",
        "out_utilization_margin", "out_expanded_uncertainty", "out_threshold_crossing",
        "out_sensitivity_driver", "out_fmea_trigger", "out_money_at_risk",
        "out_scenario_delta", "out_audit_hash_payload", "out_final_decision_state",
      ],
    },

    buildExecutePayload: weldBuildExecutePayload,
    buildReport: buildWeldReport,

    reportCapabilities: {
      primaryKpis: true,
      decisionState: true,
      executiveInterpretation: true,
      breakdown: true,
      scenarioComparison: false,
      sensitivity: true,
      hiddenLosses: true,
      missedAssumptions: true,
      riskWarnings: true,
      checklist: true,
      recommendations: true,
      pdfExport: true,
    },
  });
}
