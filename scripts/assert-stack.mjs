#!/usr/bin/env node
/**
 * SECTORCAL stack gate — fails CI/build if the locked stack is violated.
 * Decisions: JSON Schema 2020-12 | Decimal.js | Paddle | Lit | JSON-only
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '../..');
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const FORBIDDEN = new Set(PKG.sectorcal?.forbiddenPackages ?? []);

const nvmrcPath = join(ROOT, '.nvmrc');
const expectedNode = readFileSync(nvmrcPath, 'utf8').trim();
const actualNode = process.versions.node;
if (actualNode !== expectedNode) {
  console.error(
    `SECTORCAL NODE LOCK FAILED: .nvmrc wants ${expectedNode}, running ${actualNode}\n` +
      `  → nvm use   (or: nvm install && nvm use)\n`,
  );
  process.exit(1);
}

const FORBIDDEN_IMPORT_RE =
  /\bfrom\s+['"](?:react|react-dom|react\/|next|next\/|vue|vue\/|@vue\/|@angular\/|stripe|@stripe\/|protobufjs|google-protobuf|@bufbuild\/protobuf|msgpackr|@msgpack\/msgpack|cbor(?:-x)?|bson)['"]/;

const FORBIDDEN_REQUIRE_RE =
  /\brequire\(\s*['"](?:react|react-dom|next|vue|@angular\/|stripe|@stripe\/|protobufjs|google-protobuf|msgpackr|cbor|bson)['"]\s*\)/;

const OLD_SCHEMA_RE =
  /https?:\/\/json-schema\.org\/(?:draft-0[47]|draft\/(?:0[47]|2019-09))\b|["']draft-0[47]["']|\$schema["']\s*:\s*["'][^"']*draft-0[47]/;

const BINARY_HINT_RE = /\b(?:protobufjs|google-protobuf|@bufbuild\/protobuf|msgpackr|MessagePack|CBOR\b|cbor-x|\bbson\b)/;

const errors = [];
const depsOnly = process.argv.includes('--deps-only');

function fail(msg) {
  errors.push(msg);
}

function scanDeps(section) {
  const deps = PKG[section] ?? {};
  for (const name of Object.keys(deps)) {
    for (const bad of FORBIDDEN) {
      if (name === bad || name.startsWith(`${bad}/`)) {
        fail(`${section}: forbidden package "${name}"`);
        break;
      }
    }
  }
}

scanDeps('dependencies');
scanDeps('devDependencies');
scanDeps('optionalDependencies');
scanDeps('peerDependencies');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const CODE_EXT = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.json', '.html', '.mdc', '.md']);

if (!depsOnly) {
  const files = walk(ROOT).filter((f) => CODE_EXT.has(extname(f)) || extname(f) === '');
  for (const file of files) {
    const rel = relative(ROOT, file);
    if (rel === 'scripts/assert-stack.mjs') continue;
    if (rel.startsWith('.cursor/') && rel.includes('stack-decisions')) continue;
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }

    if (FORBIDDEN_IMPORT_RE.test(text) || FORBIDDEN_REQUIRE_RE.test(text)) {
      fail(`${rel}: forbidden framework/payment/binary import`);
    }
    if (OLD_SCHEMA_RE.test(text) && !rel.includes('assert-stack')) {
      fail(`${rel}: forbidden JSON Schema draft (use 2020-12 only)`);
    }
    if (rel.startsWith('schemas/') && extname(file) === '.json') {
      try {
        const schema = JSON.parse(text);
        const s = schema.$schema;
        if (!s || !String(s).includes('draft/2020-12')) {
          fail(`${rel}: $schema must be JSON Schema Draft 2020-12`);
        }
      } catch (e) {
        fail(`${rel}: invalid JSON (${e.message})`);
      }
    }
    if (rel.startsWith('src/') && BINARY_HINT_RE.test(text)) {
      fail(`${rel}: binary codec reference detected — JSON only`);
    }
  }
}

if (errors.length) {
  console.error('SECTORCAL STACK GATE FAILED\n');
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('\nLocked: 2020-12 | Decimal.js | Paddle | Lit | JSON\n');
  process.exit(1);
}

console.log('SECTORCAL stack gate OK — 2020-12 | Decimal.js | Paddle | Lit | JSON');
