#!/usr/bin/env node
/**
 * P30 — Post-build / local-server rendered locale integrity audit.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const ROOT = join(import.meta.dirname, "..");

const ROUTES = [
  "/tr",
  "/tr/free-tools",
  "/tr/premium-tools",
  "/tr/industries",
  "/tr/industries/sheet-metal",
  "/tr/tools/free/concrete-volume-calculator",
  "/tr/tools/free/paint-coverage-calculator",
  "/tr/tools/free/machine-time-calculator",
  "/tr/tools/premium-schema/cnc-oee-loss",
  "/en",
  "/en/free-tools",
  "/de/free-tools",
  "/fr/free-tools",
  "/es/free-tools",
  "/ar/free-tools",
];

const TR_FORBIDDEN =
  /\b(Length|Width|Height|Depth|Yardage|Calculate|Calculator|Result|Input|Output|Required|Optional|Invalid|Submit|Reset|Faz|Puan|Planlandı|Yayında|REG:|CUR:|SYS\.OK|VER:|HYBRID|Wizard|Intelligence)\b/i;

const EN_FORBIDDEN =
  /\b(Hesaplayıcı|Hesapla|Ücretsiz|Fiyatlandırma|Sektör|Girdi|Sonuç|Kayıt Ol|Gizlilik Politikası|Kullanım Koşulları)\b/;

const ALLOWLIST =
  /\b(SectorCalc|API|LLMS|IN|OEE|PDF|CSV|Pro|TRY|USD|EUR|m|cm|kg|kWh|bar|psi|ft|in)\b/i;

let passes = 0;
let failures = 0;

function pass(msg) {
  passes += 1;
  console.log(`PASS: ${msg}`);
}

function fail(msg) {
  failures += 1;
  console.error(`FAIL: ${msg}`);
}

function extractVisibleText(html) {
  const withoutHead = html.replace(/<head[\s\S]*?<\/head>/gi, " ");
  return withoutHead
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fetchHtml(route) {
  const staticPath = join(ROOT, ".next/server/app", `${route.slice(1)}.html`);

  if (existsSync(staticPath)) {
    return readFileSync(staticPath, "utf8");
  }

  try {
    return execSync(`curl -Ls "http://localhost:3000${route}"`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    return "";
  }
}

function scanRoute(route) {
  const html = fetchHtml(route);
  if (!html) {
    fail(`no HTML for route ${route}`);
    return;
  }

  const locale = route.split("/").filter(Boolean)[0] ?? "en";
  const visible = extractVisibleText(html);

  if (locale === "tr") {
    const matches = visible.match(TR_FORBIDDEN);
    if (matches) {
      const unique = [...new Set(matches)].filter((m) => !ALLOWLIST.test(m));
      if (unique.length > 0) {
        fail(`${route} visible TR forbidden: ${unique.join(", ")}`);
        return;
      }
    }
  }

  if (locale === "en") {
    const matches = visible.match(EN_FORBIDDEN);
    if (matches) {
      fail(`${route} visible EN forbidden TR: ${[...new Set(matches)].join(", ")}`);
      return;
    }
  }

  if (locale === "ar") {
    const hasRtl = html.includes('dir="rtl"') || html.includes('dir=\\"rtl\\"');
    const hasLang = html.includes('lang="ar"') || html.includes('lang=\\"ar\\"');
    if (!hasRtl || !hasLang) {
      fail(`${route} missing AR rtl/lang markers`);
      return;
    }
  }

  if (route.includes("sheet-metal") && !html.includes("sc-calc-card") && !html.includes("data-calculator-card")) {
    fail(`${route} missing calculator cards`);
    return;
  }

  if (
    route.includes("concrete-volume") &&
    locale === "tr" &&
    !/Uzunluk|Genişlik|Derinlik|Yükseklik|metre|santimetre|hacim/i.test(visible)
  ) {
    fail(`${route} missing TR tool labels in visible text`);
    return;
  }

  pass(`rendered locale scan: ${route}`);
}

for (const route of ROUTES) {
  scanRoute(route);
}

console.log(`\naudit:rendered-locales — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
