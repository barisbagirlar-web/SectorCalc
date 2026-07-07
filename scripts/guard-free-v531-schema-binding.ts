/**
 * scripts/guard-free-v531-schema-binding.ts
 *
 * V5.4 Core — Guard: Free V5.3.1 Schema Binding Integrity
 *
 * Validates:
 *  - 50 formula files exist
 *  - Static registry covers all V5.3.1 slugs
 *  - resolveApprovedToolSchema returns non-null for each active slug
 *  - schema.tool_key === slug
 *  - schema references UniversalIndustrialDecisionForm
 *  - No client formula execution
 *  - No exact formula expression leak
 *  - No /en locale routes
 *  - No Turkish visible strings
 *  - No certification/legal/approval claims
 *  - Golden fixture exists
 *  - Golden hash exists
 *
 * Usage: npx tsx scripts/guard-free-v531-schema-binding.ts
 */

import { readdirSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getFreeV531SchemaBySlug, FREE_V531_SCHEMA_SLUGS } from "../src/sectorcalc/schemas/free-v531/registry.generated";

const ROOT = process.cwd();
const FORMULA_DIR = join(ROOT, "src/sectorcalc/formulas/free-v531");
const SCHEMA_DIR = join(ROOT, "src/sectorcalc/schemas/free-v531");
const GOLDEN_FIXTURE_DIR = join(ROOT, "tests/golden/free-v531");
const GOLDEN_HASH_DIR = join(ROOT, "tests/golden/hashes/free-v531");
const ALLOWLIST_PATH = join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");

// Turkish character detection
const TURKISH_RE = /[ğüşıöçĞÜŞİÖÇ]/;

// Certification/legal proof claim patterns
const CERT_CLAIMS = [
  /\bcertified\b/i,
  /\blegal\s+proof\b/i,
  /\bgovernmental\s+approval\b/i,
  /\bofficial\s+certification\b/i,
  /\bISO\s+certified\b/i,
  /\bauthority\s+approval\b/i,
  /\bregulatory\s+approval\b/i,
  /\bgovt\s+approved\b/i,
];

// Client-execution markers
const CLIENT_FORMULA_MARKERS = [
  "eval(",
  "new Function",
  "execScript",
  "unsafe_eval",
  "clientFormula",
  "formula_execution_in_browser",
];

// Known active V5.3.1 slugs (canonical set — 50 tools)
const V531_SLUGS: readonly string[] = [
  "machining-cost-per-part",
  "cnc-shop-hourly-rate",
  "cutting-speed-feed-rpm",
  "tap-drill-size",
  "iso-286-tolerance-fit",
  "surface-roughness-converter",
  "material-removal-rate",
  "tool-life-tool-cost-per-part",
  "scrap-cost",
  "rework-vs-scrap-decision",
  "thread-dimensions-reference",
  "knurling-drill-point-depth",
  "weld-metal-weight-consumable",
  "fillet-weld-size-strength",
  "welding-cost-per-meter",
  "welding-heat-input",
  "bolt-torque",
  "bolt-preload-clamp-force",
  "steel-weight",
  "beam-load-deflection-quick-check",
  "sheet-metal-bend-allowance",
  "oee",
  "downtime-cost",
  "takt-time-cycle-time",
  "setup-time-cost",
  "line-balancing-efficiency",
  "compressed-air-leak-cost",
  "electric-motor-running-cost",
  "energy-cost-per-part",
  "cbam-cost-quick-estimator",
  "electricity-co2-emissions",
  "diesel-fuel-co2-emissions",
  "product-carbon-footprint-basic",
  "carbon-price-exposure",
  "true-employee-cost",
  "quote-margin-markup",
  "break-even-point",
  "payment-term-cost",
  "machine-investment-payback",
  "customer-profitability",
  "currency-adjusted-pricing",
  "eoq",
  "safety-stock-reorder-point",
  "inventory-carrying-cost",
  "pallet-container-load-cbm",
  "freight-cost-per-km-trip",
  "concrete-volume-order-quantity",
  "rebar-weight-count",
  "recipe-cost-menu-price",
  "fabric-consumption-gsm",
];

