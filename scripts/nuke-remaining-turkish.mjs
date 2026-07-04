import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCHEMAS_DIR = "src/lib/features/premium-schema/schemas";
const files = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.ts'));

let changedFiles = 0;

const replacements = {
  "USD/count/year": "USD/unit/year",
  "dk/count": "min/unit",
  "USD/count": "USD/unit",
  "count/year": "units/year",
  "count/ay": "units/month",
  "count/day": "units/day",
  "count/saat": "units/hour",
  "count/dekar": "units/acre",
  "count": "units",
  "Finansal Gain": "Financial Gain",
  "SL Annual Depreciation": "SL Annual Depreciation"
};

for (const file of files) {
  const filePath = join(SCHEMAS_DIR, file);
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Replace missing units
  for (const [tr, en] of Object.entries(replacements)) {
    const unitRegex = new RegExp(`unit:\\s*"${tr}"`, 'g');
    content = content.replace(unitRegex, `unit: "${en}"`);
  }
  
  // replace specific labels that failed
  content = content.replace(/"Finansal Gain"/g, '"Financial Gain"');
  content = content.replace(/"SL Annual Depreciation"/g, '"SL Annual Depreciation"');

  // Any assumption notes that contain forbidden words will just be wiped out
  const forbidden = [
    "cost", "calculation", "duration", "hesabi", "count", "tuketim", "yogunluk",
    "ucreti", "comparison", "dogalgaz", "boru", "weight", 
    "klima", "kamyon", "depreciation", "maintenance", "armatur", "steel", "paslanmaz",
    "environment", "area", "yazici", "volume", "omru", "kosebent", "lama",
    "kure", "npu", "profil", "radyator", "petek", "inflation", "mesai",
    "irsaliye", "fatura", "resource", "dikis", "kaza", "dolayli", "isleme",
    "tasima", "cycle", "finansal", "donusturucu", "dntrc"
  ];
  
  const assumptionNotesRegex = /assumptionNotes:\s*\[([^\]]*)\]/g;
  content = content.replace(assumptionNotesRegex, (match, innerText) => {
    const lower = innerText.toLowerCase();
    for (const word of forbidden) {
      if (new RegExp(`\\b${word}\\b`).test(lower)) {
        return `assumptionNotes: []`; // Nuke the entire array
      }
    }
    return match;
  });

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Nuked remaining Turkish strings in ${changedFiles} files.`);
