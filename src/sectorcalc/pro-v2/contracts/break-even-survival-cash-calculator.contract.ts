// SectorCalc PRO V2 — Break-Even Survival Cash Field Contract

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const investmentParamsGroup: ProFieldGroup = {
  title: "Investment & Cash Flow",
  description: "Initial investment, net cash flow, and discount parameters",
  fields: [
    {
      id: "initial_investment", label: "Initial Investment", symbol: "I_0",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 500000", helpText: "Initial investment or startup cost", min: 0, step: 1000,
    },
    {
      id: "annual_net_cash_flow", label: "Annual Net Cash Flow", symbol: "CF",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 150000", helpText: "Expected annual net cash inflow", min: 0, step: 1000,
    },
    {
      id: "discount_rate", label: "Discount Rate", symbol: "r",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 10", helpText: "Discount rate (cost of capital)", min: 0, max: 100, step: 0.1, defaultValue: 10,
    },
    {
      id: "analysis_years", label: "Analysis Years", symbol: "n",
      type: "number", unitFamily: "factor", defaultUnit: "years",
      allowedUnits: [{ unit: "years", label: "years" }, { unit: "months", label: "months" }],
      required: true, placeholder: "e.g. 5", helpText: "Number of years in projection", min: 1, max: 50, step: 1, defaultValue: 5,
    },
    {
      id: "residual_value", label: "Residual Value", symbol: "RV",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: false, placeholder: "e.g. 50000", helpText: "Estimated residual value at end of analysis period", min: 0, step: 1000,
    },
  ],
};

const stressParamsGroup: ProFieldGroup = {
  title: "Stress & Operating Parameters",
  description: "Downside factor, volume, labor, and overhead",
  fields: [
    {
      id: "stress_downside_factor", label: "Stress Downside Factor", symbol: "σ",
      type: "number", unitFamily: "factor", defaultUnit: "factor 0-1",
      allowedUnits: [{ unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 0.8", helpText: "Downside scenario multiplier (0.8 = 20% revenue drop)", min: 0.1, max: 1, step: 0.05, defaultValue: 0.8,
    },
    {
      id: "annual_volume", label: "Annual Volume", symbol: "N",
      type: "number", unitFamily: "factor", defaultUnit: "units",
      allowedUnits: [{ unit: "units", label: "units" }, { unit: "thousand", label: "thousand" }],
      required: true, placeholder: "e.g. 10000", helpText: "Expected annual volume", min: 0, step: 1,
    },
    {
      id: "labor_rate", label: "Annual Labor Cost", symbol: "C_labor",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 80000", helpText: "Annual labor cost", min: 0, step: 1000,
    },
    {
      id: "overhead_rate", label: "Annual Overhead Cost", symbol: "C_oh",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 120000", helpText: "Annual overhead cost", min: 0, step: 1000,
    },
    {
      id: "defect_or_loss_cost", label: "Annual Defect/Loss Cost", symbol: "C_def",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }],
      required: true, placeholder: "e.g. 15000", helpText: "Annual defect or quality loss cost", min: 0, step: 100,
    },
  ],
};

export const BREAK_EVEN_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "Q_src", type: "number", unitFamily: "factor", defaultUnit: "ratio", allowedUnits: [{ unit: "ratio", label: "ratio" }], required: false, defaultValue: 0.95, hidden: true },
];

export const BREAK_EVEN_GROUPS: ProFieldGroup[] = [
  investmentParamsGroup, stressParamsGroup,
];
