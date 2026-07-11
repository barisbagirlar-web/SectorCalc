// SectorCalc PRO V2 — Setup Time Reduction ROI (SMED) Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const timeGroup: ProFieldGroup = {
  title: "Setup Time Parameters",
  description: "Current and future setup time comparison",
  fields: [
    {
      id: "current_setup_time_minutes", label: "Current Setup Time", symbol: "T_cur",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [{ unit: "min", label: "min" }, { unit: "h", label: "h" }],
      required: true, placeholder: "e.g. 30", helpText: "Current average setup/changeover time", min: 0, step: 1,
    },
    {
      id: "future_setup_time_minutes", label: "Target Setup Time (After SMED)", symbol: "T_fut",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [{ unit: "min", label: "min" }, { unit: "h", label: "h" }],
      required: true, placeholder: "e.g. 10", helpText: "Target setup time after SMED implementation", min: 0, step: 1,
    },
  ],
};

const volumeGroup: ProFieldGroup = {
  title: "Setup Volume & Cost Parameters",
  description: "Number of changeovers per year and associated labor/machine rates",
  fields: [
    {
      id: "setups_per_year", label: "Setups per Year", symbol: "N",
      type: "number", unitFamily: "factor", defaultUnit: "setups/year",
      allowedUnits: [{ unit: "setups/year", label: "setups/yr" }, { unit: "setups/month", label: "setups/mo" }],
      required: true, placeholder: "e.g. 500", helpText: "Number of changeover/setup events per year", min: 0, step: 1,
    },
    {
      id: "machine_hourly_rate", label: "Machine Hourly Rate", symbol: "R_m",
      type: "number", unitFamily: "shop_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 85", helpText: "Fully loaded machine rate per hour", min: 0, step: 1,
    },
    {
      id: "labor_rate_per_hour", label: "Labor Rate per Hour", symbol: "R_l",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 45", helpText: "Fully loaded labor rate for setup operators", min: 0, step: 0.5,
    },
    {
      id: "operator_count", label: "Operator Count", symbol: "O",
      type: "number", unitFamily: "factor", defaultUnit: "operators",
      allowedUnits: [{ unit: "operators", label: "operators" }],
      required: true, placeholder: "e.g. 2", helpText: "Number of operators involved in each setup", min: 1, step: 1,
    },
  ],
};

const investmentGroup: ProFieldGroup = {
  title: "Investment & Payback",
  description: "SMED implementation cost",
  fields: [
    {
      id: "implementation_cost", label: "SMED Implementation Cost", symbol: "C_imp",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 35000", helpText: "Total cost of SMED implementation (engineering, training, tooling modifications)", min: 0, step: 100,
    },
  ],
};

export const SMED_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const SMED_GROUPS: ProFieldGroup[] = [
  timeGroup, volumeGroup, investmentGroup,
];

export const SMED_FIELD_IDS = [
  "current_setup_time_minutes", "future_setup_time_minutes",
  "setups_per_year", "machine_hourly_rate", "labor_rate_per_hour", "operator_count",
  "implementation_cost",
];
