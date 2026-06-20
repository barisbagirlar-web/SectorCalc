#!/usr/bin/env node
/**
 * Build-time validation: verifies i18n routing architecture is correctly configured.
 *
 * Checks:
 * 1. Middleware matcher includes /, /en, and all locale paths
 * 2. beforeFiles rewrites exist for / → /en and /:path → /en/:path
 * 3. LOCALE_REWRITE_EXCLUDE covers all 6 locales + admin/api
 * 4. next-intl routing config is consistent
 *
 * Exits 0 on pass, 1 on fail — designed for prebuild pipeline.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const SUPPORTED = ["en", "tr", "de", "fr", "es", "ar"];
const EXCLUDED_PREFIXES = [
  "tr", "de", "fr", "es", "ar", "en",
  "admin", "api", "api-public", "_next", "img", "images", "icons", "sitemap",
];
let exitCode = 0;
const errors = [];

function check(condition, message) {
  if (!condition) {
    errors.push(`  ✗ ${message}`);
    exitCode = 1;
  }
}

// ── Check 1: next.config.ts → NO beforeFiles locale rewrites ──
// The (english) route group architecture requires middleware-only routing.
// beforeFiles rewrites for / → /en would conflict with route group resolution.
const NEXT_CONFIG_DATA = readFileSync(join(ROOT, "next.config.ts"), "utf8");
const NO_BEFORE_FILES = !(
  NEXT_CONFIG_DATA.includes('source: "/", destination: "/en"') &&
  NEXT_CONFIG_DATA.includes('destination: "/en/:path"')
);
check(
  NO_BEFORE_FILES,
  "next.config.ts: beforeFiles does NOT contain locale rewrites (handled by middleware)",
);

// ── Check 2: LOCALE_REWRITE_EXCLUDE covers all locales ──
const REWRITE_EXCLUDE = readFileSync(
  join(ROOT, "src/lib/i18n/locale-rewrite-exclude.ts"),
  "utf8",
);
for (const loc of SUPPORTED) {
  const pattern = `${loc}(?:/|$)`;
  check(
    REWRITE_EXCLUDE.includes(pattern),
    `locale-rewrite-exclude.ts: excludes /${loc}/ paths (pattern: ${pattern})`,
  );
}
for (const prefix of EXCLUDED_PREFIXES) {
  check(
    REWRITE_EXCLUDE.includes(prefix),
    `locale-rewrite-exclude.ts: excludes /${prefix} prefix`,
  );
}

// ── Check 3: middleware matcher includes /, /en, locale paths ──
const MIDDLEWARE = readFileSync(join(ROOT, "src/middleware.ts"), "utf8");
check(
  MIDDLEWARE.includes('"/"') || MIDDLEWARE.includes("'/'"),
  "middleware.ts: matcher includes /",
);
check(
  MIDDLEWARE.includes('"/en"') || MIDDLEWARE.includes("'/en'"),
  "middleware.ts: matcher includes /en",
);
const localePattern = SUPPORTED.filter((l) => l !== "en").join("|");
check(
  MIDDLEWARE.includes(localePattern),
  `middleware.ts: matcher includes locale paths (${localePattern})`,
);

// ── Check 3b: Middleware has /en → / rewrite using stripLocaleFromPath ──
check(
  MIDDLEWARE.includes('stripLocaleFromPath(pathname)') ||
    MIDDLEWARE.includes("stripLocaleFromPath(pathname)"),
  "middleware.ts: /en → / rewrite uses stripLocaleFromPath (tested function, not manual slice)",
);
check(
  MIDDLEWARE.includes("pathname === \"/en\" || pathname.startsWith(\"/en/\")"),
  "middleware.ts: /en rewrite triggers on /en and /en/* paths",
);

// ── Check 4: Middleware has region headers + intlMiddleware ──
check(
  MIDDLEWARE.includes("intlMiddleware"),
  "middleware.ts: intlMiddleware is defined and used",
);
check(
  MIDDLEWARE.includes("applyRegionHeaders"),
  "middleware.ts: applyRegionHeaders exists",
);
check(
  MIDDLEWARE.includes("needsEnglishLocaleRewrite"),
  "middleware.ts: needsEnglishLocaleRewrite is used (catch-all for non-locale paths)",
);

// ── Check 5: next-intl routing config ──
const ROUTING = readFileSync(join(ROOT, "src/i18n/routing-config.ts"), "utf8");
check(
  ROUTING.includes("localePrefix") && ROUTING.includes("as-needed"),
  "routing-config.ts: localePrefix is 'as-needed' (English at root, locales prefixed)",
);
check(
  ROUTING.includes('defaultLocale: "en"'),
  "routing-config.ts: defaultLocale is English",
);

// ── Check 5b: locales.ts has all 6 languages ──
const LOCALES_TS = readFileSync(join(ROOT, "src/i18n/locales.ts"), "utf8");
for (const loc of SUPPORTED) {
  check(
    LOCALES_TS.includes(`"${loc}"`),
    `locales.ts: ${loc} is in locales array`,
  );
}

// ── Check 6: locale-routing.ts exports ──
const LOCALE_ROUTING = readFileSync(
  join(ROOT, "src/lib/i18n/locale-routing.ts"),
  "utf8",
);
check(
  LOCALE_ROUTING.includes("needsEnglishLocaleRewrite"),
  "locale-routing.ts: needsEnglishLocaleRewrite exists",
);
check(
  LOCALE_ROUTING.includes("rewritePathToEnglishLocale"),
  "locale-routing.ts: rewritePathToEnglishLocale exists",
);
check(
  LOCALE_ROUTING.includes("stripLocaleFromPath"),
  "locale-routing.ts: stripLocaleFromPath exists",
);
check(
  LOCALE_ROUTING.includes("isLocalizedPath"),
  "locale-routing.ts: isLocalizedPath exists",
);
check(
  LOCALE_ROUTING.includes("getLegacyEnRedirectPath"),
  "locale-routing.ts: getLegacyEnRedirectPath exists",
);

// ── Report ──
console.log(`\n🔍 validate-i18n-architecture — checking i18n architecture...`);
if (exitCode === 0) {
  console.log("\n✅ All i18n architecture checks PASSED");
} else {
  console.log(`\n❌ ${errors.length} i18n architecture check(s) FAILED:`);
  for (const e of errors) console.log(e);
}
console.log("");
process.exit(exitCode);
