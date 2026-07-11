// SectorCalc PRO V2 — Receivables Cost Payment Term Addendum Execute Payload Adapter
// Maps form field IDs to server schema input keys.

import type { ProExecutePayloadAdapter } from "../proToolRegistry";

const FORM_TO_SCHEMA_INPUT: Record<string, string> = {
  invoice_value: "invoice_value",
  payment_days: "payment_days",
  early_payment_discount_pct: "early_payment_discount_pct",
  cost_of_capital_pct: "cost_of_capital_pct",
  admin_collection_cost: "admin_collection_cost",
  default_risk_allowance: "default_risk_allowance",
};

export { FORM_TO_SCHEMA_INPUT };

export const receivablesAddendumBuildExecutePayload: ProExecutePayloadAdapter = (
  fieldState,
  _hiddenValues,
) => {
  const raw_inputs: Record<string, number> = {};
  const selected_units: Record<string, string> = {};

  for (const [formId, schemaId] of Object.entries(FORM_TO_SCHEMA_INPUT)) {
    const entry = fieldState[formId];
    if (entry && entry.value !== "" && entry.value !== undefined) {
      const num = parseFloat(entry.value);
      if (Number.isFinite(num)) {
        raw_inputs[schemaId] = num;
        selected_units[formId] = entry.unit;
      }
    }
  }

  return { raw_inputs, selected_units };
};
