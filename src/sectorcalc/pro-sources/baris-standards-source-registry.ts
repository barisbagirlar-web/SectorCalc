// SectorCalc V5.3.1 — Baris PRO Standards Source Registry
//
// Official source references for blocked engineering/CBAM tools.
// No restricted standard tables, paid coefficient values, or copyrighted
// clause numbers are copied. Each record declares the official source
// URL, its access type, and the exact runtime-use restrictions.
//
// PAID_STANDARD sources require user-verified value binding at runtime.
// REGULATORY_PUBLIC_DATA sources require version/hash/date metadata.
// Copyright table reproduction is FORBIDDEN for all sources.

import "server-only";

export type AccessType =
  | "PUBLIC_REFERENCE"
  | "PUBLIC_DOWNLOAD"
  | "PAID_STANDARD"
  | "REGULATORY_PUBLIC_DATA";

export type AllowedUse =
  | "citation_reference"
  | "evidence_requirement"
  | "user_verified_value_binding"
  | "licensed_lookup_if_implemented";

export type ForbiddenUse =
  | "hardcoded_paid_table_values"
  | "copied_standard_tables"
  | "invented_coefficients"
  | "guessed_clause_numbers";

export interface StandardsSourceRecord {
  source_id: string;
  standard_family: string;
  official_title: string;
  publisher: string;
  edition_or_version: string;
  publication_status: string;
  official_source_url: string;
  access_type: AccessType;
  copyright_table_reproduction: "FORBIDDEN";
  allowed_runtime_use: AllowedUse[];
  forbidden_runtime_use: ForbiddenUse[];
  affected_tool_keys: string[];
  required_user_evidence_fields: string[];
  live_engine_gate_condition: string;
}

// ── REQUIRED ENGINEERING STANDARDS ──────────────────────────────────────────

// 1. API 520 Part I — Pressure Relief Valve Sizing/Selection
export const API_520_P1: StandardsSourceRecord = {
  source_id: "API_520_P1",
  standard_family: "API 520 Part I",
  official_title:
    "Sizing, Selection, and Installation of Pressure-Relieving Devices Part I — Sizing and Selection",
  publisher: "American Petroleum Institute (API)",
  edition_or_version: "10th Edition, November 2021",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.api.org/products-and-services/standards",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: ["pressure-relief-valve-sizing-sheet-api-520"],
  required_user_evidence_fields: [
    "valve_type",
    "discharge_coefficient_Kd",
    "backpressure_correction_Kb",
    "viscosity_correction_Kv",
    "combination_correction_Kc",
    "set_pressure",
    "overpressure_percentage",
    "relieving_temperature",
    "relieving_pressure",
    "required_flow_rate",
  ],
  live_engine_gate_condition:
    "Requires user-verified Kd/Kb/Kc/Kv coefficients from licensed API 520 copy. Hardcoded table values forbidden. Gate lifts when licensed lookup API or user-verified coefficient input mapping is implemented.",
};

// 2. ASME BPVC Section VIII Division 1 — Pressure Vessel Wall Thickness / MAWP / Hydrotest
export const ASME_BPVC_VIII_1: StandardsSourceRecord = {
  source_id: "ASME_BPVC_VIII_1",
  standard_family: "ASME BPVC Section VIII Div. 1",
  official_title:
    "ASME Boiler and Pressure Vessel Code Section VIII — Rules for Construction of Pressure Vessels Division 1",
  publisher: "American Society of Mechanical Engineers (ASME)",
  edition_or_version: "2023 Edition",
  publication_status: "ACTIVE",
  official_source_url: "https://www.asme.org/codes-standards/bpvc",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "pressure-vessel-wall-thickness-mawp-hydrotest-package",
  ],
  required_user_evidence_fields: [
    "material_grade",
    "joint_efficiency_E",
    "allowable_stress_S",
    "inside_radius",
    "corrosion_allowance",
    "design_pressure",
    "design_temperature",
    "hydrotest_pressure_factor",
    "ultrasonic_thickness_reading",
  ],
  live_engine_gate_condition:
    "Requires user-verified joint efficiency (UW-12) and allowable stress values by material grade from ASME BPVC Section II Part D. Hardcoded table values forbidden. Gate lifts when licensed ASME digital reference API or user-verified value input mapping is implemented.",
};

