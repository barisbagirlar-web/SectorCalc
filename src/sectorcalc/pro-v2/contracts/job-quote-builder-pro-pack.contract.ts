// SectorCalc PRO V2 — Job Quote Builder Field Contract
// Groups: Order & Production, Material, Machine & Labor, Overhead, Job Costs, Scrap & Contingency, Pricing
// Symbols are hidden from normal users by the ProExecutionFormV2 debugRuntime check.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const orderGroup: ProFieldGroup = {
  title: "Order and Production",
  description: "Batch quantity, cycle time, setup time, and annual volume",
  fields: [
    {
      id: "batch_quantity", label: "Batch Quantity", symbol: "Q_batch",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "hundred", label: "hundred" }],
      required: true, placeholder: "e.g. 500",
      helpText: "Number of units in this production batch",
      min: 1, max: 10000000, step: 1,
    },
    {
      id: "cycle_time_seconds_per_unit", label: "Cycle Time per Unit", symbol: "t_c",
      type: "number", unitFamily: "time", defaultUnit: "sec",
      allowedUnits: [{ unit: "sec", label: "s" }, { unit: "min", label: "min" }, { unit: "h", label: "h" }],
      required: true, placeholder: "e.g. 720",
      helpText: "Processing cycle time per unit on this machine",
      min: 0, step: 1,
    },
    {
      id: "setup_time_minutes_per_batch", label: "Setup Time per Batch", symbol: "t_su",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [{ unit: "min", label: "min" }, { unit: "h", label: "h" }, { unit: "sec", label: "s" }],
      required: true, placeholder: "e.g. 8",
      helpText: "Setup time between batches on this machine",
      min: 0, step: 0.5,
    },
    {
      id: "annual_volume_units", label: "Annual Volume", symbol: "V_ann",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand", label: "thousand" }],
      required: true, placeholder: "e.g. 100000",
      helpText: "Expected annual production volume for this product family",
      min: 1, max: 100000000, step: 1,
    },
  ],
};

const materialGroup: ProFieldGroup = {
  title: "Material",
  description: "Direct material cost per unit",
  fields: [
    {
      id: "material_cost_per_unit", label: "Material Cost per Unit", symbol: "C_mat",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" },
      ],
      required: true, placeholder: "e.g. 25",
      helpText: "Direct material cost per unit including raw material and purchased components",
      min: 0, step: 0.01,
    },
  ],
};

const machineLaborGroup: ProFieldGroup = {
  title: "Machine and Labor",
  description: "Machine rate, labor rate, and operator count",
  fields: [
    {
      id: "machine_rate_per_hour", label: "Machine Hourly Rate", symbol: "R_m",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 85",
      helpText: "Fully loaded machine hourly rate including depreciation, energy, and maintenance",
      min: 0, max: 10000, step: 1,
    },
    {
      id: "labor_rate_per_hour", label: "Labor Rate per Hour", symbol: "R_l",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [
        { unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" },
        { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" },
        { unit: "TRY/h", label: "TRY/h" },
      ],
      required: true, placeholder: "e.g. 45",
      helpText: "Fully loaded labor rate including wages, benefits, and payroll taxes",
      min: 0, step: 0.5,
    },
    {
      id: "operator_count", label: "Number of Operators", symbol: "N_op",
      type: "number", unitFamily: "factor", defaultUnit: "count",
      allowedUnits: [{ unit: "count", label: "count" }],
      required: true, placeholder: "e.g. 1",
      helpText: "Number of operators required to run this machine",
      min: 0, max: 20, step: 1, defaultValue: 1,
    },
  ],
};

const overheadGroup: ProFieldGroup = {
  title: "Business Overhead",
  description: "Annual unallocated overhead costs not already in machine or labor rates",
  fields: [
    {
      id: "annual_unallocated_overhead", label: "Annual Unallocated Overhead", symbol: "C_oh",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" },
      ],
      required: true, placeholder: "e.g. 350000",
      helpText: "Annual overhead costs not already captured in machine or labor rates (supervision, quality, facility, administrative). Do not double-count.",
      min: 0, step: 100, defaultValue: 350000,
    },
  ],
};

const jobCostGroup: ProFieldGroup = {
  title: "Job-Specific Costs",
  description: "Optional costs specific to this job. Leave blank if not applicable.",
  fields: [
    {
      id: "tooling_consumables_cost_per_batch", label: "Tooling and Consumables per Batch", symbol: "C_tool",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 150",
      helpText: "Cutting tools, inserts, and process consumables for this batch",
      min: 0, step: 1, defaultValue: 0,
    },
    {
      id: "external_processing_cost_per_batch", label: "External Processing per Batch", symbol: "C_ext",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 0",
      helpText: "Heat treatment, coating, plating, or other outsourced operations",
      min: 0, step: 1, defaultValue: 0,
    },
    {
      id: "packaging_cost_per_batch", label: "Packaging Cost per Batch", symbol: "C_pkg",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 50",
      helpText: "Packaging materials and labor for this batch",
      min: 0, step: 1, defaultValue: 0,
    },
    {
      id: "freight_cost_per_batch", label: "Freight Cost per Batch", symbol: "C_frt",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 0",
      helpText: "Shipping and freight cost for this batch",
      min: 0, step: 1, defaultValue: 0,
    },
    {
      id: "other_job_cost_per_batch", label: "Other Job Cost per Batch", symbol: "C_oth",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 0",
      helpText: "Any other job-specific cost not captured above",
      min: 0, step: 1, defaultValue: 0,
    },
  ],
};

const scrapGroup: ProFieldGroup = {
  title: "Scrap and Contingency",
  description: "Scrap/rework rate and contingency buffer",
  fields: [
    {
      id: "scrap_rework_percent", label: "Scrap / Rework Rate", symbol: "p_scr",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 5",
      helpText: "Typical scrap or rework rate as a percentage of good production",
      min: 0, max: 99, step: 0.5, defaultValue: 5,
    },
    {
      id: "contingency_percent", label: "Contingency Allowance", symbol: "p_con",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: false, placeholder: "e.g. 3",
      helpText: "Contingency percentage applied after scrap allowance to cover unexpected costs",
      min: 0, max: 50, step: 0.5, defaultValue: 3,
    },
  ],
};

const pricingGroup: ProFieldGroup = {
  title: "Commercial Pricing",
  description: "Target revenue margin and current market quote for comparison (optional)",
  fields: [
    {
      id: "target_revenue_margin_percent", label: "Target Revenue Margin", symbol: "M_tgt",
      type: "number", unitFamily: "margin_rate", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 30",
      helpText: "Target profit margin as a percentage of the selling price (revenue margin, not markup)",
      min: 0, max: 99, step: 0.5, defaultValue: 30,
    },
    {
      id: "current_quote_per_unit", label: "Current Quote per Unit", symbol: "Q_cur",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: false, placeholder: "e.g. 90",
      helpText: "Existing customer price or competitor quote for gap analysis. Leave blank if not available.",
      min: 0, step: 0.01, defaultValue: 0,
    },
  ],
};

export const QUOTE_BUILDER_HIDDEN_FIELDS: ProFieldContract[] = [];

export const QUOTE_BUILDER_GROUPS: ProFieldGroup[] = [
  orderGroup,
  materialGroup,
  machineLaborGroup,
  overheadGroup,
  jobCostGroup,
  scrapGroup,
  pricingGroup,
];
