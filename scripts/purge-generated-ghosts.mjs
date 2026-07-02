import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(process.cwd());

const GENERATED_FILES_TO_PURGE = [
  "src/data/free-tool-inputs-i18n.generated.json",
  "src/data/schema-catalog-metadata.generated.json",
  "src/data/free-tool-catalog-i18n.generated.json",
  "scripts/data/generated-schema-copy-i18n.json",
  "src/lib/features/tools/free-traffic-catalog.generated.json",
  "src/lib/features/tools/roadmap-free-batch1-catalog.generated.json",
  "src/lib/features/tools/roadmap-free-batch2-catalog.generated.json"
];

const TURKISH_SUBSTRINGS = [
  "maliyeti", "hesaplama", "suresi", "hesabi", "sayisi", "tuketim", "yogunluk",
  "ucreti", "basina", "karsilastirma", "dogalgaz", "boru", "agirlik", 
  "klima", "kamyon", "amortisman", "bakim", "armatur", "celik", "paslanmaz",
  "hizi", "cevre", "alani", "yazici", "hacmi", "omru", "kosebent", "lama",
  "kure", "npu", "profil", "radyator", "petek", "enflasyon", "mesai",
  "irsaliye", "fatura", "kaynak", "dikis", "kaza", "dolayli", "isleme",
  "tasima", "cevrim", "finansal", "donusturucu", "dntrc", "adet", "gunluktasima"
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
        if (item.slug && containsTurkishGhost(item.slug)) {
           obj.splice(i, 1);
           changed = true;
           continue;
        }
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

for (const file of GENERATED_FILES_TO_PURGE) {
  const fullPath = join(ROOT, file);
  if (existsSync(fullPath)) {
    try {
      const content = readFileSync(fullPath, "utf8");
      const data = JSON.parse(content);
      if (purgeObject(data)) {
        writeFileSync(fullPath, JSON.stringify(data, null, 2) + "\n", "utf8");
        console.log(`Purged Turkish ghosts from ${file}`);
      } else {
        console.log(`No ghosts found in ${file}`);
      }
    } catch(e) {
       console.error(`Failed to parse/purge ${file}:`, e);
    }
  }
}

console.log("Generated files ghost purge complete.");
