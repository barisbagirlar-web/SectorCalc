// SectorCalc PRO V2 — Plant-Wide Shop Rate Cost Structure Audit Registration

import { registerTool } from "./proToolRegistry";
import { PLANT_WIDE_SHOP_RATE_GROUPS } from "./contracts/plant-wide-shop-rate-cost-structure-audit.contract";
import { PLANT_WIDE_SHOP_RATE_PRESETS } from "./presets/plant-wide-shop-rate-cost-structure-audit.presets";
import { plantWideShopRateBuildExecutePayload } from "./adapters/plant-wide-shop-rate-cost-structure-audit.adapter";
import { buildPlantWideShopRateReport } from "./insights/plant-wide-shop-rate-cost-structure-audit.insight";

export function registerPlantWideShopRateTool(): void {
  registerTool({
    slug: "plant-wide-shop-rate-cost-structure-audit",
    title: "Plant-Wide Shop Rate Cost Structure Audit",
    category: "Cost Management",
    fieldContract: PLANT_WIDE_SHOP_RATE_GROUPS,
    presets: PLANT_WIDE_SHOP_RATE_PRESETS,
    serverContract: {
      toolKey: "plant-wide-shop-rate-cost-structure-audit",
      toolId: "PRO_026",
      schemaVersion: "5.3.1",
      requiredInputKeys: [
        "n_total_annual_cost",
        "n_total_productive_hours",
        "n_machine_group_cost",
        "n_machine_group_hours",
        "n_overhead_pool",
        "n_overhead_allocation_base",
        "n_current_shop_rate",
        "n_target_margin_pct",
        "n_utilization_pct",
        "n_labor_burden",
        "n_facility_burden",
        "n_maintenance_burden",
        "n_energy_burden",
      ],
      optionalInputKeys: [],
      expectedOutputKeys: [
        "out_annual_direct_cost",
        "out_annual_indirect_cost",
        "out_productive_hours",
        "out_fixed_cost_per_hour",
        "out_labor_burden_per_hour",
        "out_facility_burden_per_hour",
        "out_maintenance_burden_per_hour",
        "out_energy_burden_per_hour",
        "out_plant_wide_shop_rate",
        "out_current_rate_gap",
        "out_annual_under_recovery",
        "out_primary_cost_pool",
        "out_final_decision_state",
      ],
    },
    buildExecutePayload: plantWideShopRateBuildExecutePayload,
    buildReport: buildPlantWideShopRateReport,
    reportCapabilities: {
      primaryKpis: true, decisionState: true, executiveInterpretation: true,
      breakdown: true, scenarioComparison: false, sensitivity: true,
      hiddenLosses: true, missedAssumptions: true, riskWarnings: true,
      checklist: true, recommendations: true, pdfExport: true,
    },
  });
}
