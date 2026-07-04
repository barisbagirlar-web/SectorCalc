#!/usr/bin/env node
/**
 * SectorCalc Page Runtime Smoke Test
 *
 * Starts against a running app or accepts BASE_URL env variable.
 * Checks:
 *   - /
 *   - /free-tools
 *   - /pro-tools
 *   - /tools/generated/pb-ratio-calculator
 *   - at least one PRO detail page
 *   - /en
 *   - /tr
 *
 * Fails on:
 *   - unexpected status code
 *   - raw slug H1 for known tool
 *   - "categories." in HTML
 *   - "daily-renovation" as wrong subtitle
 *   - Turkish characters
 *   - exact formula leak markers
 *   - Next.js runtime error text in page
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const TURKISH_RE = /[ğüşıöçĞÜŞİÖÇ]/;
const FORMULA_LEAK_RE =
  /\b(expression\s*[:=]|formula_expression\s*[:=]|public_formula_expression)\b/i;
const RUNTIME_ERROR_RE =
  /(Application error|a client-side exception|Something went wrong|500 -|500 Internal|Internal Server Error|RSC render error|Error: Not Found)/i;
const RAW_SLUG_H1_RE = /\bh1[^>]*>\s*(pb-ratio-calculator|tool-weld-strength)/i;

const routes = [
  { path: "/", expected: 200 },
  { path: "/free-tools", expected: 200 },
  { path: "/pro-tools", expected: 200 },
  { path: "/tools/generated/pb-ratio-calculator", expected: 200 },
  { path: "/en", expected: 404 },
  { path: "/tr", expected: 404 },
];

let failures = 0;

async function checkRoute({ path, expected }) {
  const url = `${BASE_URL}${path}`;
  let status;
  let html;
  try {
    const res = await fetch(url);
    status = res.status;
    html = await res.text();
  } catch (err) {
    console.error(`FAIL  ${path} — network error: ${err.message}`);
    failures++;
    return;
  }

  if (status !== expected) {
    console.error(
      `FAIL  ${path} — expected status ${expected}, got ${status}`,
    );
    failures++;
    return;
  }

  // Only check content for 200 pages
  if (status === 200) {
    const contentChecks = [
      {
        re: TURKISH_RE,
        label: "Turkish characters",
      },
      {
        re: FORMULA_LEAK_RE,
        label: "formula expression leak",
      },
      {
        re: RUNTIME_ERROR_RE,
        label: "runtime error text",
      },
      {
        re: RAW_SLUG_H1_RE,
        label: "raw slug in H1",
      },
    ];

    for (const { re, label } of contentChecks) {
      if (re.test(html)) {
        console.error(
          `FAIL  ${path} — contains ${label} (matched: ${html.match(re)?.[0]})`,
        );
        failures++;
      }
    }

    // Check for "categories." only on tool detail pages
    if (path.startsWith("/tools/") && /categories\./i.test(html)) {
      console.error(`FAIL  ${path} — contains bare "categories." text`);
      failures++;
    }

    // Check for "daily-renovation" subtitle
    if (/daily-renovation/i.test(html)) {
      console.error(`FAIL  ${path} — contains "daily-renovation"`);
      failures++;
    }
  }

  console.log(`PASS  ${path} (${status})`);
}

async function main() {
  console.log(`SectorCalc Page Runtime Smoke Test`);
  console.log(`Target: ${BASE_URL}`);
  console.log("");

  for (const route of routes) {
    await checkRoute(route);
  }

  // Try one PRO detail page (pick the first schema alphabetically)
  try {
    const proRes = await fetch(`${BASE_URL}/pro-tools`);
    const proHtml = await proRes.text();
    const slugMatch = proHtml.match(/href="\/tools\/pro\/([^"]+)"/);
    if (slugMatch) {
      const slug = slugMatch[1];
      await checkRoute({ path: `/tools/pro/${slug}`, expected: 200 });
    } else {
      console.warn(
        "WARN  /pro-tools — could not extract PRO tool slug from page",
      );
    }
  } catch (err) {
    console.error(`FAIL  PRO detail lookup — network error: ${err.message}`);
    failures++;
  }

  console.log("");
  if (failures > 0) {
    console.log(
      `RESULT: ${failures} failure(s) — PAGE RUNTIME SMOKE FAILED`,
    );
    process.exit(1);
  }
  console.log("RESULT: ALL PASS — PAGE RUNTIME SMOKE OK");
  process.exit(0);
}

main();
