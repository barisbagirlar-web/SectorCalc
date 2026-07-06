#!/usr/bin/env node
/**
 * scripts/guard-pro-v531-baris-routes.mjs
 *
 * Validates the route structure for the baris PRO V5.3.1 tools.
 *
 * Checks:
 * 1. Read manifest from pro_tools_baris_/manifest.json
 * 2. For each schema's tool_key, ensure a corresponding route pattern exists
 * 3. No locale-prefixed routes exist for baris tools (root-only routing)
 * 4. Routes match expected pattern: /pro-tools/[tool_key] or /tools/pro/[tool_key]
 * 5. Check reference-registry and monetization-registry for each tool_key
 * 6. All 45 tool_keys are either routed OR explicitly BLOCKED
 * 7. Scan src/app/ for locale-prefixed directories related to baris tools
 * 8. Exit 0 (PASS) if all OK, exit 1 (FAIL) if violations found
 *
 * No external dependencies. Uses Node.js built-in modules only.
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

// ─── Paths ─────────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, "..");
const MANIFEST_PATH = join(ROOT, "pro_tools_baris_/manifest.json");
const SCHEMAS_DIR = join(ROOT, "src/sectorcalc/schemas/pro-v531");
const APP_DIR = join(ROOT, "src/app");
const TOOLS_PRO_DIR = join(ROOT, "src/app/tools/pro");
const PRO_TOOLS_DIR = join(ROOT, "src/app/pro-tools");
const REFERENCE_REGISTRY_PATH = join(ROOT, "src/generated/reference-registry.ts");
const MONETIZATION_REGISTRY_PATH = join(ROOT, "src/sectorcalc/monetization/monetization-registry.ts");
const ACTIVE_ALLOWLIST_PATH = join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");
const BARIS_REGISTRY_PATH = join(ROOT, "src/sectorcalc/formulas/pro-v531/baris-formula-registry.ts");

// ─── Constants ──────────────────────────────────────────────────────────────

const EXPECTED_ROUTE_PATTERNS = [
  "/pro-tools/[tool_key]",
  "/tools/pro/[tool_key]",
];

const LOCALE_PREFIXED_SUBDIRS = [
  "[locale]/pro-tools",
  "[locale]/tools/pro",
  "en/pro-tools",
  "en/tools/pro",
  "tr/pro-tools",
  "tr/tools/pro",
  "de/pro-tools",
  "de/tools/pro",
  "fr/pro-tools",
  "fr/tools/pro",
  "es/pro-tools",
  "es/tools/pro",
];

// ─── Collectors ─────────────────────────────────────────────────────────────

const violations = [];
const warnings = [];

function addViolation(msg) {
  violations.push(msg);
}

function addWarning(msg) {
  warnings.push(msg);
}

// ─── Check 1: Read manifest ────────────────────────────────────────────────

function readManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    addViolation(`Manifest not found: ${MANIFEST_PATH}`);
    return null;
  }

  let raw;
  try {
    raw = readFileSync(MANIFEST_PATH, "utf8");
  } catch (err) {
    addViolation(`Failed to read manifest: ${err.message}`);
    return null;
  }

  let manifest;
  try {
    manifest = JSON.parse(raw);
  } catch (err) {
    addViolation(`Invalid JSON in manifest: ${err.message}`);
    return null;
  }

  if (!Array.isArray(manifest.schemas)) {
    addViolation("Manifest.schemas is not an array");
    return null;
  }

  if (manifest.schemas.length === 0) {
    addViolation("Manifest.schemas is empty");
    return null;
  }

  console.log(`  ✓ Manifest loaded: ${manifest.schemas.length} schemas (expected ${manifest.schema_count || "?"})`);
  return manifest;
}

// ─── Check 2: Route pattern existence ──────────────────────────────────────

function checkRoutePatterns() {
  const toolProExists = existsSync(join(TOOLS_PRO_DIR, "[slug]", "page.tsx"));
  const toolProPageExists = existsSync(join(TOOLS_PRO_DIR, "page.tsx"));
  const proToolsSlugExists = existsSync(join(PRO_TOOLS_DIR, "[slug]", "page.tsx"));

  const results = {
    hasToolsProSlug: toolProExists,
    hasToolsProPage: toolProPageExists,
    hasProToolsSlug: proToolsSlugExists,
    hasProToolsPage: existsSync(join(PRO_TOOLS_DIR, "page.tsx")),
  };

  console.log(`  ├─ /tools/pro/[slug]/page.tsx: ${results.hasToolsProSlug ? "EXISTS" : "MISSING"}`);
  console.log(`  ├─ /tools/pro/page.tsx:        ${results.hasToolsProPage ? "EXISTS" : "MISSING"}`);
  console.log(`  ├─ /pro-tools/[slug]/page.tsx: ${results.hasProToolsSlug ? "EXISTS" : "MISSING"}`);
  console.log(`  └─ /pro-tools/page.tsx:        ${results.hasProToolsPage ? "EXISTS" : "MISSING"}`);

  if (!results.hasToolsProSlug && !results.hasProToolsSlug) {
    addViolation("No dynamic route handler found for individual PRO tool pages. Expected: /tools/pro/[slug]/page.tsx or /pro-tools/[slug]/page.tsx");
  }

  if (!results.hasProToolsPage) {
    addViolation("PRO tools catalog page missing: /pro-tools/page.tsx");
  }

  return results;
}

// ─── Check 3 & 7: Locale-prefixed routes ────────────────────────────────────

function checkNoLocalePrefixedRoutes(toolKeys) {
  const toolKeySet = new Set(toolKeys);
  const localeViolations = [];

  function scanDir(dirPath, relativePath) {
    if (!existsSync(dirPath)) return;

    try {
      const entries = readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);
        const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          if (
            entry.name === "[locale]" ||
            entry.name.startsWith("[locale]") ||
            LOCALE_PREFIXED_SUBDIRS.some((sub) => relPath.endsWith(sub) || relPath.startsWith(sub))
          ) {
            // Found a locale-prefixed directory — check its children for pro-tool references
            if (relPath.includes("pro-tools") || relPath.includes("tools/pro")) {
              localeViolations.push(relPath);
            }
          }

          // Recurse into subdirectories (but not node_modules, .next, etc.)
          if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
            scanDir(fullPath, relPath);
          }
        }
      }
    } catch (err) {
      addWarning(`Could not scan ${dirPath}: ${err.message}`);
    }
  }

  // Also directly check paths that would be locale-prefixed pro-tool routes
  for (const sub of LOCALE_PREFIXED_SUBDIRS) {
    const dir = join(APP_DIR, sub);
    if (existsSync(dir)) {
      localeViolations.push(sub);
    }
  }

  if (localeViolations.length > 0) {
    addViolation(
      `Locale-prefixed PRO tool routes detected (${localeViolations.length}):\n` +
        localeViolations.map((p) => `      - ${p}`).join("\n")
    );
  } else {
    console.log("  ✓ No locale-prefixed PRO tool routes found");
  }

  return localeViolations;
}

// ─── Check 4: Verify route pattern structure ───────────────────────────────

function checkRoutePattern(manifest) {
  // Read the actual route file to confirm it handles all tool_keys
  const slugPagePath = join(TOOLS_PRO_DIR, "[slug]", "page.tsx");
  const proSlugPagePath = join(PRO_TOOLS_DIR, "[slug]", "page.tsx");

  let routeFilesChecked = [];

  if (existsSync(slugPagePath)) {
    routeFilesChecked.push("src/app/tools/pro/[slug]/page.tsx");
    const content = readFileSync(slugPagePath, "utf8");
    if (!content.includes("slug")) {
      addViolation("/tools/pro/[slug]/page.tsx does not reference 'slug' parameter");
    }
    if (!content.includes("notFound") && !content.includes("not-found")) {
      addWarning("/tools/pro/[slug]/page.tsx may not handle unknown slugs — missing 404 fallback pattern");
    }
  }

  if (existsSync(proSlugPagePath)) {
    routeFilesChecked.push("src/app/pro-tools/[slug]/page.tsx");
  }

  // Check the catalog page references correct href pattern
  const catalogPagePath = join(PRO_TOOLS_DIR, "page.tsx");
  if (existsSync(catalogPagePath)) {
    const content = readFileSync(catalogPagePath, "utf8");
    const hrefMatches = content.match(/href:\s*['"`](.+?)['"`]/g) || [];
    for (const hm of hrefMatches) {
      const stripped = hm.replace(/^href:\s*/, "").replace(/['"`]/g, "");
      if (stripped.includes("pro-tools/") || stripped.includes("tools/pro/")) {
        const pattern = stripped.replace(/\$\{[^}]+\}/g, "[tool_key]");
        if (pattern !== "/tools/pro/[tool_key]") {
          addWarning(`Catalog page href pattern "${pattern}" differs from expected "/tools/pro/[tool_key]"`);
        }
      }
    }
  }

  console.log(`  ✓ Route files checked: ${routeFilesChecked.join(", ") || "(none)"}`);
  return routeFilesChecked;
}

