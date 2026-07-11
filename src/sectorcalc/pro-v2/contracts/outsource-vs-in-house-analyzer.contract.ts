// SectorCalc PRO V2 — Outsource vs In-House Analyzer Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const inHouseCostGroup: ProFieldGroup = {
  title: "In-House Cost Parameters",
  description: "Internal production costs per unit and batch",
  fields: [
    {
      id: "in_house_material_cost_per_unit", label: "In-House Material Cost per Unit", symbol: "C_mat",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }],
      required: true, placeholder: "e.g. 30", helpText: "Material cost per unit when produced in-house", min: 0, step: 0.01,
    },
    {
      id: "in_house_labor_cost_per_unit", label: "In-House Labor Cost per Unit", symbol: "C_lab",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }],
      required: true, placeholder: "e.g. 25", helpText: "Direct labor cost per unit when produced in-house", min: 0, step: 0.01,
    },
    {
      id: "in_house_overhead_per_unit", label: "In-House Overhead per Unit", symbol: "C_oh",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }],
      required: true, placeholder: "e.g. 20", helpText: "Allocated overhead cost per unit when produced in-house", min: 0, step: 0.01,
    },
    {
      id: "in_house_setup_cost_per_batch", label: "In-House Setup Cost per Batch", symbol: "C_setup",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 500", helpText: "Setup/changeover cost per batch for in-house production", min: 0, step: 10,
    },
  ],
};

const outsourceCostGroup: ProFieldGroup = {
  title: "Outsource Cost Parameters",
  description: "Supplier pricing and logistics costs",
  fields: [
    {
      id: "outsource_unit_price", label: "Outsource Unit Price", symbol: "P_sup",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }],
      required: true, placeholder: "e.g. 95", helpText: "Supplier quoted unit price for outsourced parts", min: 0, step: 0.01,
    },
    {
      id: "outsource_logistics_per_unit", label: "Outsource Logistics per Unit", symbol: "C_log",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }],
      required: true, placeholder: "e.g. 8", helpText: "Freight, customs, and logistics cost per outsourced unit", min: 0, step: 0.01,
    },
  ],
};

const riskGroup: ProFieldGroup = {
  title: "Risk & Capacity Parameters",
  description: "Quality, lead time, and capacity cost adjustments",
  fields: [
    {
      id: "quality_defect_allowance_pct", label: "Quality Defect Allowance", symbol: "D_q",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 3", helpText: "Expected defect rate from supplier (adds cost for inspection, rework, returns)", min: 0, max: 100, step: 0.1,
    },
    {
      id: "inventory_lead_time_cost_pct", label: "Inventory & Lead Time Cost", symbol: "C_inv",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 2", helpText: "Carrying cost and lead time risk premium as percentage of unit price", min: 0, max: 100, step: 0.1,
    },
    {
      id: "capacity_opportunity_cost_pct", label: "Capacity Opportunity Cost", symbol: "C_cap",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 5", helpText: "Opportunity cost of using internal capacity for this part vs. higher-value work", min: 0, max: 100, step: 0.1,
    },
  ],
};

const volumeGroup: ProFieldGroup = {
  title: "Volume Parameters",
  description: "Annual volume and scale factors",
  fields: [
    {
      id: "annual_volume", label: "Annual Volume", symbol: "V",
      type: "number", unitFamily: "factor", defaultUnit: "units/year",
      allowedUnits: [{ unit: "units/year", label: "units/yr" }, { unit: "units/month", label: "units/mo" }],
      required: true, placeholder: "e.g. 5000", helpText: "Total annual volume for make-or-buy evaluation", min: 0, step: 1,
    },
  ],
};

export const OUTSOURCE_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const OUTSOURCE_GROUPS: ProFieldGroup[] = [
  inHouseCostGroup, outsourceCostGroup, riskGroup, volumeGroup,
];

export const OUTSOURCE_FIELD_IDS = [
  "in_house_material_cost_per_unit", "in_house_labor_cost_per_unit",
  "in_house_overhead_per_unit", "in_house_setup_cost_per_batch",
  "outsource_unit_price", "outsource_logistics_per_unit",
  "quality_defect_allowance_pct", "inventory_lead_time_cost_pct",
  "capacity_opportunity_cost_pct", "annual_volume",
];
