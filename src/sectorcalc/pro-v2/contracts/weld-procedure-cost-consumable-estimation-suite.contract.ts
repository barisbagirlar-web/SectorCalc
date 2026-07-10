// SectorCalc PRO V2 — Weld Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const jobGeometryGroup: ProFieldGroup = {
  title: "Job Geometry",
  description: "Physical weld joint parameters",
  fields: [
    {
      id: "weld_length", label: "Weld Length", symbol: "L",
      type: "number", unitFamily: "length", defaultUnit: "m",
      allowedUnits: [{ unit: "m", label: "m" }, { unit: "ft", label: "ft" }, { unit: "in", label: "in" }, { unit: "mm", label: "mm" }, { unit: "cm", label: "cm" }, { unit: "km", label: "km" }, { unit: "yd", label: "yd" }, { unit: "mile", label: "mi" }],
      required: true, placeholder: "e.g. 12", helpText: "Total length of the weld joint", min: 0, step: 0.1,
    },
    {
      id: "weld_throat", label: "Weld Size / Throat", symbol: "a",
      type: "number", unitFamily: "small_length", defaultUnit: "mm",
      allowedUnits: [{ unit: "mm", label: "mm" }, { unit: "in", label: "in" }, { unit: "µm", label: "µm" }, { unit: "cm", label: "cm" }, { unit: "m", label: "m" }],
      required: true, placeholder: "e.g. 6", helpText: "Weld throat thickness (leg size for fillet weld)", min: 0, step: 0.5,
    },
    {
      id: "material", label: "Material", symbol: "Mat",
      type: "select",
      options: [{ value: "carbon_steel", label: "Carbon steel" }, { value: "stainless_steel", label: "Stainless steel" }, { value: "aluminum", label: "Aluminum" }],
      required: true, helpText: "Base material being welded. Density is handled internally.", defaultValue: "carbon_steel",
    },
  ],
};

const consumablesGroup: ProFieldGroup = {
  title: "Consumables",
  description: "Welding wire, electrode, and shielding gas costs",
  fields: [
    {
      id: "wire_cost", label: "Wire / Electrode Cost", symbol: "C_w",
      type: "number", unitFamily: "material_cost", defaultUnit: "USD/kg",
      allowedUnits: [{ unit: "USD/kg", label: "USD/kg" }, { unit: "USD/lb", label: "USD/lb" }, { unit: "EUR/kg", label: "EUR/kg" }, { unit: "EUR/lb", label: "EUR/lb" }, { unit: "GBP/kg", label: "GBP/kg" }, { unit: "TRY/kg", label: "TRY/kg" }, { unit: "USD/tonne", label: "USD/t" }, { unit: "USD/g", label: "USD/g" }],
      required: true, placeholder: "e.g. 4.2", helpText: "Cost of welding wire or electrode per unit mass", min: 0, step: 0.01,
    },
    {
      id: "gas_cost", label: "Shielding Gas Cost", symbol: "C_g",
      type: "number", unitFamily: "cost_rate", defaultUnit: "USD/min",
      allowedUnits: [{ unit: "USD/min", label: "USD/min" }, { unit: "USD/h", label: "USD/h" }, { unit: "EUR/min", label: "EUR/min" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/min", label: "GBP/min" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/min", label: "TRY/min" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 0.18", helpText: "Shielding gas consumption cost per time unit", min: 0, step: 0.01,
    },
  ],
};

const timeAndShopGroup: ProFieldGroup = {
  title: "Time and Shop Rates",
  description: "Labor and overhead rates for the welding operation",
  fields: [
    {
      id: "arc_time", label: "Arc Time", symbol: "t_a",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [{ unit: "min", label: "min" }, { unit: "h", label: "h" }, { unit: "sec", label: "s" }, { unit: "day", label: "day" }, { unit: "week", label: "week" }],
      required: true, placeholder: "e.g. 45", helpText: "Actual arc-on time (welding time only)", min: 0, step: 1,
    },
    {
      id: "total_job_time", label: "Total Job Time", symbol: "t_t",
      type: "number", unitFamily: "time", defaultUnit: "min",
      allowedUnits: [{ unit: "min", label: "min" }, { unit: "h", label: "h" }, { unit: "sec", label: "s" }, { unit: "day", label: "day" }, { unit: "week", label: "week" }],
      required: true, placeholder: "e.g. 60", helpText: "Total job time including setup, fit-up, and inspection", min: 0, step: 1,
    },
    {
      id: "labor_rate", label: "Labor Rate", symbol: "R_l",
      type: "number", unitFamily: "labor_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" }, { unit: "USD/day", label: "USD/day" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 55", helpText: "Welder labor rate", min: 0, step: 0.5,
    },
    {
      id: "shop_overhead_rate", label: "Shop Overhead Rate", symbol: "R_o",
      type: "number", unitFamily: "shop_rate", defaultUnit: "USD/h",
      allowedUnits: [{ unit: "USD/h", label: "USD/h" }, { unit: "USD/min", label: "USD/min" }, { unit: "USD/day", label: "USD/day" }, { unit: "EUR/h", label: "EUR/h" }, { unit: "GBP/h", label: "GBP/h" }, { unit: "TRY/h", label: "TRY/h" }],
      required: true, placeholder: "e.g. 25", helpText: "Shop overhead rate (facility, equipment, supervision)", min: 0, step: 0.5,
    },
  ],
};

const quoteAssumptionsGroup: ProFieldGroup = {
  title: "Quote Assumptions",
  description: "Deposition efficiency, planned pricing, and contingency",
  fields: [
    {
      id: "deposition_efficiency", label: "Deposition Efficiency", symbol: "η",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }, { unit: "basis points", label: "bp" }, { unit: "ppm", label: "ppm" }],
      required: true, placeholder: "e.g. 85", helpText: "Deposition efficiency of the welding process", min: 0, max: 100, step: 1, defaultValue: 85,
    },
    {
      id: "planned_quote", label: "Planned Customer Quote", symbol: "Q",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }, { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" }, { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" }],
      required: false, placeholder: "e.g. 190", helpText: "Planned customer quote amount for margin analysis", min: 0, step: 1,
    },
    {
      id: "contingency", label: "Contingency Allowance", symbol: "δ",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 10", helpText: "Contingency added to cover unforeseen costs", min: 0, max: 100, step: 1, defaultValue: 10,
    },
  ],
};

export const WELD_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "material_density", label: "Material Density", symbol: "ρ", type: "number", unitFamily: "density", defaultUnit: "g/cm³", allowedUnits: [{ unit: "g/cm³", label: "g/cm³" }, { unit: "kg/m³", label: "kg/m³" }, { unit: "lb/ft³", label: "lb/ft³" }], required: false, defaultValue: 7.85, hidden: true },
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const WELD_GROUPS: ProFieldGroup[] = [
  jobGeometryGroup, consumablesGroup, timeAndShopGroup, quoteAssumptionsGroup,
];

export const WELD_FIELD_IDS = [
  "weld_length", "weld_throat", "material",
  "wire_cost", "gas_cost",
  "arc_time", "total_job_time", "labor_rate", "shop_overhead_rate",
  "deposition_efficiency", "planned_quote", "contingency",
];
