// SectorCalc PRO V2 — Machine Hourly Rate Proof Report Field Contract
// Tool-specific field definitions following the approved 23-input server contract.
// Groups: Capacity, Ownership, Facility/Operating, Labor, Commercial, Optional Financials, Optional Scenario

import type { ProFieldGroup } from "../proFieldContract";

const capacityGroup: ProFieldGroup = {
  title: "Machine Capacity",
  description: "Annual operating schedule, utilization, and planned downtime",
  fields: [
    {
      id: "planned_operating_hours", label: "Planned Operating Hours per Year", symbol: "H_sched",
      type: "number", unitFamily: "time", defaultUnit: "h",
      allowedUnits: [
        { unit: "h", label: "h" },
        { unit: "week", label: "week" },
        { unit: "day", label: "day" },
      ],
      required: true, placeholder: "e.g. 2000",
      helpText: "Total scheduled operating hours for this machine per year (before downtime and idle time)",
      min: 1, max: 8760, step: 10,
    },
    {
      id: "utilization_percent", label: "Productive Utilization", symbol: "U",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [
        { unit: "%", label: "%" },
        { unit: "factor 0-1", label: "factor" },
      ],
      required: true, placeholder: "e.g. 80",
      helpText: "Percentage of available hours that the machine is productively running",
      min: 0, max: 100, step: 1, defaultValue: 80,
    },
    {
      id: "planned_downtime_percent", label: "Planned Downtime Allowance", symbol: "D_plan",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [
        { unit: "%", label: "%" },
        { unit: "factor 0-1", label: "factor" },
      ],
      required: true, placeholder: "e.g. 5",
      helpText: "Planned downtime percentage (maintenance, holidays, breaks)",
      min: 0, max: 100, step: 1, defaultValue: 5,
    },
  ],
};

const ownershipGroup: ProFieldGroup = {
  title: "Machine Ownership",
  description: "Purchase price, residual value, economic life, and annual fixed costs",
  fields: [
    {
      id: "purchase_price", label: "Machine Purchase Price", symbol: "P",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 85000",
      helpText: "Initial purchase price of the machine",
      min: 0, step: 100,
    },
    {
      id: "residual_value", label: "Residual / Salvage Value", symbol: "R",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 5000",
      helpText: "Expected resale or scrap value at the end of economic life",
      min: 0, step: 100,
    },
    {
      id: "economic_life_years", label: "Economic Life", symbol: "N_y",
      type: "number", unitFamily: "time", defaultUnit: "year",
      allowedUnits: [
        { unit: "year", label: "year" },
        { unit: "month", label: "month" },
      ],
      required: true, placeholder: "e.g. 8",
      helpText: "Expected useful economic life of the machine for depreciation",
      min: 1, max: 50, step: 1,
    },
    {
      id: "maintenance_cost", label: "Annual Maintenance Cost", symbol: "M_maint",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" },
      ],
      required: true, placeholder: "e.g. 6000",
      helpText: "Average annual maintenance and repair cost for this machine",
      min: 0, step: 100,
    },
    {
      id: "insurance_tax_cost", label: "Annual Insurance and Tax Cost", symbol: "M_ins",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" },
      ],
      required: true, placeholder: "e.g. 2000",
      helpText: "Annual insurance premium and property tax allocated to this machine",
      min: 0, step: 50,
    },
  ],
};

