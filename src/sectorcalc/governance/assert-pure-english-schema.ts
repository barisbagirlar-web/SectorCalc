/**
 * assert-pure-english-schema.ts — V5.3.1 Pure English Schema Assertion
 *
 * Rejects schemas containing Turkish tokens in any active/public/schema field.
 * Used by adapters before returning schemas to the runtime.
 * Fails fast with exact path reporting.
 */

import {
  hasTurkishToken,
} from "./forbidden-locale-token-detector";

export interface AssertionError {
  path: string;
  token: string;
}

export interface AssertionResult {
  ok: boolean;
  errors: AssertionError[];
}

/**
 * Assert the schema contains no Turkish tokens in active/public/schema fields.
 * Returns detailed errors with exact paths.
 * Throws nothing — returns result object.
 */
export function assertPureEnglishV531Schema(schema: Record<string, unknown>): AssertionResult {
  const errors: AssertionError[] = [];

  function checkString(value: string, path: string): void {
    if (!value || typeof value !== "string") return;
    const found = hasTurkishToken(value);
    if (found) {
      errors.push({ path, token: found });
    }
  }

  function checkObject(obj: unknown, path: string): void {
    if (!obj || typeof obj !== "object") return;

    if (Array.isArray(obj)) {
      if (typeof obj[0] === "string") {
        // Check string arrays (tags, etc.)
        for (let i = 0; i < obj.length; i++) {
          checkString(obj[i] as string, `${path}[${i}]`);
        }
      } else {
        for (let i = 0; i < obj.length; i++) {
          checkObject(obj[i], `${path}[${i}]`);
        }
      }
      return;
    }

    const record = obj as Record<string, unknown>;

    for (const [key, value] of Object.entries(record)) {
      const fullPath = path ? `${path}.${key}` : key;

      // Check key itself
      checkString(key, fullPath);

      if (typeof value === "string") {
        checkString(value, fullPath);
      } else if (typeof value === "object" && value !== null) {
        checkObject(value, fullPath);
      }
    }
  }

  // Critical top-level fields to check
  const criticalFields = [
    "tool_id", "tool_key", "tool_name", "category", "scope",
    "primary_operation", "risk_level",
  ];

  for (const field of criticalFields) {
    const value = schema[field];
    if (typeof value === "string") {
      checkString(value, field);
    }
  }

  // Check inputs
  const inputs = schema.inputs;
  if (Array.isArray(inputs)) {
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i] as Record<string, unknown>;
      checkString(input.id as string, `inputs[${i}].id`);
      checkString(input.name as string, `inputs[${i}].name`);
      checkString(input.symbol as string, `inputs[${i}].symbol`);
      if (input.normalized_id) {
        checkString(input.normalized_id as string, `inputs[${i}].normalized_id`);
      }
      // Check i18n sub-fields for Turkish locale
      const labelI18n = input.label_i18n as Record<string, string> | undefined;
      if (labelI18n && labelI18n.tr) {
        errors.push({ path: `inputs[${i}].label_i18n.tr`, token: "tr" });
      }
      const contextI18n = input.businessContext_i18n as Record<string, string> | undefined;
      if (contextI18n && contextI18n.tr) {
        errors.push({ path: `inputs[${i}].businessContext_i18n.tr`, token: "tr" });
      }
    }
  }

  // Check normalized inputs
  const normalizedInputs = schema.normalized_inputs;
  if (Array.isArray(normalizedInputs)) {
    for (let i = 0; i < normalizedInputs.length; i++) {
      const ni = normalizedInputs[i] as Record<string, unknown>;
      checkString(ni.id as string, `normalized_inputs[${i}].id`);
      checkString(ni.from_input as string, `normalized_inputs[${i}].from_input`);
    }
  }

  // Check outputs
  const outputs = schema.outputs;
  if (Array.isArray(outputs)) {
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i] as Record<string, unknown>;
      checkString(output.id as string, `outputs[${i}].id`);
      checkString(output.name as string, `outputs[${i}].name`);
    }
  }

  // Check metadata
  const metadata = schema.metadata as Record<string, unknown> | undefined;
  if (metadata) {
    checkString(metadata.generator as string, "metadata.generator");
    if (Array.isArray(metadata.tags)) {
      for (let i = 0; i < (metadata.tags as string[]).length; i++) {
        checkString((metadata.tags as string[])[i], `metadata.tags[${i}]`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}
