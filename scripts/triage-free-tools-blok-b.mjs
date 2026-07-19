#!/usr/bin/env node
/**
 * BLOK B — Free-tool triage (read-only).
 * Does NOT modify allowlist or sitemap.
 *
 * For each ACTIVE_FREE_TOOL_SLUGS entry:
 *  (a) MOTOR: POST /api/tool-execute — blocked reasons / real outputs
 *  (b) SCHEMA: SCHEMA_GENERATION_MODE / NEEDS_SOURCE_VERIFICATION in schema JSON
 *  (c) SSR: Formula logic / Validation notes / Calculation assumptions / <label
 *
 * Classes: PASS | FAIL | UNCLEAR
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE = process.env.TRIAGE_BASE_URL ?? "https://sectorcalc.com";
const FETCH_TIMEOUT_MS = Number(process.env.TRIAGE_FETCH_TIMEOUT_MS ?? 25_000);

function parseAllowlist() {
  const text = readFileSync(
    resolve(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts"),
    "utf8",
  );
  const m = text.match(
    /ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/,
  );
  if (!m) throw new Error("Could not parse ACTIVE_FREE_TOOL_SLUGS");
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function findSchemaFile(slug) {
  const dir = resolve(ROOT, "src/sectorcalc/schemas/free-v531");
  if (!existsSync(dir)) return null;
  const hyphen = `${slug}.json`;
  const underscore = `${slug.replace(/-/g, "_")}.json`;
  const files = readdirSync(dir);

  // Exact basename only (no substring fuzzy match — avoids wrong-file selection).
  const exact = files.find(
    (f) =>
      f === hyphen ||
      f === underscore ||
      f.endsWith(`-${hyphen}`) ||
      f.endsWith(`-${underscore}`),
  );
  return exact ? join(dir, exact) : null;
}

function schemaFlags(slug) {
  const path = findSchemaFile(slug);
  if (!path) return { found: false, generation: false, needsSource: false, path: null };
  const raw = readFileSync(path, "utf8");
  return {
    found: true,
    path,
    generation: /"SCHEMA_GENERATION_MODE"\s*:\s*true/.test(raw),
    needsSource: /"NEEDS_SOURCE_VERIFICATION"\s*:\s*true/.test(raw),
  };
}

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function executeProbe(slug) {
  let res;
  try {
    res = await fetchWithTimeout(`${BASE}/api/tool-execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
      body: JSON.stringify({
        toolKey: slug,
        tool_key: slug,
        rawInputs: {},
        raw_inputs: {},
        selectedUnits: {},
        selected_units: {},
      }),
    });
  } catch (err) {
    return {
      ok: false,
      status: "FETCH_ERROR",
      message: String(err?.message ?? err).slice(0, 160),
      noFormula: false,
      internalOnly: false,
      rebuildGate: false,
      outputCount: 0,
    };
  }
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, status: "PARSE_ERROR", message: text.slice(0, 200) };
  }
  const message =
    json?.warnings?.[0]?.message ??
    json?.decision_interpretation?.primary_reason ??
    json?.outputs?.[0]?.public_explanation ??
    "";
  const blob = JSON.stringify(json);
  return {
    ok: json?.status === "OK" || json?.status === "PASS",
    status: json?.status ?? "UNKNOWN",
    message: String(message).slice(0, 160),
    noFormula: /NO_FORMULA_MODULE/.test(blob),
    internalOnly: /INTERNAL_SERVER_ONLY/.test(blob),
    rebuildGate: /V5\.4 Core rebuild|DISABLED|under V5\.4/.test(blob),
    outputCount: Array.isArray(json?.outputs) ? json.outputs.length : 0,
  };
}

async function ssrProbe(slug) {
  let res;
  try {
    res = await fetchWithTimeout(`${BASE}/tools/free/${slug}`, {
      headers: { "Cache-Control": "no-cache", "User-Agent": "SectorCalc-Triage/1.0" },
    });
  } catch (err) {
    return {
      http: 0,
      robots: "(fetch-error)",
      formulaLogic: 0,
      validationNotes: 0,
      assumptions: 0,
      labels: 0,
      inputs: 0,
      error: String(err?.message ?? err).slice(0, 120),
    };
  }
  const html = await res.text();
  const robots = (html.match(/name="robots" content="([^"]*)"/) || [])[1] ?? "(none)";
  return {
    http: res.status,
    robots,
    formulaLogic: (html.match(/Formula logic/g) || []).length,
    validationNotes: (html.match(/Validation notes/g) || []).length,
    assumptions: (html.match(/Calculation assumptions/g) || []).length,
    labels: (html.match(/<label/g) || []).length,
    inputs: (html.match(/<input/g) || []).length,
  };
}

function classify(exec, schema, ssr) {
  if (schema.generation || schema.needsSource) {
    return {
      class: "FAIL",
      reason: schema.generation
        ? "SCHEMA_GENERATION_MODE=true"
        : "NEEDS_SOURCE_VERIFICATION=true",
      suggest: "Remove from allowlist (hard-404) — stub template; soft noindex not enough",
    };
  }
  if (exec.noFormula || exec.internalOnly) {
    return {
      class: "FAIL",
      reason: exec.noFormula ? "NO_FORMULA_MODULE" : "INTERNAL_SERVER_ONLY",
      suggest: "Remove from allowlist (hard-404) — no formula motor",
    };
  }
  if (ssr.http === 404) {
    return {
      class: "FAIL",
      reason: "HTTP 404 on tool page",
      suggest: "Remove from allowlist or sync schema/registry",
    };
  }
  if (ssr.http === 200 && /noindex/i.test(ssr.robots)) {
    return {
      class: "FAIL",
      reason: "200 + noindex soft-404 shell",
      suggest: "Sync allowlist/registry; prefer hard-404",
    };
  }

  const ssrRich =
    ssr.formulaLogic >= 1 &&
    ssr.validationNotes >= 1 &&
    ssr.assumptions >= 1 &&
    ssr.labels >= 1;

  const motorPresent =
    !exec.noFormula &&
    !exec.internalOnly &&
    (exec.ok ||
      exec.status === "BLOCKED" ||
      exec.status === "REVIEW" ||
      exec.outputCount > 0);

  if (ssrRich && motorPresent && schema.found && !exec.rebuildGate) {
    return {
      class: "PASS",
      reason: "SSR-rich + schema clean + formula reachable",
      suggest: "Sitemap candidate (await approval); keep on allowlist",
    };
  }

  if (!schema.found) {
    return {
      class: "UNCLEAR",
      reason: "schema file not found for slug",
      suggest: "Manual review — registry/schema path mismatch?",
    };
  }

  if (!ssrRich && ssr.http === 200) {
    return {
      class: "UNCLEAR",
      reason: `SSR thin (logic=${ssr.formulaLogic} labels=${ssr.labels})`,
      suggest: "Possible CTA shell — upgrade to oee pattern or remove from allowlist",
    };
  }

  if (exec.rebuildGate) {
    return {
      class: "UNCLEAR",
      reason: "execute blocked by V5.4 rebuild gate / DISABLED",
      suggest: "Verify allowlist gate vs motor — do not blind-404",
    };
  }

  return {
    class: "UNCLEAR",
    reason: `exec=${exec.status}; ssrRich=${ssrRich}`,
    suggest: "Manual decision required",
  };
}

async function main() {
  const slugs = parseAllowlist();
  console.log(`BLOK B TRIAGE — base=${BASE} — slugs=${slugs.length}\n`);
  const rows = [];
  for (const slug of slugs) {
    process.stderr.write(`… ${slug}\n`);
    const schema = schemaFlags(slug);
    const [exec, ssr] = await Promise.all([executeProbe(slug), ssrProbe(slug)]);
    const verdict = classify(exec, schema, ssr);
    rows.push({ slug, schema, exec, ssr, ...verdict });
  }

  const groups = { PASS: [], FAIL: [], UNCLEAR: [] };
  for (const r of rows) groups[r.class].push(r);

  console.log("════════════════════════════════════════");
  console.log(
    `SUMMARY  PASS=${groups.PASS.length}  FAIL=${groups.FAIL.length}  UNCLEAR=${groups.UNCLEAR.length}`,
  );
  console.log("════════════════════════════════════════\n");

  for (const cls of ["PASS", "FAIL", "UNCLEAR"]) {
    console.log(`--- [${cls}] ${groups[cls].length} ---`);
    for (const r of groups[cls]) {
      console.log(
        `${r.slug} | ${r.reason} | http=${r.ssr.http} robots=${r.ssr.robots} | exec=${r.exec.status} | gen=${r.schema.generation} src=${r.schema.needsSource} | suggest: ${r.suggest}`,
      );
    }
    console.log("");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
