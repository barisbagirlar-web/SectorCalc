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
 * Classes: GEÇTİ | KALDI | BELİRSİZ
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const BASE = process.env.TRIAGE_BASE_URL ?? "https://sectorcalc.com";

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
  const exact = files.find((f) => f === hyphen || f.endsWith(`-${hyphen}`) || f === underscore || f.endsWith(`-${underscore}`));
  if (exact) return join(dir, exact);
  // numbered prefix e.g. 278-von-mises-stress-calculator.json
  const fuzzy = files.find(
    (f) => f.includes(slug) || f.includes(slug.replace(/-/g, "_")),
  );
  return fuzzy ? join(dir, fuzzy) : null;
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

async function executeProbe(slug) {
  const res = await fetch(`${BASE}/api/tool-execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
    body: JSON.stringify({ toolKey: slug, inputs: {} }),
  });
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
  const res = await fetch(`${BASE}/tools/free/${slug}`, {
    headers: { "Cache-Control": "no-cache", "User-Agent": "SectorCalc-Triage/1.0" },
  });
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
  // KALDI hard fails
  if (schema.generation || schema.needsSource) {
    return {
      class: "KALDI",
      reason: schema.generation
        ? "SCHEMA_GENERATION_MODE=true"
        : "NEEDS_SOURCE_VERIFICATION=true",
      suggest: "allowlist'ten ÇIKAR (hard-404) — stub şablon; soft noindex'e gerek yok",
    };
  }
  if (exec.noFormula || exec.internalOnly) {
    return {
      class: "KALDI",
      reason: exec.noFormula ? "NO_FORMULA_MODULE" : "INTERNAL_SERVER_ONLY",
      suggest: "allowlist'ten ÇIKAR (hard-404) — motor yok",
    };
  }
  if (ssr.http === 404) {
    return {
      class: "KALDI",
      reason: "HTTP 404 on tool page",
      suggest: "allowlist'ten ÇIKAR (zaten hard-404) veya schema/registry sync",
    };
  }
  if (ssr.http === 200 && /noindex/i.test(ssr.robots)) {
    return {
      class: "KALDI",
      reason: "200 + noindex soft-404 shell",
      suggest: "allowlist/registry sync; hard-404 tercih",
    };
  }

  const ssrRich =
    ssr.formulaLogic >= 1 &&
    ssr.validationNotes >= 1 &&
    ssr.assumptions >= 1 &&
    ssr.labels >= 1;

  // Empty inputs often BLOCKED — that is OK if formula module exists and page is SSR-rich
  const motorPresent =
    !exec.noFormula &&
    !exec.internalOnly &&
    (exec.ok ||
      exec.status === "BLOCKED" ||
      exec.status === "REVIEW" ||
      exec.outputCount > 0);

  if (ssrRich && motorPresent && schema.found && !exec.rebuildGate) {
    return {
      class: "GEÇTİ",
      reason: "SSR-rich + schema clean + formula reachable",
      suggest: "sitemap'e almaya ADAY (onay sonrası); allowlist'te tut",
    };
  }

  if (!schema.found) {
    return {
      class: "BELİRSİZ",
      reason: "schema file not found for slug",
      suggest: "manuel inceleme — registry/schema path mismatch?",
    };
  }

  if (!ssrRich && ssr.http === 200) {
    return {
      class: "BELİRSİZ",
      reason: `SSR thin (logic=${ssr.formulaLogic} labels=${ssr.labels})`,
      suggest: "CTA kabuğu olabilir — oee kalıbına taşı veya allowlist'ten çıkar (onay)",
    };
  }

  if (exec.rebuildGate) {
    return {
      class: "BELİRSİZ",
      reason: "execute blocked by V5.4 rebuild gate / DISABLED",
      suggest: "allowlist gate vs motor — doğrula; kör 404 yapma",
    };
  }

  return {
    class: "BELİRSİZ",
    reason: `exec=${exec.status}; ssrRich=${ssrRich}`,
    suggest: "manuel karar",
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

  const groups = { GEÇTİ: [], KALDI: [], BELİRSİZ: [] };
  for (const r of rows) groups[r.class].push(r);

  console.log("════════════════════════════════════════");
  console.log(
    `SUMMARY  GEÇTİ=${groups.GEÇTİ.length}  KALDI=${groups.KALDI.length}  BELİRSİZ=${groups.BELİRSİZ.length}`,
  );
  console.log("════════════════════════════════════════\n");

  for (const cls of ["GEÇTİ", "KALDI", "BELİRSİZ"]) {
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
