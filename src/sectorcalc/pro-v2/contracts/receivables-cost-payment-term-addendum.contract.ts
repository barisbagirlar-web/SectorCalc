// SectorCalc PRO V2 — Receivables Cost Payment Term Addendum Field Contract
// Groups: Invoice & Payment Terms, Cost Parameters

import type { ProFieldGroup } from "../proFieldContract";

const invoiceGroup: ProFieldGroup = {
  title: "Invoice & Payment Terms",
  description: "Invoice value, payment term structure, and early payment discount",
  fields: [
    {
      id: "invoice_value", label: "Invoice Value", symbol: "V_inv",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 100000",
      helpText: "Total invoice amount subject to the payment term",
      min: 0.01, step: 0.01,
    },
    {
      id: "payment_days", label: "Payment Term (Days)", symbol: "T_pay",
      type: "number", unitFamily: "finance_period", defaultUnit: "days",
      allowedUnits: [{ unit: "days", label: "days" }],
      required: true, placeholder: "e.g. 30",
      helpText: "Number of days before payment is due per the contract",
      min: 1, max: 365, step: 1,
    },
    {
      id: "early_payment_discount_pct", label: "Early Payment Discount", symbol: "D_early",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }],
      required: true, placeholder: "e.g. 2",
      helpText: "Discount percentage offered for early payment",
      min: 0, max: 100, step: 0.1,
    },
    {
      id: "early_payment_days", label: "Early Payment Days", symbol: "T_early",
      type: "number", unitFamily: "finance_period", defaultUnit: "days",
      allowedUnits: [{ unit: "days", label: "days" }],
      required: true, placeholder: "e.g. 10",
      helpText: "Number of days within which early payment discount applies",
      min: 1, max: 365, step: 1,
    },
  ],
};

const costGroup: ProFieldGroup = {
  title: "Cost Parameters",
  description: "Financing, administrative, and default risk costs",
  fields: [
    {
      id: "cost_of_capital_pct", label: "Cost of Capital", symbol: "r_coc",
      type: "number", unitFamily: "percentage", defaultUnit: "%",
      allowedUnits: [{ unit: "%", label: "%" }],
      required: true, placeholder: "e.g. 6",
      helpText: "Annual cost of capital or weighted average cost of capital (WACC)",
      min: 0, max: 100, step: 0.1,
    },
    {
      id: "admin_collection_cost", label: "Admin & Collection Cost", symbol: "C_admin",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 500",
      helpText: "Administrative and collection cost to process this receivable",
      min: 0, step: 0.01,
    },
    {
      id: "default_risk_allowance", label: "Default Risk Allowance", symbol: "C_def",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: true, placeholder: "e.g. 200",
      helpText: "Expected loss allowance for default risk on this receivable",
      min: 0, step: 0.01,
    },
  ],
};

export const RECEIVABLES_ADDENDUM_GROUPS: ProFieldGroup[] = [
  invoiceGroup,
  costGroup,
];

export const RECEIVABLES_ADDENDUM_FIELD_IDS = [
  "invoice_value", "payment_days", "early_payment_discount_pct", "early_payment_days",
  "cost_of_capital_pct", "admin_collection_cost", "default_risk_allowance",
];