// ─── Check 5: Reference registry & monetization registry ────────────────────

function checkRegistriesForToolKeys(toolKeys) {
  const results = { inReferenceRegistry: [], inMonetizationRegistry: [], notFound: [] };

  // Check reference registry
  if (existsSync(REFERENCE_REGISTRY_PATH)) {
    const content = readFileSync(REFERENCE_REGISTRY_PATH, "utf8");
    for (const tk of toolKeys) {
      // The registry keys are stored as object property names — check both quoted and unquoted
      const regex = new RegExp(`["'\`]${escapeRegex(tk)}["'\`]\\s*:`);
      if (regex.test(content)) {
        results.inReferenceRegistry.push(tk);
      }
    }
    console.log(`  ├─ Reference registry: ${results.inReferenceRegistry.length}/${toolKeys.length} tool_keys found`);
  } else {
    addWarning("Reference registry not found, skipping registry check");
  }

  // Check monetization registry
  if (existsSync(MONETIZATION_REGISTRY_PATH)) {
    const content = readFileSync(MONETIZATION_REGISTRY_PATH, "utf8");
    for (const tk of toolKeys) {
      const regex = new RegExp(`["'\`]${escapeRegex(tk)}["'\`]\\s*:`);
      if (regex.test(content)) {
        results.inMonetizationRegistry.push(tk);
      }
    }
    console.log(`  ├─ Monetization registry: ${results.inMonetizationRegistry.length}/${toolKeys.length} tool_keys found`);
  } else {
    addWarning("Monetization registry not found, skipping registry check");
  }

  // Which tool_keys are in neither?
  const inNeither = toolKeys.filter(
    (tk) => !results.inReferenceRegistry.includes(tk) && !results.inMonetizationRegistry.includes(tk)
  );
  results.notFound = inNeither;

  if (inNeither.length > 0) {
    addWarning(
      `${inNeither.length} tool_keys not found in reference or monetization registries:\n` +
        `      ${inNeither.join(", ")}`
    );
  }

  return results;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ─── Check 6: All tool_keys routed or explicitly blocked ────────────────────

function readBarisLiveToolKeys() {
  // Read LIVE_BATCH_KEYS from baris-formula-registry.ts
  if (!existsSync(BARIS_REGISTRY_PATH)) return [];
  const content = readFileSync(BARIS_REGISTRY_PATH, "utf8");
  const liveMatch = content.match(/LIVE_BATCH_(?:1_)?KEYS.*?new\s+Set\(LIVE_TOOLS\.map\(t\s*=>\s*t\.toolKey\)\)/);
  if (!liveMatch) return [];

  // Also collect toolKey entries from LIVE_TOOLS array
  const keys = [];
  const keyRegex = /toolKey:\s*"([^"]+)"/g;
  let m;
  while ((m = keyRegex.exec(content)) !== null) {
    keys.push(m[1]);
  }
  return keys;
}

