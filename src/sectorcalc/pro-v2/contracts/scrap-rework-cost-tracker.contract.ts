// SectorCalc PRO V2 — Scrap & Rework Cost Tracker Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const productionGroup: ProFieldGroup = {
  title: "Production Volume",
  description: "Total production and defect quantities",
  fields: [
    {
      id: "total_produced", label: "Total Produced", symbol: "P_total",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand units", label: "K units" }],
      required: true, placeholder: "e.g. 10000", helpText: "Total units produced in the measurement period", min: 0, step: 1,
    },
    {
      id: "scrap_quantity", label: "Scrap Quantity", symbol: "Q_scrap",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }],
      required: true, placeholder: "e.g. 150", helpText: "Number of scrapped (non-reworkable) units", min: 0, step: 1,
    },
    {
      id: "rework_quantity", label: "Rework Quantity", symbol: "Q_rework",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }],
      required: true, placeholder: "e.g. 80", helpText: "Number of units requiring rework", min: 0, step: 1,
    },
    {
      id: "monthly_volume", label: "Monthly Volume", symbol: "V_month",
      type: "number", unitFamily: "factor", defaultUnit: "units/month",
      allowedUnits: [{ unit: "units/month", label: "units/mo" }, { unit: "units", label: "units" }],
      required: true, placeholder: "e.g. 10000", helpText: "Typical monthly production volume for annualization", min: 0, step: 1,
    },
  ],
};

const costGroup: ProFieldGroup = {
  title: "Unit Costs",
  description: "Material and labor costs per unit",
  fields: [
    {
      id: "unit_material_cost", label: "Unit Material Cost", symbol: "C_mat",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }],
      required: true, placeholder: "e.g. 25", helpText: "Material cost per unit", min: 0, step: 0.01,
    },
    {
      id: "unit_labor_cost", label: "Unit Labor Cost", symbol: "C_lab",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }],
      required: true, placeholder: "e.g. 15", helpText: "Direct labor cost per unit (for scrap labor loss calculation)", min: 0, step: 0.01,
    },
  ],
};

const reworkCostGroup: ProFieldGroup = {
  title: "Rework Cost Parameters",
  description: "Rework labor rate and time requirements",
  fields: [
    {
      id: "rework_labor_rate", label: "Rework Labor Rate", symbol: "R_rework",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 45", helpText: "Labor rate for rework activities", min: 0, step: 0.5,
    },
    {
      id: "rework_time_per_unit", label: "Rework Time per Unit", symbol: "T_rework",
      type: "number", unitFamily: "time", defaultUnit: "h",
      allowedUnits: [{ unit: "h", label: "h" }, { unit: "min", label: "min" }],
      required: true, placeholder: "e.g. 0.5", helpText: "Average rework time per reworked unit", min: 0, step: 0.1,
    },
    {
      id: "defect_rate_target_pct", label: "Defect Rate Target", symbol: "D_target",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 2.0", helpText: "Target defect/scrap rate percentage for quality benchmarking", min: 0, max: 100, step: 0.1,
    },
  ],
};

export const SCRAP_REWORK_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const SCRAP_REWORK_GROUPS: ProFieldGroup[] = [
  productionGroup, costGroup, reworkCostGroup,
];

export const SCRAP_REWORK_FIELD_IDS = [
  "total_produced", "scrap_quantity", "rework_quantity", "monthly_volume",
  "unit_material_cost", "unit_labor_cost",
  "rework_labor_rate", "rework_time_per_unit", "defect_rate_target_pct",
];
