import type { MachineRecord, MachineRecordField } from "@/lib/features/machine-rate/types";
import type { ShopRateSavedRates } from "@/lib/features/shop-rate/types";

const FORM_INPUT_TO_MACHINE_FIELD: Readonly<Record<string, MachineRecordField>> = {
  machineHourlyCost: "hourlyRate",
  machineRate: "hourlyRate",
  machineRatePerHour: "hourlyRate",
  machineCostPerHour: "hourlyRate",
  unitVariableCost: "hourlyRate",
  energyCost: "energyCost",
  energyCostPerHour: "energyCost",
  maintenanceCost: "maintenanceCost",
  maintenanceCostPerHour: "maintenanceCost",
  amortizationCost: "amortization",
  amortizationPerHour: "amortization",
  machineDepreciationPerHour: "amortization",
};

export const MACHINE_RATE_MAPPABLE_INPUT_IDS = Object.freeze(
  Object.keys(FORM_INPUT_TO_MACHINE_FIELD),
) as readonly string[];

export function hasMachineRateMappableInputs(toolInputIds: readonly string[]): boolean {
  const inputIdSet = new Set(toolInputIds);
  return MACHINE_RATE_MAPPABLE_INPUT_IDS.some((inputId) => inputIdSet.has(inputId));
}

export function buildMachineInputMapping(
  toolInputIds: readonly string[],
): Record<string, MachineRecordField> {
  const mapping: Record<string, MachineRecordField> = {};

  for (const inputId of toolInputIds) {
    const machineField = FORM_INPUT_TO_MACHINE_FIELD[inputId];
    if (machineField) {
      mapping[inputId] = machineField;
    }
  }

  return mapping;
}

export function mapMachineToFormValues(
  machine: MachineRecord,
  inputMapping: Readonly<Record<string, MachineRecordField>>,
): Record<string, number> {
  const mapped: Record<string, number> = {};

  for (const [formField, machineField] of Object.entries(inputMapping)) {
    const value = machine[machineField];
    if (typeof value === "number" && Number.isFinite(value)) {
      mapped[formField] = value;
    }
  }

  return mapped;
}

export function mapShopRateRatesToFormValues(
  rates: ShopRateSavedRates,
  inputMapping: Readonly<Record<string, MachineRecordField>>,
): Record<string, number> {
  const machineRecord: MachineRecord = {
    id: "shop-rate-calculated",
    name: "Calculated shop rate",
    hourlyRate: rates.hourlyRate,
    amortization: rates.amortization,
    energyCost: rates.energyCost,
    maintenanceCost: rates.maintenanceCost,
    currency: rates.currency,
  };

  return mapMachineToFormValues(machineRecord, inputMapping);
}
