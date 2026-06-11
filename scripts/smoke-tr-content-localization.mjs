#!/usr/bin/env node
/**
 * Smoke: Turkish locale content rendering across industry / tool / SEO pages.
 *
 * Confirms that /tr pages render Turkish body content (not English), that
 * banned English UI labels are gone, that natural Turkish labels are present
 * where relevant, and that no /en industry route is served.
 *
 * Coverage was extended in LOCALIZATION-P2-001 to cover the full active
 * industry catalog and the priority premium tool SEO landings.
 *
 * Usage: node scripts/smoke-tr-content-localization.mjs
 *   SMOKE_BASE_URL=http://localhost:3000 node scripts/smoke-tr-content-localization.mjs
 */

import {
  checkFatalMarkers,
  fetchRouteWithRetry,
  getBaseUrl,
  localePath,
} from "./smoke-utils.mjs";

// English UI labels that must NOT appear in /tr page bodies.
// (JSON-LD payloads still allow English Schema.org names; visibleText() strips
// <script> blocks before this check runs.)
const BANNED_LABELS = [
  "Free calculator",
  "Who it is for",
  "What decision it helps with",
  "Standard Weight",
  "Next Parameter",
  "Previous parameter",
  "Cost & Margin Tools",
  "Bid Risk Analyzer",
  "Margin Guard",
  "Profit Verdict",
  "Quote Risk Tool",
  "Start your optimization journey",
  "Our Foundational Belief",
  "Related tools",
  "Premium tool",
  "Free tool",
];

// Turkish header term — confirms the locale shell stayed Turkish.
const TR_HEADER_TERM = "Sektörler";

const REQUIRED_INDUSTRY_TURKISH = [
  "Kimler için uygun?",
  "Hangi kararı netleştirir?",
  "Ücretsiz hesaplama aracı",
];

const INDUSTRY_SLUGS = [
  "welding-fabrication",
  "cnc-manufacturing",
  "hvac",
  "restaurant",
  "construction",
  "cleaning",
  "ecommerce",
  "electrical-contracting",
  "landscaping-lawn-care",
  "auto-repair-shop",
  "printing-signage",
  "plumbing",
  "carpentry-millwork",
  "roofing",
  "painting",
  "sheet-metal",
  "3d-printing-service",
  "logistics-transport",
  "agriculture-crops",
  "agriculture-irrigation",
  "agriculture-feed",
  "agriculture-dairy",
  "energy-consumption",
  "energy-carbon",
  "daily-renovation",
  "daily-fuel",
  "daily-meals",
];

const INDUSTRY_ROUTES = INDUSTRY_SLUGS.map((slug) => ({
  label: `industry:${slug}`,
  path: localePath("tr", `/industries/${slug}`),
  requiredTurkish: REQUIRED_INDUSTRY_TURKISH,
}));

const SEO_ROUTES = [
  {
    label: "seo:cnc-quote-risk-analyzer",
    path: localePath("tr", "/seo/cnc-quote-risk-analyzer"),
    requiredTurkish: ["CNC Teklif Riski Analizi"],
  },
  {
    label: "seo:welding-bid-risk-analyzer",
    path: localePath("tr", "/seo/welding-bid-risk-analyzer"),
    requiredTurkish: ["Kaynak Teklifi Risk Analizi"],
  },
  {
    label: "seo:hvac-project-margin-guard",
    path: localePath("tr", "/seo/hvac-project-margin-guard"),
    requiredTurkish: ["HVAC Proje Kârlılık Kontrolü"],
  },
  {
    label: "seo:menu-profit-leak-detector",
    path: localePath("tr", "/seo/menu-profit-leak-detector"),
    requiredTurkish: ["Menü Kâr Kaçağı Analizi"],
  },
  {
    label: "seo:sheet-metal-quote-risk-tool",
    path: localePath("tr", "/seo/sheet-metal-quote-risk-tool"),
    requiredTurkish: ["Sac Metal Teklif Riski Analizi"],
  },
  {
    label: "seo:change-order-impact-analyzer",
    path: localePath("tr", "/seo/change-order-impact-analyzer"),
    requiredTurkish: ["İş Değişikliği Etki Analizi"],
  },
];