// 3. VDI 2230 Blatt 1 — Bolted Joint Calculation
export const VDI_2230_B1: StandardsSourceRecord = {
  source_id: "VDI_2230_B1",
  standard_family: "VDI 2230 Blatt 1",
  official_title:
    "Systematic Calculation of Highly Stressed Bolted Joints — Joints with One Cylindrical Bolt",
  publisher: "Verein Deutscher Ingenieure (VDI)",
  edition_or_version: "2015-12",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.vdi.de/en/home/vdi-standards",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "bolt-torque-preload-spec-card-vdi-2230",
    "bolted-connection-verifier",
  ],
  required_user_evidence_fields: [
    "friction_coefficient_mu_total",
    "friction_coefficient_thread_mu_G",
    "friction_coefficient_head_mu_K",
    "bolt_property_class",
    "bolt_diameter",
    "clamping_length_ratio",
    "tightening_factor_alpha_A",
    "preload_scatter_percentage",
    "yield_stress_Rp02",
  ],
  live_engine_gate_condition:
    "Requires user-verified friction coefficient tables (mu_total, mu_G, mu_K), tightening factor alpha_A, and preload scatter from licensed VDI 2230 copy. Hardcoded table values and invented coefficients forbidden. Gate lifts when licensed lookup or user-verified input mapping is implemented.",
};

// 4. EN 1993 Eurocode 3 — Steel Structures, Joints, Welded/Bolted Connections
export const EN_1993_EC3: StandardsSourceRecord = {
  source_id: "EN_1993_EC3",
  standard_family: "EN 1993 Eurocode 3",
  official_title:
    "Eurocode 3: Design of Steel Structures — Part 1-1: General Rules and Rules for Buildings (EN 1993-1-1), Part 1-8: Design of Joints (EN 1993-1-8), Part 1-9: Fatigue (EN 1993-1-9)",
  publisher: "European Committee for Standardization (CEN)",
  edition_or_version:
    "EN 1993-1-1:2005 + AC:2009, EN 1993-1-8:2005 + AC:2009, EN 1993-1-9:2005 + AC:2009",
  publication_status: "ACTIVE",
  official_source_url:
    "https://eurocodes.europen.com/en-1993-eurocode-3-design-of-steel-structures",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "structural-connection-verification-dossier-ec3-aisc",
    "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
    "bolted-connection-verifier",
  ],
  required_user_evidence_fields: [
    "steel_grade",
    "section_class",
    "partial_factor_gamma_M0",
    "partial_factor_gamma_M1",
    "partial_factor_gamma_M2",
    "joint_type",
    "weld_throat_thickness",
    "bolt_grade_8_8_or_10_9",
  ],
  live_engine_gate_condition:
    "Requires user-verified steel grade table S235-S460 yield/ultimate strengths, partial safety factors (gamma_M0/M1/M2), and joint classification from licensed EN 1993 copy. Hardcoded table values and guessed clause numbers forbidden. Gate lifts when licensed lookup or user-verified input mapping is implemented.",
};

// 5. ANSI/AISC 360-22 — Structural Steel Buildings, LRFD/ASD
export const AISC_360_22: StandardsSourceRecord = {
  source_id: "AISC_360_22",
  standard_family: "ANSI/AISC 360-22",
  official_title:
    "Specification for Structural Steel Buildings (ANSI/AISC 360-22)",
  publisher:
    "American Institute of Steel Construction (AISC)",
  edition_or_version: "2022 (ANSI/AISC 360-22)",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.aisc.org/standards",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "structural-connection-verification-dossier-ec3-aisc",
    "bolted-connection-verifier",
  ],
  required_user_evidence_fields: [
    "steel_grade_ASTM",
    "LRFD_or_ASD",
    "resistance_factor_phi",
    "safety_factor_Omega",
    "yield_stress_Fy",
    "tensile_strength_Fu",
    "bolt_grade_A325_or_A490",
    "weld_electrode_classification",
  ],
  live_engine_gate_condition:
    "Requires user-verified ASTM steel grade tables (Fy/Fu), bolt specification (A325/A490), weld electrode strengths, and resistance/safety factors from licensed AISC 360-22 copy. Hardcoded table values and guessed clause numbers forbidden. Gate lifts when licensed lookup or user-verified input mapping is implemented.",
};

