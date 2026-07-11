// SectorCalc PRO V2 — OEE Loss Monetization & Improvement Business Case Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const oeeTimeGroup: ProFieldGroup = {
  title: "Production Time Parameters",
  description: "OEE time model inputs for availability calculation",
  fields: [
    {
      id: "planned_production_time_seconds", label: "Planned Production Time", symbol: "PPT",
      type: "number", unitFamily: "time", defaultUnit: "sec",
      allowedUnits: [{ unit: "sec", label: "sec" }, { unit: "min", label: "min" }, { unit: "h", label: "h" }],
      required: true, placeholder: "e.g. 28800", helpText: "Total planned production time in seconds (shift length)", min: 0, step: 60,
    },
    {
      id: "operating_time_seconds", label: "Operating Time", symbol: "OT",
      type: "number", unitFamily: "time", defaultUnit: "sec",
      allowedUnits: [{ unit: "sec", label: "sec" }, { unit: "min", label: "min" }, { unit: "h", label: "h" }],
      required: true, placeholder: "e.g. 25200", helpText: "Actual operating time after planned downtime (stops, breaks)", min: 0, step: 60,
    },
    {
      id: "net_operating_time_seconds", label: "Net Operating Time", symbol: "NOT",
      type: "number", unitFamily: "time", defaultUnit: "sec",
      allowedUnits: [{ unit: "sec", label: "sec" }, { unit: "min", label: "min" }, { unit: "h", label: "h" }],
      required: true, placeholder: "e.g. 23000", helpText: "Operating time minus unplanned downtime", min: 0, step: 60,
    },
  ],
};

const performanceGroup: ProFieldGroup = {
  title: "Performance & Quality Parameters",
  description: "Cycle time, production counts, and quality data",
  fields: [
    {
      id: "ideal_cycle_time_per_part", label: "Ideal Cycle Time", symbol: "CT",
      type: "number", unitFamily: "time", defaultUnit: "sec",
      allowedUnits: [{ unit: "sec", label: "sec" }, { unit: "min", label: "min" }],
      required: true, placeholder: "e.g. 30", helpText: "Ideal (design) cycle time per part in seconds", min: 0, step: 0.1,
    },
    {
      id: "total_parts_produced", label: "Total Parts Produced", symbol: "P_total",
      type: "number", unitFamily: "production_rate", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand units", label: "K units" }],
      required: true, placeholder: "e.g. 900", helpText: "Total parts produced in the measurement period", min: 0, step: 1,
    },
    {
      id: "good_parts", label: "Good Parts", symbol: "P_good",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand units", label: "K units" }],
      required: true, placeholder: "e.g. 855", helpText: "Parts meeting quality standards (first-pass yield)", min: 0, step: 1,
    },
  ],
};

const monetizationGroup: ProFieldGroup = {
  title: "Monetization & Investment",
  description: "Financial parameters for loss monetization and improvement ROI",
  fields: [
    {
      id: "hourly_contribution", label: "Hourly Contribution", symbol: "C_h",
      type: "number", unitFamily: "cost_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 100", helpText: "Contribution (profit + fixed cost coverage) per operating hour", min: 0, step: 1,
    },
    {
      id: "improvement_investment", label: "Improvement Investment", symbol: "I",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 50000", helpText: "Total investment required for OEE improvement initiative", min: 0, step: 100,
    },
    {
      id: "operating_hours_per_year", label: "Operating Hours per Year", symbol: "H_y",
      type: "number", unitFamily: "time", defaultUnit: "h",
      allowedUnits: [{ unit: "h", label: "h" }, { unit: "day", label: "day" }],
      required: true, placeholder: "e.g. 2000", helpText: "Total operating hours per year (shift schedule × weeks)", min: 0, step: 100,
    },
  ],
};

export const OEE_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const OEE_GROUPS: ProFieldGroup[] = [
  oeeTimeGroup, performanceGroup, monetizationGroup,
];

export const OEE_FIELD_IDS = [
  "planned_production_time_seconds", "operating_time_seconds", "net_operating_time_seconds",
  "ideal_cycle_time_per_part", "total_parts_produced", "good_parts",
  "hourly_contribution", "improvement_investment", "operating_hours_per_year",
];