function checkAllToolsRoutedOrBlocked(toolKeys, routeResults) {
  // Read the active allowlist
  let activeSlugs = [];
  let activeSourceInfo = "";

  if (existsSync(ACTIVE_ALLOWLIST_PATH)) {
    const content = readFileSync(ACTIVE_ALLOWLIST_PATH, "utf8");
    const proMatch = content.match(/ACTIVE_PRO_TOOL_SLUGS\s*:\s*(?:readonly\s*)?(?:string\s*)?\[\s*([\s\S]*?)\]\s*;/);
    if (proMatch) {
      const slugMatches = proMatch[1].match(/["'`]([^"'`]+)["'`]/g) || [];
      activeSlugs = slugMatches.map((s) => s.replace(/["'`]/g, ""));
      activeSourceInfo = "ACTIVE_PRO_TOOL_SLUGS";
    }
  }

  // Also read Baris LIVE tool keys from baris-formula-registry.ts
  const barisLiveKeys = readBarisLiveToolKeys();

  const isRouted = toolKeys.map((tk) => {
    const hasDynamicHandler = routeResults.hasToolsProSlug || routeResults.hasProToolsSlug;
    const inActiveList = activeSlugs.includes(tk);
    const inBarisLive = barisLiveKeys.includes(tk);

    // A tool is "routed/active" if:
    // - dynamic handler exists AND (in active allowlist OR in Baris LIVE registry)
    const isRoutedTool = hasDynamicHandler && (inActiveList || inBarisLive);

    // A tool is "explicitly BLOCKED" if schema exists but is NOT routed
    const schemaExists = existsSync(join(SCHEMAS_DIR, `${tk}.schema.json`));
    const isBlocked = schemaExists && !isRoutedTool;

    return { toolKey: tk, hasDynamicHandler, inActiveList, inBarisLive, schemaExists, isBlocked, isRoutedTool };
  });

  const routed = isRouted.filter((r) => r.isRoutedTool);
  const blocked = isRouted.filter((r) => r.isBlocked);
  const unaccounted = isRouted.filter((r) => !r.hasDynamicHandler && !r.isBlocked && !r.isRoutedTool);

  // Determine routed/blocked breakdown
  const barisRouted = isRouted.filter((r) => r.inBarisLive && !r.inActiveList);
  const allowlistRouted = isRouted.filter((r) => r.inActiveList);

  console.log(`  ├─ Routed (active):        ${routed.length}/${toolKeys.length}`);
  if (barisRouted.length > 0) {
    console.log(`  │    ├─ via Baris LIVE registry: ${barisRouted.length} tools`);
  }
  if (allowlistRouted.length > 0) {
    console.log(`  │    └─ via active allowlist:    ${allowlistRouted.length} tools`);
  }
  console.log(`  ├─ Blocked (assisted dossier): ${blocked.length}/${toolKeys.length}`);
  console.log(`  └─ Unaccounted:                ${unaccounted.length}/${toolKeys.length}`);

  if (unaccounted.length > 0) {
    addViolation(
      `${unaccounted.length} tool_keys are neither routed nor explicitly blocked:\n` +
        unaccounted.map((r) => `      - ${r.toolKey} (schema exists: ${r.schemaExists})`).join("\n")
    );
  }

  if (routed.length === 0 && toolKeys.length > 0) {
    addWarning("No baris tool_keys are in the active PRO allowlist. All are in quarantine state.");
  }

  return { isRouted, routed, blocked, unaccounted, barisRouted };
}

