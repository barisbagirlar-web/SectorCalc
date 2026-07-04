import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "pipe-pressure-drop-calculator";
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
  for (const key of ["flow_rate", "pipe_diameter", "pipe_length", "friction_factor", "fluid_density", "minor_loss_coefficient"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_flow_rate = get(inputs, "flow_rate");
    const val_pipe_diameter = get(inputs, "pipe_diameter");
    const val_pipe_length = get(inputs, "pipe_length");
    const val_friction_factor = get(inputs, "friction_factor");
    const val_fluid_density = get(inputs, "fluid_density");
    const val_minor_loss_coefficient = get(inputs, "minor_loss_coefficient");
    outputs["pressure_drop"] = round(val_flow_rate * val_pipe_diameter * val_pipe_length * val_friction_factor * val_fluid_density * val_minor_loss_coefficient, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["flow_velocity", "pressure_drop", "minor_loss_pressure"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
