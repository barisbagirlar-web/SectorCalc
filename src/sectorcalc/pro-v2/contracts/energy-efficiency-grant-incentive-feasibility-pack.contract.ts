// SectorCalc PRO V2 — Energy Efficiency Grant / Incentive Feasibility Pack Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const energyBaselineGroup: ProFieldGroup = {
  title: "Energy Baseline",
  description: "Current energy consumption and cost parameters",
  fields: [
    {
      id: "baseline_energy_consumption_kwh", label: "Baseline Energy Consumption", symbol: "E_b",
      type: "number", unitFamily: "energy", defaultUnit: "kWh",
      allowedUnits: [{ unit: "kWh", label: "kWh" }, { unit: "MWh", label: "MWh" }, { unit: "GWh", label: "GWh" }, { unit: "MJ", label: "MJ" }],
      required: true, placeholder: "e.g. 500000", helpText: "Current annual energy consumption in kWh", min: 0, step: 1000,
    },
    {
      id: "baseline_energy_price_per_kwh", label: "Energy Price", symbol: "p",
      type: "number", unitFamily: "energy_price", defaultUnit: "USD/kWh",
      allowedUnits: [{ unit: "USD/kWh", label: "USD/kWh" }, { unit: "EUR/kWh", label: "EUR/kWh" }, { unit: "TRY/kWh", label: "TRY/kWh" }, { unit: "USD/MWh", label: "USD/MWh" }],
      required: true, placeholder: "e.g. 0.12", helpText: "Current electricity price per kWh", min: 0, step: 0.01,
    },
    {
      id: "projected_saving_pct", label: "Projected Energy Saving", symbol: "η",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 30", helpText: "Expected energy reduction percentage from the project", min: 0, max: 100, step: 1,
    },
  ],
};

const projectCostGroup: ProFieldGroup = {
  title: "Project Costs & Grant",
  description: "Capital costs, eligible expenses, and expected grant/incentive",
  fields: [
    {
      id: "gross_project_cost", label: "Gross Project Cost", symbol: "C_g",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 120000", helpText: "Total gross cost of the energy efficiency project", min: 0, step: 1000,
    },
    {
      id: "eligible_project_cost", label: "Eligible Project Cost", symbol: "C_e",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 100000", helpText: "Portion of project cost eligible for grant/incentive", min: 0, step: 1000,
    },
    {
      id: "grant_incentive_amount", label: "Grant / Incentive Amount", symbol: "G",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 35000", helpText: "Expected grant or incentive amount", min: 0, step: 500,
    },
  ],
};

const financialAssumptionsGroup: ProFieldGroup = {
  title: "Financial Assumptions",
  description: "Maintenance, useful life, discount rate, and price escalation",
  fields: [
    {
      id: "annual_maintenance_cost", label: "Annual Maintenance Cost", symbol: "M",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
      ],
      required: true, placeholder: "e.g. 5000", helpText: "Expected annual maintenance cost for the new equipment", min: 0, step: 500,
    },
    {
      id: "useful_life_years", label: "Useful Life", symbol: "Y",
      type: "number", unitFamily: "finance_period", defaultUnit: "years",
      allowedUnits: [{ unit: "years", label: "years" }, { unit: "months", label: "months" }],
      required: true, placeholder: "e.g. 10", helpText: "Expected useful life of the energy efficiency investment", min: 1, step: 1,
    },
    {
      id: "discount_rate", label: "Discount Rate", symbol: "r",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }, { unit: "basis points", label: "bp" }],
      required: true, placeholder: "e.g. 8", helpText: "Discount rate for NPV calculation", min: 0, max: 100, step: 0.5,
    },
    {
      id: "energy_price_escalation_pct", label: "Energy Price Escalation", symbol: "e",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 2", helpText: "Expected annual energy price escalation rate", min: 0, max: 100, step: 0.5,
    },
  ],
};

export const GRANT_FEASIBILITY_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const GRANT_FEASIBILITY_GROUPS: ProFieldGroup[] = [
  energyBaselineGroup, projectCostGroup, financialAssumptionsGroup,
];

export const GRANT_FEASIBILITY_FIELD_IDS = [
  "baseline_energy_consumption_kwh", "baseline_energy_price_per_kwh", "projected_saving_pct",
  "gross_project_cost", "eligible_project_cost", "grant_incentive_amount",
  "annual_maintenance_cost", "useful_life_years", "discount_rate", "energy_price_escalation_pct",
];