// ─── Check 7: Full scan of src/app/ for locale prefixes ─────────────────────

function scanAppForLocalePrefixes() {
  if (!existsSync(APP_DIR)) {
    addViolation(`src/app directory not found: ${APP_DIR}`);
    return [];
  }

  const localePrefixedDirs = [];

  function scan(dirPath, relativePath) {
    try {
      const entries = readdirSync(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === ".next") continue;

        const fullPath = join(dirPath, entry.name);
        const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

        // Detect locale prefixes: [locale], en, tr, de, fr, es
        const isLocaleDir = entry.name === "[locale]" || /^(en|tr|de|fr|es|pt|ru|ar|zh|ja|ko)$/.test(entry.name);

        if (isLocaleDir) {
          // Check if any pro-tool related content exists under this locale dir
          const children = getDirTree(fullPath, "");
          const proToolChildren = children.filter(
            (c) => c.includes("pro-tools") || c.includes("tools/pro")
          );
          if (proToolChildren.length > 0) {
            localePrefixedDirs.push({
              localeDir: relPath,
              proToolPaths: proToolChildren,
            });
          }
        }

        scan(fullPath, relPath);
      }
    } catch (err) {
      addWarning(`Could not scan ${dirPath}: ${err.message}`);
    }
  }

  scan(APP_DIR, "");

  if (localePrefixedDirs.length > 0) {
    addViolation(
      `Locale-prefixed PRO tool routes detected:\n` +
        localePrefixedDirs
          .map((d) => `      - ${d.localeDir}/` + d.proToolPaths.map((p) => p.substring(d.localeDir.length + 1)).join(", "))
          .join("\n")
    );
  }

  return localePrefixedDirs;
}

