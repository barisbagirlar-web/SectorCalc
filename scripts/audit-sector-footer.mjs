#!/usr/bin/env node
/**
 * CI gate: SectorCalc HUD footer — structure lock, i18n, forbidden copy, links.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const REQUIRED_CLASSES = [
  "sch-footer",
  "sch-container",
  "sch-hud-bar",
  "sch-logo",
  "sch-sq",
  "sch-logo-text",
  "sch-badge",
  "sch-mono-text",
  "sch-status-ok",
  "sch-dot",
  "animate-pulse",
  "sch-grid",
  "sch-panel",
  "sch-panel-visual",
  "sch-shape-svg",
  "sch-svg-bg",
  "sch-svg-icon",
  "sch-spin-hover",
  "sch-svg-text",
  "sch-svg-dot",
  "sch-panel-content",
  "sch-panel-terminal",
  "sch-terminal-body",
  "sch-label",
  "sch-input",
  "sch-btn",
  "sch-social-node",
  "sch-bottom-nav",
  "sch-legal-links",
  "sch-meta-info",
];

const REQUIRED_SVG_PATHS = [
  "M140 70 V210 M70 140 H210",
  "M70 140 H210",
  "M90 90 L190 190 M190 90 L90 190",
];

/** Exact public TR phrases allowed despite broader forbidden-term rules. */
const ALLOWED_PUBLIC_TR_PHRASES = ["Fiyat Teklif Sihirbazı"];

function stripAllowedPublicTrPhrases(text) {
  let out = text;
  for (const phrase of ALLOWED_PUBLIC_TR_PHRASES) {
    out = out.split(phrase).join("");
  }
  return out;
}

/** Public footer copy only — not sch-* class names (e.g. sch-panel-terminal). */
const FORBIDDEN =
  /Bütünsel Analitik Platformu|BÜTÜNSEL ANALİTİK PLATFORMU|\bAnalitik\b|\bAnalyzer\b|\bAnalysis\b|\bAnalyze\b|\bAnaliz\b|\banaliz\b|\bSihirbaz\b|\bYÜRÜT\b|\bEXEC\b|SYS\.OK|VER: 2\.5_HYBRID|ISO 27001|\bSLA\b|Yatırımcı Demosu/i;

const POSITIVE_TR = [
  "SEKTÖREL HESAP MAKİNESİ",
  "Fiyat Teklif Sihirbazı",
  "Makine Saat Ücreti Hesaplayıcı",
  "Fire ve Malzeme Kaybı",
  "OEE Hesaplayıcı",
  "Kompresör Kaçağı Maliyeti",
  "SECTORCALC BÜLTENİ",
];

const failures = [];

const footerTsx = readFileSync(
  join(ROOT, "src/components/layout/EnterpriseFooter.tsx"),
  "utf8",
);
const linksTs = readFileSync(join(ROOT, "src/lib/footer/sector-footer-links.ts"), "utf8");

const footerCss = readFileSync(join(ROOT, "src/styles/sectorcalc-hud-footer.css"), "utf8");

for (const cls of REQUIRED_CLASSES) {
  if (!footerTsx.includes(cls)) {
    failures.push(`EnterpriseFooter.tsx missing class: ${cls}`);
  }
}

for (const pathD of REQUIRED_SVG_PATHS) {
  if (!footerTsx.includes(pathD)) {
    failures.push(`EnterpriseFooter.tsx missing SVG path: ${pathD}`);
  }
}

if (!footerCss.includes("transform: rotate(360deg) scale(0.8)")) {
  failures.push("sectorcalc-hud-footer.css missing 360deg hover transform");
}

if (!footerCss.includes("rgba(74, 92, 245, 0.15)")) {
  failures.push("sectorcalc-hud-footer.css missing original SVG bg stroke color");
}

if (footerCss.includes("transform-box")) {
  failures.push("sectorcalc-hud-footer.css must not contain transform-box");
}

if (footerTsx.includes('href="#"') || footerTsx.includes("href={'#'}")) {
  failures.push("EnterpriseFooter.tsx contains empty # href");
}

if (!linksTs.includes('return "/calculator-library"')) {
  failures.push("getSectorFooterApiHref must return /calculator-library");
}

if (!footerTsx.includes('type="button"')) {
  failures.push("Newsletter button must be type=button (no backend)");
}

for (const locale of LOCALES) {
  const messages = JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"));
  const sectorFooter = messages.sectorFooter;
  if (!sectorFooter || typeof sectorFooter !== "object") {
    failures.push(`${locale}: missing sectorFooter namespace`);
    continue;
  }
  const requiredKeys = [
    "logoText",
    "badge",
    "hudRight1",
    "panel1Svg",
    "panel1Link1",
    "newsletterLabel",
    "legalPrivacy",
    "metaCopyright",
  ];
  for (const key of requiredKeys) {
    if (!sectorFooter[key]) {
      failures.push(`${locale}: sectorFooter.${key} missing`);
    }
  }
  for (const value of Object.values(sectorFooter)) {
    if (typeof value === "string" && FORBIDDEN.test(stripAllowedPublicTrPhrases(value))) {
      failures.push(`${locale}: forbidden copy in sectorFooter → "${value.slice(0, 60)}"`);
    }
  }
}

const trMessages = JSON.parse(readFileSync(join(ROOT, "messages", "tr.json"), "utf8"));
const trBlob = JSON.stringify(trMessages.sectorFooter ?? {});
for (const phrase of POSITIVE_TR) {
  if (!trBlob.includes(phrase)) {
    failures.push(`tr: missing positive footer copy → "${phrase}"`);
  }
}

console.log("audit:sector-footer");
if (failures.length === 0) {
  console.log("PASS — HUD footer structure, i18n, and copy OK");
  process.exit(0);
}

console.log(`FAIL — ${failures.length} issue(s):`);
for (const line of failures) {
  console.log(`  - ${line}`);
}
process.exit(1);
