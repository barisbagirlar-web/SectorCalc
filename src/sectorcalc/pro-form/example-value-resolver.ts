// SectorCalc — Industrial Example Value Resolver V1
// Central resolver for industrially sensible initial/example input values.
// Uses tool-specific maps, schema defaults, semantic heuristics, and range fallbacks.
// Never hardcodes values inside JSX.
// Never replaces the schema default_value system — only supplements it.

type ExamplePrimitive = number | string;

export interface IndustrialExampleValueContext {
  toolSlug?: string | null;
  toolKey?: string | null;
  inputId: string;
  inputName?: string | null;
  unit?: string | null;
  rangeMin?: number | null;
  rangeMax?: number | null;
  schemaExampleValue?: unknown;
  schemaDefaultValue?: unknown;
}

// ── Tool-specific example value overrides ─────────────────────────────────
// Keyed by tool slug → input id → value.
// Highest priority — overrides schema defaults and heuristics.
// Slugs must match free-tools-manifest.ts exactly.
const TOOL_EXAMPLE_VALUES: Record<string, Record<string, ExamplePrimitive>> = {
  "machining-cost-per-part": {
    batch_quantity: 500,
    cycle_seconds: 180,
    edge_life_parts: 200,
    labor_hourly_rate: 45,
    machine_hourly_rate: 85,
    material_cost_per_blank: 4.5,
    overhead_percent: 15,
    scrap_percent: 3,
    setup_minutes: 30,
    target_margin_percent: 20,
    tooling_cost_per_edge: 12,
  },

  "cnc-shop-hourly-rate": {
    annual_admin_allocation: 15000,
    annual_available_machine_hours: 4000,
    annual_depreciation: 18000,
    annual_fixed_cost: 12000,
    annual_floor_cost: 8000,
    annual_maintenance_cost: 6000,
    annual_operator_cost: 55000,
    average_power_kw: 25,
    consumables_per_hour: 3.5,
    current_shop_rate: 95,
    electricity_rate: 0.12,
    utilization_percent: 75,
  },

  "cutting-speed-feed-rpm": {
    cutting_speed_m_min: 180,
    feed_per_tooth_mm: 0.08,
    max_chip_load_mm: 0.15,
    number_of_teeth: 4,
    tool_diameter_mm: 20,
  },

  "tap-drill-size": {
    major_diameter_mm: 12,
    material_allowance_mm: 0.25,
    plating_allowance_mm: 0.05,
    thread_pitch_mm: 1.75,
  },

  "iso-286-tolerance-fit": {
    hole_lower_deviation_um: 0,
    hole_upper_deviation_um: 25,
    nominal_diameter_mm: 50,
    shaft_lower_deviation_um: -25,
    shaft_upper_deviation_um: 0,
  },

  "surface-roughness-converter": {
    ra_um: 1.6,
    rms_to_ra_ratio: 1.11,
    rz_to_ra_ratio: 6.0,
  },

  "material-removal-rate": {
    depth_of_cut_mm: 3,
    feed_rate_mm_min: 500,
    machine_hourly_rate: 85,
    material_density_kg_m3: 7850,
    width_of_cut_mm: 50,
  },

  "tool-life-tool-cost-per-part": {
    cutting_speed_m_min: 150,
    cutting_time_seconds_per_part: 120,
    edge_cost: 8,
    machine_hourly_rate: 85,
    taylor_c: 350,
    taylor_n: 0.25,
    tool_change_minutes: 5,
  },

  "scrap-cost": {
    conversion_cost_per_unit: 12,
    material_cost_per_unit: 8.5,
    produced_quantity: 10000,
    reinspection_cost_per_scrap: 2,
    salvage_value_per_unit: 1.5,
    scrap_quantity: 350,
  },

  "rework-vs-scrap-decision": {
    delivery_penalty_cost: 5000,
    reinspection_cost: 3,
    rework_labor_cost: 15,
    rework_material_cost: 6,
    rework_success_probability_percent: 80,
    scrap_replacement_cost: 25,
    scrap_salvage_credit: 3,
  },

  "thread-dimensions-reference": {
    allowance_mm: 0.038,
    engagement_length_mm: 18,
    major_diameter_mm: 12,
    pitch_mm: 1.75,
  },

  "knurling-drill-point-depth": {
    drill_diameter_mm: 8.5,
    drill_point_angle_deg: 118,
    knurl_pitch_mm: 1.0,
    workpiece_diameter_mm: 20,
  },

  "weld-metal-weight-consumable": {
    consumable_cost_per_kg: 6.5,
    deposit_density_kg_m3: 7850,
    deposition_efficiency_percent: 85,
    weld_cross_section_area_mm2: 50,
    weld_length_m: 2,
  },

  "weld-procedure-cost-consumable-estimation-suite": {
    weld_length_m: 12,
    weld_throat_mm: 6,
    weld_density: 7.85,
    wire_cost_per_kg: 4.2,
    gas_cost_per_min: 0.18,
    arc_time_min: 45,
    weld_time_min: 60,
    labor_rate: 55,
    overhead_rate: 25,
    deposition_efficiency: 85,
    source_confidence: 0.8,
  },

  "fillet-weld-size-strength": {
    applied_load_kn: 50,
    effective_weld_length_mm: 200,
    fillet_leg_size_mm: 8,
    load_angle_factor: 1.0,
    user_verified_allowable_stress_mpa: 150,
  },

  "welding-cost-per-meter": {
    arc_on_ratio_percent: 70,
    consumable_cost_per_kg: 6.5,
    consumable_kg_per_meter: 0.35,
    energy_cost_per_meter: 0.05,
    labor_hourly_rate: 55,
    machine_hourly_rate: 40,
    shielding_gas_cost_per_meter: 0.08,
    travel_speed_mm_min: 300,
  },

  "welding-heat-input": {
    arc_voltage_v: 28,
    process_efficiency_percent: 80,
    travel_speed_mm_min: 300,
    user_verified_max_heat_input_kj_mm: 2.5,
    welding_current_a: 250,
  },

  "bolt-torque": {
    desired_preload_kn: 150,
    nominal_diameter_mm: 24,
    nut_factor_k: 0.2,
    torque_scatter_percent: 10,
  },

  "bolt-preload-clamp-force": {
    external_tension_kn: 80,
    joint_settlement_loss_percent: 5,
    target_preload_percent: 75,
    user_verified_proof_load_kn: 200,
  },

  "steel-weight": {
    cross_section_area_mm2: 5000,
    density_kg_m3: 7850,
    length_m: 6,
    material_cost_per_kg: 1.2,
    waste_percent: 5,
  },

  "beam-load-deflection-quick-check": {
    deflection_limit_ratio: 360,
    elastic_modulus_gpa: 200,
    second_moment_area_cm4: 5000,
    section_modulus_cm3: 400,
    span_m: 5,
    uniform_load_kn_m: 15,
    user_verified_yield_stress_mpa: 250,
  },

  "sheet-metal-bend-allowance": {
    bend_angle_deg: 90,
    flange_a_mm: 30,
    flange_b_mm: 40,
    inside_radius_mm: 2,
    k_factor: 0.33,
    material_thickness_mm: 2,
  },

  "oee": {
    contribution_margin_per_good_unit: 5,
    downtime_minutes: 45,
    good_count: 850,
    ideal_cycle_seconds: 30,
    planned_production_minutes: 480,
    total_count: 950,
  },

  "downtime-cost": {
    contribution_margin_per_unit: 15,
    delivery_penalty_cost: 2000,
    downtime_hours: 4,
    idle_labor_cost_per_hour: 45,
    planned_units_per_hour: 60,
    repair_cost: 1500,
  },

  "takt-time-cycle-time": {
    actual_cycle_seconds: 55,
    available_production_minutes: 450,
    customer_demand_units: 500,
    expected_uptime_percent: 92,
  },

  "setup-time-cost": {
    batch_quantity: 200,
    changeovers_per_month: 8,
    labor_hourly_rate: 45,
    machine_hourly_rate: 85,
    setup_minutes: 45,
    target_setup_cost_per_part: 0.5,
  },

  "line-balancing-efficiency": {
    labor_cost_per_hour_per_station: 40,
    line_cycle_time_seconds: 60,
    number_of_stations: 8,
    shift_hours: 8,
    total_task_time_seconds: 420,
  },

  "compressed-air-leak-cost": {
    annual_operating_hours: 6000,
    compressor_specific_power_kw_per_cfm: 0.18,
    electricity_rate: 0.12,
    estimated_leak_flow_cfm: 50,
    estimated_repair_cost: 180,
  },

  "electric-motor-running-cost": {
    electricity_rate: 0.12,
    load_factor_percent: 75,
    motor_efficiency_percent: 92,
    motor_power_kw: 50,
    operating_hours: 4000,
  },

  "energy-cost-per-part": {
    auxiliary_kwh_per_part: 0.05,
    average_machine_power_kw: 25,
    batch_idle_kwh: 2.5,
    cycle_seconds_per_part: 180,
    electricity_rate: 0.12,
    parts_per_batch: 500,
  },

  "cbam-cost-quick-estimator": {
    carbon_price_per_tco2e: 90,
    embedded_emission_tco2e_per_ton: 1.5,
    evidence_confidence_percent: 70,
    export_product_mass_ton: 20,
    free_allocation_factor_percent: 60,
  },

  "electricity-co2-emissions": {
    electricity_kwh: 100000,
    evidence_confidence_percent: 90,
    renewable_share_percent: 15,
    user_verified_grid_factor_kgco2e_kwh: 0.45,
  },

  "diesel-fuel-co2-emissions": {
    bio_blend_reduction_percent: 5,
    fuel_volume_liters: 10000,
    payload_ton_km: 500,
    user_verified_emission_factor_kgco2e_liter: 2.68,
  },

  "product-carbon-footprint-basic": {
    allocated_process_emissions_kgco2e: 5000,
    production_units: 10000,
    scope1_emissions_kgco2e: 8000,
    scope2_emissions_kgco2e: 12000,
    scrap_rate_percent: 3,
  },

  "carbon-price-exposure": {
    base_carbon_price: 80,
    customer_pass_through_percent: 40,
    exposed_emissions_tco2e: 5000,
    high_carbon_price: 120,
    low_carbon_price: 50,
  },

  "true-employee-cost": {
    employer_tax_percent: 22,
    gross_salary: 55000,
    monthly_benefits_cost: 500,
    monthly_insurance_cost: 800,
    monthly_overtime_cost: 300,
    monthly_productive_hours: 160,
    monthly_severance_accrual: 200,
  },

  "quote-margin-markup": {
    commission_percent: 5,
    direct_cost: 4500,
    minimum_margin_percent: 15,
    overhead_cost: 800,
    risk_allowance: 300,
    selling_price: 7500,
  },

  "break-even-point": {
    expected_sales_units: 500,
    monthly_fixed_cost: 12000,
    selling_price_per_unit: 85,
    target_monthly_profit: 5000,
    variable_cost_per_unit: 52,
  },

  "payment-term-cost": {
    annual_finance_rate_percent: 8,
    cash_discount_percent: 2,
    default_risk_percent: 1.5,
    invoice_amount: 50000,
    payment_term_days: 60,
  },

  "machine-investment-payback": {
    annual_extra_margin: 35000,
    annual_incremental_maintenance: 3000,
    annual_labor_savings: 25000,
    annual_scrap_savings: 8000,
    installation_cost: 12000,
    machine_capex: 180000,
    maximum_payback_months: 36,
    residual_value: 20000,
  },

  "customer-profitability": {
    customer_revenue: 250000,
    logistics_cost: 25000,
    payment_delay_cost: 5000,
    product_cost: 140000,
    return_rework_cost: 8000,
    sales_support_cost: 15000,
    service_cost: 12000,
  },

  "currency-adjusted-pricing": {
    base_cost_local_currency: 100,
    current_fx_rate: 1.10,
    freight_cost_local_currency: 8,
    fx_buffer_percent: 3,
    quote_fx_rate: 1.05,
    target_margin_percent: 20,
  },

  "eoq": {
    annual_carrying_rate_percent: 25,
    annual_demand_units: 10000,
    ordering_cost_per_order: 150,
    unit_cost: 25,
  },

  "safety-stock-reorder-point": {
    average_daily_demand: 200,
    daily_demand_std_dev: 40,
    lead_time_days: 7,
    lead_time_std_dev_days: 2,
    service_level_z_score: 1.65,
  },

  "inventory-carrying-cost": {
    annual_storage_cost: 15000,
    average_inventory_value: 500000,
    capital_cost_percent: 8,
    insurance_tax_percent: 2,
    obsolescence_percent: 3,
    shrinkage_percent: 1.5,
  },

  "pallet-container-load-cbm": {
    container_capacity_cbm: 33,
    item_height_m: 0.3,
    item_length_m: 0.6,
    item_quantity: 500,
    item_width_m: 0.4,
    void_allowance_percent: 10,
  },

  "freight-cost-per-km-trip": {
    distance_km: 500,
    economic_minimum_units: 500,
    fixed_trip_cost: 200,
    fuel_surcharge_percent: 8,
    rate_per_km: 1.5,
    units_shipped: 1000,
    waiting_cost: 50,
  },

  "concrete-volume-order-quantity": {
    concrete_cost_per_m3: 120,
    depth_m: 0.3,
    length_m: 10,
    truck_capacity_m3: 8,
    waste_percent: 5,
    width_m: 5,
  },

  "rebar-weight-count": {
    bar_count: 50,
    bar_diameter_mm: 16,
    bar_length_m: 6,
    lap_waste_percent: 3,
    rebar_cost_per_kg: 0.85,
  },

  "recipe-cost-menu-price": {
    batch_yield_portions: 20,
    ingredient_cost_per_batch: 45,
    kitchen_waste_percent: 5,
    labor_cost_per_portion: 3.5,
    overhead_cost_per_portion: 2,
    target_food_cost_percent: 30,
  },

  "fabric-consumption-gsm": {
    fabric_cost_per_kg: 8,
    fabric_gsm: 200,
    garment_area_m2: 1.5,
    marker_efficiency_percent: 85,
    shrinkage_percent: 3,
  },
};

