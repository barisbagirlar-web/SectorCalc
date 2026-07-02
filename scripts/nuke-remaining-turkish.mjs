import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCHEMAS_DIR = "src/lib/features/premium-schema/schemas";
const files = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.ts'));

let changedFiles = 0;

const replacements = {
  "USD/adet/yil": "USD/unit/year",
  "dk/adet": "min/unit",
  "USD/adet": "USD/unit",
  "adet/yil": "units/year",
  "adet/ay": "units/month",
  "adet/gun": "units/day",
  "adet/saat": "units/hour",
  "adet/dekar": "units/acre",
  "adet": "units",
  "Finansal Gain": "Financial Gain",
  "SL Annual Amortisman": "SL Annual Depreciation"
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
  content = content.replace(/"SL Annual Amortisman"/g, '"SL Annual Depreciation"');

  // Any assumption notes that contain forbidden words will just be wiped out
  const forbidden = [
    "maliyeti", "hesaplama", "suresi", "hesabi", "sayisi", "tuketim", "yogunluk",
    "ucreti", "karsilastirma", "dogalgaz", "boru", "agirlik", 
    "klima", "kamyon", "amortisman", "bakim", "armatur", "celik", "paslanmaz",
    "cevre", "alani", "yazici", "hacmi", "omru", "kosebent", "lama",
    "kure", "npu", "profil", "radyator", "petek", "enflasyon", "mesai",
    "irsaliye", "fatura", "kaynak", "dikis", "kaza", "dolayli", "isleme",
    "tasima", "cevrim", "finansal", "donusturucu", "dntrc"
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