// 6. AWS D1.1/D1.1M:2025 — Structural Welding Code — Steel
export const AWS_D1_1_2025: StandardsSourceRecord = {
  source_id: "AWS_D1_1_2025",
  standard_family: "AWS D1.1/D1.1M",
  official_title:
    "Structural Welding Code — Steel (AWS D1.1/D1.1M:2025)",
  publisher: "American Welding Society (AWS)",
  edition_or_version: "2025 (AWS D1.1/D1.1M:2025)",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.aws.org/standards",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "fillet-weld-sizing-verification-sheet-ec3-aws-d11",
  ],
  required_user_evidence_fields: [
    "welding_process",
    "electrode_classification",
    "FEXx_number",
    "base_metal_group",
    "joint_design_type",
    "effective_throat_dimension",
    "welding_position",
    "prequalified_joint_details",
  ],
  live_engine_gate_condition:
    "Requires user-verified Table 2 (permissible stresses) and Table 3.7 (prequalified joint details) values from licensed AWS D1.1:2025 copy. Hardcoded table values and guessed clause numbers forbidden. Gate lifts when licensed lookup or user-verified input mapping is implemented.",
};

// 7. ISO 286-1 — Tolerance/Deviation/Fits System
export const ISO_286_1: StandardsSourceRecord = {
  source_id: "ISO_286_1",
  standard_family: "ISO 286-1",
  official_title:
    "Geometrical Product Specifications (GPS) — ISO Code System for Tolerances on Linear Sizes — Part 1: Basis of Tolerances, Deviations and Fits",
  publisher:
    "International Organization for Standardization (ISO)",
  edition_or_version: "ISO 286-1:2010 (current)",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.iso.org/standard/36332.html",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "gdt-fit-clearance-calculator-iso-286",
    "tolerance-stack-up-root-cause-report-wc-rss",
  ],
  required_user_evidence_fields: [
    "nominal_size_range_mm",
    "tolerance_grade_IT01_to_IT18",
    "fundamental_deviation_letter",
    "shaft_or_hole_basis",
    "upper_deviation_es_or_ES",
    "lower_deviation_ei_or_EI",
  ],
  live_engine_gate_condition:
    "Requires user-verified fundamental deviation values and tolerance grade multipliers (IT01-IT18) from licensed ISO 286-1 copy. Hardcoded ISO tolerance tables and guessed deviation values forbidden. Gate lifts when licensed ISO GPS lookup or user-verified input mapping is implemented.",
};

// 8. EU CBAM Legislation/Guidance/Default Values/Benchmarks — Definitive Period
export const EU_CBAM_DEFINITIVE: StandardsSourceRecord = {
  source_id: "EU_CBAM_DEFINITIVE",
  standard_family: "EU CBAM — Carbon Border Adjustment Mechanism",
  official_title:
    "Regulation (EU) 2023/956 establishing a Carbon Border Adjustment Mechanism; Commission Implementing Regulation (EU) 2024/... on reporting obligations and default values for the definitive period",
  publisher: "European Commission / Official Journal of the EU",
  edition_or_version:
    "Regulation (EU) 2023/956 + Implementing Regulation definitive period",
  publication_status: "ACTIVE",
  official_source_url:
    "https://ec.europa.eu/taxation_customs/carbon-border-adjustment-mechanism_en",
  access_type: "REGULATORY_PUBLIC_DATA",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "cbam-definitive-period-compliance-package",
    "cbam-cost-exposure-hedging-forecaster",
    "cbam-supplier-emissions-data-sheet",
  ],
  required_user_evidence_fields: [
    "cn_code",
    "country_of_origin",
    "production_route",
    "default_emission_value_tCO2e_per_t",
    "benchmark_value_if_available",
    "carbon_price_paid_in_country_of_origin_EUR",
    "cbam_certificate_price_EUR",
    "reporting_period_quarter",
  ],
  live_engine_gate_condition:
    "Gate lifts when European Commission publishes final definitive-period Implementing Regulation with official default values and benchmarks. Values must be sourced from official EU PDF or EU API, never from third-party summaries. Must include version/date/hash metadata for each value reference.",
};

// ── ADDITIONAL SOURCE RECORDS ───────────────────────────────────────────────

// ASME B30 Series — Lifting/Rigging/Crane Safety
export const ASME_B30: StandardsSourceRecord = {
  source_id: "ASME_B30",
  standard_family: "ASME B30 Series",
  official_title:
    "ASME B30 Safety Standard for Cableways, Cranes, Derricks, Hoists, Hooks, Jacks, and Slings",
  publisher: "American Society of Mechanical Engineers (ASME)",
  edition_or_version:
    "B30.5-2021 (Mobile and Locomotive Cranes), B30.9-2018 (Slings), B30.10-2019 (Hooks), B30.20-2021 (Below-the-Hook Lifting Devices)",
  publication_status: "ACTIVE",
  official_source_url: "https://www.asme.org/codes-standards/b30",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: ["lifting-rigging-crane-plan-suite"],
  required_user_evidence_fields: [
    "crane_type",
    "rated_load_capacity_at_radius",
    "sling_angle_degrees",
    "sling_leg_count",
    "hook_rating",
    "lift_radius",
    "counterweight_configuration",
  ],
  live_engine_gate_condition:
    "Requires user-verified load chart values and sling angle capacity factors from licensed ASME B30 copy. Hardcoded table values forbidden. Gate lifts when licensed lookup or user-verified input mapping is implemented.",
};

