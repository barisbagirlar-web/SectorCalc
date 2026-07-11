// SectorCalc PRO V2 — Motor/Compressor Replacement ROI Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const currentEquipmentGroup: ProFieldGroup = {
  title: "Current Equipment",
  description: "Existing motor/compressor specifications",
  fields: [
    {
      id: "current_power_kw", label: "Current Motor Power", symbol: "P_c",
      type: "number", unitFamily: "power", defaultUnit: "kW",
      allowedUnits: [{ unit: "kW", label: "kW" }, { unit: "HP", label: "HP" }, { unit: "W", label: "W" }, { unit: "MW", label: "MW" }],
      required: true, placeholder: "e.g. 75", helpText: "Power rating of the current motor/compressor", min: 0, step: 0.5,
    },
    {
      id: "current_maintenance_cost", label: "Current Annual Maintenance", symbol: "M_c",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 5000", helpText: "Current annual maintenance cost", min: 0, step: 100,
    },
  ],
};

const proposedEquipmentGroup: ProFieldGroup = {
  title: "Proposed Replacement",
  description: "New motor/compressor specifications and cost",
  fields: [
    {
      id: "proposed_power_kw", label: "Proposed Motor Power", symbol: "P_p",
      type: "number", unitFamily: "power", defaultUnit: "kW",
      allowedUnits: [{ unit: "kW", label: "kW" }, { unit: "HP", label: "HP" }, { unit: "W", label: "W" }, { unit: "MW", label: "MW" }],
      required: true, placeholder: "e.g. 60", helpText: "Power rating of the proposed replacement unit", min: 0, step: 0.5,
    },
    {
      id: "proposed_maintenance_cost", label: "Proposed Annual Maintenance", symbol: "M_p",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 3000", helpText: "Expected annual maintenance cost for replacement", min: 0, step: 100,
    },
    {
      id: "replacement_cost", label: "Replacement Cost", symbol: "C_r",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 16000", helpText: "Total cost to purchase and install replacement", min: 0, step: 500,
    },
  ],
};

const operatingParametersGroup: ProFieldGroup = {
  title: "Operating Parameters",
  description: "Energy usage, operating profile, and financial assumptions",
  fields: [
    {
      id: "annual_operating_hours", label: "Annual Operating Hours", symbol: "H",
      type: "number", unitFamily: "time", defaultUnit: "h",
      allowedUnits: [{ unit: "h", label: "h" }, { unit: "min", label: "min" }, { unit: "day", label: "day" }, { unit: "week", label: "week" }],
      required: true, placeholder: "e.g. 6000", helpText: "Total operating hours per year", min: 0, step: 100,
    },
    {
      id: "energy_price_per_kwh", label: "Energy Price", symbol: "E",
      type: "number", unitFamily: "energy_price", defaultUnit: "USD/kWh",
      allowedUnits: [{ unit: "USD/kWh", label: "USD/kWh" }, { unit: "EUR/kWh", label: "EUR/kWh" }, { unit: "TRY/kWh", label: "TRY/kWh" }, { unit: "USD/MWh", label: "USD/MWh" }],
      required: true, placeholder: "e.g. 0.12", helpText: "Electricity price per kWh", min: 0, step: 0.01,
    },
    {
      id: "useful_life_years", label: "Useful Life", symbol: "Y",
      type: "number", unitFamily: "finance_period", defaultUnit: "years",
      allowedUnits: [{ unit: "years", label: "years" }, { unit: "months", label: "months" }],
      required: true, placeholder: "e.g. 10", helpText: "Expected useful life of the replacement equipment", min: 1, step: 1,
    },
    {
      id: "discount_rate", label: "Discount Rate", symbol: "r",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }, { unit: "basis points", label: "bp" }],
      required: true, placeholder: "e.g. 8", helpText: "Discount rate for NPV calculation", min: 0, max: 100, step: 0.5,
    },
  ],
};

export const MOTOR_ROI_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const MOTOR_ROI_GROUPS: ProFieldGroup[] = [
  currentEquipmentGroup, proposedEquipmentGroup, operatingParametersGroup,
];

export const MOTOR_ROI_FIELD_IDS = [
  "current_power_kw", "current_maintenance_cost",
  "proposed_power_kw", "proposed_maintenance_cost", "replacement_cost",
  "annual_operating_hours", "energy_price_per_kwh", "useful_life_years", "discount_rate",
];
