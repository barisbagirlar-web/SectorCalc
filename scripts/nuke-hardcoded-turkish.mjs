import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCHEMAS_DIR = "src/lib/features/premium-schema/schemas";
const files = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.ts'));

let changedFiles = 0;

const hardcodedReplacements = {
  "Finansal obligation": "Financial obligation",
  "dak/adet": "min/unit",
  "Isleme Cost": "Machining Cost",
  "Enerji Maliyeti": "Energy Cost",
  "cevrim/saat": "cycles/hour",
  "Kamyon Says": "Truck Loads",
  "Beton Hacmi": "Concrete Volume",
  "Donusturucu": "Converter",
  "Finansal Loss": "Financial Loss",
  "adet/donem": "units/period",
  "Garanti Maliyeti/Adet": "Warranty Cost/Unit",
  "Ariza Suresi Maliyeti": "Downtime Cost",
  "Rework Maliyeti/Batch": "Rework Cost/Batch",
  "Ciro Maliyeti": "Turnover Cost",
  "Scrap Maliyeti/Adet": "Scrap Cost/Unit",
  "SL Aylk Amortisman": "SL Monthly Depreciation",
  "yeni hata maliyeti": "new defect cost",
  "Enerji maliyeti": "Energy cost",
  "Finansal": "Financial",
  "maliyeti": "cost",
  "Maliyeti": "Cost"
};

for (const file of files) {
  const filePath = join(SCHEMAS_DIR, file);
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [tr, en] of Object.entries(hardcodedReplacements)) {
    // replace exact string if it is inside quotes (double or single)
    // or just blind global replace
    content = content.split(tr).join(en);
  }

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Hardcoded replaced strings in ${changedFiles} files.`);
