// SectorCalc Public Tool Render Contracts Guard
// Verifies that public calculator routes use either ToolRenderContract or UniversalIndustrialDecisionForm.

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

const TURKISH_TOKENS = [
  "hesaplama", "hesap", "katsayı", "kullan", "değer", "sonuç",
  "i̇ndirim", "tutar", "oran", "fiyat", "maliyet", "kar",
  "ücretsiz", "deneme", "satın al", "giriş", "kayıt",
];

function walkDir(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry === "node_modules" || entry === ".next" || entry === "__tests__") continue;
        files.push(...walkDir(full));
      } else if (full.endsWith(".ts") || full.endsWith(".tsx") || full.endsWith(".js") || full.endsWith(".jsx")) {
        files.push(full);
      }
    }
  } catch { /* skip */ }
  return files;
}

function run() {
  let ec = 0;
  const violations = [];

  // Check that all [slug] calculator page files use UniversalIndustrialDecisionForm or ToolRenderContract
  const calculatorPagePatterns = [
    "app/tools/generated/[slug]/page.tsx",
    "app/tools/pro/[slug]/page.tsx",
    "app/tools/premium/[slug]/page.tsx",
    "app/tools/premium-schema/[slug]/page.tsx",
    "app/embed/[slug]/page.tsx",
  ];

  for (const pattern of calculatorPagePatterns) {
    const fullPath = join(SRC, pattern);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, "utf-8");
    if (!content.includes("UniversalIndustrialDecisionForm") && !content.includes("buildToolRenderContract")) {
      violations.push(`MISSING_RENDER_CONTRACT:${pattern} does not use UniversalIndustrialDecisionForm or ToolRenderContract`);
    }
  }

  // Check for Turkish tokens in calculator page files
  for (const pattern of calculatorPagePatterns) {
    const fullPath = join(SRC, pattern);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, "utf-8");
    const cleanContent = content.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const strings = cleanContent.match(/"([^"]{3,})"/g) || [];
    for (const str of strings) {
      const lower = str.toLowerCase();
      for (const token of TURKISH_TOKENS) {
        if (lower.includes(token)) {
          violations.push(`TURKISH_TOKEN:${pattern} contains "${token}" in string "${str.substring(0, 50)}"`);
        }
      }
    }
  }

  // Check for raw slug H1 in calculator pages
  for (const pattern of calculatorPagePatterns) {
    const fullPath = join(SRC, pattern);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, "utf-8");
    if (content.match(/<h1[^>]*>\s*\{[^}]*slug[^}]*\}\s*<\/h1>/i)) {
      violations.push(`RAW_SLUG_H1:${pattern} uses raw slug in H1`);
    }
  }

  if (violations.length) {
    console.error("PUBLIC TOOL RENDER CONTRACTS GUARD FAILED");
    for (const v of violations) console.error(`  ${v}`);
    ec = 1;
  } else {
    console.log(`PUBLIC TOOL RENDER CONTRACTS GUARD PASSED (${calculatorPagePatterns.length} routes)`);
  }
  process.exit(ec);
}

run();
