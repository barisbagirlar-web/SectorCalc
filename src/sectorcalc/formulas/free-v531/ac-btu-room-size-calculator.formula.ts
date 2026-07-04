import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "ac-btu-room-size-calculator";
export const formulaVersion = "1.0.0";

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function get(inputs: Record<string, number>, key: string): number {
  const v = inputs[key];
  return isFiniteNumber(v) ? v : 0;
}

function round(v: number, d: number): number {
  if (!isFiniteNumber(v)) return 0;
  const f = Math.pow(10, d);
  return Math.round(v * f) / f;
}

export function calculate(inputs: Record<string, number>): {
  status: CalculationStatus;
  outputs: Record<string, number>;
  warnings: string[];
  outputKeys: string[];
  redaction_status: RedactionStatus;
} {
  const warnings: string[] = [];
  const outputs: Record<string, number> = {};

  // Validate required inputs
  for (const key of ["room_area", "ceiling_height", "window_area", "sun_exposure_factor", "occupants", "equipment_watts"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_room_area = get(inputs, "room_area");
    const val_ceiling_height = get(inputs, "ceiling_height");
    const val_window_area = get(inputs, "window_area");
    const val_sun_exposure_factor = get(inputs, "sun_exposure_factor");
    const val_occupants = get(inputs, "occupants");
    const val_equipment_watts = get(inputs, "equipment_watts");
    outputs["cooling_load_btu_per_hour"] = round(val_room_area * val_ceiling_height * val_window_area * val_sun_exposure_factor * val_occupants * val_equipment_watts, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["cooling_load_btu_per_hour", "sensible_load_index", "recommended_capacity_kw"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
