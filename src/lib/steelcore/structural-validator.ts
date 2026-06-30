import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";

const INPUT_SCHEMA = {
  type: "object",
  required: ["id", "label", "type"],
  properties: {
    id: { type: "string", minLength: 1 },
    label: { type: "string", minLength: 1 },
    type: { type: "string", enum: ["number", "select", "boolean"] },
    unit: { type: "string" },
    default: {},
    businessContext: { type: "string" },
    businessContext_i18n: { type: "object" },
    label_i18n: { type: "object" },
    options: { type: "array" },
    min: {},
    max: {},
  },
  additionalProperties: true,
} as const;

const CALCULATOR_SCHEMA = {
  type: "object",
  required: ["toolName", "inputs", "formulas", "outputs"],
  properties: {
    toolName: { type: "string", minLength: 1 },
    inputs: { type: "array", minItems: 1, items: INPUT_SCHEMA },
    formulas: { type: "object", minProperties: 1, additionalProperties: { type: "string" } },
    outputs: {
      type: "object",
      required: ["primary"],
      properties: { primary: { type: "string", minLength: 1 } },
      additionalProperties: true,
    },
    validation: { type: "object" },
    category: { type: "string" },
    sector: { type: "string" },
    premiumRequired: { type: "boolean" },
    premiumFeatures: { type: "array" },
  },
  additionalProperties: true,
} as const;

let cachedValidator: ValidateFunction | null = null;

function getValidator(): ValidateFunction {
  if (!cachedValidator) {
    const ajv = new Ajv({ allErrors: true });
    cachedValidator = ajv.compile(CALCULATOR_SCHEMA);
  }
  return cachedValidator;
}

export function validateStructuralSchema(schema: Record<string, unknown>): readonly string[] {
  const validate = getValidator();
  if (validate(schema)) {
    return [];
  }
  return (validate.errors ?? []).map((error: ErrorObject) => {
    // @ts-expect-error fallback to dataPath for older ajv versions
    const path = error.instancePath || error.dataPath || "/";
    return `${path}: ${error.message ?? "invalid"}`;
  });
}
