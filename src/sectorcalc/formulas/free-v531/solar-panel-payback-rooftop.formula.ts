import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "solar-panel-payback-rooftop";
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
  for (const key of ["installed_system_cost", "system_capacity_kw", "sun_hours_per_day", "electricity_rate", "self_consumption_percent", "annual_maintenance_cost"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Compute formula outputs
    const val_installed_system_cost = get(inputs, "installed_system_cost");
    const val_system_capacity_kw = get(inputs, "system_capacity_kw");
    const val_sun_hours_per_day = get(inputs, "sun_hours_per_day");
    const val_electricity_rate = get(inputs, "electricity_rate");
    const val_self_consumption_percent = get(inputs, "self_consumption_percent");
    const val_annual_maintenance_cost = get(inputs, "annual_maintenance_cost");
    outputs["payback_years"] = round(val_installed_system_cost * val_system_capacity_kw * val_sun_hours_per_day * val_electricity_rate * val_self_consumption_percent * val_annual_maintenance_cost, 4);

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["annual_energy_production", "annual_savings", "payback_years"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
