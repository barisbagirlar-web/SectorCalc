// SectorCalc PRO V2 — Job Quote Builder Field Contract

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const jobParamsGroup: ProFieldGroup = {
  title: "Job Parameters",
  description: "Machine rate, material, labor, and overhead for this job",
  fields: [
    {
      id: "machine_rate", label: "Machine Rate per Hour", symbol: "C_machine",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 85", helpText: "Machine rate per hour", min: 0, step: 1,
    },
    {
      id: "material_cost", label: "Material Cost per Unit", symbol: "C_mat",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: true, placeholder: "e.g. 300", helpText: "Material cost per unit", min: 0, step: 0.01,
    },
    {
      id: "labor_rate", label: "Labor Rate", symbol: "C_labor",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" }, { unit: "EUR/h", label: "EUR/h" }],
      required: true, placeholder: "e.g. 55", helpText: "Labor rate per hour", min: 0, step: 0.5,
    },
    {
      id: "overhead_rate", label: "Overhead Rate", symbol: "C_oh",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: true, placeholder: "e.g. 75", helpText: "Overhead rate per unit", min: 0, step: 0.5,
    },
    {
      id: "defect_or_loss_cost", label: "Defect/Loss Cost", symbol: "C_def",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: true, placeholder: "e.g. 20", helpText: "Defect or rework cost per unit", min: 0, step: 0.01,
    },
  ],
};

const pricingGroup: ProFieldGroup = {
  title: "Pricing & Volume",
  description: "Target margin, batch size, and volume",
  fields: [
    {
      id: "target_margin", label: "Target Margin", symbol: "GM",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 25", helpText: "Target margin percentage", min: -100, max: 95, step: 0.5, defaultValue: 25,
    },
    {
      id: "batch_quantity", label: "Batch Quantity", symbol: "Q_batch",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "hundred", label: "hundred" }],
      required: true, placeholder: "e.g. 100", helpText: "Quantity in batch", min: 0, step: 1,
    },
    {
      id: "annual_volume", label: "Annual Volume", symbol: "N",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand", label: "thousand" }],
      required: true, placeholder: "e.g. 5000", helpText: "Annual production volume", min: 0, step: 1,
    },
  ],
};

export const LOSS_DETECTOR_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "Q_src", type: "number", unitFamily: "factor", defaultUnit: "ratio", allowedUnits: [{ unit: "ratio", label: "ratio" }], required: false, defaultValue: 0.9, hidden: true },
];

export const LOSS_DETECTOR_GROUPS: ProFieldGroup[] = [
  jobParamsGroup, pricingGroup,
];
