import "server-only";

export type CalculationStatus = "OK" | "REVIEW" | "BLOCKED";
export type RedactionStatus = "PUBLIC_SAFE_REDACTED" | "REDACTION_NOT_REQUIRED" | "REDACTION_FAILED_BLOCKED";

export const toolKey = "engine-torque-calculator";
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

  // Validate required measured inputs
  for (const key of ["enginePowerKw", "engineSpeedRpm"]) {
    if (!isFiniteNumber(inputs[key])) {
      warnings.push("Missing or non-finite input: " + key);
    }
  }

  // Check for zero/negative values
  const enginePowerKw = get(inputs, "enginePowerKw");
  const engineSpeedRpm = get(inputs, "engineSpeedRpm");

  if (enginePowerKw <= 0) {
    warnings.push("Engine Power must be a positive value.");
  }
  if (engineSpeedRpm <= 0) {
    warnings.push("Engine Speed must be a positive value.");
  }

  // Compute engine torque: T (N.m) = (P (kW) * 9550) / N (rpm)
  const safeSpeed = Math.max(engineSpeedRpm, 0.0001);
  const torque = round((enginePowerKw * 9550) / safeSpeed, 2);
  outputs["engine_torque"] = torque;

  return {
    status: warnings.length > 0 ? "REVIEW" : "OK",
    outputs,
    warnings,
    outputKeys: ["engine_torque"],
    redaction_status: "PUBLIC_SAFE_REDACTED",
  };
}
