export const FREE_DECIMAL_ARITHMETIC_MODE = "DECIMAL_BIGJS_50_HALF_EVEN" as const;
export const FREE_INTERVAL_ARITHMETIC_MODE = "MPMATH_IV_OUTWARD_EXACT_BOUNDS" as const;

export type FreeArithmeticMode =
  | typeof FREE_DECIMAL_ARITHMETIC_MODE
  | typeof FREE_INTERVAL_ARITHMETIC_MODE;

export interface FreeFormulaCertification {
  readonly toolKey: string;
  readonly formulaVersion: string;
  readonly modelId: string;
  readonly arithmeticMode: FreeArithmeticMode;
  readonly evidencePath: string;
  readonly sourceRefs: readonly string[];
}

type CertificationRecord = readonly [
  toolKey: string,
  formulaVersion: string,
  modelId: string,
  sourceRefs?: readonly string[],
  arithmeticMode?: FreeArithmeticMode,
];

const records: readonly CertificationRecord[] = [
  ["downtime-cost", "2.0.0", "FREE_DOWNTIME_LOSS_V2"],
  ["energy-cost-per-part", "2.0.0", "FREE_ENERGY_COST_PER_PART_V2"],
  ["quote-margin-markup", "2.0.0", "FREE_QUOTE_MARGIN_MARKUP_V2"],
  ["concrete-volume-order-quantity", "2.0.0", "FREE_CONCRETE_ORDER_QUANTITY_V2"],
  ["pallet-container-load-cbm", "2.0.0", "FREE_VOLUMETRIC_LOAD_UTILIZATION_V2"],
  ["scrap-cost", "2.0.0", "FREE_SCRAP_NET_LOSS_V2"],
  ["setup-time-cost", "2.0.0", "FREE_SETUP_COST_ALLOCATION_V2"],
  ["line-balancing-efficiency", "2.0.0", "FREE_LINE_BALANCE_V2"],
  ["electric-motor-running-cost", "2.0.0", "FREE_MOTOR_RUNNING_COST_V2"],
  ["inventory-carrying-cost", "2.0.0", "FREE_INVENTORY_CARRYING_COST_V2"],
  ["freight-cost-per-km-trip", "2.0.0", "FREE_FREIGHT_TRIP_COST_V2"],
  ["true-employee-cost", "2.0.0", "FREE_LOADED_EMPLOYEE_COST_V2"],
  ["break-even-point", "2.0.0", "FREE_CONTRIBUTION_BREAK_EVEN_V2"],
  ["customer-profitability", "2.0.0", "FREE_CUSTOMER_PROFITABILITY_V2"],
  ["machining-cost-per-part", "2.0.0", "FREE_MACHINING_COST_PER_PART_V2"],
  ["cnc-shop-hourly-rate", "2.0.0", "FREE_CNC_SHOP_RATE_V2"],
  ["material-removal-rate", "2.0.0", "FREE_MATERIAL_REMOVAL_RATE_V2"],
  ["compressed-air-leak-cost", "2.0.0", "FREE_COMPRESSED_AIR_LEAK_COST_V2"],
  ["carbon-price-exposure", "2.0.0", "FREE_CARBON_PRICE_EXPOSURE_V2"],
  ["payment-term-cost", "2.0.0", "FREE_PAYMENT_TERM_SIMPLE_365_EXPECTED_LOSS_V2"],
  ["machine-investment-payback", "2.0.0", "FREE_NET_CAPITAL_SIMPLE_PAYBACK_V2"],
  ["currency-adjusted-pricing", "2.0.0", "FREE_SAME_CONVENTION_FX_QUOTE_V2"],
  ["eoq", "2.0.0", "FREE_CLASSICAL_EOQ_V2"],
  ["safety-stock-reorder-point", "2.0.0", "FREE_INDEPENDENT_DEMAND_LEADTIME_VARIANCE_V2"],
  ["recipe-cost-menu-price", "2.0.0", "FREE_RECIPE_YIELD_FOOD_COST_PRICING_V2"],
  ["fabric-consumption-gsm", "2.0.0", "FREE_MARKER_SHRINKAGE_FABRIC_CONSUMPTION_V2"],
  ["oee", "2.0.0", "FREE_OEE_IDEAL_CAPACITY_LOSS_V2"],
  ["takt-time-cycle-time", "2.0.0", "FREE_TAKT_EFFECTIVE_CYCLE_CAPACITY_V2"],
  ["rework-vs-scrap-decision", "2.0.0", "FREE_EXPECTED_REWORK_VS_SCRAP_V2"],
  ["welding-cost-per-meter", "2.0.0", "FREE_WELDING_ARC_ON_COST_PER_METER_V2"],
  ["welding-heat-input", "2.0.0", "FREE_WELDING_NET_HEAT_INPUT_V2"],
  ["electricity-co2-emissions", "2.0.0", "FREE_USER_FACTOR_RESIDUAL_ELECTRICITY_EMISSIONS_V2"],
  ["diesel-fuel-co2-emissions", "2.0.0", "FREE_USER_FACTOR_FUEL_EMISSIONS_INTENSITY_V2"],
  ["product-carbon-footprint-basic", "2.0.0", "FREE_ALLOCATED_PRODUCT_FOOTPRINT_V2"],
  ["rebar-weight-count", "2.0.0", "FREE_NOMINAL_REBAR_D2_OVER_162_V2"],
  ["steel-weight", "2.0.0", "FREE_USER_DENSITY_SECTION_MASS_V2"],
  ["weld-metal-weight-consumable", "2.0.0", "FREE_WELD_DEPOSIT_EFFICIENCY_MASS_V2"],
  ["bolt-torque", "2.0.0", "FREE_USER_NUT_FACTOR_TORQUE_PRELOAD_V2", ["https://www.nasa.gov/wp-content/uploads/2018/01/nasa-std-5020a_w-chg_1_nasa_fastener_standards.pdf"]],
  ["bolt-preload-clamp-force", "2.0.0", "FREE_CONSERVATIVE_CLAMP_SEPARATION_MARGIN_V2", ["https://www.nasa.gov/wp-content/uploads/2018/01/nasa-std-5020a_w-chg_1_nasa_fastener_standards.pdf"]],
  ["beam-load-deflection-quick-check", "2.0.0", "FREE_SIMPLY_SUPPORTED_UDL_ELASTIC_BEAM_V2", ["https://ntrs.nasa.gov/api/citations/20120007195/downloads/20120007195.pdf"]],
  ["surface-roughness-converter", "2.0.0", "FREE_USER_RATIO_ROUGHNESS_APPROXIMATION_V2"],
  ["tap-drill-size", "2.0.0", "FREE_METRIC_PITCH_TAP_DRILL_SCREENING_V2"],
  ["thread-dimensions-reference", "2.0.0", "FREE_ISO_METRIC_BASIC_PROFILE_APPROXIMATION_V2"],
  ["iso-286-tolerance-fit", "2.0.0", "FREE_USER_DEVIATION_LIMIT_FIT_V2", ["https://www.iso.org/standard/45975.html"]],
  ["cbam-cost-quick-estimator", "2.0.0", "FREE_USER_SCENARIO_CBAM_EXPOSURE_NONCOMPLIANCE_V2", ["https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism/cbam-legislation-and-guidance_en"]],
  ["cutting-speed-feed-rpm", "2.0.0", "FREE_INTERVAL_CUTTING_SPEED_FEED_SCREENING_V2", [], FREE_INTERVAL_ARITHMETIC_MODE],
  ["fillet-weld-size-strength", "2.0.0", "FREE_INTERVAL_USER_ALLOWABLE_FILLET_WELD_SCREENING_V2", [], FREE_INTERVAL_ARITHMETIC_MODE],
  ["knurling-drill-point-depth", "2.0.0", "FREE_INTERVAL_KNURL_DRILL_GEOMETRY_V2", [], FREE_INTERVAL_ARITHMETIC_MODE],
  ["sheet-metal-bend-allowance", "2.0.0", "FREE_INTERVAL_USER_K_FACTOR_BEND_GEOMETRY_V2", [], FREE_INTERVAL_ARITHMETIC_MODE],
  ["tool-life-tool-cost-per-part", "2.0.0", "FREE_INTERVAL_TAYLOR_TOOL_LIFE_COST_V2", [], FREE_INTERVAL_ARITHMETIC_MODE],
];

