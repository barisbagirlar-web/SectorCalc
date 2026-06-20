import { CALCULATION_STANDARD_KEY } from "@/lib/generated-tools/standard-input";
import type {
  GeneratedCalculatorModule,
  GeneratedToolResult,
} from "@/lib/generated-tools/types";

type StandardCalculatorOverride = (
  input: Record<string, unknown>,
  baseCalculate: GeneratedCalculatorModule["calculate"],
) => GeneratedToolResult;

const YIELD_STRENGTH_MPA: Readonly<Record<string, number>> = {
  "4.6": 240,
  "5.8": 420,
  "8.8": 640,
  "10.9": 940,
  "12.9": 1100,
};

function parseJointEfficiency(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function calculatePressureVesselThickness(
  input: Record<string, unknown>,
): GeneratedToolResult {
  const standard = input[CALCULATION_STANDARD_KEY] === "ped" ? "ped" : "asme";
  const pressure = Number(input.design_pressure);
  const diameter = Number(input.vessel_diameter);
  const allowableStress = Number(input.allowable_stress);
  const jointEfficiency = parseJointEfficiency(input.joint_efficiency);
  const corrosionAllowance = Number(input.corrosion_allowance);
  const materialUtilization = Number(input.material_utilization);
  const safetyFactorOverride = input.safety_factor_override === true;
  const customSafetyFactor = Number(input.custom_safety_factor);

  const denominatorBase = 2 * allowableStress * jointEfficiency;
  const requiredThickness =
    standard === "ped"
      ? (() => {
          const designStress = allowableStress / 1.1;
          const denominator = 2 * designStress * jointEfficiency - pressure;
          return denominator > 0 ? (pressure * diameter) / denominator : 0;
        })()
      : (() => {
          const denominator = denominatorBase - 1.2 * pressure;
          return denominator > 0 ? (pressure * diameter) / denominator : 0;
        })();

  const thicknessWithCorrosion = requiredThickness + corrosionAllowance;
  const innerRadius = diameter / 2;
  const outerRadius = innerRadius + thicknessWithCorrosion;
  const materialVolume = Math.PI * (outerRadius ** 2 - innerRadius ** 2) * 1000;
  const weightPerMeter = (materialVolume / 1e9) * 7800;
  const materialCostPerMeter =
    (materialVolume / 1e9) * 7800 * 2.5 * (100 / materialUtilization);
  const recommendedThickness = Math.ceil(thicknessWithCorrosion * 2) / 2;
  const effectiveSafetyFactor = safetyFactorOverride ? customSafetyFactor : 3.5;

  const breakdown = {
    required_thickness: requiredThickness,
    thickness_with_corrosion: thicknessWithCorrosion,
    material_volume_per_m: materialVolume,
    weight_per_meter: weightPerMeter,
    material_cost_per_meter: materialCostPerMeter,
    effective_safety_factor: effectiveSafetyFactor,
  };

  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? recommendedThickness * (input.dataConfidence / 100)
      : recommendedThickness;

  return {
    recommended_thickness: recommendedThickness,
    totalWasteCost: recommendedThickness,
    breakdown,
    hiddenLossDrivers: [
      "Excess Corrosion Allowance",
      "Low Joint Efficiency",
      "Material Utilization Waste",
    ],
    suggestedActions: [
      "Consider Full Radiography",
      "Review Corrosion Allowance",
      "Improve Nesting Efficiency",
      "Evaluate Higher Strength Material",
    ],
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: [
      "PDF export",
      "CSV export",
      "Trend analysis",
      "Material database sync",
      "Multi-user collaboration",
      "API access",
    ],
    unit: "mm",
  };
}

function temperatureAdjustedYield(yieldMpa: number, temperatureC: number): number {
  if (temperatureC <= 100) {
    return yieldMpa;
  }
  const derating = 1 - 0.001 * (temperatureC - 100);
  return yieldMpa * Math.max(derating, 0.7);
}

function computeBoltTorqueMetric(input: Record<string, unknown>): {
  calculatedTorque: number;
  breakdown: Record<string, number>;
} {
  const diameterMm = Number(input.nominal_diameter);
  const pitchMm = Number(input.thread_pitch);
  const boltGrade = String(input.bolt_grade);
  const yieldMpa = temperatureAdjustedYield(
    YIELD_STRENGTH_MPA[boltGrade] ?? 640,
    Number(input.temperature),
  );
  const tensileStressArea = (Math.PI / 4) * (diameterMm - 0.9382 * pitchMm) ** 2;
  const targetPreload = (Number(input.preload_percentage) / 100) * yieldMpa * tensileStressArea;
  const headDiameter = 1.5 * diameterMm;
  const frictionThread = Number(input.friction_coefficient_thread);
  const frictionHead = Number(input.friction_coefficient_head);
  const torqueCoefficient =
    0.5 * (pitchMm / (Math.PI * diameterMm)) +
    0.5 * (frictionThread / Math.cos(Math.PI / 6)) +
    0.5 * frictionHead * (headDiameter / diameterMm);
  const calculatedTorque = torqueCoefficient * targetPreload * (diameterMm / 1000);

  return {
    calculatedTorque,
    breakdown: {
      thread_friction_torque: calculatedTorque * 0.45,
      head_friction_torque: calculatedTorque * 0.35,
      preload_torque: calculatedTorque * 0.2,
    },
  };
}

function computeBoltTorqueImperial(input: Record<string, unknown>): {
  calculatedTorque: number;
  breakdown: Record<string, number>;
} {
  const diameterIn = Number(input.nominal_diameter) / 25.4;
  const pitchIn = Number(input.thread_pitch) / 25.4;
  const boltGrade = String(input.bolt_grade);
  const yieldMpa = temperatureAdjustedYield(
    YIELD_STRENGTH_MPA[boltGrade] ?? 640,
    Number(input.temperature),
  );
  const yieldPsi = yieldMpa * 145.038;
  const tensileStressAreaIn2 = (Math.PI / 4) * (diameterIn - 0.9743 * pitchIn) ** 2;
  const targetPreloadLbf =
    (Number(input.preload_percentage) / 100) * yieldPsi * tensileStressAreaIn2;
  const headDiameterIn = 1.5 * diameterIn;
  const frictionThread = Number(input.friction_coefficient_thread);
  const frictionHead = Number(input.friction_coefficient_head);
  const torqueCoefficient =
    0.5 * (pitchIn / (Math.PI * diameterIn)) +
    0.5 * (frictionThread / Math.cos(Math.PI / 6)) +
    0.5 * frictionHead * (headDiameterIn / diameterIn);
  const torqueLbfIn = torqueCoefficient * targetPreloadLbf * diameterIn;
  const calculatedTorque = torqueLbfIn * 0.1129848;

  return {
    calculatedTorque,
    breakdown: {
      thread_friction_torque: calculatedTorque * 0.45,
      head_friction_torque: calculatedTorque * 0.35,
      preload_torque: calculatedTorque * 0.2,
    },
  };
}

function calculateBoltTorque(input: Record<string, unknown>): GeneratedToolResult {
  const standard = input[CALCULATION_STANDARD_KEY] === "imperial" ? "imperial" : "metric";
  const { calculatedTorque, breakdown } =
    standard === "imperial" ? computeBoltTorqueImperial(input) : computeBoltTorqueMetric(input);

  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? calculatedTorque * (input.dataConfidence / 100)
      : calculatedTorque;

  return {
    calculated_torque: calculatedTorque,
    totalWasteCost: calculatedTorque,
    breakdown,
    hiddenLossDrivers: [
      "Friction Coefficient Scatter",
      "Embedment & Relaxation",
      "Temperature Derating",
      "Tool Accuracy",
    ],
    suggestedActions: [
      "Use calibrated torque wrench with accuracy ±3% or better.",
      "Apply molybdenum disulfide paste to threads and underhead to reduce friction scatter.",
      "Perform torque-tension verification test on 5% of bolts per batch.",
      "For critical joints, consider hydraulic tensioning instead of torque control.",
      "Re-torque after 24 hours to compensate for embedment loss.",
    ],
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: [
      "PDF export",
      "CSV export",
      "Trend analysis",
      "Multi-bolt pattern optimization",
      "Friction coefficient sensitivity analysis",
      "API integration for CMMS",
    ],
    unit: "Nm",
  };
}

export const STANDARD_CALCULATOR_OVERRIDES: Readonly<
  Record<string, StandardCalculatorOverride>
> = {
  "pressure-vessel-thickness": (input) => calculatePressureVesselThickness(input),
  "bolt-torque-calculator": (input) => calculateBoltTorque(input),
};

export function applyStandardCalculatorOverride(
  slug: string,
  module: GeneratedCalculatorModule,
): GeneratedCalculatorModule {
  const override = STANDARD_CALCULATOR_OVERRIDES[slug];
  if (!override) {
    return module;
  }
  return {
    ...module,
    calculate: (input) => override(input, module.calculate),
  };
}
