import type { ServerOutput, SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";
import { getFreeFormulaCertification } from "@/sectorcalc/formulas/free-v531/free-formula-verification-manifest";
import { FREE_INTERVAL_MODEL_CONTRACTS } from "@/sectorcalc/formulas/free-v531/free-interval-model-contract";

type OutputDefinition = readonly [id: string, name: string, unit: string, decisionUse: string];

const outputs: Readonly<Record<string, readonly OutputDefinition[]>> = Object.freeze({
  ...Object.fromEntries(
    Object.entries(FREE_INTERVAL_MODEL_CONTRACTS).map(([toolKey, contract]) => [toolKey, contract.outputs]),
  ),
  "downtime-cost": [["lost_units", "Lost Units", "units", "SECONDARY_METRIC"], ["lost_contribution", "Lost Contribution", "currency", "BUSINESS_IMPACT"], ["downtime_loss", "Total Downtime Loss", "currency", "PRIMARY_DECISION"]],
  "energy-cost-per-part": [["kwh_per_part", "Energy per Part", "kWh/part", "PRIMARY_DECISION"], ["energy_cost_per_part", "Energy Cost per Part", "currency/part", "BUSINESS_IMPACT"], ["allocated_idle_energy_per_part", "Allocated Idle Energy", "kWh/part", "SECONDARY_METRIC"]],
  "quote-margin-markup": [["quote_total_cost", "Quote Total Cost", "currency", "BUSINESS_IMPACT"], ["quote_margin_percent", "Quote Margin", "percent", "PRIMARY_DECISION"], ["quote_markup_percent", "Quote Markup", "percent", "SECONDARY_METRIC"]],
  "concrete-volume-order-quantity": [["net_concrete_volume_m3", "Net Concrete Volume", "m3", "SECONDARY_METRIC"], ["concrete_order_volume", "Concrete Order Volume", "m3", "PRIMARY_DECISION"], ["estimated_truck_loads", "Estimated Truck Loads", "loads", "SECONDARY_METRIC"], ["concrete_material_cost", "Concrete Material Cost", "currency", "BUSINESS_IMPACT"]],
  "pallet-container-load-cbm": [["item_cbm", "Item Volume", "m3/unit", "SECONDARY_METRIC"], ["gross_load_cbm", "Gross Load Volume", "m3", "PRIMARY_DECISION"], ["load_utilization_percent", "Volumetric Utilization", "percent", "SECONDARY_METRIC"]],
  "scrap-cost": [["scrap_rate", "Scrap Rate", "ratio", "PRIMARY_DECISION"], ["scrap_loss", "Net Scrap Loss", "currency", "BUSINESS_IMPACT"], ["loss_per_good_unit", "Scrap Loss per Good Unit", "currency/good unit", "SECONDARY_METRIC"]],
  "setup-time-cost": [["setup_cost_per_changeover", "Setup Cost per Changeover", "currency", "SECONDARY_METRIC"], ["setup_cost_per_part", "Setup Cost per Part", "currency/part", "PRIMARY_DECISION"], ["monthly_setup_burden", "Monthly Setup Burden", "currency/month", "BUSINESS_IMPACT"]],
  "line-balancing-efficiency": [["line_efficiency_percent", "Line Efficiency", "percent", "PRIMARY_DECISION"], ["balance_delay_percent", "Balance Delay", "percent", "SECONDARY_METRIC"], ["daily_idle_cost", "Daily Idle Labor Cost", "currency/day", "BUSINESS_IMPACT"]],
  "electric-motor-running-cost": [["input_power_kw", "Electrical Input Power", "kW", "SECONDARY_METRIC"], ["energy_kwh", "Operating Energy", "kWh", "PRIMARY_DECISION"], ["motor_energy_cost", "Motor Energy Cost", "currency", "BUSINESS_IMPACT"]],
  "inventory-carrying-cost": [["annual_carrying_cost", "Annual Carrying Cost", "currency/year", "PRIMARY_DECISION"], ["carrying_rate_percent", "Carrying Rate", "percent", "SECONDARY_METRIC"], ["monthly_inventory_burden", "Monthly Inventory Burden", "currency/month", "BUSINESS_IMPACT"]],
  "freight-cost-per-km-trip": [["total_trip_freight_cost", "Total Trip Freight Cost", "currency/trip", "PRIMARY_DECISION"], ["freight_cost_per_unit", "Freight Cost per Unit", "currency/unit", "BUSINESS_IMPACT"], ["fuel_surcharge_value", "Fuel Surcharge Value", "currency", "SECONDARY_METRIC"]],
  "true-employee-cost": [["loaded_employee_monthly_cost", "Loaded Monthly Employee Cost", "currency/month", "PRIMARY_DECISION"], ["loaded_employee_cost", "Loaded Employee Hourly Cost", "currency/hour", "BUSINESS_IMPACT"], ["burden_multiplier", "Employment Burden Multiplier", "ratio", "SECONDARY_METRIC"]],
  "break-even-point": [["unit_contribution_margin", "Unit Contribution Margin", "currency/unit", "SECONDARY_METRIC"], ["break_even_units", "Break-Even Units", "units", "PRIMARY_DECISION"], ["target_profit_units", "Target Profit Units", "units", "SECONDARY_METRIC"], ["safety_margin_units", "Sales Safety Margin", "units", "BUSINESS_IMPACT"]],
  "customer-profitability": [["customer_total_hidden_cost", "Customer Total Service Cost", "currency", "BUSINESS_IMPACT"], ["customer_profit", "Customer Profit", "currency", "PRIMARY_DECISION"], ["customer_profit_margin_percent", "Customer Profit Margin", "percent", "SECONDARY_METRIC"]],
  "machining-cost-per-part": [["cost_per_part", "Machining Cost per Part", "currency/part", "PRIMARY_DECISION"], ["quote_price_per_part", "Quote Price per Part", "currency/part", "SECONDARY_METRIC"], ["batch_margin_value", "Batch Margin Value", "currency", "BUSINESS_IMPACT"]],
  "cnc-shop-hourly-rate": [["true_hourly_rate", "True CNC Hourly Rate", "currency/hour", "PRIMARY_DECISION"], ["fixed_hourly_burden", "Fixed Hourly Burden", "currency/hour", "SECONDARY_METRIC"], ["variable_hourly_burden", "Variable Hourly Burden", "currency/hour", "SECONDARY_METRIC"], ["annual_underpricing_exposure", "Annual Underpricing Exposure", "currency/year", "BUSINESS_IMPACT"]],
  "material-removal-rate": [["mrr_cm3_min", "Material Removal Rate", "cm3/min", "PRIMARY_DECISION"], ["mass_removal_kg_hour", "Mass Removal Rate", "kg/hour", "SECONDARY_METRIC"], ["machine_cost_per_removed_kg", "Machine Cost per Removed Kilogram", "currency/kg", "BUSINESS_IMPACT"]],
  "compressed-air-leak-cost": [["annual_wasted_kwh", "Annual Wasted Energy", "kWh/year", "SECONDARY_METRIC"], ["annual_leak_cost", "Annual Leak Cost", "currency/year", "PRIMARY_DECISION"], ["repair_payback_months", "Repair Payback", "months", "BUSINESS_IMPACT"]],
  "carbon-price-exposure": [["low_case_exposure", "Low Carbon Price Exposure", "currency", "SECONDARY_METRIC"], ["carbon_price_exposure", "Base Carbon Price Exposure", "currency", "PRIMARY_DECISION"], ["high_case_exposure", "High Carbon Price Exposure", "currency", "BUSINESS_IMPACT"]],
  "payment-term-cost": [["finance_cost", "Simple Finance Cost", "currency", "SECONDARY_METRIC"], ["expected_default_cost", "Expected Default Cost", "currency", "BUSINESS_IMPACT"], ["payment_term_cost", "Total Payment-Term Cost", "currency", "PRIMARY_DECISION"]],
  "machine-investment-payback": [["net_investment", "Net Initial Investment", "currency", "SECONDARY_METRIC"], ["annual_net_benefit", "Annual Net Benefit", "currency/year", "BUSINESS_IMPACT"], ["payback_months", "Undiscounted Simple Payback", "months", "PRIMARY_DECISION"]],
  "currency-adjusted-pricing": [["fx_adjusted_cost", "FX-Adjusted Cost", "currency", "SECONDARY_METRIC"], ["currency_adjusted_price", "Currency-Adjusted Quote Price", "currency", "PRIMARY_DECISION"], ["fx_risk_value", "Unbuffered FX Movement Value", "currency", "BUSINESS_IMPACT"]],
  "eoq": [["economic_order_quantity", "Economic Order Quantity", "units", "PRIMARY_DECISION"], ["annual_ordering_cost", "Annual Ordering Cost at EOQ", "currency/year", "SECONDARY_METRIC"], ["annual_holding_cost", "Annual Holding Cost at EOQ", "currency/year", "BUSINESS_IMPACT"]],
  "safety-stock-reorder-point": [["safety_stock_units", "Safety Stock", "units", "SECONDARY_METRIC"], ["reorder_point_units", "Reorder Point", "units", "PRIMARY_DECISION"], ["cycle_stock_days", "Reorder-Point Coverage", "days", "BUSINESS_IMPACT"]],
  "recipe-cost-menu-price": [["food_cost_per_portion", "Food Cost per Saleable Portion", "currency/portion", "SECONDARY_METRIC"], ["total_cost_per_portion", "Loaded Cost per Portion", "currency/portion", "BUSINESS_IMPACT"], ["menu_price", "Menu Price at Target Food Cost", "currency/portion", "PRIMARY_DECISION"]],
  "fabric-consumption-gsm": [["effective_fabric_area_m2", "Effective Fabric Area", "m2", "SECONDARY_METRIC"], ["fabric_consumption_kg", "Fabric Consumption", "kg", "PRIMARY_DECISION"], ["fabric_consumption_cost", "Fabric Consumption Cost", "currency", "BUSINESS_IMPACT"]],
  "oee": [["availability", "Availability", "ratio", "SECONDARY_METRIC"], ["performance", "Performance", "ratio", "SECONDARY_METRIC"], ["quality", "Quality", "ratio", "SECONDARY_METRIC"], ["oee_percent", "Overall Equipment Effectiveness", "percent", "PRIMARY_DECISION"], ["estimated_hidden_factory_loss", "Ideal-Capacity Opportunity Loss", "currency", "BUSINESS_IMPACT"]],
  "takt-time-cycle-time": [["takt_time_seconds", "Takt Time", "s/unit", "SECONDARY_METRIC"], ["effective_cycle_seconds", "Uptime-Adjusted Cycle Time", "s/unit", "SECONDARY_METRIC"], ["capacity_gap_seconds", "Cycle-to-Takt Gap", "s/unit", "PRIMARY_DECISION"], ["capacity_units", "Available-Time Capacity", "units", "BUSINESS_IMPACT"]],
  "rework-vs-scrap-decision": [["expected_rework_cost", "Expected Rework Path Cost", "currency", "SECONDARY_METRIC"], ["immediate_scrap_cost", "Immediate Scrap Path Cost", "currency", "BUSINESS_IMPACT"], ["decision_delta", "Scrap Cost Minus Expected Rework Cost", "currency", "PRIMARY_DECISION"]],
  "welding-cost-per-meter": [["minutes_per_meter", "Elapsed Minutes per Meter", "min/m", "SECONDARY_METRIC"], ["welding_cost_per_meter", "Welding Cost per Meter", "currency/m", "PRIMARY_DECISION"], ["consumable_cost_share", "Consumable Cost Share", "ratio", "BUSINESS_IMPACT"]],
  "welding-heat-input": [["heat_input_kj_mm", "Net Heat Input", "kJ/mm", "PRIMARY_DECISION"], ["heat_input_limit_utilization", "User-Verified Limit Utilization", "ratio", "BUSINESS_IMPACT"]],
  "electricity-co2-emissions": [["electricity_emissions_kgco2e", "Residual Electricity Emissions", "kgCO2e", "SECONDARY_METRIC"], ["electricity_emissions_tco2e", "Residual Electricity Emissions", "tCO2e", "PRIMARY_DECISION"], ["evidence_confidence_index", "Evidence Confidence", "ratio", "BUSINESS_IMPACT"]],
  "diesel-fuel-co2-emissions": [["fuel_emissions_kgco2e", "Fuel Emissions", "kgCO2e", "SECONDARY_METRIC"], ["fuel_emissions_tco2e", "Fuel Emissions", "tCO2e", "PRIMARY_DECISION"], ["emission_intensity_kgco2e_ton_km", "Payload Emission Intensity", "kgCO2e/ton-km", "BUSINESS_IMPACT"]],
  "product-carbon-footprint-basic": [["total_allocated_emissions_kgco2e", "Total User-Allocated Emissions", "kgCO2e", "SECONDARY_METRIC"], ["good_units_after_scrap", "Good Units after Scrap", "units", "SECONDARY_METRIC"], ["product_footprint_kgco2e", "Allocated Product Footprint", "kgCO2e/unit", "PRIMARY_DECISION"]],
  "rebar-weight-count": [["kg_per_meter", "Nominal Mass per Meter (d2/162)", "kg/m", "SECONDARY_METRIC"], ["rebar_weight_kg", "Nominal Rebar Order Weight", "kg", "PRIMARY_DECISION"], ["rebar_material_cost", "Rebar Material Cost", "currency", "BUSINESS_IMPACT"]],
  "steel-weight": [["net_steel_weight_kg", "Net Section Weight", "kg", "SECONDARY_METRIC"], ["gross_steel_weight_with_waste_kg", "Gross Weight with Waste", "kg", "PRIMARY_DECISION"], ["steel_material_cost", "Steel Material Cost", "currency", "BUSINESS_IMPACT"]],
  "weld-metal-weight-consumable": [["deposited_weld_metal_kg", "Deposited Weld Metal", "kg", "SECONDARY_METRIC"], ["purchased_consumable_kg", "Purchased Consumable Requirement", "kg", "PRIMARY_DECISION"], ["weld_consumable_cost", "Weld Consumable Cost", "currency", "BUSINESS_IMPACT"]],
  "bolt-torque": [["tightening_torque_nm", "Nominal Tightening Torque", "N*m", "PRIMARY_DECISION"], ["estimated_lower_clamp_kn", "Estimated Lower Preload", "kN", "BUSINESS_IMPACT"], ["estimated_upper_clamp_kn", "Estimated Upper Preload", "kN", "SECONDARY_METRIC"]],
  "bolt-preload-clamp-force": [["initial_preload_kn", "Initial Target Preload", "kN", "SECONDARY_METRIC"], ["residual_clamp_force_kn", "Conservative Residual Clamp Force", "kN", "BUSINESS_IMPACT"], ["joint_separation_margin_kn", "Conservative Joint Separation Margin", "kN", "PRIMARY_DECISION"], ["proof_load_utilization", "Proof Load Utilization", "ratio", "SECONDARY_METRIC"]],
  "beam-load-deflection-quick-check": [["bending_stress_utilization", "Elastic Bending Stress Utilization", "ratio", "SECONDARY_METRIC"], ["deflection_m", "Midspan Elastic Deflection", "m", "BUSINESS_IMPACT"], ["deflection_utilization", "Deflection Limit Utilization", "ratio", "PRIMARY_DECISION"]],
  "surface-roughness-converter": [["roughness_ra_um", "Entered Ra", "um", "PRIMARY_DECISION"], ["roughness_rz_um", "User-Ratio Rz Approximation", "um", "SECONDARY_METRIC"], ["roughness_rms_um", "User-Ratio RMS Approximation", "um", "SECONDARY_METRIC"]],
  "tap-drill-size": [["tap_drill_diameter_mm", "Screening Tap-Drill Diameter", "mm", "PRIMARY_DECISION"], ["thread_engagement_index", "Pitch-Based Engagement Index", "ratio", "BUSINESS_IMPACT"]],
  "thread-dimensions-reference": [["pitch_diameter_approx_mm", "Basic-Profile Pitch Diameter Approximation", "mm", "PRIMARY_DECISION"], ["minor_diameter_approx_mm", "Basic-Profile Minor Diameter Approximation", "mm", "SECONDARY_METRIC"], ["engagement_length_ratio", "Engagement Length Ratio", "ratio", "BUSINESS_IMPACT"]],
  "iso-286-tolerance-fit": [["minimum_clearance_mm", "Minimum Clearance (Negative = Interference)", "mm", "PRIMARY_DECISION"], ["maximum_clearance_mm", "Maximum Clearance", "mm", "SECONDARY_METRIC"], ["transition_fit_risk", "Transition Fit Indicator", "0/1", "BUSINESS_IMPACT"]],
  "cbam-cost-quick-estimator": [["exposed_emissions_tco2e", "User-Scenario Exposed Emissions", "tCO2e", "SECONDARY_METRIC"], ["cbam_exposure_cost", "User-Scenario Carbon Exposure", "currency", "PRIMARY_DECISION"], ["evidence_risk_index", "Evidence Risk Index", "ratio", "BUSINESS_IMPACT"]],
});

const inputCopyOverrides: Readonly<Record<string, Readonly<Record<string, readonly [name: string, help: string]>>>> = Object.freeze({
  "machine-investment-payback": Object.freeze({
    residual_value: ["Immediate Trade-In / Disposal Credit", "Enter only a verified credit available at purchase. Do not enter a future terminal salvage value in this undiscounted simple-payback model."] as const,
  }),
  "currency-adjusted-pricing": Object.freeze({
    current_fx_rate: ["Current FX Rate (Consistent Quote Convention)", "Use the same numerator/denominator currency convention as Quote FX Rate."] as const,
    quote_fx_rate: ["Quote FX Rate (Consistent Quote Convention)", "Use the same numerator/denominator currency convention as Current FX Rate."] as const,
  }),
  "recipe-cost-menu-price": Object.freeze({
    target_food_cost_percent: ["Target Food Cost Percent", "Menu price is derived as food cost per saleable portion divided by this target. Labor and overhead remain visible in loaded cost."] as const,
  }),
  "electricity-co2-emissions": Object.freeze({
    user_verified_grid_factor_kgco2e_kwh: ["Verified Factor for Residual Electricity (kgCO2e/kWh)", "Enter a verified factor applicable to the electricity remaining after the separately entered zero-emission contractual renewable share. Do not enter a factor already reduced by that same share." ] as const,
    renewable_share_percent: ["Verified Zero-Emission Contractual Share", "Enter only a documented share whose accounting treatment supports zero emissions in this screening model." ] as const,
  }),
  "diesel-fuel-co2-emissions": Object.freeze({
    user_verified_emission_factor_kgco2e_liter: ["Verified Fuel Emission Factor (kgCO2e/liter)", "Use a factor with a documented boundary consistent with the intended screening result." ] as const,
    bio_blend_reduction_percent: ["Verified Bio-Blend Reduction", "Enter only a documented reduction not already embedded in the emission factor." ] as const,
  }),
  "product-carbon-footprint-basic": Object.freeze({
    allocated_process_emissions_kgco2e: ["Other Allocated Process Emissions", "Enter emissions allocated to the same production period and organizational boundary as Scope 1 and Scope 2 inputs." ] as const,
  }),
  "rebar-weight-count": Object.freeze({
    bar_diameter_mm: ["Nominal Bar Diameter", "The d2/162 convention produces nominal planning mass; supplier certificates and bar schedules remain controlling." ] as const,
  }),
  "bolt-torque": Object.freeze({
    nut_factor_k: ["User-Verified Nut Factor K", "Use joint-, finish-, lubrication- and process-specific test evidence. The model applies the NASA screening relation T = KFD." ] as const,
    torque_scatter_percent: ["Verified Preload Scatter", "Enter the documented preload variation for the selected torque-control process." ] as const,
  }),
  "bolt-preload-clamp-force": Object.freeze({
    external_tension_kn: ["Conservative External Separating Tension", "This screening model conservatively subtracts the full entered external tension from retained preload; joint stiffness distribution is not modeled." ] as const,
  }),
  "beam-load-deflection-quick-check": Object.freeze({
    uniform_load_kn_m: ["Full-Span Uniform Load", "Model basis: simply supported beam, full-span UDL, linear elastic small deflection; shear deformation, lateral torsional buckling and code factors are excluded." ] as const,
  }),
  "surface-roughness-converter": Object.freeze({
    rz_to_ra_ratio: ["User-Verified Rz/Ra Ratio", "This ratio is an approximation input, not a standards-table conversion. Measured drawing requirements control." ] as const,
    rms_to_ra_ratio: ["User-Verified RMS/Ra Ratio", "This ratio is an approximation input, not a standards-table conversion. Measured drawing requirements control." ] as const,
  }),
  "iso-286-tolerance-fit": Object.freeze({
    hole_lower_deviation_um: ["Controlled Hole Lower Deviation", "Enter the signed deviation from the controlled ISO 286 table or drawing; this tool does not generate tolerance classes." ] as const,
    shaft_lower_deviation_um: ["Controlled Shaft Lower Deviation", "Enter the signed deviation from the controlled ISO 286 table or drawing; this tool does not generate tolerance classes." ] as const,
  }),
  "cbam-cost-quick-estimator": Object.freeze({
    free_allocation_factor_percent: ["User-Verified Scenario Adjustment", "Enter a documented scenario adjustment. This screening tool does not generate allocation benchmarks." ] as const,
    carbon_price_per_tco2e: ["User-Entered Carbon Price Scenario", "Enter a dated scenario value. Official CBAM certificate pricing and applicable deductions remain controlling." ] as const,
  }),
  "cutting-speed-feed-rpm": Object.freeze({
    cutting_speed_m_min: ["Verified Cutting Speed", "Enter a material-, tool- and operation-specific cutting speed from controlled process evidence." ] as const,
    max_chip_load_mm: ["Verified Maximum Chip Load", "Enter the limiting chip load for the selected cutter, insert, material and engagement condition." ] as const,
  }),
  "fillet-weld-size-strength": Object.freeze({
    user_verified_allowable_stress_mpa: ["User-Verified Allowable Weld Stress", "Enter only a project- and code-specific allowable stress approved by the responsible welding engineer. This model does not derive code allowables." ] as const,
    load_angle_factor: ["User-Verified Load Direction Factor", "Enter a positive factor documented for the assessed load path; the screening capacity is divided by this factor." ] as const,
  }),
  "knurling-drill-point-depth": Object.freeze({
    drill_point_angle_deg: ["Included Drill Point Angle", "Enter the measured or specified included angle strictly between 0 and 180 degrees." ] as const,
    knurl_pitch_mm: ["Nominal Knurl Pitch", "Enter the controlled pitch. The model blocks execution if interval uncertainty crosses a nearest-tooth rounding boundary." ] as const,
  }),
  "sheet-metal-bend-allowance": Object.freeze({
    k_factor: ["User-Verified K-Factor", "Enter a decimal value from 0 to 1 established for the material, thickness, tooling and bend process. A calibrated bend test remains controlling." ] as const,
    bend_angle_deg: ["Included Bend Angle", "Enter an angle strictly between 0 and 180 degrees for this single-bend geometry model." ] as const,
  }),
  "tool-life-tool-cost-per-part": Object.freeze({
    taylor_c: ["Calibrated Taylor Constant C", "Enter the Taylor constant fitted for the same tool, work material, operation and speed-unit convention." ] as const,
    taylor_n: ["Calibrated Taylor Exponent n", "Enter a strictly positive fitted exponent. No denominator floor or substitute value is applied." ] as const,
  }),
});

function serverOutput([id, name, unit, decisionUse]: OutputDefinition): ServerOutput {
  return {
    id, name, unit, value: null, status: "REVIEW", formula_source: null,
    public_explanation: `${name} is produced by the certified server-side Decimal model.`,
    decision_use: decisionUse,
    evidence_level: "USER_VERIFIED_REQUIRED",
  };
}

export function applyCertifiedFreeCalculationContract(schema: SuperV4Schema): SuperV4Schema {
  const certification = getFreeFormulaCertification(schema.tool_key);
  const definitions = outputs[schema.tool_key];
  if (!certification || !definitions) return schema;
  const legacyPrimaryMetric = schema.decision_context?.primary_metric;
  const certifiedPrimaryMetric = definitions.find((definition) => definition[3] === "PRIMARY_DECISION")?.[0] ?? definitions[0][0];
  const copyOverrides = inputCopyOverrides[schema.tool_key] ?? {};
  schema.inputs = schema.inputs.map((input) => {
    const copy = copyOverrides[input.id];
    return copy ? { ...input, name: copy[0], user_help_text: copy[1], help_text: copy[1] } : input;
  });
  schema.outputs = definitions.map(serverOutput);
  if (typeof legacyPrimaryMetric === "string" && legacyPrimaryMetric !== certifiedPrimaryMetric) {
    schema.formulas = schema.formulas.map((formula) =>
      formula.output === legacyPrimaryMetric
        ? { ...formula, output: certifiedPrimaryMetric }
        : formula,
    );
  }
  schema.metadata.formula_version = certification.formulaVersion;
  schema.calculation_basis = {
    ...schema.calculation_basis,
    model_id: certification.modelId,
    arithmetic_mode: certification.arithmeticMode,
  };
  schema.decision_context = {
    ...schema.decision_context,
    primary_metric: certifiedPrimaryMetric,
    secondary_metrics: definitions.filter((definition) => definition[3] !== "PRIMARY_DECISION").map((definition) => definition[0]),
  };
  return schema;
}

export function getCertifiedFreeOutputIds(toolKey: string): readonly string[] | null {
  const definitions = outputs[toolKey];
  return definitions ? definitions.map((definition) => definition[0]) : null;
}
