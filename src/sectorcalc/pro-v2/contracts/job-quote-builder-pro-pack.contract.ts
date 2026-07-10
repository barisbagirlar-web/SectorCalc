// SectorCalc PRO V2 — Job Quote Builder Field Contract

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const jobScopeGroup: ProFieldGroup = {
  title: "Job Scope",
  description: "Machine, cycle, setup, and batch parameters",
  fields: [
    {
      id: "machine_rate", label: "Machine Hourly Rate", symbol: "C_machine",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 85", helpText: "Machine hourly rate", min: 0, max: 10000, step: 1,
    },
    {
      id: "cycle_time", label: "Cycle Time per Unit", symbol: "t_cycle",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [{ unit: "min", label: "min" }, { unit: "h", label: "h" }, { unit: "sec", label: "s" }],
      required: true, placeholder: "e.g. 12", helpText: "Processing time per unit", min: 0, step: 0.5,
    },
    {
      id: "setup_time", label: "Setup Time", symbol: "t_setup",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [{ unit: "min", label: "min" }, { unit: "h", label: "h" }, { unit: "sec", label: "s" }],
      required: true, placeholder: "e.g. 8", helpText: "Batch setup time", min: 0, step: 0.5,
    },
    {
      id: "batch_quantity", label: "Batch Quantity", symbol: "Q_batch",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "hundred", label: "hundred" }],
      required: true, placeholder: "e.g. 500", helpText: "Quantity in this batch", min: 0, step: 1,
    },
  ],
};

const costingGroup: ProFieldGroup = {
  title: "Costing & Margin",
  description: "Material, labor, overhead, and margin targets",
  fields: [
    {
      id: "material_cost", label: "Material Cost per Unit", symbol: "C_mat",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 25", helpText: "Material cost per unit", min: 0, step: 0.01,
    },
    {
      id: "labor_rate", label: "Labor Rate", symbol: "C_labor",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }],
      required: true, placeholder: "e.g. 45", helpText: "Fully loaded labor rate", min: 0, step: 0.5,
    },
    {
      id: "overhead_rate", label: "Annual Overhead", symbol: "C_oh",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 350000", helpText: "Annual allocated overhead", min: 0, step: 100, defaultValue: 350000,
    },
    {
      id: "annual_volume", label: "Annual Volume", symbol: "N",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand", label: "thousand" }],
      required: true, placeholder: "e.g. 100000", helpText: "Annual decision volume", min: 0, step: 1,
    },
  ],
};

const quoteAssumptionsGroup: ProFieldGroup = {
  title: "Quote Assumptions",
  description: "Target margin, defect cost, and uncertainty",
  fields: [
    {
      id: "target_margin", label: "Target Margin", symbol: "GM",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 30", helpText: "Target margin percentage", min: -100, max: 95, step: 0.5, defaultValue: 30,
    },
    {
      id: "defect_or_loss_cost", label: "Defect or Loss Cost", symbol: "C_def",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: true, placeholder: "e.g. 12000", helpText: "Annual defect or scrap cost", min: 0, step: 1,
    },
    {
      id: "uncertainty_multiplier", label: "Uncertainty Multiplier", symbol: "U",
      type: "number", unitFamily: "factor", defaultUnit: "factor 0-1",
      allowedUnits: [{ unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 1.1", helpText: "Risk multiplier for price (e.g. 1.1 = +10%)", min: 0.5, max: 3, step: 0.05, defaultValue: 1.1,
    },
  ],
};

export const QUOTE_BUILDER_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence Ratio", symbol: "Q_src", type: "number", unitFamily: "factor", defaultUnit: "ratio", allowedUnits: [{ unit: "ratio", label: "ratio" }], required: false, defaultValue: 0.9, hidden: true },
];

export const QUOTE_BUILDER_GROUPS: ProFieldGroup[] = [
  jobScopeGroup, costingGroup, quoteAssumptionsGroup,
];
