// SectorCalc PRO V2 — Machine Investment Feasibility (Buy/Lease/Keep) Field Contract
// Tool-specific field definitions: user-facing labels, units, validation bounds.

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const acquisitionGroup: ProFieldGroup = {
  title: "Acquisition & Financing",
  description: "Purchase price, down payment, and loan terms",
  fields: [
    {
      id: "machine_purchase_price", label: "Machine Purchase Price", symbol: "P",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 500000", helpText: "Total purchase price of the machine", min: 0, step: 1000,
    },
    {
      id: "down_payment_pct", label: "Down Payment", symbol: "DP%",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }],
      required: true, placeholder: "e.g. 20", helpText: "Down payment percentage of purchase price", min: 0, max: 100, step: 1,
    },
    {
      id: "loan_interest_rate_pct", label: "Loan Interest Rate", symbol: "i",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }, { unit: "basis points", label: "bp" }],
      required: true, placeholder: "e.g. 8", helpText: "Annual interest rate on equipment loan", min: 0, max: 100, step: 0.25,
    },
    {
      id: "loan_term_years", label: "Loan Term", symbol: "n",
      type: "number", unitFamily: "finance_period", defaultUnit: "years",
      allowedUnits: [{ unit: "years", label: "years" }, { unit: "months", label: "months" }],
      required: true, placeholder: "e.g. 5", helpText: "Loan repayment period", min: 1, step: 1,
    },
  ],
};

const leaseGroup: ProFieldGroup = {
  title: "Lease Terms",
  description: "Leasing alternative parameters",
  fields: [
    {
      id: "lease_annual_payment", label: "Lease Annual Payment", symbol: "L",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 85000", helpText: "Annual lease payment amount", min: 0, step: 1000,
    },
    {
      id: "lease_term_years", label: "Lease Term", symbol: "t",
      type: "number", unitFamily: "finance_period", defaultUnit: "years",
      allowedUnits: [{ unit: "years", label: "years" }, { unit: "months", label: "months" }],
      required: true, placeholder: "e.g. 5", helpText: "Lease duration", min: 1, step: 1,
    },
  ],
};

const operatingCostGroup: ProFieldGroup = {
  title: "Operating Costs & Benefits",
  description: "Maintenance, downtime costs, residual value, and operational savings",
  fields: [
    {
      id: "annual_maintenance_cost", label: "Annual Maintenance Cost", symbol: "M",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 15000", helpText: "Expected annual maintenance cost", min: 0, step: 500,
    },
    {
      id: "annual_downtime_cost", label: "Annual Downtime Cost", symbol: "D",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 8000", helpText: "Expected annual cost of downtime", min: 0, step: 500,
    },
    {
      id: "residual_value", label: "Residual Value", symbol: "RV",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 120000", helpText: "Expected resale or salvage value at end of useful life", min: 0, step: 1000,
    },
    {
      id: "operating_savings_per_year", label: "Annual Operating Savings", symbol: "S",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [
        { unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" },
        { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" },
        { unit: "CAD", label: "CAD" }, { unit: "AUD", label: "AUD" },
        { unit: "CHF", label: "CHF" }, { unit: "JPY", label: "JPY" },
      ],
      required: true, placeholder: "e.g. 180000", helpText: "Expected annual operating savings from new machine", min: 0, step: 1000,
    },
    {
      id: "discount_rate", label: "Discount Rate", symbol: "r",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }, { unit: "factor 0-1", label: "factor" }, { unit: "basis points", label: "bp" }],
      required: true, placeholder: "e.g. 10", helpText: "Discount rate for NPV calculation", min: 0, max: 100, step: 0.5,
    },
  ],
};

export const BUY_LEASE_KEEP_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "SC", type: "number", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, defaultValue: 0.9, hidden: true },
  { id: "schema_hash", label: "Schema Hash", symbol: "H", type: "text", unitFamily: "factor", defaultUnit: "factor 0-1", allowedUnits: [{ unit: "factor 0-1", label: "factor" }], required: false, hidden: true },
];

export const BUY_LEASE_KEEP_GROUPS: ProFieldGroup[] = [
  acquisitionGroup, leaseGroup, operatingCostGroup,
];

export const BUY_LEASE_KEEP_FIELD_IDS = [
  "machine_purchase_price", "down_payment_pct", "loan_interest_rate_pct", "loan_term_years",
  "lease_annual_payment", "lease_term_years",
  "annual_maintenance_cost", "annual_downtime_cost", "residual_value",
  "operating_savings_per_year", "discount_rate",
];