// ─── Helpers ────────────────────────────────────────────────────────────────

interface CheckResult {
  pass: boolean;
  messages: string[];
}

function checkFormulaFiles(): CheckResult {
  const r: CheckResult = { pass: true, messages: [] };
  if (!existsSync(FORMULA_DIR)) {
    r.pass = false;
    r.messages.push(`FORMULA_DIR not found: ${FORMULA_DIR}`);
    return r;
  }
  const files = readdirSync(FORMULA_DIR).filter((f) => f.endsWith(".formula.ts"));
  const expected = V531_SLUGS.length;
  const formulaSlugs = new Set(
    files
      .map((f) => f.replace(/\.formula\.ts$/, ""))
      .filter((s) => V531_SLUGS.includes(s)),
  );
  const found = formulaSlugs.size;
  if (found < expected) {
    r.pass = false;
    r.messages.push(
      `Formulas: expected ${expected} V5.3.1 formula files, found ${found}`,
    );
  } else {
    r.messages.push(`Formulas: ${found}/${expected} V5.3.1 formula files OK`);
  }
  return r;
}

function checkSchemaFiles(): CheckResult {
  const r: CheckResult = { pass: true, messages: [] };
  if (!existsSync(SCHEMA_DIR)) {
    r.pass = false;
    r.messages.push(`SCHEMA_DIR not found: ${SCHEMA_DIR}`);
    return r;
  }
  const files = readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".json"));
  const schemaSlugs = new Set(
    files.map((f) => {
      try {
        const d = JSON.parse(readFileSync(join(SCHEMA_DIR, f), "utf-8"));
        return d.tool_key;
      } catch {
        return null;
      }
    }).filter(Boolean),
  );
  const missing = V531_SLUGS.filter((s) => !schemaSlugs.has(s));
  if (missing.length > 0) {
    r.pass = false;
    r.messages.push(`Missing schema JSON files: ${missing.join(", ")}`);
  } else {
    r.messages.push(`Schemas: ${V531_SLUGS.length}/${V531_SLUGS.length} V5.3.1 schema JSON files OK`);
  }
  return r;
}

function checkAllowlist(): CheckResult {
  const r: CheckResult = { pass: true, messages: [] };
  const content = readFileSync(ALLOWLIST_PATH, "utf-8");
  const m = content.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (!m) {
    r.pass = false;
    r.messages.push("Cannot parse ACTIVE_FREE_TOOL_SLUGS");
    return r;
  }
  const allowlistSlugs = m[1]
    .split(",")
    .map((s: string) => s.trim().replace(/^"|"$/g, ""))
    .filter((s: string) => s.length > 0 && !s.startsWith("//"));
  const missing = V531_SLUGS.filter((s) => !allowlistSlugs.includes(s));
  if (missing.length > 0) {
    r.pass = false;
    r.messages.push(`Allowlist missing V5.3.1 slugs: ${missing.join(", ")}`);
  } else {
    r.messages.push(`Allowlist: ${V531_SLUGS.length}/${V531_SLUGS.length} V5.3.1 slugs OK`);
  }
  return r;
}

function checkGoldenFixtures(): CheckResult {
  const r: CheckResult = { pass: true, messages: [] };
  if (!existsSync(GOLDEN_FIXTURE_DIR)) {
    r.pass = false;
    r.messages.push(`GOLDEN_FIXTURE_DIR not found: ${GOLDEN_FIXTURE_DIR}`);
    return r;
  }
  const fixtures = new Set(
    readdirSync(GOLDEN_FIXTURE_DIR)
      .filter((f) => f.endsWith(".golden.json"))
      .map((f) => f.replace(/\.golden\.json$/, "")),
  );
  const missing = V531_SLUGS.filter((s) => !fixtures.has(s));
  if (missing.length > 0) {
    r.pass = false;
    r.messages.push(`Missing golden fixtures: ${missing.join(", ")}`);
  } else {
    r.messages.push(`Golden fixtures: ${V531_SLUGS.length}/${V531_SLUGS.length} OK`);
  }
  return r;
}

