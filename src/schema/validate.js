/**
 * JSON Schema Draft 2020-12 validation (Ajv 2020 dialect).
 * Decision #1 + #5: 2020-12 schemas, JSON data only.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const SCHEMAS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../schemas');

/** @type {Record<string, object>} */
const REGISTRY = {};

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateSchema: true
});
addFormats(ajv);

/**
 * @param {string} filename schema file under /schemas
 */
export function loadSchema(filename) {
  if (!REGISTRY[filename]) {
    const raw = readFileSync(join(SCHEMAS_DIR, filename), 'utf8');
    const schema = JSON.parse(raw);
    if (!schema.$schema || !String(schema.$schema).includes('draft/2020-12')) {
      throw new Error(`${filename}: $schema must be Draft 2020-12`);
    }
    const id = schema.$id ?? filename;
    if (!ajv.getSchema(id)) {
      ajv.addSchema(schema, id);
    }
    REGISTRY[filename] = schema;
  }
  return REGISTRY[filename];
}

/**
 * @param {string} filename
 * @param {unknown} data
 */
export function validate(filename, data) {
  const schema = loadSchema(filename);
  const id = schema.$id ?? filename;
  const validateFn = ajv.getSchema(id);
  if (!validateFn) {
    throw new Error(`failed to compile schema ${filename}`);
  }
  const ok = validateFn(data);
  return {
    ok: Boolean(ok),
    errors: validateFn.errors ?? null
  };
}

/**
 * @param {unknown} value
 * @returns {string}
 */
export function toJson(value) {
  return JSON.stringify(value);
}

/**
 * @param {string} text
 * @returns {unknown}
 */
export function fromJson(text) {
  return JSON.parse(text);
}
