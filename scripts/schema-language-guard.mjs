#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = join(process.cwd());

const FILES_TO_CHECK = [
  "messages/en.json",
  "src/data/free-tool-inputs-i18n.generated.json",
  "src/data/free-tool-catalog-i18n.generated.json",
  "src/data/schema-catalog-metadata.generated.json"
];

// Add all premium schema ts files
const PREMIUM_DIR = join(ROOT, "src/lib/features/premium-schema/schemas");
if (existsSync(PREMIUM_DIR)) {
  const files = readdirSync(PREMIUM_DIR);
  for (const file of files) {
    if (file.endsWith(".ts")) {
      FILES_TO_CHECK.push(`src/lib/features/premium-schema/schemas/${file}`);
    }
  }
}

// Very strict forbidden Turkish words list
const FORBIDDEN_WORDS = [
  "maliyeti", "hesaplama", "suresi", "hesabi", "sayisi", "tuketim", "yogunluk",
  "ucreti", "karsilastirma", "dogalgaz", "boru", "agirlik", 
  "klima", "kamyon", "amortisman", "bakim", "armatur", "celik", "paslanmaz",
  "cevre", "alani", "yazici", "hacmi", "omru", "kosebent", "lama",
  "kure", "npu", "profil", "radyator", "petek", "enflasyon", "mesai",
  "irsaliye", "fatura", "kaynak", "dikis", "kaza", "dolayli", "isleme",
  "tasima", "cevrim", "finansal", "donusturucu", "dntrc", "adet"
];

let failed = false;

for (const rel of FILES_TO_CHECK) {
  const fp = join(ROOT, rel);
  if (!existsSync(fp)) continue;
  
  if (statSync(fp).isDirectory()) continue;

  const content = readFileSync(fp, 'utf8');
  for (const word of FORBIDDEN_WORDS) {
    // using regex boundary to avoid matching "inputs" for "npu"
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    const match = content.match(regex);
    if (match) {
      const idx = match.index;
      const start = Math.max(0, idx - 30);
      const end = Math.min(content.length, idx + 30);
      const snippet = content.substring(start, end).replace(/\n/g, "\\n");
      
      console.error(`❌ [LANGUAGE GUARD] Forbidden Turkish word "${word}" found in ${rel}`);
      console.error(`   Context: "...${snippet}..."`);
      failed = true;
    }
  }
}

if (failed) {
  console.error("\\n[GUARD FAILED] Turkish text leakage detected in base English schemas or messages! Fix the leakage before deploying.");
  process.exit(1);
}

console.log("✅ [LANGUAGE GUARD] SectorCalc schema English purity check passed.");
process.exit(0);