// ── Internal helpers ──────────────────────────────────────────────────────

function normalizeKey(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
}

function normalizeText(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = value.trim().replace(",", ".");
    if (!n) return null;
    const parsed = Number(n);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isInsideRange(
  value: number,
  min?: number | null,
  max?: number | null,
): boolean {
  if (typeof min === "number" && Number.isFinite(min) && value < min) return false;
  if (typeof max === "number" && Number.isFinite(max) && value > max) return false;
  return true;
}

/** Round a value to a "nice" industrial number for display as an example. */
function niceNumber(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const abs = Math.abs(value);
  if (abs === 0) return 0;
  if (abs < 1) return Number(value.toFixed(3));
  if (abs < 10) return Number(value.toFixed(2));
  if (abs < 100) return Math.round(value);
  if (abs < 1000) return Math.round(value / 5) * 5;
  if (abs < 10000) return Math.round(value / 50) * 50;
  if (abs < 100000) return Math.round(value / 500) * 500;
  if (abs < 1000000) return Math.round(value / 5000) * 5000;
  return Math.round(value / 10000) * 10000;
}

/** Derive a candidate from physical range bounds when nothing else is available. */
function rangeFallback(min?: number | null, max?: number | null): number | null {
  const hasMin = typeof min === "number" && Number.isFinite(min);
  const hasMax = typeof max === "number" && Number.isFinite(max);

  if (!hasMin && !hasMax) return null;
  if (hasMin && !hasMax) return niceNumber(Math.max(1, min as number));
  if (!hasMin && hasMax) return niceNumber((max as number) * 0.1);

  const rMin = min as number;
  const rMax = max as number;

  if (rMax <= rMin) return niceNumber(rMin);
  if (rMin > 0 && rMax / rMin > 100) return niceNumber(Math.sqrt(rMin * rMax));
  if (rMin === 0 && rMax > 0) return niceNumber(rMax * 0.1);

  return niceNumber(rMin + (rMax - rMin) * 0.35);
}

/**
 * Semantic heuristics based on input id, name, and unit.
 * Only fires when no tool-specific, schema example, or schema default is available.
 */
function semanticFallback(ctx: IndustrialExampleValueContext): number | string | null {
  const id = normalizeText(ctx.inputId);
  const name = normalizeText(ctx.inputName);
  const unit = normalizeText(ctx.unit);
  const text = `${id} ${name} ${unit}`;

  // Energy / electricity
  if (text.includes("electricity") && text.includes("kwh")) return 0.15;
  if (text.includes("energy") && text.includes("price")) return 0.15;
  if (text.includes("cost_per_kwh") || text.includes("cost per kwh")) return 0.15;
  if (text.includes("usd_per_kwh") || text.includes("usd/kwh")) return 0.15;

  // Pressure
  if (text.includes("pressure") && (text.includes("bar") || text.includes("bar_g"))) return 7;

  // Diameter / orifice
  if ((text.includes("diameter") || text.includes("orifice")) && text.includes("mm")) return 3;

  // Operating hours
  if (text.includes("operating") && (text.includes("hour") || text.includes("h/"))) return 6000;
  if (text.includes("hours_per_year") || text.includes("h/year") || text.includes("h_per_year")) return 6000;

  // Compressor specific power
  if (text.includes("specific") && text.includes("power")) return 6.5;
  if (text.includes("kw_per_m3_min") || text.includes("kw/(m³/min)")) return 6.5;

  // Repair cost
  if (text.includes("repair") && (text.includes("cost") || text.includes("price"))) return 180;

  // Fixed cost
  if (text.includes("fixed") && text.includes("cost")) return 12000;

  // Selling price
  if (text.includes("selling") && text.includes("price")) return 85;

  // Variable cost
  if (text.includes("variable") && text.includes("cost")) return 52;

  // Sales units
  if (text.includes("sales") && text.includes("unit")) return 520;

  // Generic quantity/count/units
  if (text.includes("quantity") || text.includes("count") || (text.includes("units") && !text.includes("sales"))) return 1000;

  // Rate or percentage
  if (text.includes("percent") || text.includes("%") || text.includes("rate")) return 75;
  if (text.includes("efficiency") || text.includes("yield")) return 85;

  // Temperature
  if (text.includes("temperature")) return 25;

  // Density
  if (text.includes("density") && (text.includes("steel") || text.includes("iron"))) return 7850;
  if (text.includes("density")) return 1000;

  // Length / dimension
  if (text.includes("length") && text.includes("mm")) return 1000;
  if (text.includes("width") && text.includes("mm")) return 500;
  if (text.includes("height") && text.includes("mm")) return 500;
  if (text.includes("thickness") && text.includes("mm")) return 10;

  // Generic currency-denominated cost
  if (text.includes("currency") || text.includes("cost") || text.includes("price")) return 1000;

  return null;
}

/** Validate a candidate against range and return it if suitable. */
function pickValidCandidate(
  value: unknown,
  min?: number | null,
  max?: number | null,
): ExamplePrimitive | null {
  const numeric = toFiniteNumber(value);
  if (numeric !== null && isInsideRange(numeric, min, max)) return numeric;
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Resolve an industrially sensible example value for a calculator input.
 *
 * Precedence (highest first):
 * 1. Tool-specific override map
 * 2. Schema example value (if valid and in range)
 * 3. Schema default value (if valid and in range)
 * 4. Unit/input semantic heuristic
 * 5. Reference range heuristic
 * 6. Safe fallback empty string
 */
export function resolveIndustrialExampleValue(
  ctx: IndustrialExampleValueContext,
): ExamplePrimitive | "" {
  const slug = normalizeKey(ctx.toolSlug);
  const key = normalizeKey(ctx.toolKey);
  const inputId = String(ctx.inputId ?? "");

  // Priority 1: Tool-specific override
  const toolOverride =
    TOOL_EXAMPLE_VALUES[slug]?.[inputId] ??
    TOOL_EXAMPLE_VALUES[key]?.[inputId];
  const override = pickValidCandidate(toolOverride, ctx.rangeMin, ctx.rangeMax);
  if (override !== null) return override;

  // Priority 2: Schema example value
  const schemaExample = pickValidCandidate(ctx.schemaExampleValue, ctx.rangeMin, ctx.rangeMax);
  if (schemaExample !== null) return schemaExample;

  // Priority 3: Schema default value
  const schemaDefault = pickValidCandidate(ctx.schemaDefaultValue, ctx.rangeMin, ctx.rangeMax);
  if (schemaDefault !== null) return schemaDefault;

  // Priority 4: Semantic heuristic
  const semantic = pickValidCandidate(semanticFallback(ctx), ctx.rangeMin, ctx.rangeMax);
  if (semantic !== null) return semantic;

  // Priority 5: Range heuristic
  const ranged = rangeFallback(ctx.rangeMin, ctx.rangeMax);
  if (ranged !== null && isInsideRange(ranged, ctx.rangeMin, ctx.rangeMax)) {
    return ranged;
  }

  // Priority 6: Fallback empty — caller decides what to do
  return "";
}
