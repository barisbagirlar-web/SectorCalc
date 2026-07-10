// SectorCalc PRO V2 — Loss-Making Job Detector Field Contract
// Groups: Job & Revenue, Material, Machine & Setup, Labor, External & Job Costs, Overhead & Scrap, Profitability Target

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const jobRevenueGroup: ProFieldGroup = {
  title: "Job and Revenue",
  description: "Batch quantity and selling price",
  fields: [
    {
      id: "batch_quantity", label: "Batch Quantity", symbol: "Q_batch",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "hundred", label: "100 units" }],
      required: true, placeholder: "e.g. 500",
      helpText: "Number of units in this job batch",
      min: 1, max: 10000000, step: 1,
    },
    {
      id: "selling_price_per_unit", label: "Selling Price per Unit", symbol: "P_sell",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 95",
      helpText: "Price charged to the customer per unit",
      min: 0, step: 0.01,
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
      ],
      required: true, placeholder: "e.g. 25",
      helpText: "Raw material and purchased component cost per unit",
      min: 0, step: 0.01,
    },
  ],
};

const machineSetupGroup: ProFieldGroup = {
  title: "Machine and Setup",
  description: "Machine hourly rate, cycle time, and setup time",
  fields: [
    {
      id: "machine_rate_per_hour", label: "Machine Hourly Rate", symbol: "R_m",
      type: "number", unitFamily: "shop_rate", defaultUnit: "USD/h",
      allowedUnits: [
        { unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" },
        { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" },
      ],
      required: true, placeholder: "e.g. 85",
      helpText: "Fully loaded machine hourly rate including depreciation, energy, and maintenance",
      min: 0, max: 10000, step: 1,
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
  ],
};

const laborGroup: ProFieldGroup = {
  title: "Labor",
  description: "Operator count and loaded labor rate",
  fields: [
    {
      id: "operator_count", label: "Number of Operators", symbol: "N_op",
      type: "number", unitFamily: "factor", defaultUnit: "count",
      allowedUnits: [{ unit: "count", label: "count" }],
      required: true, placeholder: "e.g. 1",
      helpText: "Number of operators running this machine",
      min: 0, max: 20, step: 1, defaultValue: 1,
    },
    {
      id: "labor_rate_per_hour", label: "Labor Rate per Hour", symbol: "R_l",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [
        { unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" },
        { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" },
      ],
      required: true, placeholder: "e.g. 45",
      helpText: "Fully loaded labor rate including wages, benefits, and payroll taxes",
      min: 0, step: 0.5,
    },
  ],
};

const externalJobCostGroup: ProFieldGroup = {
  title: "External and Job-Specific Costs",
  description: "Optional costs specific to this job. Leave at 0 if not applicable.",
  fields: [
    {
      id: "external_processing_per_batch", label: "External Processing per Batch", symbol: "C_ext",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 0",
      helpText: "Heat treatment, coating, plating, or other outsourced operations",
      min: 0, step: 1, defaultValue: 0,
    },
    {
      id: "packaging_freight_per_batch", label: "Packaging and Freight per Batch", symbol: "C_pkg",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 50",
      helpText: "Packaging materials and shipping cost for this batch",
      min: 0, step: 1, defaultValue: 0,
    },
    {
      id: "other_job_cost_per_batch", label: "Other Job Cost per Batch", symbol: "C_oth",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: false, placeholder: "e.g. 0",
      helpText: "Commissions, royalties, or other job-specific costs",
      min: 0, step: 1, defaultValue: 0,
    },
  ],
};

const overheadScrapGroup: ProFieldGroup = {
  title: "Overhead and Scrap",
  description: "Allocated overhead and scrap/rework allowance",
  fields: [
    {
      id: "allocated_overhead", label: "Allocated Overhead per Batch", symbol: "C_oh",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 350",
      helpText: "Overhead cost allocated to this batch (supervision, facility, quality, administrative)",
      min: 0, step: 10,
    },
    {
      id: "scrap_rework_percent", label: "Scrap / Rework Rate", symbol: "p_scr",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 5",
      helpText: "Typical scrap or rework rate as a percentage of good production",
      min: 0, max: 99, step: 0.5, defaultValue: 5,
    },
  ],
};

const profitabilityGroup: ProFieldGroup = {
  title: "Profitability Target",
  description: "Target revenue margin and annual volume for risk assessment",
  fields: [
    {
      id: "target_revenue_margin_percent", label: "Target Revenue Margin", symbol: "M_tgt",
      type: "number", unitFamily: "margin_rate", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 30",
      helpText: "Target profit margin as a percentage of selling price (revenue margin, not markup)",
      min: 0, max: 99, step: 0.5, defaultValue: 30,
    },
    {
      id: "annual_volume_units", label: "Annual Volume", symbol: "V_ann",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand", label: "1,000 units" }],
      required: true, placeholder: "e.g. 100000",
      helpText: "Expected annual production volume to calculate annualized money at risk",
      min: 0, step: 1,
    },
  ],
};

export const LOSS_DETECTOR_HIDDEN_FIELDS: ProFieldContract[] = [];

export const LOSS_DETECTOR_GROUPS: ProFieldGroup[] = [
  jobRevenueGroup,
  materialGroup,
  machineSetupGroup,
  laborGroup,
  externalJobCostGroup,
  overheadScrapGroup,
  profitabilityGroup,
];
