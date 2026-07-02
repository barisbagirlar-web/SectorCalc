import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(process.cwd());
const MESSAGES_DIR = join(ROOT, "messages");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const TURKISH_SUBSTRINGS = [
  "maliyeti", "hesaplama", "suresi", "hesabi", "sayisi", "tuketim", "yogunluk",
  "ucreti", "basina", "karsilastirma", "dogalgaz", "boru", "agirlik", 
  "klima", "kamyon", "amortisman", "bakim", "armatur", "celik", "paslanmaz",
  "hizi", "cevre", "alani", "yazici", "hacmi", "omru", "kosebent", "lama",
  "kure", "npu", "profil", "radyator", "petek", "enflasyon", "mesai",
  "irsaliye", "fatura", "kaynak", "dikis", "kaza", "dolayli", "isleme",
  "tasima", "cevrim", "finansal", "donusturucu", "dntrc", "adet"
];

function containsTurkishGhost(str) {
  const lower = str.toLowerCase();
  for (const sub of TURKISH_SUBSTRINGS) {
    if (lower.includes(sub)) {
      if (sub === "adet" && lower.includes("cadet")) continue; // avoid cadet
      return true;
    }
  }
  return false;
}

function purgeObject(obj) {
  let changed = false;
  if (Array.isArray(obj)) {
    for (let i = obj.length - 1; i >= 0; i--) {
      const item = obj[i];
      if (typeof item === 'string' && containsTurkishGhost(item)) {
        obj.splice(i, 1);
        changed = true;
      } else if (typeof item === 'object' && item !== null) {
        if (purgeObject(item)) {
          changed = true;
        }
      }
    }
  } else {
    for (const key of Object.keys(obj)) {
      if (containsTurkishGhost(key)) {
        delete obj[key];
        changed = true;
        continue;
      }

      const value = obj[key];
      if (typeof value === 'string') {
        if (containsTurkishGhost(value)) {
          delete obj[key];
          changed = true;
        }
      } else if (typeof value === 'object' && value !== null) {
        if (purgeObject(value)) {
          changed = true;
        }
      }
    }
  }
  return changed;
}

for (const loc of LOCALES) {
  const filePath = join(MESSAGES_DIR, `${loc}.json`);
  if (!existsSync(filePath)) continue;

  const content = readFileSync(filePath, "utf8");
  try {
    const data = JSON.parse(content);
    if (purgeObject(data)) {
      writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
      console.log(`Purged Turkish ghosts from messages/${loc}.json`);
    } else {
      console.log(`No ghosts found in messages/${loc}.json`);
    }
  } catch (e) {
    console.error(`Error processing ${filePath}:`, e);
  }
}