export const FREE_FORMULA_CERTIFICATIONS: Readonly<Record<string, FreeFormulaCertification>> =
  Object.freeze(Object.fromEntries(records.map(([
    toolKey,
    formulaVersion,
    modelId,
    sourceRefs = [],
    arithmeticMode = FREE_DECIMAL_ARITHMETIC_MODE,
  ]) => [
    toolKey,
    Object.freeze({
      toolKey,
      formulaVersion,
      modelId,
      arithmeticMode,
      evidencePath: "tests/free-tools/certified-free-tools.property.test.ts",
      sourceRefs: Object.freeze([...sourceRefs]),
    }),
  ])));

export const CERTIFIED_FREE_TOOL_SLUGS = Object.freeze(
  Object.keys(FREE_FORMULA_CERTIFICATIONS).sort(),
);

export const CERTIFIED_DECIMAL_FREE_TOOL_SLUGS = Object.freeze(
  CERTIFIED_FREE_TOOL_SLUGS.filter(
    (toolKey) => FREE_FORMULA_CERTIFICATIONS[toolKey].arithmeticMode === FREE_DECIMAL_ARITHMETIC_MODE,
  ),
);

export const CERTIFIED_INTERVAL_FREE_TOOL_SLUGS = Object.freeze(
  CERTIFIED_FREE_TOOL_SLUGS.filter(
    (toolKey) => FREE_FORMULA_CERTIFICATIONS[toolKey].arithmeticMode === FREE_INTERVAL_ARITHMETIC_MODE,
  ),
);

export function getFreeFormulaCertification(toolKey: string): FreeFormulaCertification | null {
  return FREE_FORMULA_CERTIFICATIONS[toolKey] ?? null;
}

export function isCertifiedIntervalFreeTool(toolKey: string): boolean {
  return getFreeFormulaCertification(toolKey)?.arithmeticMode === FREE_INTERVAL_ARITHMETIC_MODE;
}
