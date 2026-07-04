import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "pump-flow-rate-calculator";
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
  for (const key of ["motor_power", "pump_efficiency_percent", "total_head", "friction_loss_head", "fluid_density"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_motor_power = get(inputs, "motor_power");
    const val_pump_efficiency_percent = get(inputs, "pump_efficiency_percent");
    const val_total_head = get(inputs, "total_head");
    const val_friction_loss_head = get(inputs, "friction_loss_head");
    const val_fluid_density = get(inputs, "fluid_density");
    outputs["estimated_flow_rate"] = round(val_motor_power * val_pump_efficiency_percent * val_total_head * val_friction_loss_head * val_fluid_density, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["estimated_flow_rate", "hydraulic_power", "energy_loss_index"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
