/**
 * AJV validation against JSON Schema Draft 2020-12.
 * Every input passes through here on every keystroke (not on submit).
 */
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import type { ErrorObject, ValidateFunction } from 'ajv/dist/2020';

// Ajv2020 loads the Draft 2020-12 meta-schema by default.
const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
  validateFormats: true
});
addFormats(ajv);

const cache = new Map<string, ValidateFunction>();

export interface ValidationError {
  field: string;
  message: string | undefined;
  keyword: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function compileSchema(schema: object): ValidateFunction {
  const key = (schema as { $id?: string }).$id || JSON.stringify(schema);
  const cached = cache.get(key);
  if (cached) return cached;
  const compiled = ajv.compile(schema);
  cache.set(key, compiled);
  return compiled;
}

/** Returns { valid, errors: [{ field, message, keyword }] } */
export function validate(schema: object, data: unknown): ValidationResult {
  const validateFn = compileSchema(schema);
  const valid = validateFn(data) as boolean;
  if (valid) return { valid: true, errors: [] };
  return {
    valid: false,
    errors: (validateFn.errors ?? []).map((e: ErrorObject) => ({
      field:
        e.instancePath.replace(/^\//, '') ||
        (e.params as { missingProperty?: string }).missingProperty ||
        'root',
      message: e.message,
      keyword: e.keyword
    }))
  };
}
