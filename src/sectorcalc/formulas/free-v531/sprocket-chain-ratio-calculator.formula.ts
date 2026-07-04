import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "sprocket-chain-ratio-calculator";
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
  for (const key of ["front_sprocket_teeth", "rear_sprocket_teeth", "primary_ratio", "engine_speed", "wheel_circumference", "drivetrain_efficiency_percent"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_front_sprocket_teeth = get(inputs, "front_sprocket_teeth");
    const val_rear_sprocket_teeth = get(inputs, "rear_sprocket_teeth");
    const val_primary_ratio = get(inputs, "primary_ratio");
    const val_engine_speed = get(inputs, "engine_speed");
    const val_wheel_circumference = get(inputs, "wheel_circumference");
    const val_drivetrain_efficiency_percent = get(inputs, "drivetrain_efficiency_percent");
    outputs["final_drive_ratio"] = round(val_front_sprocket_teeth * val_rear_sprocket_teeth * val_primary_ratio * val_engine_speed * val_wheel_circumference * val_drivetrain_efficiency_percent, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["final_drive_ratio", "wheel_speed", "theoretical_vehicle_speed", "torque_multiplier"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