// JCGM GUM / ISO/IEC Guide 98-3 — Measurement Uncertainty
export const JCGM_GUM: StandardsSourceRecord = {
  source_id: "JCGM_GUM",
  standard_family: "JCGM GUM (Guide to the Expression of Uncertainty in Measurement)",
  official_title:
    "Evaluation of Measurement Data — Guide to the Expression of Uncertainty in Measurement (JCGM 100:2008 / ISO/IEC Guide 98-3)",
  publisher: "JCGM / BIPM / ISO / IEC",
  edition_or_version: "JCGM 100:2008 (GUM 1995 with minor corrections)",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.bipm.org/en/publications/guides/gum.html",
  access_type: "PUBLIC_DOWNLOAD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "measurement-uncertainty-budget-gum-iso-17025",
  ],
  required_user_evidence_fields: [
    "coverage_factor_k",
    "confidence_level_percentage",
    "standard_uncertainty_type_A_or_B",
    "degrees_of_freedom",
    "sensitivity_coefficient",
    "expanded_uncertainty_formula",
  ],
  live_engine_gate_condition:
    "JCGM GUM is public-domain (BIPM free download). Coverage factor table k(p, nu) is openly published and may be reproduced with citation. Gate lifts when user-verified coverage factor input and uncertainty budget structure is mapped. No hardcoded values from national annexes.",
};

// AS9102 — First Article Inspection
export const AS9102: StandardsSourceRecord = {
  source_id: "AS9102",
  standard_family: "AS9102 / SAE AS9102",
  official_title:
    "Aerospace Series — First Article Inspection Requirements (SAE AS9102)",
  publisher: "SAE International",
  edition_or_version: "SAE AS9102 Rev. B (2024)",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.sae.org/standards/content/as9102/",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "first-article-inspection-report-builder-as9102-lite",
  ],
  required_user_evidence_fields: [
    "form_1_part_number_characteristic_trace",
    "form_2_material_specification",
    "form_3_characteristic_verification",
    "ballooned_drawing_revision",
    "design_organization_approval",
  ],
  live_engine_gate_condition:
    "AS9102 is primarily a form template and process standard, not a table-value standard. Gate lifts when the form builder maps verified fields without reproducing SAE proprietary content. Form layout references must cite section numbers only; no template form images.",
};

// ISO 11011 — Compressed Air Energy Audit
export const ISO_11011: StandardsSourceRecord = {
  source_id: "ISO_11011",
  standard_family: "ISO 11011",
  official_title:
    "Compressed Air — Energy Efficiency Assessment — Part 1: General Requirements and Assessment Methods",
  publisher:
    "International Organization for Standardization (ISO)",
  edition_or_version: "ISO 11011-1:2023",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.iso.org/standard/79497.html",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "compressed-air-leak-energy-audit-report-iso-11011",
  ],
  required_user_evidence_fields: [
    "audit_class_A_B_or_C",
    "measurement_point_mapping",
    "leak_flow_rate_measurement_method",
    "pressure_measurement_point",
    "power_measurement_method",
    "baseline_operating_hours",
  ],
  live_engine_gate_condition:
    "ISO 11011 defines audit classification (Class A/B/C) and measurement requirements. Table values are primarily measurement uncertainty bands per class. Gate lifts when user-verified audit class selection and measurement method mapping is implemented. No hardcoded measurement uncertainty tables.",
};