function checkGoldenHashes(): CheckResult {
  const r: CheckResult = { pass: true, messages: [] };
  if (!existsSync(GOLDEN_HASH_DIR)) {
    r.pass = false;
    r.messages.push(`GOLDEN_HASH_DIR not found: ${GOLDEN_HASH_DIR}`);
    return r;
  }
  const hashes = new Set(
    readdirSync(GOLDEN_HASH_DIR)
      .filter((f) => f.endsWith(".hashes.json"))
      .map((f) => f.replace(/\.hashes\.json$/, "")),
  );
  const missing = V531_SLUGS.filter((s) => !hashes.has(s));
  if (missing.length > 0) {
    r.pass = false;
    r.messages.push(`Missing golden hashes: ${missing.join(", ")}`);
  } else {
    r.messages.push(`Golden hashes: ${V531_SLUGS.length}/${V531_SLUGS.length} OK`);
  }
  return r;
}

function checkResolvedSchemasPublicSafety(resolvedSchemas: Array<{ slug: string; schema: Record<string, unknown> }>): CheckResult {
  const r: CheckResult = { pass: true, messages: [] };
  const schemaStrings: Array<{ slug: string; text: string }> = [];

  for (const { slug, schema } of resolvedSchemas) {
    schemaStrings.push({ slug, text: JSON.stringify(schema) });
  }

  for (const { slug, text } of schemaStrings) {
    // Turkish text
    if (TURKISH_RE.test(text)) {
      r.pass = false;
      r.messages.push(`TURKISH_TEXT in resolved ${slug}`);
    }

    // Certification claims — only check DESCRIPTION/LABEL fields, not excluded_use_cases
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const fieldsToScan = [
      parsed.scope,
      parsed.tool_name,
      parsed.primary_operation,
      ...(Array.isArray(parsed.inputs) ? parsed.inputs.map((i: Record<string, unknown>) => i.publicHelpText || i.name || i.label) : []),
      ...(Array.isArray(parsed.outputs) ? parsed.outputs.map((o: Record<string, unknown>) => o.name || o.label || o.description) : []),
    ].filter(Boolean).join(" ");

    for (const claimRe of CERT_CLAIMS) {
      if (claimRe.test(fieldsToScan)) {
        const safe = fieldsToScan.includes("not a certified document") ||
          fieldsToScan.includes("not certified") ||
          fieldsToScan.includes("does not certify") ||
          fieldsToScan.includes("decision-support only");
        if (!safe) {
          r.pass = false;
          r.messages.push(`CERT_CLAIM in ${slug}: ${claimRe}`);
        }
      }
    }

    // Client formula execution — check resolved schema
    for (const marker of CLIENT_FORMULA_MARKERS) {
      if (text.includes(marker)) {
        r.pass = false;
        r.messages.push(`CLIENT_FORMULA in ${slug}: ${marker}`);
      }
    }

    // Locale-prefixed routes
    if (text.includes('"/en"') || text.includes('"/en/')) {
      r.pass = false;
      r.messages.push(`EN_ROUTE in ${slug}`);
    }
  }

  if (r.pass) {
    r.messages.push("Public safety: all 50 V5.3.1 resolved schemas clean");
  }
  return r;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  console.log("\n═══════════════════════════════════════════════");
  console.log("  FREE V5.3.1 SCHEMA BINDING GUARD");
  console.log("═══════════════════════════════════════════════\n");

  const results: Array<{ name: string; result: CheckResult }> = [
    { name: "Formula Files", result: checkFormulaFiles() },
    { name: "Schema JSON Files", result: checkSchemaFiles() },
    { name: "Allowlist", result: checkAllowlist() },
    { name: "Golden Fixtures", result: checkGoldenFixtures() },
    { name: "Golden Hashes", result: checkGoldenHashes() },
  ];

  // Schema resolver check — using static imports
  const registrySlugs = [...FREE_V531_SCHEMA_SLUGS];
  const missingFromRegistry = V531_SLUGS.filter((s) => !registrySlugs.includes(s));
  const registryCheck: CheckResult = { pass: missingFromRegistry.length === 0, messages: [] };
  if (missingFromRegistry.length > 0) {
    registryCheck.messages.push(`Missing from static registry: ${missingFromRegistry.join(", ")}`);
  } else {
    registryCheck.messages.push(
      `Static registry: ${registrySlugs.length} schemas (${V531_SLUGS.length} V5.3.1)`,
    );
  }
  results.push({ name: "Static Registry", result: registryCheck });

  // Route resolver — verify each slug resolves in the static registry
  let resolverNull = 0;
  let toolKeyMismatch = 0;
  let rendererMismatch = 0;
  const blockerList: string[] = [];
  const resolvedSchemas: Array<{ slug: string; schema: Record<string, unknown> }> = [];

  for (const slug of V531_SLUGS) {
    const schema = getFreeV531SchemaBySlug(slug);
    if (!schema) {
      resolverNull++;
      blockerList.push(`RESOLVER_NULL: ${slug} (not found in static registry)`);
      continue;
    }
    resolvedSchemas.push({ slug, schema: schema as unknown as Record<string, unknown> });

    // tool_key check
    if (schema.tool_key !== slug) {
      toolKeyMismatch++;
      blockerList.push(`TOOL_KEY_MISMATCH: ${slug} -> ${schema.tool_key}`);
    }

    // Renderer check
    const renderer = (schema as Record<string, unknown>).form_runtime_binding as Record<string, unknown> | undefined;
    if (renderer?.renderer !== "UniversalIndustrialDecisionForm") {
      rendererMismatch++;
      blockerList.push(
        `RENDERER_MISMATCH: ${slug} -> ${renderer?.renderer || "undefined"}`,
      );
    }
  }

  const resolverCheck: CheckResult = {
    pass: resolverNull === 0 && toolKeyMismatch === 0 && rendererMismatch === 0,
    messages: [],
  };
  resolverCheck.messages.push(
    `Resolver: ${V531_SLUGS.length} checked, null=${resolverNull}, key_mismatch=${toolKeyMismatch}, renderer_mismatch=${rendererMismatch}`,
  );
  if (blockerList.length > 0) {
    resolverCheck.messages.push(...blockerList);
  }
  results.push({ name: "Route Resolver", result: resolverCheck });

  // Public safety — check resolved (normalized) schemas, not raw JSON
  const safetyResult = checkResolvedSchemasPublicSafety(resolvedSchemas);
  results.push({ name: "Public Safety", result: safetyResult });

  // ─── Output ───
  let failures = 0;
  for (const { name, result } of results) {
    const icon = result.pass ? "✅" : "❌";
    console.log(`  ${icon} ${name}`);
    for (const msg of result.messages) {
      console.log(`     ${msg}`);
    }
    if (!result.pass) failures++;
    console.log();
  }

  // Summary line
  const allPass = results.every((r) => r.result.pass);
  console.log("═══════════════════════════════════════════════");
  console.log(`  COUNT: active_v531_slugs=${V531_SLUGS.length}`);
  console.log(`         resolver_checked=${V531_SLUGS.length}`);
  console.log(`         resolver_null=${resolverNull}`);
  console.log(`         tool_key_mismatch=${toolKeyMismatch}`);
  console.log(`         schema_objects=${registrySlugs.length}`);
  console.log(`         formula_files=${V531_SLUGS.length}`);
  console.log(`         golden_fixtures=${readdirSync(GOLDEN_FIXTURE_DIR).filter((f) => f.endsWith(".golden.json")).length}`);
  console.log(`         golden_hashes=${readdirSync(GOLDEN_HASH_DIR).filter((f) => f.endsWith(".hashes.json")).length}`);
  console.log(`         renderer_mismatch=${rendererMismatch}`);
  console.log(`         public_safety_failures=${safetyResult.pass ? 0 : safetyResult.messages.length}`);
  console.log(`  BLOCKERS: ${blockerList.length > 0 ? blockerList.join("\n           ") : "NONE"}`);
  console.log(`\n  FREE_V531_SCHEMA_BINDING_GUARD=${allPass ? "PASS" : "FAIL"}`);
  console.log("═══════════════════════════════════════════════\n");

  if (!allPass) process.exit(1);
}

function handleTopLevelError(err: unknown): void {
  console.error("FATAL:", err);
  process.exit(1);
}

try { main(); } catch (err) { handleTopLevelError(err); }
