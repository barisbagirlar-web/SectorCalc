#!/usr/bin/env node
/**
 * P28 CI gate — no public roadmap leaks; footer meta/social layout guards.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const PUBLIC_FORBIDDEN = [
  "Stratejik yol haritası",
  "Stratejik Premium Hesaplayıcı Yol Haritası",
  "Faz 1",
  "Faz 2",
  "Faz 3",
  "Faz 4",
  "Planlandı",
  "Yayında",
  "KAYIT: KÜRESEL",
  "CUR: TRY",
  "INAPILLMS",
  "INAPI",
  "APILLMS",
];

const PREMIUM_PAGE_FORBIDDEN = [
  "Stratejik yol haritası",
  "Stratejik Premium Hesaplayıcı Yol Haritası",
  "Faz 1",
  "Faz 2",
  "Faz 3",
  "Faz 4",
  "Puan",
  "Skor",
  "Planlandı",
  "Yayında",
];

let failures = 0;
let passes = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function read(rel) {
  return readFileSync(join(ROOT, rel), "utf8");
}

const premiumPage = read("src/app/[locale]/premium-tools/page.tsx");
if (premiumPage.includes("StrategicPremiumRoadmapPanel")) {
  fail("premium-tools page still renders StrategicPremiumRoadmapPanel");
} else {
  pass("roadmap panel removed from premium-tools page");
}

if (premiumPage.includes("buildStrategicPremiumRoadmapCards")) {
  fail("premium-tools page still builds strategic roadmap cards");
} else {
  pass("strategic roadmap cards not loaded on premium-tools page");
}

const footer = read("src/components/layout/EnterpriseFooter.tsx");
if (!footer.includes("sch-meta-info") || !footer.includes("sch-mono-text")) {
  fail("footer meta spans missing sch-mono-text structure");
} else {
  pass("footer meta uses separated sch-mono-text spans");
}

if (footer.includes('href="#"')) {
  fail("footer contains href=\"#\"");
} else {
  pass("footer social links avoid href=\"#\"");
}

const footerCss = read("src/styles/sectorcalc-hud-footer.css");
for (const rule of [".sch-social-grid", ".sch-meta-info", ".sch-legal-links"]) {
  if (!footerCss.includes(rule)) {
    fail(`footer CSS missing ${rule}`);
  }
}
pass("footer social/meta/legal CSS rules present");

const tr = JSON.parse(read("messages/tr.json"));
const en = JSON.parse(read("messages/en.json"));

if (!tr.sectorFooter?.metaCopyright || !en.sectorFooter?.metaCopyright) {
  fail("sectorFooter.metaCopyright missing in en/tr messages");
} else {
  pass("sectorFooter.metaCopyright present in en/tr");
}

const trFooterBlob = JSON.stringify(tr.sectorFooter ?? {});
if (trFooterBlob.includes("KAYIT") || trFooterBlob.includes("CUR: TRY")) {
  fail("TR sectorFooter still contains legacy KAYIT/CUR footer leak strings");
} else {
  pass("TR sectorFooter free of legacy KAYIT/CUR prefixes");
}

if (!tr.catalogExplorer.discoveryTabs.premiumToolsAll?.includes("premium")) {
  fail("TR premium tools all-tab label missing");
} else {
  pass("TR premium filter labels present");
}

if (tr.catalogExplorer?.premiumRoadmap) {
  fail("TR messages still expose catalogExplorer.premiumRoadmap");
} else {
  pass("premiumRoadmap removed from public messages");
}

const staticHtmlPaths = [
  ".next/server/app/tr/premium-tools.html",
  ".next/server/app/tr.html",
];

if (process.env.POST_BUILD === "1") {
  for (const rel of staticHtmlPaths) {
    const full = join(ROOT, rel);
    if (!existsSync(full)) {
      continue;
    }
    const html = readFileSync(full, "utf8");
    for (const term of PREMIUM_PAGE_FORBIDDEN) {
      if (html.includes(term)) {
        fail(`static HTML ${rel} contains forbidden: ${term}`);
      }
    }
    for (const term of ["KAYIT: KÜRESEL", "CUR: TRY", "INAPILLMS"]) {
      if (html.includes(term)) {
        fail(`static HTML ${rel} contains footer leak: ${term}`);
      }
    }
  }
  pass("post-build static HTML scan completed when artifacts exist");
} else {
  pass("source-level public surface checks complete (set POST_BUILD=1 for HTML scan)");
}

console.log(`\naudit:public-surface — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