const facilityOperatingGroup: ProFieldGroup = {
  title: "Facility and Operating Cost",
  description: "Facility space, power, consumables, and tooling costs",
  fields: [
    {
      id: "facility_allocation", label: "Annual Facility Allocation", symbol: "C_fac",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" },
      ],
      required: true, placeholder: "e.g. 18000",
      helpText: "Annual floor space cost, utilities (non-power), and facility services allocated to this machine",
      min: 0, step: 100,
    },
    {
      id: "machine_power_kw", label: "Average Machine Power Demand", symbol: "P_kW",
      type: "number", unitFamily: "power", defaultUnit: "kW",
      allowedUnits: [
        { unit: "kW", label: "kW" },
        { unit: "W", label: "W" },
        { unit: "MW", label: "MW" },
        { unit: "hp", label: "hp" },
      ],
      required: true, placeholder: "e.g. 15",
      helpText: "Average electrical power demand of the machine during operation",
      min: 0, step: 0.5,
    },
    {
      id: "electricity_price", label: "Electricity Price", symbol: "p_elec",
      type: "number", unitFamily: "energy_price", defaultUnit: "USD/kWh",
      allowedUnits: [
        { unit: "USD/kWh", label: "USD/kWh" }, { unit: "EUR/kWh", label: "EUR/kWh" },
        { unit: "GBP/kWh", label: "GBP/kWh" }, { unit: "USD/MWh", label: "USD/MWh" },
        { unit: "EUR/MWh", label: "EUR/MWh" },
      ],
      required: true, placeholder: "e.g. 0.12",
      helpText: "Cost of electricity per unit of energy consumption",
      min: 0, step: 0.001,
    },
    {
      id: "consumables_cost_per_hour", label: "Consumables Cost per Operating Hour", symbol: "C_con",
      type: "number", unitFamily: "cost_rate", defaultUnit: "USD/h",
      allowedUnits: [
        { unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" },
        { unit: "EUR/h", label: "EUR/h" }, { unit: "EUR/min", label: "EUR/min" },
        { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" },
      ],
      required: true, placeholder: "e.g. 2.50",
      helpText: "Average cost of coolants, lubricants, and process consumables per operating hour",
      min: 0, step: 0.01,
    },
    {
      id: "tooling_cost_per_hour", label: "Tooling Cost per Operating Hour", symbol: "C_tool",
      type: "number", unitFamily: "cost_rate", defaultUnit: "USD/h",
      allowedUnits: [
        { unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" },
        { unit: "EUR/h", label: "EUR/h" }, { unit: "EUR/min", label: "EUR/min" },
        { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" },
      ],
      required: true, placeholder: "e.g. 3.00",
      helpText: "Average cutting tool, insert, and wear-part cost per operating hour",
      min: 0, step: 0.01,
    },
  ],
};

const laborGroup: ProFieldGroup = {
  title: "Labor",
  description: "Operator count and fully loaded labor rate",
  fields: [
    {
      id: "operator_count", label: "Number of Operators", symbol: "N_op",
      type: "number", unitFamily: "factor", defaultUnit: "count",
      allowedUnits: [
        { unit: "count", label: "count" },
      ],
      required: true, placeholder: "e.g. 1",
      helpText: "Number of operators required to run this machine (may be shared across multiple machines)",
      min: 0, max: 10, step: 1, defaultValue: 1,
    },
    {
      id: "labor_rate_per_hour", label: "Fully Loaded Labor Rate", symbol: "R_l",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [
        { unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" },
        { unit: "USD/day", label: "USD/day" },
        { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" },
        { unit: "TRY/h", label: "TRY/h" },
      ],
      required: true, placeholder: "e.g. 45",
      helpText: "Fully loaded labor rate including wages, benefits, payroll taxes, and supervision allocation",
      min: 0, step: 0.5,
    },
  ],
};

const commercialGroup: ProFieldGroup = {
  title: "Commercial Rate",
  description: "Current shop rate and target revenue margin for pricing decisions",
  fields: [
    {
      id: "current_shop_rate", label: "Current Shop Rate", symbol: "R_shop",
      type: "number", unitFamily: "shop_rate", defaultUnit: "USD/h",
      allowedUnits: [
        { unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" },
        { unit: "USD/day", label: "USD/day" },
        { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" },
        { unit: "TRY/h", label: "TRY/h" },
      ],
      required: true, placeholder: "e.g. 85",
      helpText: "Current shop rate charged to customers per hour",
      min: 0, step: 0.5,
    },
    {
      id: "target_margin_percent", label: "Target Revenue Margin", symbol: "M_tgt",
      type: "number", unitFamily: "margin_rate", defaultUnit: "%",
      allowedUnits: [
        { unit: "%", label: "%" },
        { unit: "factor 0-1", label: "factor" },
      ],
      required: true, placeholder: "e.g. 25",
      helpText: "Target profit margin as a percentage of the selling price (revenue margin, not markup)",
      min: 0, max: 99, step: 0.5, defaultValue: 25,
    },
  ],
};

const optionalFinancialGroup: ProFieldGroup = {
  title: "Optional Financial Assumptions",
  description: "Financing cost and other fixed costs. Collapsed by default.",
  fields: [
    {
      id: "financing_cost_percent", label: "Annual Financing Cost Rate", symbol: "i_f",
      type: "number", unitFamily: "interest_rate", defaultUnit: "%/year",
      allowedUnits: [
        { unit: "%/year", label: "%/year" },
        { unit: "%/month", label: "%/month" },
        { unit: "factor/year", label: "factor/year" },
      ],
      required: false, placeholder: "e.g. 5",
      helpText: "Interest rate or cost of capital for financing the machine purchase. Leave blank if fully owned.",
      min: 0, max: 100, step: 0.1, defaultValue: 0,
    },
    {
      id: "other_annual_fixed_cost", label: "Other Annual Fixed Cost", symbol: "C_other",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" },
      ],
      required: false, placeholder: "e.g. 0",
      helpText: "Any other annual fixed cost not captured above (software licenses, calibration contracts, etc.)",
      min: 0, step: 100, defaultValue: 0,
    },
  ],
};

const optionalScenarioGroup: ProFieldGroup = {
  title: "Optional Part Cost and Capacity Scenario",
  description: "Enter all four fields to calculate part cost and capacity feasibility. Incomplete scenario inputs block calculation and do not consume a credit.",
  fields: [
    {
      id: "annual_production_volume", label: "Annual Production Volume", symbol: "V_ann",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [
        { unit: "units", label: "units" },
        { unit: "thousand", label: "1,000 units" },
      ],
      required: false, placeholder: "e.g. 100000",
      helpText: "Expected annual production volume for a representative part family on this machine",
      min: 0, step: 1,
    },
    {
      id: "cycle_time_seconds", label: "Cycle Time per Unit", symbol: "t_c",
      type: "number", unitFamily: "time", defaultUnit: "sec",
      allowedUnits: [
        { unit: "sec", label: "s" },
        { unit: "min", label: "min" },
        { unit: "h", label: "h" },
      ],
      required: false, placeholder: "e.g. 720",
      helpText: "Processing cycle time per unit on this machine",
      min: 0, step: 1,
    },
    {
      id: "setup_time_minutes", label: "Setup Time per Batch", symbol: "t_su",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [
        { unit: "min", label: "min" },
        { unit: "h", label: "h" },
        { unit: "sec", label: "s" },
      ],
      required: false, placeholder: "e.g. 8",
      helpText: "Average setup time between batches on this machine",
      min: 0, step: 1,
    },
    {
      id: "average_batch_quantity", label: "Average Batch Quantity", symbol: "Q_batch",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [
        { unit: "units", label: "units" },
        { unit: "thousand", label: "1,000 units" },
      ],
      required: false, placeholder: "e.g. 500",
      helpText: "Average number of units per production batch",
      min: 1, step: 1,
    },
  ],
};

export const MACHINE_RATE_GROUPS: ProFieldGroup[] = [
  capacityGroup,
  ownershipGroup,
  facilityOperatingGroup,
  laborGroup,
  commercialGroup,
  optionalFinancialGroup,
  optionalScenarioGroup,
];

export const MACHINE_RATE_FIELD_IDS = [
  "planned_operating_hours", "utilization_percent", "planned_downtime_percent",
  "purchase_price", "residual_value", "economic_life_years",
  "maintenance_cost", "insurance_tax_cost",
  "facility_allocation", "machine_power_kw", "electricity_price",
  "consumables_cost_per_hour", "tooling_cost_per_hour",
  "operator_count", "labor_rate_per_hour",
  "current_shop_rate", "target_margin_percent",
  "financing_cost_percent", "other_annual_fixed_cost",
  "annual_production_volume", "cycle_time_seconds", "setup_time_minutes", "average_batch_quantity",
];
