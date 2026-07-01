#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const SCHEMAS_DIR = "src/lib/features/premium-schema/schemas";
const TRANSLATIONS_FILE = "/tmp/full-translation-map.json";

const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, "utf-8"));
const sorted = Object.keys(translations).sort((a, b) => b.length - a.length);

let totalChanged = 0;
let fileCount = 0;

function applyTranslations(content) {
  let result = content;
  for (const tr of sorted) {
    const en = translations[tr];
    const searchStr = `"en":"${tr}"`;
    const replaceStr = `"en":"${en}"`;
    if (result.includes(searchStr)) {
      result = result.split(searchStr).join(replaceStr);
    }
  }
  return result;
}

const files = fs.readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".ts"));

for (const file of files) {
  const filePath = path.join(SCHEMAS_DIR, file);
  const content = fs.readFileSync(filePath, "utf-8");

  const hasAny = sorted.some(tr => content.includes(`"en":"${tr}"`));
  if (!hasAny) continue;

  const modified = applyTranslations(content);

  let fileChanges = 0;
  for (const tr of sorted) {
    const s = `"en":"${tr}"`;
    if (content.includes(s)) {
      fileChanges += content.split(s).length - 1;
    }
  }

  if (fileChanges > 0 && modified !== content) {
    fs.writeFileSync(filePath, modified, "utf-8");
    fileCount++;
    totalChanged += fileChanges;
    console.log(`  ${file}: ${fileChanges} replacements`);
  }
}

console.log(`\n✅ ${fileCount} files updated, ${totalChanged} total replacements`);

// Verify
const turkishChars = /[çşğöüıÇŞĞÖÜİâîû]/;
let remaining = 0;
for (const file of files) {
  const content = fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8");
  const matches = content.match(/"en":"(?:[^"\\]|\\.)*"/g) || [];
  for (const m of matches) {
    if (turkishChars.test(m)) {
      if (remaining < 5) {
        console.log(`  ⚠️  ${file}: ${m.slice(0, 80)}`);
      }
      remaining++;
    }
  }
}

if (remaining > 0) {
  console.log(`\n⚠️  ${remaining} Turkish chars remain in _i18n.en fields`);
} else {
  console.log(`\n✅ ALL _i18n.en fields are English-only.`);
}
