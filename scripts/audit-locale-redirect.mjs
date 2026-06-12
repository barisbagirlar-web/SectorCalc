#!/usr/bin/env node
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

if (existsSync(join(ROOT, "src/middleware.ts"))) {
  pass("src/middleware.ts exists");
} else {
  fail("src/middleware.ts missing");
}

const localeConfig = readFileSync(join(ROOT, "src/lib/i18n/locale-config.ts"), "utf8");
for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
  if (localeConfig.includes(`"${locale}"`)) {
    pass(`SUPPORTED_LOCALES contains ${locale}`);
  } else {
    fail(`SUPPORTED_LOCALES missing ${locale}`);
  }
}

if (/TR:\s*"tr"/.test(localeConfig)) {
  pass("COUNTRY_TO_LOCALE.TR === tr");
} else {
  fail("COUNTRY_TO_LOCALE.TR missing");
}

const localeRouting = readFileSync(join(ROOT, "src/lib/i18n/locale-routing.ts"), "utf8");
for (const file of [
  "/ai.txt",
  "/ai-tool-index.json",
  "/ai-categories.json",
  "/ai-search-manifest.json",
]) {
  if (localeRouting.includes(`"${file}"`)) {
    pass(`public allowlist includes ${file}`);
  } else {
    fail(`public allowlist missing ${file}`);
  }
}

if (localeRouting.includes("LOCALE_MANUAL_COOKIE")) {
  pass("locale manual cookie gate present");
} else {
  fail("locale manual cookie gate missing");
}

try {
  const output = execSync("npx tsx scripts/audit-locale-redirect-runner.ts", {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const payload = JSON.parse(output.trim().split("\n").at(-1) ?? "{}");
  for (const check of payload.checks ?? []) {
    if (check.pass) pass(check.name);
    else fail(check.name);
  }
  if (payload.countryTr === "tr") {
    pass("runner confirms COUNTRY_TO_LOCALE.TR");
  } else {
    fail(`runner countryTr expected tr, got ${payload.countryTr}`);
  }
} catch (error) {
  fail(`runner failed: ${String(error.stderr ?? error.message ?? error)}`);
}

console.log(`\naudit:locale-redirect — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
