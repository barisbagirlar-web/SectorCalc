// SectorCalc Free V5.3.1 Public-Safe Tool Manifest
// This file is fs-free and contains NO formulas, NO private registry,
// NO schema contract body, NO internal trace.
// Only public-safe route metadata for sitemap, catalog, and routing use.

export interface FreeToolManifestEntry {
  slug: string;
  toolKey: string;
  toolName: string;
  route: string;
  accessTier: "FREE";
}

const FREE_TOOLS: FreeToolManifestEntry[] = [
  { slug: "2d_inverse_kinematics_calculator", toolKey: "2d_inverse_kinematics_calculator", toolName: "2d Inverse Kinematics Calculator", route: "/tools/free/2d_inverse_kinematics_calculator", accessTier: "FREE" },
  { slug: "abc_classification_calculator", toolKey: "abc_classification_calculator", toolName: "Abc Classification Calculator", route: "/tools/free/abc_classification_calculator", accessTier: "FREE" },
  { slug: "accounts_payable_turnover_calculator", toolKey: "accounts_payable_turnover_calculator", toolName: "Accounts Payable Turnover Calculator", route: "/tools/free/accounts_payable_turnover_calculator", accessTier: "FREE" },
  { slug: "accounts_receivable_turnover_calculator", toolKey: "accounts_receivable_turnover_calculator", toolName: "Accounts Receivable Turnover Calculator", route: "/tools/free/accounts_receivable_turnover_calculator", accessTier: "FREE" },
  { slug: "adc_resolution_calculator", toolKey: "adc_resolution_calculator", toolName: "Adc Resolution Calculator", route: "/tools/free/adc_resolution_calculator", accessTier: "FREE" },
  { slug: "adhesive_quantity_calculator", toolKey: "adhesive_quantity_calculator", toolName: "Adhesive Quantity Calculator", route: "/tools/free/adhesive_quantity_calculator", accessTier: "FREE" },
  { slug: "ai_token_cost_analyzer", toolKey: "ai_token_cost_analyzer", toolName: "AI Token Cost Analyzer", route: "/tools/free/ai_token_cost_analyzer", accessTier: "FREE" },
  { slug: "anchor_chain_length_calculator", toolKey: "anchor_chain_length_calculator", toolName: "Anchor Chain Length Calculator", route: "/tools/free/anchor_chain_length_calculator", accessTier: "FREE" },
  { slug: "angle_of_twist_calculator", toolKey: "angle_of_twist_calculator", toolName: "Angle Of Twist Calculator", route: "/tools/free/angle_of_twist_calculator", accessTier: "FREE" },
  { slug: "annualized_return_calculator", toolKey: "annualized_return_calculator", toolName: "Annualized Return Calculator", route: "/tools/free/annualized_return_calculator", accessTier: "FREE" },
  { slug: "annuity_income_calculator", toolKey: "annuity_income_calculator", toolName: "Annuity Income Calculator", route: "/tools/free/annuity_income_calculator", accessTier: "FREE" },
  { slug: "antenna_length_calculator", toolKey: "antenna_length_calculator", toolName: "Antenna Length Calculator", route: "/tools/free/antenna_length_calculator", accessTier: "FREE" },
  { slug: "api_latency_sla_calculator", toolKey: "api_latency_sla_calculator", toolName: "Api Latency Sla Calculator", route: "/tools/free/api_latency_sla_calculator", accessTier: "FREE" },
  { slug: "apr_calculator", toolKey: "apr_calculator", toolName: "Apr Calculator", route: "/tools/free/apr_calculator", accessTier: "FREE" },
  { slug: "asme_shaft_diameter_bending_torsion_calculator", toolKey: "asme_shaft_diameter_bending_torsion_calculator", toolName: "Asme Shaft Diameter Bending Torsion Calculator", route: "/tools/free/asme_shaft_diameter_bending_torsion_calculator", accessTier: "FREE" },
  { slug: "asset_allocation_calculator", toolKey: "asset_allocation_calculator", toolName: "Asset Allocation Calculator", route: "/tools/free/asset_allocation_calculator", accessTier: "FREE" },
  { slug: "audit_risk_calculator", toolKey: "audit_risk_calculator", toolName: "Audit Risk Calculator", route: "/tools/free/audit_risk_calculator", accessTier: "FREE" },
  { slug: "barn_ventilation_calculator", toolKey: "barn_ventilation_calculator", toolName: "Barn Ventilation Calculator", route: "/tools/free/barn_ventilation_calculator", accessTier: "FREE" },
  { slug: "baseboard_length_calculator", toolKey: "baseboard_length_calculator", toolName: "Baseboard Length Calculator", route: "/tools/free/baseboard_length_calculator", accessTier: "FREE" },
  { slug: "battery_backup_time_calculator", toolKey: "battery_backup_time_calculator", toolName: "Battery Backup Time Calculator", route: "/tools/free/battery_backup_time_calculator", accessTier: "FREE" },
  { slug: "beam_deflection_calculator", toolKey: "beam_deflection_calculator", toolName: "Beam Deflection Calculator", route: "/tools/free/beam_deflection_calculator", accessTier: "FREE" },
  { slug: "beam_reaction_calculator", toolKey: "beam_reaction_calculator", toolName: "Beam Reaction Calculator", route: "/tools/free/beam_reaction_calculator", accessTier: "FREE" },
  { slug: "bearing_wall_stress_calculator", toolKey: "bearing_wall_stress_calculator", toolName: "Bearing Wall Stress Calculator", route: "/tools/free/bearing_wall_stress_calculator", accessTier: "FREE" },
  { slug: "bernoulli_pressure_calculator", toolKey: "bernoulli_pressure_calculator", toolName: "Bernoulli Pressure Calculator", route: "/tools/free/bernoulli_pressure_calculator", accessTier: "FREE" },
  { slug: "bilge_discharge_time_calculator", toolKey: "bilge_discharge_time_calculator", toolName: "Bilge Discharge Time Calculator", route: "/tools/free/bilge_discharge_time_calculator", accessTier: "FREE" },
  { slug: "black_scholes_calculator", toolKey: "black_scholes_calculator", toolName: "Black Scholes Calculator", route: "/tools/free/black_scholes_calculator", accessTier: "FREE" },
  { slug: "bobbin_yarn_length_calculator", toolKey: "bobbin_yarn_length_calculator", toolName: "Bobbin Yarn Length Calculator", route: "/tools/free/bobbin_yarn_length_calculator", accessTier: "FREE" },
  { slug: "bond_price_calculator", toolKey: "bond_price_calculator", toolName: "Bond Price Calculator", route: "/tools/free/bond_price_calculator", accessTier: "FREE" },
  { slug: "bottleneck_analysis_calculator", toolKey: "bottleneck_analysis_calculator", toolName: "Bottleneck Analysis Calculator", route: "/tools/free/bottleneck_analysis_calculator", accessTier: "FREE" },
  { slug: "break_even_and_margin_of_safety_analysis", toolKey: "break_even_and_margin_of_safety_analysis", toolName: "Break-Even & Margin of Safety Analysis", route: "/tools/free/break_even_and_margin_of_safety_analysis", accessTier: "FREE" },
  { slug: "breeam_leed_score_calculator", toolKey: "breeam_leed_score_calculator", toolName: "Breeam Leed Score Calculator", route: "/tools/free/breeam_leed_score_calculator", accessTier: "FREE" },
  { slug: "building_load_factor_calculator", toolKey: "building_load_factor_calculator", toolName: "Building Load Factor Calculator", route: "/tools/free/building_load_factor_calculator", accessTier: "FREE" },
  { slug: "building_shadow_duration_calculator", toolKey: "building_shadow_duration_calculator", toolName: "Building Shadow Duration Calculator", route: "/tools/free/building_shadow_duration_calculator", accessTier: "FREE" },
  { slug: "buoyant_force_calculator", toolKey: "buoyant_force_calculator", toolName: "Buoyant Force Calculator", route: "/tools/free/buoyant_force_calculator", accessTier: "FREE" },
  { slug: "burn_rate_calculator", toolKey: "burn_rate_calculator", toolName: "Burn Rate Calculator", route: "/tools/free/burn_rate_calculator", accessTier: "FREE" },
  { slug: "business_valuation_multiple_calculator", toolKey: "business_valuation_multiple_calculator", toolName: "Business Valuation Multiple Calculator", route: "/tools/free/business_valuation_multiple_calculator", accessTier: "FREE" },
  { slug: "cac_to_clv_ratio_calculator", toolKey: "cac_to_clv_ratio_calculator", toolName: "Cac To Clv Ratio Calculator", route: "/tools/free/cac_to_clv_ratio_calculator", accessTier: "FREE" },
  { slug: "cagr_calculator", toolKey: "cagr_calculator", toolName: "Cagr Calculator", route: "/tools/free/cagr_calculator", accessTier: "FREE" },
  { slug: "calibration_drift_calculator", toolKey: "calibration_drift_calculator", toolName: "Calibration Drift Calculator", route: "/tools/free/calibration_drift_calculator", accessTier: "FREE" },
  { slug: "cap_rate_calculator", toolKey: "cap_rate_calculator", toolName: "Cap Rate Calculator", route: "/tools/free/cap_rate_calculator", accessTier: "FREE" },
  { slug: "cap_table_calculator", toolKey: "cap_table_calculator", toolName: "Cap Table Calculator", route: "/tools/free/cap_table_calculator", accessTier: "FREE" },
  { slug: "capacitive_reactance_calculator", toolKey: "capacitive_reactance_calculator", toolName: "Capacitive Reactance Calculator", route: "/tools/free/capacitive_reactance_calculator", accessTier: "FREE" },
  { slug: "capital_gains_tax_calculator", toolKey: "capital_gains_tax_calculator", toolName: "Capital Gains Tax Calculator", route: "/tools/free/capital_gains_tax_calculator", accessTier: "FREE" },
  { slug: "capm_cost_of_equity_calculator", toolKey: "capm_cost_of_equity_calculator", toolName: "Capm Cost Of Equity Calculator", route: "/tools/free/capm_cost_of_equity_calculator", accessTier: "FREE" },
  { slug: "carbon_footprint_calculator", toolKey: "carbon_footprint_calculator", toolName: "Carbon Footprint Calculator", route: "/tools/free/carbon_footprint_calculator", accessTier: "FREE" },
  { slug: "carbon_offset_trees_calculator", toolKey: "carbon_offset_trees_calculator", toolName: "Carbon Offset Trees Calculator", route: "/tools/free/carbon_offset_trees_calculator", accessTier: "FREE" },
  { slug: "carnot_efficiency_calculator", toolKey: "carnot_efficiency_calculator", toolName: "Carnot Efficiency Calculator", route: "/tools/free/carnot_efficiency_calculator", accessTier: "FREE" },
  { slug: "cash_conversion_cycle_calculator", toolKey: "cash_conversion_cycle_calculator", toolName: "Cash Conversion Cycle Calculator", route: "/tools/free/cash_conversion_cycle_calculator", accessTier: "FREE" },
  { slug: "cash_flow_gap_analysis", toolKey: "cash_flow_gap_analysis", toolName: "Cash Flow Gap Analysis", route: "/tools/free/cash_flow_gap_analysis", accessTier: "FREE" },
  { slug: "cash_on_cash_return_calculator", toolKey: "cash_on_cash_return_calculator", toolName: "Cash On Cash Return Calculator", route: "/tools/free/cash_on_cash_return_calculator", accessTier: "FREE" },
];

const freeToolSlugs: string[] = FREE_TOOLS.map((t) => t.slug).sort();
const freeToolBySlug = new Map<string, FreeToolManifestEntry>(FREE_TOOLS.map((t) => [t.slug, t]));

export function listFreeToolSlugs(): string[] {
  return [...freeToolSlugs];
}

export function listFreeToolManifestEntries(): FreeToolManifestEntry[] {
  return FREE_TOOLS.map((t) => ({ ...t }));
}

export function getFreeToolManifestEntry(slug: string): FreeToolManifestEntry | undefined {
  return freeToolBySlug.get(slug);
}

export function getFreeToolSitemapItems(): { slug: string; route: string; toolName: string }[] {
  return FREE_TOOLS.map((t) => ({ slug: t.slug, route: t.route, toolName: t.toolName }));
}