// ISO GPS / ASME Y14.5 — Dimensioning and Tolerancing
export const ISO_GPS_Y14_5: StandardsSourceRecord = {
  source_id: "ISO_GPS_Y14_5",
  standard_family: "ISO GPS / ASME Y14.5",
  official_title:
    "Geometrical Product Specifications (GPS) — ISO 8015:2011 (Fundamentals) / ASME Y14.5-2018 (Dimensioning and Tolerancing)",
  publisher: "ISO / ASME",
  edition_or_version: "ISO 8015:2011, ASME Y14.5-2018",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.iso.org/standard/42054.html / https://www.asme.org/codes-standards/y14-5",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: [
    "tolerance-stack-up-root-cause-report-wc-rss",
  ],
  required_user_evidence_fields: [
    "tolerance_accumulation_method_RSS_or_WC",
    "characteristic_dimension_value",
    "tolerance_value_per_characteristic",
    "datum_reference_frame",
    "material_condition_MMC_LMC_RFS",
    "statistical_distribution_assumption",
  ],
  live_engine_gate_condition:
    "Requires user-verified geometric tolerance values from engineering drawing. The WC and RSS accumulation formulas are standard published engineering practice, not restricted table values. Gate lifts when user enters verified tolerance values from the drawing. No hardcoded ISO/ASME tolerance tables permitted.",
};

// EN 13155 — Crane Safety / Loose Load Attachments
export const EN_13155: StandardsSourceRecord = {
  source_id: "EN_13155",
  standard_family: "EN 13155",
  official_title:
    "Crane Safety — Non-fixed Load Lifting Attachments",
  publisher: "European Committee for Standardization (CEN)",
  edition_or_version: "EN 13155:2003 + A2:2009",
  publication_status: "ACTIVE",
  official_source_url:
    "https://www.cencenelec.eu",
  access_type: "PAID_STANDARD",
  copyright_table_reproduction: "FORBIDDEN",
  allowed_runtime_use: [
    "citation_reference",
    "evidence_requirement",
    "user_verified_value_binding",
    "licensed_lookup_if_implemented",
  ],
  forbidden_runtime_use: [
    "hardcoded_paid_table_values",
    "copied_standard_tables",
    "invented_coefficients",
    "guessed_clause_numbers",
  ],
  affected_tool_keys: ["lifting-rigging-crane-plan-suite"],
  required_user_evidence_fields: [
    "lifting_attachment_type",
    "working_load_limit_WLL",
    "angle_limit_degrees",
    "attachment_inspection_certificate",
  ],
  live_engine_gate_condition:
    "Requires user-verified WLL ratings and angle limits from lifting attachment manufacturer certification. No hardcoded EN 13155 table values. Gate lifts when user-verified WLL and angle input mapping is implemented.",
};

// ── FULL REGISTRY EXPORT ────────────────────────────────────────────────────

export const BARIS_STANDARDS_SOURCE_REGISTRY: StandardsSourceRecord[] = [
  API_520_P1,
  ASME_BPVC_VIII_1,
  VDI_2230_B1,
  EN_1993_EC3,
  AISC_360_22,
  AWS_D1_1_2025,
  ISO_286_1,
  EU_CBAM_DEFINITIVE,
  ASME_B30,
  JCGM_GUM,
  AS9102,
  ISO_11011,
  ISO_GPS_Y14_5,
  EN_13155,
];

// ── LOOKUP HELPERS ──────────────────────────────────────────────────────────

export function getSourceById(
  sourceId: string,
): StandardsSourceRecord | null {
  return (
    BARIS_STANDARDS_SOURCE_REGISTRY.find((s) => s.source_id === sourceId) ??
    null
  );
}

export function getSourcesForTool(
  toolKey: string,
): StandardsSourceRecord[] {
  return BARIS_STANDARDS_SOURCE_REGISTRY.filter((s) =>
    s.affected_tool_keys.includes(toolKey),
  );
}

export function sourceFamilySummary(): {
  families: number;
  paid: number;
  public: number;
  regulatory: number;
} {
  const paid = BARIS_STANDARDS_SOURCE_REGISTRY.filter(
    (s) => s.access_type === "PAID_STANDARD",
  ).length;
  const regulatory = BARIS_STANDARDS_SOURCE_REGISTRY.filter(
    (s) => s.access_type === "REGULATORY_PUBLIC_DATA",
  ).length;
  const pub = BARIS_STANDARDS_SOURCE_REGISTRY.filter(
    (s) => s.access_type === "PUBLIC_DOWNLOAD" || s.access_type === "PUBLIC_REFERENCE",
  ).length;
  return {
    families: BARIS_STANDARDS_SOURCE_REGISTRY.length,
    paid,
    public: pub,
    regulatory,
  };
}

export function getRequiredFamilyCount(): number {
  return 8;
}

export const REQUIRED_FAMILY_IDS = [
  "API_520_P1",
  "ASME_BPVC_VIII_1",
  "VDI_2230_B1",
  "EN_1993_EC3",
  "AISC_360_22",
  "AWS_D1_1_2025",
  "ISO_286_1",
  "EU_CBAM_DEFINITIVE",
] as const;
