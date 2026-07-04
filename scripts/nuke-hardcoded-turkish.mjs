import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCHEMAS_DIR = "src/lib/features/premium-schema/schemas";
const files = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.ts'));

let changedFiles = 0;

const hardcodedReplacements = {
  "Finansal obligation": "Financial obligation",
  "dak/count": "min/unit",
  "Isleme Cost": "Machining Cost",
  "Energy Cost": "Energy Cost",
  "cycle/saat": "cycles/hour",
  "Kamyon Says": "Truck Loads",
  "Concrete Volume": "Concrete Volume",
  "Donusturucu": "Converter",
  "Finansal Loss": "Financial Loss",
  "count/period": "units/period",
  "Garanti Cost/Count": "Warranty Cost/Unit",
  "Ariza Duration Cost": "Downtime Cost",
  "Rework Cost/Batch": "Rework Cost/Batch",
  "Ciro Cost": "Turnover Cost",
  "Scrap Cost/Count": "Scrap Cost/Unit",
  "SL Aylk Depreciation": "SL Monthly Depreciation",
  "yeni error cost": "new defect cost",
  "Energy cost": "Energy cost",
  "Finansal": "Financial",
  "cost": "cost",
  "Cost": "Cost"
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
