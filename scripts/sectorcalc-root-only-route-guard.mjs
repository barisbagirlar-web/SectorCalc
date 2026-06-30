#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const out = [];
  const stack = [dir];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(current, entry.name);

      if (
        full.includes("node_modules") ||
        full.includes(".next") ||
        full.includes("out") ||
        full.includes("dist") ||
        full.includes("build") ||
        full.includes("_safe_vault")
      ) {
        continue;
      }

      if (entry.isDirectory()) stack.push(full);
      else out.push(full);
    }
  }

  return out;
}

const localeFiles = [
  "src/i18n/locales.ts",
  "src/i18n/routing.ts",
  "src/i18n/routing-config.ts",
].filter((file) => fs.existsSync(file));

for (const file of localeFiles) {
  const text = read(file);

  if (!/locales\s*(?::[^=]+)?=\s*\[\s*["']en["']\s*\]/.test(text) && !/locales:\s*\[\s*["']en["']\s*\]/.test(text)) {
    fail(`LOCALES_NOT_EN_ONLY:${file}`);
  }

  if (/["'](tr|de|fr|es|ar)["']/.test(text)) {
    fail(`NON_EN_LOCALE_ACTIVE_IN_ROUTING:${file}`);
  }
}

const middlewareCandidates = ["src/middleware.ts", "middleware.ts", "middleware.js"].filter((file) =>
  fs.existsSync(file),
);

if (middlewareCandidates.length === 0) {
  fail("MIDDLEWARE_NOT_FOUND_FOR_EN_PREFIX_HARD_BLOCK");
} else {
  const middlewareText = middlewareCandidates.map((file) => `\n// ${file}\n${read(file)}`).join("\n");

  if (!middlewareText.includes("SECTORCALC_HARD_BLOCK_PUBLIC_EN_PREFIX")) {
    fail("MIDDLEWARE_MISSING_HARD_BLOCK_MARKER_FOR_PUBLIC_EN_PREFIX");
  }

  if (!/pathname\s*===\s*["']\/en["']/.test(middlewareText)) {
    fail("MIDDLEWARE_DOES_NOT_CHECK_EXACT_PUBLIC_EN_PREFIX");
  }

  if (!/pathname\.startsWith\(["']\/en\/["']\)/.test(middlewareText)) {
    fail("MIDDLEWARE_DOES_NOT_CHECK_PUBLIC_EN_CHILD_PREFIX");
  }

  if (!/status:\s*(404|410)/.test(middlewareText)) {
    fail("MIDDLEWARE_DOES_NOT_RETURN_404_OR_410_FOR_PUBLIC_EN_PREFIX");
  }

  if (/\/en[^\\n]*(NextResponse\.redirect|redirect\()/i.test(middlewareText)) {
    fail("MIDDLEWARE_APPEARS_TO_REDIRECT_PUBLIC_EN_PREFIX_INSTEAD_OF_BLOCKING");
  }
}

const productionFiles = [
  ...listFiles("src/app"),
  ...listFiles("src/components"),
  ...listFiles("src/lib/infrastructure/seo"),
  ...listFiles("src/lib/infrastructure/metadata"),
].filter((file) => {
  if (file.includes("__tests__")) return false;
  if (/\.(test|spec)\./.test(file)) return false;
  return /\.(ts|tsx|js|jsx|mjs|json|txt)$/.test(file);
});

const hardcodedPublicEnPattern =
  /(href\s*=\s*["'{`]\s*\/en(?:\/|["'`}])|canonical[^\\n]*\/en(?:\/|["'`])|https:\/\/www\.sectorcalc\.com\/en(?:\/|["'`]))/;

for (const file of productionFiles) {
  const text = read(file);

  if (hardcodedPublicEnPattern.test(text)) {
    fail(`HARDCODED_PUBLIC_EN_LINK_OR_CANONICAL:${file}`);
  }
}

const publicClaimFiles = [
  "src/app/ai.txt/route.ts",
  "src/app/sectorcalc-index.txt/route.ts",
  "src/app/faq-knowledge.txt/route.ts",
].filter((file) => fs.existsSync(file));

for (const file of publicClaimFiles) {
  const text = read(file);

  if (/Supported locales:\s*en,\s*tr,\s*de,\s*fr,\s*es,\s*ar/i.test(text)) {
    fail(`PUBLIC_AI_SURFACE_CLAIMS_MULTI_LOCALE:${file}`);
  }

  if (/all\s+6\s+locales|6\s+locales|all\s+six\s+locales|six\s+locales/i.test(text)) {
    fail(`PUBLIC_AI_SURFACE_MENTIONS_MULTI_LOCALE:${file}`);
  }
}

console.log("ROOT_ONLY_POLICY=ROOT_DOMAIN_ENGLISH_ONLY");
console.log("PUBLIC_EN_PREFIX_ALLOWED=FALSE");
console.log("PUBLIC_EN_PREFIX_REDIRECT_ALLOWED=FALSE");
console.log("PUBLIC_EN_PREFIX_REQUIRED_STATUS=404_OR_410");
console.log(`ROOT_ONLY_WARNING_COUNT=${warnings.length}`);

for (const item of warnings) {
  console.log(`ROOT_ONLY_WARNING=${item}`);
}

console.log(`ROOT_ONLY_FAILURE_COUNT=${failures.length}`);

for (const item of failures) {
  console.log(`ROOT_ONLY_FAILURE=${item}`);
}

if (failures.length > 0) {
  process.exit(1);
}

console.log("ROOT_ONLY_ROUTE_GUARD_PASS=YES");
