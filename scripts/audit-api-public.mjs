#!/usr/bin/env node
/**
 * Enterprise gate: api-public agentic layer completeness.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

let failures = 0;

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failures += 1;
}

const requiredFiles = [
  "src/app/api-public/calculate/[slug]/route.ts",
  "src/app/api-public/bot-md/[slug]/route.ts",
  "src/lib/validation/calculator-validator.ts",
  "src/lib/validation/calculator-validator-schema.ts",
  "src/lib/validation/api-public-messages.ts",
  "src/lib/validation/build-bot-md-document.ts",
  "src/lib/validation/public-calculate-rate-limit.ts",
  "public/.well-known/openapi.yaml",
  "src/lib/semantic/build-generated-tool-calculate-action-jsonld.ts",
];

for (const file of requiredFiles) {
  if (existsSync(join(ROOT, file))) {
    pass(`file exists: ${file}`);
  } else {
    fail(`missing file: ${file}`);
  }
}

const messages = readFileSync(join(ROOT, "src/lib/validation/api-public-messages.ts"), "utf8");
for (const locale of LOCALES) {
  if (messages.includes(`${locale}: `) || messages.includes(`${locale}:`)) {
    pass(`api-public-messages includes locale ${locale}`);
  } else {
    fail(`api-public-messages missing locale block ${locale}`);
  }
}

if (messages.includes("unknownInputFieldMessage")) {
  pass("unknownInputFieldMessage defined");
} else {
  fail("unknownInputFieldMessage missing");
}

const calculateRoute = readFileSync(
  join(ROOT, "src/app/api-public/calculate/[slug]/route.ts"),
  "utf8",
);
if (calculateRoute.includes("getApiValidatorForTool")) {
  pass("calculate route uses strict API validator");
} else {
  fail("calculate route missing getApiValidatorForTool");
}

if (calculateRoute.includes("findUnknownInputKeys")) {
  pass("calculate route rejects unknown input keys");
} else {
  fail("calculate route missing findUnknownInputKeys");
}

const robots = readFileSync(join(ROOT, "src/app/robots.ts"), "utf8");
if (robots.includes("/api-public/")) {
  pass("robots allows /api-public/");
} else {
  fail("robots missing /api-public/ allow");
}

const localeRouting = readFileSync(join(ROOT, "src/lib/i18n/locale-routing.ts"), "utf8");
if (localeRouting.includes('"/api-public"')) {
  pass("middleware excludes /api-public from locale redirects");
} else {
  fail("locale-routing missing /api-public exclusion");
}

console.log(`\naudit:api-public — ${failures === 0 ? "PASS" : `${failures} failed`}`);
process.exit(failures > 0 ? 1 : 0);
