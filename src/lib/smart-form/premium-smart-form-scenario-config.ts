import type { SmartFormMode } from "@/lib/smart-form/dynamic-form-types";

export type PremiumScenarioEntry = {
  readonly id: string;
  readonly labelEn: string;
  readonly descriptionEn: string;
  readonly inputKeys?: readonly string[];
};

export type PremiumScenarioConfig = {
  readonly defaultScenarioId: string;
  readonly scenarios: readonly PremiumScenarioEntry[];
  readonly modeByKey?: Record<string, SmartFormMode>;
};

const CNC_MODE_BY_KEY: Record<string, SmartFormMode> = {
  setupTime: "simple",
  cycleTime: "simple",
  quantity: "simple",
  machineRate: "simple",
  riskMargin: "simple",
  toolCost: "advanced",
  materialCost: "advanced",
};

const WELDING_MODE_BY_KEY: Record<string, SmartFormMode> = {
  materialCost: "simple",
  laborHours: "simple",
  laborRate: "simple",
  fitUpHours: "simple",
  targetMargin: "simple",
  gasConsumableCost: "advanced",
  reworkRiskPercent: "advanced",
};

const HVAC_MODE_BY_KEY: Record<string, SmartFormMode> = {
  equipmentCost: "simple",
  laborHours: "simple",
  laborRate: "simple",
  callbackRiskPercent: "simple",
  targetMargin: "simple",
  ductworkCost: "advanced",
  commissioningCost: "advanced",
};

