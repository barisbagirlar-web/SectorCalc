// SectorCalc PRO V2 — Capital Equipment Investment Appraisal (NPV/IRR) Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const investmentGroup: ProFieldGroup = {
  title: "Investment & Working Capital",
  description: "Initial capital outlay and working capital requirements",
  fields: [
    {
      id: "initial_investment", label: "Initial Investment", symbol: "I₀",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 500000", helpText: "Total initial capital investment", min: 0, step: 1000,
    },
    {
      id: "working_capital", label: "Working Capital", symbol: "WC",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 50000", helpText: "Additional working capital needed", min: 0, step: 1000,
    },
  ],
};

const cashFlowGroup: ProFieldGroup = {
  title: "Projected Cash Flows",
  description: "Annual net cash inflows over the 5-year projection period",
  fields: [
    {
      id: "annual_cash_inflow_1", label: "Year 1 Cash Inflow", symbol: "CF₁",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 150000", helpText: "Projected net cash inflow for year 1", min: 0, step: 1000,
    },
    {
      id: "annual_cash_inflow_2", label: "Year 2 Cash Inflow", symbol: "CF₂",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 165000", helpText: "Projected net cash inflow for year 2", min: 0, step: 1000,
    },
    {
      id: "annual_cash_inflow_3", label: "Year 3 Cash Inflow", symbol: "CF₃",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 180000", helpText: "Projected net cash inflow for year 3", min: 0, step: 1000,
    },
    {
      id: "annual_cash_inflow_4", label: "Year 4 Cash Inflow", symbol: "CF₄",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 195000", helpText: "Projected net cash inflow for year 4", min: 0, step: 1000,
    },
    {
      id: "annual_cash_inflow_5", label: "Year 5 Cash Inflow", symbol: "CF₅",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 210000", helpText: "Projected net cash inflow for year 5", min: 0, step: 1000,
    },
  ],
};

const terminalAndDiscountGroup: ProFieldGroup = {
  title: "Terminal Value & Discount Rate",
  description: "Residual value and cost of capital assumptions",
  fields: [
    {
      id: "terminal_residual_value", label: "Terminal / Residual Value", symbol: "TV",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 75000", helpText: "Expected residual value at end of projection period", min: 0, step: 1000,
    },
    {
      id: "discount_rate_percent", label: "Discount Rate", symbol: "r",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }, { unit: "basis points", label: "bp" }],
      required: true, placeholder: "e.g. 10", helpText: "Weighted average cost of capital (WACC) or target discount rate", min: 0, max: 100, step: 0.5,
    },
  ],
};

const scenarioGroup: ProFieldGroup = {
  title: "Scenario Analysis",
  description: "Downside and upside adjustment factors for sensitivity testing",
  fields: [
    {
      id: "scenario_downside_pct", label: "Downside Adjustment", symbol: "δ−",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. -20", helpText: "Pessimistic scenario: % reduction to all cash flows (negative value)", max: 0, step: 1,
    },
    {
      id: "scenario_upside_pct", label: "Upside Adjustment", symbol: "δ+",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 20", helpText: "Optimistic scenario: % increase to all cash flows", min: 0, step: 1,
    },
  ],
};

export const NPV_IRR_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const NPV_IRR_GROUPS: ProFieldGroup[] = [
  investmentGroup, cashFlowGroup, terminalAndDiscountGroup, scenarioGroup,
];

export const NPV_IRR_FIELD_IDS = [
  "initial_investment", "working_capital",
  "annual_cash_inflow_1", "annual_cash_inflow_2", "annual_cash_inflow_3",
  "annual_cash_inflow_4", "annual_cash_inflow_5",
  "terminal_residual_value", "discount_rate_percent",
  "scenario_downside_pct", "scenario_upside_pct",
];
