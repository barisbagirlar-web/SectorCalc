#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");

const FORBIDDEN = [
  "METAL İMALAT ZEKÂSI",
  "ADIM 1 / 3",
  "Standart Ağırlık",
  "SONRAKİ PARAMETRE",
  "Sonraki Parametre",
  "Next parameter",
  "Industry Wizard",
  "IndustryAuditModule",
  "PremiumAuditInput",
  "Faz 1",
  "Faz 2",
  "Planlandı",
  "Yayında",
];

const REQUIRED_INDUSTRY_KEYS = [
  "relatedFreeTools",
  "relatedPremiumTools",
  "openCalculator",
  "viewAllCalculators",
  "noToolsTitle",
  "noToolsDescription",
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

const industryPageContent = read("src/components/pages/IndustryPageContent.tsx");
if (industryPageContent.includes("IndustryAuditModule")) {
  fail("IndustryPageContent still imports IndustryAuditModule");
} else {
  pass("inline audit wizard removed from IndustryPageContent");
}

if (!industryPageContent.includes("IndustryRelatedToolsPanel")) {
  fail("IndustryPageContent missing IndustryRelatedToolsPanel");
} else {
  pass("IndustryRelatedToolsPanel wired on industry pages");
}

if (!industryPageContent.includes("CalculatorCard")) {
  pass("IndustryPageContent delegates cards to IndustryRelatedToolsPanel");
}

const cardList = read("src/components/industries/IndustryCalculatorCardList.tsx");
if (!cardList.includes("CalculatorCard")) {
  fail("IndustryCalculatorCardList missing CalculatorCard");
} else {
  pass("IndustryCalculatorCardList uses CalculatorCard");
}

if (cardList.includes('href="#"')) {
  fail('IndustryCalculatorCardList contains href="#"');
} else {
  pass("IndustryCalculatorCardList avoids href=\"#\"");
}

if (!existsSync(join(ROOT, "src/lib/industries/resolve-industry-tools.ts"))) {
  fail("resolve-industry-tools.ts missing");
} else {
  pass("industry tool resolver exists");
}

for (const locale of ["en", "tr", "de", "fr", "es", "ar"]) {
  const messages = JSON.parse(read(`messages/${locale}.json`));
  for (const key of REQUIRED_INDUSTRY_KEYS) {
    if (!messages.industries?.[key]) {
      fail(`${locale} industries.${key} missing`);
    }
  }
}
pass("industries i18n keys present for 6 locales");

const resolverSource = read("src/lib/industries/resolve-industry-tools.ts");
if (resolverSource.includes("StrategicPremiumRoadmap")) {
  fail("resolver references strategic roadmap tools");
} else {
  pass("resolver avoids strategic roadmap imports");
}

if (!resolverSource.includes("MAX_TOOLS_PER_TIER = 12")) {
  fail("resolver missing max tool cap");
} else {
  pass("resolver caps related tools per tier");
}

try {
  const { execSync } = await import("node:child_process");
  execSync("npx vitest run src/lib/industries/__tests__/resolve-industry-tools.test.ts", {
    cwd: ROOT,
    stdio: "pipe",
  });
  pass("sheet-metal resolver tests pass");
} catch {
  fail("sheet-metal resolver vitest failed");
}

if (process.env.POST_BUILD === "1") {
  const htmlPath = join(ROOT, ".next/server/app/tr/industries/sheet-metal.html");
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, "utf8");
    for (const term of FORBIDDEN) {
      if (html.includes(term)) {
        fail(`static HTML contains forbidden: ${term}`);
      }
    }
    if (html.includes('type="number"') && html.includes("placeholder=\"0.00\"")) {
      fail("static HTML contains calculator number input pattern");
    }
    if (!html.includes("sc-calc-card") && !html.includes("data-calculator-card")) {
      fail("static HTML missing calculator card markers");
    }
    pass("post-build sheet-metal HTML scan completed");
  }
}

console.log(`\naudit:industry-pages — ${passes} passed, ${failures} failed`);
process.exit(failures > 0 ? 1 : 0);
