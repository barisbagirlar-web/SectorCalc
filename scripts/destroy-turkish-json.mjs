import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIRS = [
  "data/pro-tools",
  "data/pro-tools-universal"
];

const unitTranslations = {
  "saat": "hours",
  "adet": "units",
  "kisi": "people",
  "kişi": "people",
  "ay": "months",
  "gun": "days",
  "gün": "days",
  "hafta": "weeks",
  "yil": "years",
  "yıl": "years",
  "dakika": "minutes",
  "USD/saat": "USD/hour",
  "adet/saat": "units/hour",
  "USD/ay": "USD/month",
  "USD/gun": "USD/day",
  "USD/yil": "USD/year"
};

const properties = ["name", "painStatement", "label", "helper", "expertMeaning", "warningMessage", "criticalMessage", "title"];

function cleanObject(obj) {
  let changed = false;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'object' && obj[i] !== null) {
        if (cleanObject(obj[i])) changed = true;
      }
    }
    return changed;
  }

  for (const key of Object.keys(obj)) {
    // Check if there is an i18n fallback
    if (properties.includes(key)) {
      const i18nKey = key + "_i18n";
      if (obj[i18nKey] && obj[i18nKey]["en"]) {
        if (obj[key] !== obj[i18nKey]["en"]) {
          obj[key] = obj[i18nKey]["en"];
          changed = true;
        }
      }
    }

    if (key === "unit" && typeof obj[key] === 'string') {
      if (unitTranslations[obj[key]]) {
        obj[key] = unitTranslations[obj[key]];
        changed = true;
      }
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (cleanObject(obj[key])) changed = true;
    }
  }

  return changed;
}

let totalChanged = 0;

for (const dir of DIRS) {
  const files = readdirSync(dir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const filePath = join(dir, file);
    const content = readFileSync(filePath, 'utf8');
    try {
      const data = JSON.parse(content);
      const changed = cleanObject(data);
      if (changed) {
        writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        totalChanged++;
      }
    } catch (e) {
      console.error(`Failed to parse ${filePath}: ${e}`);
    }
  }
}

console.log(`Destroyed Turkish strings in ${totalChanged} JSON files.`);
