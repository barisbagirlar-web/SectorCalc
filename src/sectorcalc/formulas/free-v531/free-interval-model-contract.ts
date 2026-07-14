export type FreeOutputRole = "PRIMARY_DECISION" | "SECONDARY_METRIC" | "BUSINESS_IMPACT";

export type FreeIntervalOutputDefinition = readonly [
  id: string,
  name: string,
  unit: string,
  role: FreeOutputRole,
];

export interface FreeIntervalModelContract {
  readonly inputIds: readonly string[];
  readonly outputs: readonly FreeIntervalOutputDefinition[];
}

export const FREE_INTERVAL_MODEL_CONTRACTS: Readonly<Record<string, FreeIntervalModelContract>> =
  Object.freeze({
    "cutting-speed-feed-rpm": Object.freeze({
      inputIds: Object.freeze(["cutting_speed_m_min", "tool_diameter_mm", "number_of_teeth", "feed_per_tooth_mm", "max_chip_load_mm"]),
      outputs: Object.freeze([
        ["spindle_speed_rpm", "Spindle Speed", "rev/min", "PRIMARY_DECISION"],
        ["feed_rate_mm_min", "Table Feed Rate", "mm/min", "SECONDARY_METRIC"],
        ["chip_load_utilization", "Chip-Load Limit Utilization", "ratio", "BUSINESS_IMPACT"],
      ] as const),
    }),
    "fillet-weld-size-strength": Object.freeze({
      inputIds: Object.freeze(["fillet_leg_size_mm", "effective_weld_length_mm", "user_verified_allowable_stress_mpa", "applied_load_kn", "load_angle_factor"]),
      outputs: Object.freeze([
        ["effective_throat_mm", "Effective Fillet Throat", "mm", "SECONDARY_METRIC"],
        ["screening_capacity_kn", "User-Allowable Screening Capacity", "kN", "BUSINESS_IMPACT"],
        ["fillet_utilization", "Fillet Weld Utilization", "ratio", "PRIMARY_DECISION"],
      ] as const),
    }),
    "knurling-drill-point-depth": Object.freeze({
      inputIds: Object.freeze(["drill_diameter_mm", "drill_point_angle_deg", "knurl_pitch_mm", "workpiece_diameter_mm"]),
      outputs: Object.freeze([
        ["drill_point_depth_mm", "Drill Point Depth", "mm", "PRIMARY_DECISION"],
        ["estimated_knurl_teeth_count", "Estimated Knurl Tooth Count", "count", "SECONDARY_METRIC"],
        ["knurl_pitch_deviation_index", "Nearest-Tooth Pitch Deviation", "ratio", "BUSINESS_IMPACT"],
      ] as const),
    }),
    "sheet-metal-bend-allowance": Object.freeze({
      inputIds: Object.freeze(["bend_angle_deg", "inside_radius_mm", "material_thickness_mm", "k_factor", "flange_a_mm", "flange_b_mm"]),
      outputs: Object.freeze([
        ["bend_allowance_mm", "Bend Allowance", "mm", "PRIMARY_DECISION"],
        ["outside_setback_mm", "Outside Setback", "mm", "SECONDARY_METRIC"],
        ["flat_blank_length_mm", "Two-Flange Flat Blank Length", "mm", "BUSINESS_IMPACT"],
      ] as const),
    }),
    "tool-life-tool-cost-per-part": Object.freeze({
      inputIds: Object.freeze(["taylor_c", "taylor_n", "cutting_speed_m_min", "edge_cost", "cutting_time_seconds_per_part", "tool_change_minutes", "machine_hourly_rate"]),
      outputs: Object.freeze([
        ["estimated_tool_life_minutes", "Estimated Taylor Tool Life", "min", "SECONDARY_METRIC"],
        ["parts_per_edge", "Estimated Parts per Edge", "parts", "SECONDARY_METRIC"],
        ["tool_cost_per_part", "Tool Cost per Part", "currency/part", "PRIMARY_DECISION"],
      ] as const),
    }),
  });

export function getFreeIntervalModelContract(toolKey: string): FreeIntervalModelContract | null {
  return FREE_INTERVAL_MODEL_CONTRACTS[toolKey] ?? null;
}
