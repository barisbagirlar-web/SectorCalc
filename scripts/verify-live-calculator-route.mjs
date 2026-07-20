#!/usr/bin/env node
/**
 * Post-deploy live route isolation check.
 *
 * Diagnosis (2026-07-20):
 * - Live free break-even / oee / von-mises do NOT embed NPV form labels.
 * - Shared org JSON-LD may mention "IRR/NPV" in knowsAbout — that is NOT
 *   cross-tool form contamination.
 * - The previous CI step failed because PRO SSR often ships a streaming
 *   shell without the calculator title string, so title grep exited under
 *   `set -e` before (or instead of) a true contamination signal.
 *
 * This script:
 * 1) Checks FREE pages that SSR-render identity + fields.
 * 2) Checks PRO break-even for HTTP 200 + slug identity + no NPV labels.
 * 3) Positive-controls NPV hub so the contamination grep is known-working.
 */
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SITE = process.env.PUBLIC_SITE_URL || "https://sectorcalc.com";
const RELEASE = process.env.RELEASE_SHA || String(Date.now());

/** Labels that belong to capital-appraisal / NPV tools — must not appear on break-even/oee/von-mises. */
const NPV_FORM_LABELS = [
  "Initial Investment",
  "Annual Net Cash Flow",
  "Discount Rate",
  "Residual Value",
];

const NPV_LABEL_RE = new RegExp(NPV_FORM_LABELS.map(escapeRegExp).join("|"));

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fetchHtml(path) {
  const url = `${SITE}${path}${path.includes("?") ? "&" : "?"}release=${encodeURIComponent(RELEASE)}`;
  const res = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Accept: "text/html",
    },
    redirect: "follow",
  });
  const html = await res.text();
  return { url, status: res.status, html, bytes: Buffer.byteLength(html, "utf8") };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findNpvLabelHits(html) {
  const hits = [];
  for (const label of NPV_FORM_LABELS) {
    let from = 0;
    while (true) {
      const idx = html.indexOf(label, from);
      if (idx < 0) break;
      hits.push({ label, idx, ctx: html.slice(Math.max(0, idx - 40), idx + label.length + 40).replace(/\s+/g, " ") });
      from = idx + label.length;
    }
  }
  return hits;
}

function mustNotContainNpvLabels(pageName, html) {
  const hits = findNpvLabelHits(html);
  if (hits.length > 0) {
    console.error(`CROSS_TOOL_INPUT_CONTAMINATION=FAIL page=${pageName}`);
    for (const hit of hits.slice(0, 8)) {
      console.error(`  label=${JSON.stringify(hit.label)} ctx=${JSON.stringify(hit.ctx)}`);
    }
    throw new Error(`${pageName}: forbidden NPV form labels present (${hits.length} hit(s))`);
  }
}

function mustContain(pageName, html, needles) {
  for (const needle of needles) {
    assert(html.includes(needle), `${pageName}: missing identity marker ${JSON.stringify(needle)}`);
  }
}

async function main() {
  const outDir = mkdtempSync(join(tmpdir(), "sectorcalc-live-verify-"));
  console.log(`LIVE_VERIFY_SITE=${SITE}`);
  console.log(`LIVE_VERIFY_RELEASE=${RELEASE}`);
  console.log(`LIVE_VERIFY_TMP=${outDir}`);

  // A) FREE break-even — SSR-rich identity page
  const freeBe = await fetchHtml("/tools/free/break-even-and-margin-of-safety-analysis");
  writeFileSync(join(outDir, "free-break-even.html"), freeBe.html);
  assert(freeBe.status === 200, `free break-even HTTP ${freeBe.status}`);
  mustContain("free-break-even", freeBe.html, ["Break-Even", "Margin of Safety"]);
  mustNotContainNpvLabels("free-break-even", freeBe.html);
  console.log(`FREE_BREAK_EVEN=PASS bytes=${freeBe.bytes}`);

  // B) FREE oee / von-mises control pages — must stay free of NPV form labels
  for (const slug of ["oee", "von-mises-stress-calculator"]) {
    const page = await fetchHtml(`/tools/free/${slug}`);
    writeFileSync(join(outDir, `free-${slug}.html`), page.html);
    assert(page.status === 200, `free ${slug} HTTP ${page.status}`);
    mustNotContainNpvLabels(`free-${slug}`, page.html);
    console.log(`FREE_${slug.toUpperCase().replace(/-/g, "_")}=PASS bytes=${page.bytes}`);
  }

  // C) PRO break-even — identity via slug / aria-label / title; not via fragile full SSR form
  const proBe = await fetchHtml("/tools/pro/break-even-survival-cash-calculator");
  writeFileSync(join(outDir, "pro-break-even.html"), proBe.html);
  assert(proBe.status === 200, `pro break-even HTTP ${proBe.status}`);
  const proIdentity =
    proBe.html.includes("break-even-survival-cash-calculator") ||
    proBe.html.includes("Break-Even & Survival Cash Calculator") ||
    proBe.html.includes("Break-Even &amp; Survival Cash Calculator") ||
    proBe.html.includes("Break-Even and Survival Cash Calculator");
  assert(proIdentity, "pro break-even: missing slug/title identity marker");
  mustNotContainNpvLabels("pro-break-even", proBe.html);
  console.log(`PRO_BREAK_EVEN=PASS bytes=${proBe.bytes}`);

  // D) Positive control — NPV hub MUST contain its own form labels (grep is live)
  const npvHub = await fetchHtml("/calculators/npv");
  writeFileSync(join(outDir, "npv-hub.html"), npvHub.html);
  assert(npvHub.status === 200, `npv hub HTTP ${npvHub.status}`);
  assert(NPV_LABEL_RE.test(npvHub.html), "npv hub: expected NPV form labels missing — contamination grep is inert");
  mustContain("npv-hub", npvHub.html, ["Initial Investment", "Discount Rate"]);
  console.log(`NPV_HUB_POSITIVE_CONTROL=PASS bytes=${npvHub.bytes}`);

  // E) ROI hub sanity (no break-even contamination expected either way)
  const roiHub = await fetchHtml("/calculators/roi");
  writeFileSync(join(outDir, "roi-hub.html"), roiHub.html);
  assert(roiHub.status === 200, `roi hub HTTP ${roiHub.status}`);
  mustContain("roi-hub", roiHub.html, ["Return on Investment", "ROI"]);
  console.log(`ROI_HUB=PASS bytes=${roiHub.bytes}`);

  console.log("LIVE_CALCULATOR_ROUTE=PASS");
  console.log("CROSS_TOOL_INPUT_CONTAMINATION=PASS");
}

main().catch((error) => {
  console.error(String(error?.stack || error));
  process.exit(1);
});
