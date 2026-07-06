#!/usr/bin/env node
/**
 * scripts/audit-live-free-v531-tools.mjs
 *
 * V5.4 Core — Live Quality Audit for all active Free V5.3.1 tool routes.
 * Fetches each production URL and validates:
 *   - HTTP 200
 *   - No 404 text (NEXT_HTTP_ERROR_FALLBACK;404)
 *   - Title present
 *   - CTA/pro link present
 *   - English-only
 *   - JSON-LD present
 *   - No formula leak
 *   - No certification/legal claims
 *
 * Usage:
 *   node scripts/audit-live-free-v531-tools.mjs
 *
 * Env:
 *   FREE_V531_BASE_URL  - default https://sectorcalc.com
 *   SAMPLE=<N>           - check first N tools only
 *   MAX_FAIL=<N>         - stop after N failures (0 = all)
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE_URL = process.env.FREE_V531_BASE_URL || "https://sectorcalc.com";
const ALLOWLIST_PATH = path.join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");
const SCHEMA_DIR = path.join(ROOT, "src/sectorcalc/schemas/free-v531");
const SAMPLE = parseInt(process.env.SAMPLE || "0", 10);
const MAX_FAIL = parseInt(process.env.MAX_FAIL || "0", 10);

const TURKISH_RE = /[ğüşıöçĞÜŞİÖÇ]/;

const LEAK_PATTERNS = [
  "formula_expression",
  "INTERNAL_SERVER_ONLY",
  "privateFormula",
  "checkerTrace",
  "private_formula_expression",
  "public_formula_expression",
  "publicFormulaExpression",
  "uncertainty_expression",
];

const CERT_PATTERNS = [
  { re: /\bcertified\b/i, label: "certified" },
  { re: /\blegal\s+proof\b/i, label: "legal proof" },
  { re: /\bgovernmental\s+approval\b/i, label: "gov approval" },
  { re: /\bofficial\s+certification\b/i, label: "official certification" },
  { re: /\bISO\s+certified\b/i, label: "ISO certified" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseActiveFreeSlugs() {
  const content = fs.readFileSync(ALLOWLIST_PATH, "utf-8");
  const m = content.match(
    /ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/,
  );
  if (!m) {
    console.error("FAIL: cannot parse ACTIVE_FREE_TOOL_SLUGS from", ALLOWLIST_PATH);
    process.exit(1);
  }
  const slugs = m[1]
    .split(",")
    .map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, ""))
    .filter((s) => s.length > 0 && !s.startsWith("//"));
  return SAMPLE > 0 ? slugs.slice(0, SAMPLE) : slugs;
}

function loadToolNames() {
  const names = {};
  if (!fs.existsSync(SCHEMA_DIR)) return names;
  for (const f of fs.readdirSync(SCHEMA_DIR).filter((f) => f.endsWith(".json"))) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, f), "utf-8"));
      if (d.tool_key && d.tool_name) names[d.tool_key] = d.tool_name;
    } catch {}
  }
  return names;
}

async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);
    try {
      const resp = await fetch(url, { signal: controller.signal, redirect: "follow" });
      clearTimeout(timer);
      if (resp.status === 429 && attempt < maxRetries) {
        await sleep(5000 * attempt);
        continue;
      }
      return resp;
    } catch (err) {
      clearTimeout(timer);
      if (attempt < maxRetries) {
        await sleep(3000 * attempt);
        continue;
      }
      throw err;
    }
  }
  throw new Error("Max retries exceeded");
}

async function auditTool(slug) {
  const url = `${BASE_URL}/tools/free/${slug}`;
  const r = {
    slug,
    httpStatus: 0,
    titleOk: false,
    ctaOk: false,
    englishOnly: true,
    jsonldOk: false,
    no404: false,
    noLeak: true,
    noCertClaim: true,
    failReasons: [],
  };

  let resp;
  try {
    resp = await fetchWithRetry(url);
    r.httpStatus = resp.status;
  } catch (err) {
    r.failReasons.push(`FETCH:${err.message}`);
    return r;
  }

  let body;
  try {
    body = await resp.text();
  } catch {
    r.failReasons.push("BODY_ERR");
    return r;
  }

  if (resp.status !== 200) r.failReasons.push(`HTTP_${resp.status}`);

  // 404 detection — Next.js error boundary or explicit 404
  const is404 =
    body.includes("NEXT_HTTP_ERROR_FALLBACK;404") ||
    body.includes("NEXT_NOT_FOUND") ||
    body.includes("/_not-found") ||
    body.includes('"statusCode":404') ||
    (body.includes("404") && body.includes("Page Not Found")) ||
    body.includes("The page you are looking for does not exist");
  r.no404 = !is404;
  if (is404) {
    r.failReasons.push("404");
    return r; // skip other checks on 404
  }

  // Content checks (only if page is not 404)
  if (body.includes("<title>")) {
    const title = body.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
    r.titleOk = title.length > 0;
  }
  if (!r.titleOk) r.failReasons.push("TITLE");

  const ctaRe = [/\/pricing/, /\/pro-tools/, /cta-primary/, /proUnlockReason/];
  r.ctaOk = ctaRe.some((re) => re.test(body));
  if (!r.ctaOk) r.failReasons.push("NO_CTA");

  r.englishOnly = !TURKISH_RE.test(body);
  if (!r.englishOnly) r.failReasons.push("TR");

  r.jsonldOk =
    body.includes('@type":"SoftwareApplication"') ||
    body.includes('application/ld+json');
  if (!r.jsonldOk) r.failReasons.push("NO_JSONLD");

  for (const pat of LEAK_PATTERNS) {
    if (body.includes(pat)) {
      r.noLeak = false;
      r.failReasons.push(`LEAK:${pat}`);
      break;
    }
  }

  for (const { re, label } of CERT_PATTERNS) {
    if (re.test(body)) {
      const safe =
        body.includes("not a certified document") ||
        body.includes("not certified") ||
        body.includes("does not certify") ||
        body.includes("decision-support only");
      if (!safe) {
        r.noCertClaim = false;
        r.failReasons.push(`CLAIM:${label}`);
      }
      break;
    }
  }

  return r;
}

async function main() {
  const slugs = parseActiveFreeSlugs();
  console.log(`\n🔍 FREE V5.3.1 LIVE AUDIT — ${BASE_URL}`);
  console.log(`   Routes: ${slugs.length} (SAMPLE=${SAMPLE || "all"}, MAX_FAIL=${MAX_FAIL || "off"})\n`);

  const hdr = [
    "slug".padEnd(38),
    "http".padEnd(5),
    "title".padEnd(6),
    "cta".padEnd(4),
    "en".padEnd(3),
    "jsonld".padEnd(7),
    "404".padEnd(4),
    "leak".padEnd(5),
    "cert".padEnd(5),
    "result",
  ].join(" | ");
  console.log(hdr);
  console.log("-".repeat(hdr.length));

  let passed = 0;
  let failed = 0;
  const failedRoutes = [];

  for (const slug of slugs) {
    const r = await auditTool(slug);
    const pass = r.failReasons.length === 0;
    if (pass) passed++;
    else {
      failed++;
      failedRoutes.push({ slug, reasons: r.failReasons.join(", ") });
    }

    console.log(
      [
        slug.padEnd(38),
        String(r.httpStatus).padStart(4),
        (r.titleOk ? "✓" : "✗").padStart(5),
        (r.ctaOk ? "✓" : "✗").padStart(3),
        (r.englishOnly ? "✓" : "✗").padStart(2),
        (r.jsonldOk ? "✓" : "✗").padStart(6),
        (r.no404 ? "✓" : "✗").padStart(3),
        (r.noLeak ? "✓" : "✗").padStart(4),
        (r.noCertClaim ? "✓" : "✗").padStart(4),
        (pass ? "PASS" : "FAIL").padStart(7),
      ].join(" | "),
    );
    if (!pass) console.error(`     ↳ ${r.failReasons.join(", ")}`);

    // Fast-fail: stop after MAX_FAIL failures
    if (MAX_FAIL > 0 && failed >= MAX_FAIL) {
      console.error(`\n⚠  Stopped early: reached MAX_FAIL=${MAX_FAIL}`);
      break;
    }

    await sleep(2000);
  }

  const total = passed + failed;
  console.log(
    `\n─── SUMMARY ───\n   Total: ${total}   PASS: ${passed}   FAIL: ${failed}   PASS%: ${((passed / total) * 100).toFixed(1)}%`,
  );
  console.log(
    `\n${failed > 0 ? "❌" : "✅"} FREE_V531_LIVE_AUDIT=${failed > 0 ? "FAIL" : "PASS"}`,
  );

  if (failed > 0) {
    for (const fr of failedRoutes) {
      console.error(`   FAIL ${fr.slug}: ${fr.reasons}`);
    }
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