function getDirTree(dirPath, relativePath) {
  const results = [];
  if (!existsSync(dirPath)) return results;

  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        results.push(relPath);
        results.push(...getDirTree(fullPath, relPath));
      } else if (entry.isFile() && !entry.name.startsWith(".")) {
        results.push(relPath);
      }
    }
  } catch {
    // skip unreadable dirs
  }

  return results;
}

// ─── Schema file existence check ────────────────────────────────────────────

function checkSchemaFilesExist(toolKeys) {
  const missing = [];

  for (const tk of toolKeys) {
    const schemaPath = join(SCHEMAS_DIR, `${tk}.schema.json`);
    if (!existsSync(schemaPath)) {
      missing.push(tk);
    }
  }

  if (missing.length > 0) {
    addViolation(
      `${missing.length} tool_keys missing schema files in ${SCHEMAS_DIR}:\n` +
        missing.map((m) => `      - ${m}.schema.json`).join("\n")
    );
  } else {
    console.log(`  ✓ All ${toolKeys.length} schema files exist in src/sectorcalc/schemas/pro-v531/`);
  }

  return missing;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  console.log("");
  console.log("═══ PRO V5.3.1 Baris Route Guard ═══");
  console.log("");

  // Check 1: Read manifest
  console.log("[1/8] Reading manifest...");
  const manifest = readManifest();
  if (!manifest) {
    printSummary();
    process.exit(1);
  }

  const toolKeys = manifest.schemas.map((s) => s.tool_key);
  console.log(`      Tool keys: ${toolKeys.length} (${toolKeys[0]} ... ${toolKeys[toolKeys.length - 1]})`);
  console.log("");

  // Check schema files exist
  console.log("      Validating schema files...");
  checkSchemaFilesExist(toolKeys);
  console.log("");

  // Check 2: Route pattern existence
  console.log("[2/8] Checking route pattern existence...");
  const routeResults = checkRoutePatterns();
  console.log("");

  // Check 4: Route pattern structure
  console.log("[4/8] Verifying route pattern structure...");
  checkRoutePattern(manifest);
  console.log("");

  // Check 3 & 7: Locale-prefixed routes (deep scan)
  console.log("[3/8] Checking locale-prefixed routes...");
  checkNoLocalePrefixedRoutes(toolKeys);
  console.log("");

  console.log("[7/8] Scanning src/app/ for locale prefixes...");
  scanAppForLocalePrefixes();
  console.log("");

  // Check 5: Reference & monetization registries
  console.log("[5/8] Checking reference and monetization registries...");
  checkRegistriesForToolKeys(toolKeys);
  console.log("");

  // Check 6: All tool_keys routed or blocked
  console.log("[6/8] Checking all tool_keys are routed or explicitly blocked...");
  checkAllToolsRoutedOrBlocked(toolKeys, routeResults);
  console.log("");

  // Final summary
  printSummary();
}

function printSummary() {
  console.log("─── Summary ──────────────────────────────────────");
  console.log(`  Violations: ${violations.length}`);
  console.log(`  Warnings:   ${warnings.length}`);
  console.log("");

  if (violations.length > 0) {
    console.log("  VIOLATIONS:");
    violations.forEach((v, i) => {
      const lines = v.split("\n");
      console.log(`    ${i + 1}. ${lines[0]}`);
      for (let j = 1; j < lines.length; j++) {
        console.log(`       ${lines[j]}`);
      }
    });
    console.log("");
  }

  if (warnings.length > 0) {
    console.log("  WARNINGS:");
    warnings.forEach((w, i) => {
      const lines = w.split("\n");
      console.log(`    ${i + 1}. ${lines[0]}`);
      for (let j = 1; j < lines.length; j++) {
        console.log(`       ${lines[j]}`);
      }
    });
    console.log("");
  }

  if (violations.length === 0) {
    console.log("  ✓ ALL CHECKS PASSED");
    console.log("");
    process.exit(0);
  } else {
    console.log(`  ✗ ${violations.length} VIOLATION(S) FOUND — FAIL`);
    console.log("");
    process.exit(1);
  }
}

main();
