import type { ToolResult, ResultTone } from "@/data/tool-schema";

export interface MachineHourEstimatorInput {
  monthlyMachineCost: number;
  monthlyMaintenanceCost: number;
  monthlyEnergyCost: number;
  monthlyLaborCost: number;
  monthlyOverheadCost: number;
  availableHours: number;
  utilizationRate: number;
}

export interface MachineHourEstimatorOutput {
  machineHourCost: number;
  productiveHours: number;
  idleHours: number;
  idleCost: number;
}

export type MachineHourEstimatorField = keyof MachineHourEstimatorInput;

export type MachineHourEstimatorErrors = Partial<
  Record<MachineHourEstimatorField, string>
>;

const COST_FIELDS: MachineHourEstimatorField[] = [
  "monthlyMachineCost",
  "monthlyMaintenanceCost",
  "monthlyEnergyCost",
  "monthlyLaborCost",
  "monthlyOverheadCost",
];

function hourCostTone(cost: number): ResultTone {
  if (cost <= 40) return "success";
  if (cost <= 80) return "warning";
  return "danger";
}

function idleCostTone(cost: number): ResultTone {
  if (cost <= 500) return "success";
  if (cost <= 2000) return "warning";
  return "danger";
}

export function validateMachineHourEstimator(
  input: MachineHourEstimatorInput
): MachineHourEstimatorErrors {
  const errors: MachineHourEstimatorErrors = {};

  for (const field of COST_FIELDS) {
    const value = input[field];
    if (Number.isNaN(value) || value < 0) {
      errors[field] = "Enter a valid amount of zero or greater.";
    }
  }

  if (Number.isNaN(input.availableHours) || input.availableHours <= 0) {
    errors.availableHours = "Available hours must be greater than zero.";
  }

  if (
    Number.isNaN(input.utilizationRate) ||
    input.utilizationRate < 1 ||
    input.utilizationRate > 100
  ) {
    errors.utilizationRate = "Utilization must be between 1% and 100%.";
  }

  return errors;
}

export function hasValidationErrors(
  errors: MachineHourEstimatorErrors
): boolean {
  return Object.keys(errors).length > 0;
}

export function calculateMachineHourEstimator(
  input: MachineHourEstimatorInput
): MachineHourEstimatorOutput | null {
  const errors = validateMachineHourEstimator(input);
  if (hasValidationErrors(errors)) return null;

  const productiveHours = input.availableHours * (input.utilizationRate / 100);
  const monthlyTotalCost =
    input.monthlyMachineCost +
    input.monthlyMaintenanceCost +
    input.monthlyEnergyCost +
    input.monthlyLaborCost +
    input.monthlyOverheadCost;

  const machineHourCost = monthlyTotalCost / productiveHours;
  const idleHours = input.availableHours - productiveHours;
  const idleCost = idleHours * machineHourCost;

  return {
    machineHourCost,
    productiveHours,
    idleHours,
    idleCost,
  };
}

export function mapMachineHourResults(
  output: MachineHourEstimatorOutput
): ToolResult[] {
  return [
    {
      id: "machineHourCost",
      label: "Estimated machine hour cost",
      value: output.machineHourCost,
      currency: true,
      tone: hourCostTone(output.machineHourCost),
    },
    {
      id: "productiveHours",
      label: "Productive hours per month",
      value: output.productiveHours,
      unit: "hours",
      tone: "neutral",
    },
    {
      id: "idleHours",
      label: "Estimated idle hours",
      value: output.idleHours,
      unit: "hours",
      tone: "neutral",
    },
    {
      id: "idleCost",
      label: "Estimated idle capacity cost",
      value: output.idleCost,
      currency: true,
      tone: idleCostTone(output.idleCost),
    },
  ];
}
