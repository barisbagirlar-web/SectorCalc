import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "radiator-btu-heat-loss";
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
  for (const key of ["room_volume", "temperature_difference", "insulation_loss_factor", "window_loss_btu", "safety_margin_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_room_volume = get(inputs, "room_volume");
    const val_temperature_difference = get(inputs, "temperature_difference");
    const val_insulation_loss_factor = get(inputs, "insulation_loss_factor");
    const val_window_loss_btu = get(inputs, "window_loss_btu");
    const val_safety_margin_percent = get(inputs, "safety_margin_percent");
    outputs["radiator_capacity_required"] = round(val_room_volume * val_temperature_difference * val_insulation_loss_factor * val_window_loss_btu * val_safety_margin_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["heat_loss_btu_per_hour", "radiator_capacity_required", "loss_intensity"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
