#!/usr/bin/env node
/**
 * Striking Distance Keyword pipeline (Google Search Console).
 * =========================================================
 * Dependency-free: signs a service-account JWT with node:crypto, exchanges it
 * for an OAuth token, then queries the Search Analytics API. No googleapis dep.
 *
 * "Striking distance" = queries already ranking on the edge of page 1
 * (default average position 8-20) with enough impressions to be worth a push.
 * These are the highest-ROI SEO opportunities.
 *
 * Built as discrete, composable nodes (n8n methodology): each step is a pure
 * function that takes input and returns output; main() wires them together.
 *
 * ENV (all optional; the job fails soft with exit 0 when credentials are absent):
 *   GSC_SERVICE_ACCOUNT_JSON   raw service-account JSON (preferred in CI/n8n)
 *   GOOGLE_APPLICATION_CREDENTIALS  path to service-account JSON file
 *   GSC_SITE_URL               GSC property, e.g. "sc-domain:sectorcalc.com"
 *                              or "https://sectorcalc.com/" (default derives
 *                              sc-domain from NEXT_PUBLIC_SITE_URL/SITE_HOST)
 *   GSC_DAYS                   lookback window in days (default 28)
 *   STRIKING_MIN_POS           min avg position (default 8)
 *   STRIKING_MAX_POS           max avg position (default 20)
 *   STRIKING_MIN_IMPRESSIONS   min impressions filter (default 20)
 *   STRIKING_LIMIT             max rows in report (default 200)
 *
 * SECURITY: never commit service-account JSON. Pass credentials via env only.
 *
 * Usage:  npm run seo:striking-distance
 */
import { createSign } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TOKEN_URI = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const API_BASE = "https://searchconsole.googleapis.com/webmasters/v3";

// ── Node: load credentials ────────────────────────────────────────────
function loadServiceAccount() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim();
  if (raw) {
    return JSON.parse(raw);
  }
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (path) {
    return JSON.parse(readFileSync(path, "utf8"));
  }
  return null;
}

// ── Node: resolve GSC property ────────────────────────────────────────
function resolveSiteUrl() {
  const explicit = process.env.GSC_SITE_URL?.trim();
  if (explicit) return explicit;
  const host = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_HOST ?? "sectorcalc.com")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  return `sc-domain:${host}`;
}

// ── Node: base64url ───────────────────────────────────────────────────
function base64url(input) {
  return Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ── Node: sign JWT + exchange for access token ────────────────────────
async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({ iss: sa.client_email, scope: SCOPE, aud: TOKEN_URI, iat: now, exp: now + 3600 }),
  );
  const signature = createSign("RSA-SHA256")
    .update(`${header}.${claims}`)
    .sign(sa.private_key, "base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  const assertion = `${header}.${claims}.${signature}`;

  const res = await fetch(TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth token exchange failed: HTTP ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.access_token;
}

// ── Node: date range ──────────────────────────────────────────────────
function dateRange(days) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { startDate: fmt(start), endDate: fmt(end) };
}

// ── Node: query Search Analytics ──────────────────────────────────────
async function querySearchAnalytics(token, siteUrl, days) {
  const { startDate, endDate } = dateRange(days);
  const res = await fetch(
    `${API_BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query", "page"],
        rowLimit: 25000,
        dataState: "final",
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Search Analytics query failed: HTTP ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return { rows: json.rows ?? [], startDate, endDate };
}

// ── Node: filter + rank striking-distance opportunities ───────────────
function filterStrikingDistance(rows, { minPos, maxPos, minImpr, limit }) {
  return rows
    .filter((r) => r.position >= minPos && r.position <= maxPos && r.impressions >= minImpr)
    .map((r) => {
      const [query, page] = r.keys;
      // Opportunity score: impressions weighted by proximity to page 1 and
      // headroom in click-through rate.
      const proximity = 1 - (r.position - minPos) / (maxPos - minPos || 1);
      const ctrHeadroom = 1 - Math.min(r.ctr, 0.5) / 0.5;
      const opportunityScore = Math.round(r.impressions * (0.6 * proximity + 0.4 * ctrHeadroom));
      return {
        query,
        page,
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: Number((r.ctr * 100).toFixed(2)),
        position: Number(r.position.toFixed(1)),
        opportunityScore,
      };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, limit);
}

// ── Node: write report (JSON + CSV) ───────────────────────────────────
function writeReport(opportunities, meta) {
  const dir = join(process.cwd(), "reports", "seo");
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);

  const jsonPath = join(dir, `striking-distance-${stamp}.json`);
  writeFileSync(jsonPath, `${JSON.stringify({ ...meta, opportunities }, null, 2)}\n`, "utf8");

  const header = "opportunityScore,query,page,impressions,clicks,ctr_pct,avg_position";
  const csv = [
    header,
    ...opportunities.map((o) =>
      [
        o.opportunityScore,
        `"${o.query.replace(/"/g, '""')}"`,
        `"${o.page}"`,
        o.impressions,
        o.clicks,
        o.ctr,
        o.position,
      ].join(","),
    ),
  ].join("\n");
  const csvPath = join(dir, `striking-distance-${stamp}.csv`);
  writeFileSync(csvPath, `${csv}\n`, "utf8");

  return { jsonPath, csvPath };
}

// ── Pipeline ──────────────────────────────────────────────────────────
async function main() {
  const sa = loadServiceAccount();
  if (!sa) {
    console.warn(
      "GSC credentials not set (GSC_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS) — skipping striking-distance analysis.",
    );
    console.warn("See automation/n8n/README.md for setup.");
    process.exit(0);
  }

  const siteUrl = resolveSiteUrl();
  const days = Number(process.env.GSC_DAYS ?? 28);
  const filters = {
    minPos: Number(process.env.STRIKING_MIN_POS ?? 8),
    maxPos: Number(process.env.STRIKING_MAX_POS ?? 20),
    minImpr: Number(process.env.STRIKING_MIN_IMPRESSIONS ?? 20),
    limit: Number(process.env.STRIKING_LIMIT ?? 200),
  };

  console.log(`GSC property: ${siteUrl}`);
  console.log(`Lookback: ${days} days | striking range: pos ${filters.minPos}-${filters.maxPos}, impressions >= ${filters.minImpr}`);

  const token = await getAccessToken(sa);
  const { rows, startDate, endDate } = await querySearchAnalytics(token, siteUrl, days);
  console.log(`Rows returned: ${rows.length} (${startDate} -> ${endDate})`);

  const opportunities = filterStrikingDistance(rows, filters);
  const { jsonPath, csvPath } = writeReport(opportunities, {
    generatedAt: new Date().toISOString(),
    siteUrl,
    startDate,
    endDate,
    filters,
    totalRows: rows.length,
    strikingCount: opportunities.length,
  });

  console.log(`Striking-distance opportunities: ${opportunities.length}`);
  console.log(`Report: ${jsonPath}`);
  console.log(`Report: ${csvPath}`);
  if (opportunities.length > 0) {
    console.log("\nTop 10 opportunities:");
    for (const o of opportunities.slice(0, 10)) {
      console.log(`  [${o.opportunityScore}] pos ${o.position} | ${o.impressions} impr | "${o.query}" -> ${o.page}`);
    }
  }
}

main().catch((err) => {
  console.error(`Striking-distance analysis failed: ${err.message}`);
  process.exit(1);
});
