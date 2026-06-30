import type { ResultTone, ToolResult } from "@/data/tool-schema";

export interface IndicatedHorsepowerInput {
  meanEffectivePressure: number; // bar
  strokeLength: number; // mm
  cylinderBore: number; // mm
  engineRpm: number; // rpm
  cylinderCount: number; // units
  cycleType: number; // 2 or 4 (stroke)
}

export type IndicatedHorsepowerField = keyof IndicatedHorsepowerInput;

export type IndicatedHorsepowerErrors = Partial<
  Record<IndicatedHorsepowerField, string>
>;

export function validateIndicatedHorsepower(
  input: IndicatedHorsepowerInput
): IndicatedHorsepowerErrors {
  const errors: IndicatedHorsepowerErrors = {};

  if (Number.isNaN(input.meanEffectivePressure) || input.meanEffectivePressure <= 0) {
    errors.meanEffectivePressure = "Mean effective pressure must be greater than zero.";
  }

  if (Number.isNaN(input.strokeLength) || input.strokeLength <= 0) {
    errors.strokeLength = "Stroke length must be greater than zero.";
  }

  if (Number.isNaN(input.cylinderBore) || input.cylinderBore <= 0) {
    errors.cylinderBore = "Cylinder bore must be greater than zero.";
  }

  if (Number.isNaN(input.engineRpm) || input.engineRpm <= 0) {
    errors.engineRpm = "Engine RPM must be greater than zero.";
  }

  if (Number.isNaN(input.cylinderCount) || input.cylinderCount < 1) {
    errors.cylinderCount = "Cylinder count must be at least 1.";
  }

  if (Number.isNaN(input.cycleType) || (input.cycleType !== 2 && input.cycleType !== 4)) {
    errors.cycleType = "Cycle type must be either 2 (2-stroke) or 4 (4-stroke).";
  }

  return errors;
}

export function hasIndicatedHorsepowerErrors(
  errors: IndicatedHorsepowerErrors
): boolean {
  return Object.keys(errors).length > 0;
}

export interface IndicatedHorsepowerOutput {
  indicatedHorsepower: number; // HP
  pistonSpeed: number; // m/s
  totalDisplacement: number; // Litres
  powerOutputKw: number; // kW
}

export function calculateIndicatedHorsepower(
  input: IndicatedHorsepowerInput
): IndicatedHorsepowerOutput | null {
  const errors = validateIndicatedHorsepower(input);
  if (hasIndicatedHorsepowerErrors(errors)) return null;

  const P = input.meanEffectivePressure * 100000; // bar to Pa (N/m²)
  const L = input.strokeLength / 1000; // mm to meters
  const A = Math.PI * Math.pow(input.cylinderBore / 2000, 2); // bore in mm to radius in meters, then area in m²
  
  // Power strokes per second (n)
  // For 4-stroke: 1 power stroke every 2 revolutions per cylinder
  // For 2-stroke: 1 power stroke every 1 revolution per cylinder
  const n = input.cycleType === 4 ? input.engineRpm / 120 : input.engineRpm / 60;

  // Power in Watts = P * L * A * n * k (number of cylinders)
  const powerWatts = P * L * A * n * input.cylinderCount;

  // Convert to metric horsepower (1 PS = 735.49875 Watts)
  const indicatedHorsepower = powerWatts / 735.49875;
  const powerOutputKw = powerWatts / 1000;

  // Mean Piston Speed = 2 * Stroke (meters) * (RPM / 60)
  const pistonSpeed = 2 * L * (input.engineRpm / 60);

  // Displacement in Litres = Area (m²) * Stroke (m) * Cylinders * 1000
  const totalDisplacement = A * L * input.cylinderCount * 1000;

  return {
    indicatedHorsepower,
    pistonSpeed,
    totalDisplacement,
    powerOutputKw,
  };
}

export function mapIndicatedHorsepowerResults(
  output: IndicatedHorsepowerOutput
): ToolResult[] {
  return [
    {
      id: "indicatedHorsepower",
      label: "Indicated Horsepower",
      value: output.indicatedHorsepower,
      unit: "hp",
      tone: "success",
    },
    {
      id: "powerOutputKw",
      label: "Indicated Power",
      value: output.powerOutputKw,
      unit: "kW",
      tone: "neutral",
    },
    {
      id: "totalDisplacement",
      label: "Engine Displacement",
      value: output.totalDisplacement,
      unit: "L",
      tone: "neutral",
    },
    {
      id: "pistonSpeed",
      label: "Mean Piston Speed",
      value: output.pistonSpeed,
      unit: "m/s",
      tone: output.pistonSpeed > 20 ? "warning" : "success",
    },
  ];
}
