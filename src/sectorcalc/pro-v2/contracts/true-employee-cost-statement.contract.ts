// SectorCalc PRO V2 — True Employee Cost Statement Field Contract

import type { ProFieldGroup, ProFieldContract } from "../proFieldContract";

const employeeParamsGroup: ProFieldGroup = {
  title: "Employee Compensation",
  description: "Base salary or wage and overhead allocation",
  fields: [
    {
      id: "labor_rate", label: "Annual Gross Salary / Hourly Wage", symbol: "S",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }, { unit: "TRY", label: "TRY" }],
      required: true, placeholder: "e.g. 45000", helpText: "Annual gross salary (enter hourly if below 100)", min: 0, step: 100,
    },
    {
      id: "overhead_rate", label: "Annual Employer Overhead", symbol: "C_oh",
      type: "number", unitFamily: "currency", defaultUnit: "USD",
      allowedUnits: [{ unit: "USD", label: "USD" }, { unit: "EUR", label: "EUR" }, { unit: "GBP", label: "GBP" }],
      required: false, placeholder: "e.g. 350000", helpText: "Total annual overhead allocated to employee cost center", min: 0, step: 100,
    },
  ],
};

export const EMPLOYEE_COST_HIDDEN_FIELDS: ProFieldContract[] = [
  { id: "source_confidence", label: "Source Confidence", symbol: "Q_src", type: "number", unitFamily: "factor", defaultUnit: "ratio", allowedUnits: [{ unit: "ratio", label: "ratio" }], required: false, defaultValue: 0.9, hidden: true },
];

export const EMPLOYEE_COST_GROUPS: ProFieldGroup[] = [
  employeeParamsGroup,
];
