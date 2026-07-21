#!/usr/bin/env node
/**
 * Validate all schemas/*.json as JSON Schema Draft 2020-12 (Ajv 2020 dialect).
 * Used by: npm run schema:validate
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SCHEMAS_DIR = join(ROOT, 'schemas');
const DRAFT = 'https://json-schema.org/draft/2020-12/schema';

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateSchema: true
});
addFormats(ajv);

const files = readdirSync(SCHEMAS_DIR)
  .filter((name) => name.endsWith('.json'))
  .sort();

if (files.length === 0) {
  console.error('No schemas found in schemas/');
  process.exit(1);
}

let failed = 0;

for (const file of files) {
  const path = join(SCHEMAS_DIR, file);
  let schema;
  try {
    schema = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    console.error(`FAIL ${file}: invalid JSON (${err.message})`);
    failed += 1;
    continue;
  }

  if (schema.$schema !== DRAFT) {
    console.error(`FAIL ${file}: $schema must be exactly ${DRAFT}`);
    failed += 1;
    continue;
  }

  try {
    const id = schema.$id ?? file;
    if (ajv.getSchema(id)) {
      ajv.removeSchema(id);
    }
    ajv.compile(schema);
    console.log(`OK   ${file}`);
  } catch (err) {
    console.error(`FAIL ${file}: ${err.message}`);
    failed += 1;
  }
}

if (failed > 0) {
  console.error(`\n${failed} schema(s) failed`);
  process.exit(1);
}

console.log(`\n${files.length} schema(s) valid (Draft 2020-12)`);
