// SectorCalc PRO V2 — Outsource vs In-House Analyzer Registration
// Wires field contract, adapter, insight, and presets into the shared registry.

import { registerTool } from "./proToolRegistry";
import { OUTSOURCE_GROUPS } from "./contracts/outsource-vs-in-house-analyzer.contract";
import { OUTSOURCE_PRESETS } from "./presets/outsource-vs-in-house-analyzer.presets";
import { outsourceBuildExecutePayload } from "./adapters/outsource-vs-in-house-analyzer.adapter";
import { buildOutsourceReport } from "./insights/outsource-vs-in-house-analyzer.insight";

const OUTSOURCE_SLUG = "outsource-vs-in-house-analyzer";

export function registerOutsourceTool(): void {
  registerTool({
    slug: OUTSOURCE_SLUG,
    title: "Outsource vs In-House Analyzer",
    category: "Sourcing Strategy",

    fieldContract: OUTSOURCE_GROUPS,
    presets: OUTSOURCE_PRESETS,

    serverContract: {
      toolKey: OUTSOURCE_SLUG,
      toolId: "PRO_033",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_in_house_material_cost_per_unit",
        "n_in_house_labor_cost_per_unit",
        "n_in_house_overhead_per_unit",
        "n_in_house_setup_cost_per_batch",
        "n_outsource_unit_price",
        "n_outsource_logistics_per_unit",
        "n_quality_defect_allowance_pct",
        "n_inventory_lead_time_cost_pct",
        "n_capacity_opportunity_cost_pct",
        "n_annual_volume",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_in_house_variable_cost",
        "out_in_house_allocated_fixed",
        "out_in_house_total_cost",
        "out_supplier_unit_price",
        "out_logistics_import_cost",
        "out_quality_defect_allowance",
        "out_inventory_lead_time_cost",
        "out_capacity_opportunity_cost",
        "out_outsource_total_landed_cost",
        "out_cost_difference",
        "out_break_even_volume",
        "out_make_buy_decision",
        "out_primary_decision_driver",
        "out_final_decision_state",
      ],
    },

    buildExecutePayload: outsourceBuildExecutePayload,
    buildReport: buildOutsourceReport,

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
