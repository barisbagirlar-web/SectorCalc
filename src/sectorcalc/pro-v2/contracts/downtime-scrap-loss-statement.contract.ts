// SectorCalc PRO V2 — Downtime & Scrap Loss Statement Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const eventParametersGroup: ProFieldGroup = {
  title: "Event Parameters",
  description: "Downtime event details and frequency",
  fields: [
    {
      id: "downtime_hours", label: "Downtime Hours", symbol: "Dt",
      type: "number", unitFamily: "time", defaultUnit: "h",
      allowedUnits: [{ unit: "h", label: "h" }, { unit: "min", label: "min" }, { unit: "day", label: "day" }],
      required: true, placeholder: "e.g. 4", helpText: "Total downtime hours for the event", min: 0, step: 0.5,
    },
    {
      id: "hourly_contribution_rate", label: "Hourly Contribution Rate", symbol: "C_h",
      type: "number", unitFamily: "cost_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 200", helpText: "Lost contribution (profit + fixed cost coverage) per hour of production", min: 0, step: 1,
    },
    {
      id: "annual_event_frequency", label: "Annual Event Frequency", symbol: "F",
      type: "number", unitFamily: "factor", defaultUnit: "events/year",
      allowedUnits: [{ unit: "events/year", label: "events/yr" }, { unit: "events/month", label: "events/mo" }],
      required: true, placeholder: "e.g. 12", helpText: "Estimated number of similar events per year", min: 1, step: 1,
    },
  ],
};

const scrapParametersGroup: ProFieldGroup = {
  title: "Scrap Parameters",
  description: "Scrap quantities and material cost",
  fields: [
    {
      id: "scrap_quantity", label: "Scrap Quantity", symbol: "Q_s",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "kg", label: "kg" }, { unit: "lb", label: "lb" }],
      required: true, placeholder: "e.g. 150", helpText: "Quantity of scrap generated from the event", min: 0, step: 1,
    },
    {
      id: "material_cost_per_unit", label: "Material Cost per Unit", symbol: "C_m",
      type: "number", unitFamily: "cost_per_unit", defaultUnit: "USD/unit",
      allowedUnits: [{ unit: "USD/unit", label: "USD/unit" }, { unit: "EUR/unit", label: "EUR/unit" }, { unit: "GBP/unit", label: "GBP/unit" }, { unit: "TRY/unit", label: "TRY/unit" }, { unit: "USD/kg", label: "USD/kg" }],
      required: true, placeholder: "e.g. 25", helpText: "Material cost per scrapped unit", min: 0, step: 0.01,
    },
  ],
};

const reworkParametersGroup: ProFieldGroup = {
  title: "Rework Parameters",
  description: "Rework hours and labor recovery cost",
  fields: [
    {
      id: "rework_hours", label: "Rework Hours", symbol: "H_r",
      type: "number", unitFamily: "time", defaultUnit: "h",
      allowedUnits: [{ unit: "h", label: "h" }, { unit: "min", label: "min" }],
      required: true, placeholder: "e.g. 8", helpText: "Hours spent on rework due to the event", min: 0, step: 0.5,
    },
    {
      id: "rework_labor_rate", label: "Rework Labor Rate", symbol: "R_r",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 55", helpText: "Labor rate for rework activity", min: 0, step: 0.5,
    },
  ],
};

const disposalGroup: ProFieldGroup = {
  title: "Disposal & Inspection",
  description: "Fixed costs for disposal and inspection",
  fields: [
    {
      id: "disposal_inspection_cost", label: "Disposal & Inspection Cost", symbol: "C_di",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 500", helpText: "Combined cost of scrap disposal and quality inspection", min: 0, step: 10,
    },
  ],
};

export const DOWNTIME_SCRAP_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.95, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const DOWNTIME_SCRAP_GROUPS: ProFieldGroup[] = [
  eventParametersGroup, scrapParametersGroup, reworkParametersGroup, disposalGroup,
];

export const DOWNTIME_SCRAP_FIELD_IDS = [
  "downtime_hours", "hourly_contribution_rate", "annual_event_frequency",
  "scrap_quantity", "material_cost_per_unit",
  "rework_hours", "rework_labor_rate",
  "disposal_inspection_cost",
];