/** Scenario metadata for all 27 premium analyzers. */
export const PREMIUM_SMART_FORM_SCENARIO_CONFIG: Record<string, PremiumScenarioConfig> = {
  "cnc-quote-risk-analyzer": {
    defaultScenarioId: "quick_quote_check",
    modeByKey: CNC_MODE_BY_KEY,
    scenarios: [
      {
        id: "quick_quote_check",
        labelEn: "Quick quote check",
        descriptionEn: "Fast floor check with core time and rate inputs.",
        inputKeys: [
          "setupTime",
          "cycleTime",
          "quantity",
          "machineRate",
          "riskMargin",
          "toolCost",
          "materialCost",
        ],
      },
      {
        id: "detailed_margin_review",
        labelEn: "Detailed margin review",
        descriptionEn: "Full job cost stack including tooling and material.",
        inputKeys: [
          "setupTime",
          "cycleTime",
          "quantity",
          "toolCost",
          "materialCost",
          "machineRate",
          "riskMargin",
        ],
      },
    ],
  },
  "change-order-impact-analyzer": {
    defaultScenarioId: "small_change_order",
    scenarios: [
      {
        id: "small_change_order",
        labelEn: "Small change order",
        descriptionEn: "Minor scope tweak with delay and crew cost focus.",
      },
      {
        id: "major_scope_change",
        labelEn: "Major scope change",
        descriptionEn: "Large scope shift with margin and schedule risk.",
      },
    ],
  },
  "office-cleaning-bid-optimizer": {
    defaultScenarioId: "recurring_cleaning",
    scenarios: [
      {
        id: "recurring_cleaning",
        labelEn: "Recurring cleaning",
        descriptionEn: "Monthly contract with visit frequency and labor stack.",
      },
      {
        id: "one_time_deep_clean",
        labelEn: "One-time deep clean",
        descriptionEn: "Single deep-clean bid with supply and labor load.",
      },
    ],
  },
  "menu-profit-leak-detector": {
    defaultScenarioId: "single_menu_item",
    scenarios: [
      {
        id: "single_menu_item",
        labelEn: "Single menu item",
        descriptionEn: "One dish margin after waste and delivery fees.",
      },
      {
        id: "full_menu_review",
        labelEn: "Full menu review",
        descriptionEn: "Menu-wide leak check with labor and supplier drift.",
      },
    ],
  },
  "return-profit-erosion-tool": {
    defaultScenarioId: "product_return_check",
    scenarios: [
      {
        id: "product_return_check",
        labelEn: "Product return check",
        descriptionEn: "Single SKU return impact on net profit.",
      },
      {
        id: "monthly_return_impact",
        labelEn: "Monthly return impact",
        descriptionEn: "Monthly return volume with ad and logistics cost.",
      },
    ],
  },
  "welding-bid-risk-analyzer": {
    defaultScenarioId: "field_repair",
    modeByKey: WELDING_MODE_BY_KEY,
    scenarios: [
      {
        id: "field_repair",
        labelEn: "Field repair",
        descriptionEn: "On-site weld repair with fit-up and labor focus.",
        inputKeys: [
          "materialCost",
          "laborHours",
          "laborRate",
          "fitUpHours",
          "targetMargin",
          "gasConsumableCost",
          "reworkRiskPercent",
        ],
      },
      {
        id: "production_weld_bid",
        labelEn: "Production weld bid",
        descriptionEn: "Fab shop bid with consumables and rework risk.",
        inputKeys: [
          "materialCost",
          "laborHours",
          "laborRate",
          "gasConsumableCost",
          "fitUpHours",
          "reworkRiskPercent",
          "targetMargin",
        ],
      },
    ],
  },
  "hvac-project-margin-guard": {
    defaultScenarioId: "small_service_job",
    modeByKey: HVAC_MODE_BY_KEY,
    scenarios: [
      {
        id: "small_service_job",
        labelEn: "Small service job",
        descriptionEn: "Replace or service call with core equipment and labor.",
        inputKeys: [
          "equipmentCost",
          "laborHours",
          "laborRate",
          "callbackRiskPercent",
          "targetMargin",
          "ductworkCost",
          "commissioningCost",
        ],
      },
      {
        id: "commercial_project",
        labelEn: "Commercial project",
        descriptionEn: "Full install with ductwork and commissioning.",
        inputKeys: [
          "equipmentCost",
          "ductworkCost",
          "laborHours",
          "laborRate",
          "commissioningCost",
          "callbackRiskPercent",
          "targetMargin",
        ],
      },
    ],
  },
  "panel-shop-margin-verdict": {
    defaultScenarioId: "small_control_panel",
    scenarios: [
      {
        id: "small_control_panel",
        labelEn: "Small control panel",
        descriptionEn: "Compact panel build with core labor and material.",
      },
      {
        id: "industrial_panel_project",
        labelEn: "Industrial panel project",
        descriptionEn: "Multi-bay panel job with engineering and test load.",
      },
    ],
  },
  "landscaping-contract-profit-tool": {
    defaultScenarioId: "maintenance_contract",
    scenarios: [
      {
        id: "maintenance_contract",
        labelEn: "Maintenance contract",
        descriptionEn: "Recurring grounds maintenance with crew and fuel.",
      },
      {
        id: "installation_project",
        labelEn: "Installation project",
        descriptionEn: "Install bid with material, labor and margin guard.",
      },
    ],
  },
  "auto-shop-margin-leak-detector": {
    defaultScenarioId: "repair_order",
    scenarios: [
      {
        id: "repair_order",
        labelEn: "Repair order",
        descriptionEn: "Single repair order with parts and bay labor.",
      },
      {
        id: "service_package",
        labelEn: "Service package",
        descriptionEn: "Bundled service package with margin leak check.",
      },
    ],
  },
  "signage-bid-safe-price-tool": {
    defaultScenarioId: "indoor_signage",
    scenarios: [
      {
        id: "indoor_signage",
        labelEn: "Indoor signage",
        descriptionEn: "Interior sign bid with material and install labor.",
      },
      {
        id: "outdoor_installation",
        labelEn: "Outdoor installation",
        descriptionEn: "Exterior sign with weatherproofing and rigging risk.",
      },
    ],
  },
  "plumbing-job-margin-verdict": {
    defaultScenarioId: "service_repair_job",
    scenarios: [
      {
        id: "service_repair_job",
        labelEn: "Service repair job",
        descriptionEn: "Service call with labor, parts and callback risk.",
      },
      {
        id: "installation_project",
        labelEn: "Installation project",
        descriptionEn: "Rough-in or repipe project with full cost stack.",
      },
    ],
  },
  "millwork-bid-risk-analyzer": {
    defaultScenarioId: "custom_cabinet_job",
    scenarios: [
      {
        id: "custom_cabinet_job",
        labelEn: "Custom cabinet job",
        descriptionEn: "Custom millwork bid with shop labor and material.",
      },
      {
        id: "commercial_millwork_bid",
        labelEn: "Commercial millwork bid",
        descriptionEn: "Commercial package with tolerance and rework risk.",
      },
    ],
  },
  "roofing-contract-margin-guard": {
    defaultScenarioId: "residential_roofing",
    scenarios: [
      {
        id: "residential_roofing",
        labelEn: "Residential roofing",
        descriptionEn: "Residential re-roof with square and labor inputs.",
      },
      {
        id: "commercial_roofing",
        labelEn: "Commercial roofing",
        descriptionEn: "Commercial roof scope with tear-off and margin guard.",
      },
    ],
  },
  "painting-job-profit-verdict": {
    defaultScenarioId: "interior_painting",
    scenarios: [
      {
        id: "interior_painting",
        labelEn: "Interior painting",
        descriptionEn: "Interior coat bid with prep and labor hours.",
      },
      {
        id: "exterior_project",
        labelEn: "Exterior project",
        descriptionEn: "Exterior project with weather and access risk.",
      },
    ],
  },
  "sheet-metal-quote-risk-tool": {
    defaultScenarioId: "quick_sheet_quote",
    scenarios: [
      {
        id: "quick_sheet_quote",
        labelEn: "Quick sheet quote",
        descriptionEn: "Fast fab quote with material and run time.",
      },
      {
        id: "detailed_fabrication_margin",
        labelEn: "Detailed fabrication margin",
        descriptionEn: "Full fab stack with setup, scrap and margin band.",
      },
    ],
  },
  "3d-print-job-margin-tool": {
    defaultScenarioId: "prototype_print",
    scenarios: [
      {
        id: "prototype_print",
        labelEn: "Prototype print",
        descriptionEn: "Single prototype job with machine and material time.",
      },
      {
        id: "batch_production_print",
        labelEn: "Batch production print",
        descriptionEn: "Batch run with amortized setup and failure risk.",
      },
    ],
  },
  "route-optimization-analyzer": {
    defaultScenarioId: "daily_delivery_route",
    scenarios: [
      {
        id: "daily_delivery_route",
        labelEn: "Daily delivery route",
        descriptionEn: "Daily route with stops, fuel and driver cost.",
      },
      {
        id: "multi_stop_route_plan",
        labelEn: "Multi-stop route plan",
        descriptionEn: "Multi-stop plan with freight loss and margin guard.",
      },
    ],
  },
  "crop-yield-loss-analyzer": {
    defaultScenarioId: "field_yield_check",
    scenarios: [
      {
        id: "field_yield_check",
        labelEn: "Field yield check",
        descriptionEn: "Field-level yield gap vs expected output.",
      },
      {
        id: "seasonal_loss_review",
        labelEn: "Seasonal loss review",
        descriptionEn: "Season-wide loss review with input and revenue impact.",
      },
    ],
  },
  "water-optimization-verdict": {
    defaultScenarioId: "irrigation_efficiency",
    scenarios: [
      {
        id: "irrigation_efficiency",
        labelEn: "Irrigation efficiency",
        descriptionEn: "Irrigation system efficiency and cost leak check.",
      },
      {
        id: "facility_water_usage",
        labelEn: "Facility water usage",
        descriptionEn: "Facility water use with utility and waste drivers.",
      },
    ],
  },
  "feed-efficiency-analyzer": {
    defaultScenarioId: "daily_feed_check",
    scenarios: [
      {
        id: "daily_feed_check",
        labelEn: "Daily feed check",
        descriptionEn: "Daily ration efficiency vs production output.",
      },
      {
        id: "herd_feed_performance",
        labelEn: "Herd feed performance",
        descriptionEn: "Herd-level feed cost and conversion review.",
      },
    ],
  },
  "dairy-profit-detector": {
    defaultScenarioId: "milk_batch_margin",
    scenarios: [
      {
        id: "milk_batch_margin",
        labelEn: "Milk batch margin",
        descriptionEn: "Batch margin after feed, labor and shrink.",
      },
      {
        id: "monthly_dairy_profit",
        labelEn: "Monthly dairy profit",
        descriptionEn: "Monthly dairy profit with overhead and price risk.",
      },
    ],
  },
  "energy-efficiency-report": {
    defaultScenarioId: "facility_energy_check",
    scenarios: [
      {
        id: "facility_energy_check",
        labelEn: "Facility energy check",
        descriptionEn: "Facility kWh cost and baseline efficiency review.",
      },
      {
        id: "equipment_efficiency_review",
        labelEn: "Equipment efficiency review",
        descriptionEn: "Equipment-level efficiency and upgrade ROI signal.",
      },
    ],
  },
  "cbam-compliance-verdict": {
    defaultScenarioId: "shipment_cbam_check",
    scenarios: [
      {
        id: "shipment_cbam_check",
        labelEn: "Shipment CBAM check",
        descriptionEn: "Single shipment embedded emissions exposure.",
      },
      {
        id: "annual_export_exposure",
        labelEn: "Annual export exposure",
        descriptionEn: "Annual export volume with CBAM cost exposure.",
      },
    ],
  },
  "renovation-budget-optimizer": {
    defaultScenarioId: "small_renovation",
    scenarios: [
      {
        id: "small_renovation",
        labelEn: "Small renovation",
        descriptionEn: "Room or partial remodel budget guard.",
      },
      {
        id: "full_project_budget",
        labelEn: "Full project budget",
        descriptionEn: "Whole-home or full fit-out budget optimization.",
      },
    ],
  },
  "trip-budget-optimizer": {
    defaultScenarioId: "simple_trip_budget",
    scenarios: [
      {
        id: "simple_trip_budget",
        labelEn: "Simple trip budget",
        descriptionEn: "Core travel cost stack for a short trip.",
      },
      {
        id: "detailed_travel_plan",
        labelEn: "Detailed travel plan",
        descriptionEn: "Multi-segment travel plan with margin-safe budget.",
      },
    ],
  },
  "meal-planning-verdict": {
    defaultScenarioId: "weekly_meal_plan",
    scenarios: [
      {
        id: "weekly_meal_plan",
        labelEn: "Weekly meal plan",
        descriptionEn: "Weekly grocery and meal cost verdict.",
      },
      {
        id: "family_budget_plan",
        labelEn: "Family budget plan",
        descriptionEn: "Family-scale meal budget with waste and delivery risk.",
      },
    ],
  },
};
