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
  "sch-hud-left",
  "sch-footer-brand",
  "sch-logo",
  "sch-logo-icon",
  "sch-sq",
  "sch-logo-text",
  "sch-footer-tagline",
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
  "sch-list",
  "sch-panel-note",
  "sch-footer-note-title",
  "sch-footer-note",
  "sch-bottom-nav",
  "sch-legal-links",
  "sch-meta-info",
  "sch-mono-text",
];

const REQUIRED_SVG_PATHS = [
  "M140 70 V210 M70 140 H210",
  "M70 140 H210",
  "M90 90 L190 190 M190 90 L90 190",
];

const ALLOWED_PUBLIC_TR_PHRASES = ["Fiyat Teklif Sihirbazı"];

function stripAllowedPublicTrPhrases(text) {
  let out = text;
  for (const phrase of ALLOWED_PUBLIC_TR_PHRASES) {
    out = out.split(phrase).join("");
  }
  return out;
}

const FORBIDDEN_COPY =
  /Bütünsel Analitik Platformu|BÜTÜNSEL ANALİTİK PLATFORMU|\bAnalitik\b|\bAnalyzer\b|\bAnalysis\b|\bAnalyze\b|\bAnaliz\b|\banaliz\b|\bSihirbaz\b|\bYÜRÜT\b|\bEXEC\b|SYS\.OK|VER: 2\.5_HYBRID|ISO 27001|\bSLA\b|Yatırımcı Demosu/i;

const FORBIDDEN_META =
  /REG:|CUR:|KAYIT:|SYS\.OK|VER:|HYBRID|INAPILLMS|INAPI|APILLMS|\bLLMS\b|SECTORCALCSEKTÖREL|GİZLİLİK POLİTİKASIKULLANIM/i;

const POSITIVE_TR = [
  "SectorCalc",
  "sektörel hesaplama araçları",
  "Fiyat Teklif Sihirbazı",
  "Gizlilik Politikası",
  "Kullanım Koşulları",
  "Tüm hakları saklıdır",
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

if (footerTsx.includes("sch-social-grid") || footerTsx.includes("socialIn")) {
  failures.push("EnterpriseFooter.tsx must not render IN/API/LLMS social nodes");
}

if (footerTsx.includes("metaReg") || footerTsx.includes("metaCur")) {
  failures.push("EnterpriseFooter.tsx must not render REG/CUR meta fields");
}

if (!linksTs.includes('return "/calculator-library"')) {
  failures.push("getSectorFooterApiHref must return /calculator-library");
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
    "tagline",
    "homeAria",
    "panel1Svg",
    "panel1Link1",
    "noteTitle",
    "noteBody",
    "legalPrivacy",
    "legalTerms",
    "legalDisclaimer",
    "metaCopyright",
    "metaRights",
  ];
  for (const key of requiredKeys) {
    if (!sectorFooter[key]) {
      failures.push(`${locale}: sectorFooter.${key} missing`);
    }
  }
  for (const value of Object.values(sectorFooter)) {
    if (typeof value === "string") {
      const stripped = stripAllowedPublicTrPhrases(value);
      if (FORBIDDEN_COPY.test(stripped)) {
        failures.push(`${locale}: forbidden copy in sectorFooter → "${value.slice(0, 60)}"`);
      }
      if (FORBIDDEN_META.test(value)) {
        failures.push(`${locale}: forbidden meta copy in sectorFooter → "${value.slice(0, 60)}"`);
      }
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