const OTHER_ROUTES = [
  { label: "pricing", path: localePath("tr", "/pricing"), requiredTurkish: [] },
  { label: "enterprise", path: localePath("tr", "/enterprise"), requiredTurkish: [] },
];

/**
 * Strip <script>/<style> blocks so JSON-LD schema and RSC flight payloads
 * (which legitimately contain English) are not treated as visible UI labels.
 */
function visibleText(body) {
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

function bannedHits(body) {
  const visible = visibleText(body);
  return BANNED_LABELS.filter((label) => visible.includes(label));
}

async function auditTrRoute({ label, path, requiredTurkish }) {
  const result = await fetchRouteWithRetry(path);
  const body = result.body ?? "";
  const fatals = checkFatalMarkers(body, result.status);
  const hits = bannedHits(body);
  const missingTurkish = requiredTurkish.filter((t) => !body.includes(t));

  const checks = {
    status200: result.status === 200,
    noFatal: fatals.length === 0,
    turkishHeader: body.includes(TR_HEADER_TERM),
    noBannedLabels: hits.length === 0,
    turkishCopyPresent: missingTurkish.length === 0,
  };

  const ok = Object.values(checks).every(Boolean);
  return { label, path, status: result.status, checks, ok, hits, missingTurkish };
}

/** /en/industries/welding-fabrication must NOT be a 200 route. */
async function auditEnPrefix() {
  const url = `${getBaseUrl()}/en/industries/welding-fabrication`;
  try {
    const res = await fetch(url, { method: "GET", redirect: "manual" });
    return { url, status: res.status, ok: res.status !== 200 };
  } catch (error) {
    return { url, status: 0, ok: false, error: String(error) };
  }
}

function failDetail(r) {
  const parts = [];
  const failed = Object.entries(r.checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (failed.length) parts.push(`fail: ${failed.join(", ")}`);
  if (r.hits.length) parts.push(`banned: ${r.hits.join(" | ")}`);
  if (r.missingTurkish.length) parts.push(`missingTR: ${r.missingTurkish.join(" | ")}`);
  return parts.join("; ");
}

async function main() {
  console.log(`=== Turkish Content Localization Smoke (${getBaseUrl()}) ===\n`);
  const failures = [];

  console.log(`Industry pages (${INDUSTRY_ROUTES.length}):`);
  for (const route of INDUSTRY_ROUTES) {
    const r = await auditTrRoute(route);
    console.log(`${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` + (r.ok ? "" : ` [${failDetail(r)}]`));
    if (!r.ok) failures.push(r);
  }

  console.log(`\nPremium tool SEO landings (${SEO_ROUTES.length}):`);
  for (const route of SEO_ROUTES) {
    const r = await auditTrRoute(route);
    console.log(`${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` + (r.ok ? "" : ` [${failDetail(r)}]`));
    if (!r.ok) failures.push(r);
  }

  console.log("\nOther priority pages:");
  for (const route of OTHER_ROUTES) {
    const r = await auditTrRoute(route);
    console.log(`${r.ok ? "✓" : "✗"} ${r.path} → ${r.status}` + (r.ok ? "" : ` [${failDetail(r)}]`));
    if (!r.ok) failures.push(r);
  }

  console.log("\n/en prefix guard:");
  const enCheck = await auditEnPrefix();
  console.log(
    `${enCheck.ok ? "✓" : "✗"} /en/industries/welding-fabrication → ${enCheck.status} (must not be 200)`,
  );
  if (!enCheck.ok) failures.push(enCheck);

  if (failures.length > 0) {
    console.error(`\nTurkish content localization smoke FAILED (${failures.length} checks)`);
    process.exit(1);
  }
  console.log("\nTurkish content localization smoke PASSED");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
