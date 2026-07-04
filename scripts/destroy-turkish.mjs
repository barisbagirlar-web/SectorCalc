import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SCHEMAS_DIR = "src/lib/features/premium-schema/schemas";
const files = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith('.ts'));

let changedFiles = 0;

const unitTranslations = {
  "saat": "hours",
  "count": "units",
  "kisi": "people",
  "kişi": "people",
  "ay": "months",
  "day": "days",
  "gün": "days",
  "hafta": "weeks",
  "year": "years",
  "yıl": "years",
  "dakika": "minutes",
  "USD/saat": "USD/hour",
  "count/saat": "units/hour",
  "count/ay": "units/month",
  "count/year": "units/year",
  "count/dekar": "units/acre",
  "count/day": "units/day",
  "USD/ay": "USD/month",
  "USD/day": "USD/day",
  "USD/year": "USD/year",
  "USD/count": "USD/unit"
};

for (const file of files) {
  const filePath = join(SCHEMAS_DIR, file);
  let content = readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix properties with _i18n fallback:
  const properties = ["name", "painStatement", "label", "helper", "expertMeaning", "warningMessage", "criticalMessage", "title"];
  
  for (const prop of properties) {
    const regex = new RegExp(`${prop}:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"\\s*,\\s*${prop}_i18n:\\s*\\{\\s*"en"\\s*:\\s*"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"\\s*\\}`, 'g');
    content = content.replace(regex, (match, turkishVal, englishVal) => {
      return `${prop}: "${englishVal}", ${prop}_i18n: {"en":"${englishVal}"}`;
    });
  }

  // Handle assumptionNotes: ["Turkish"], assumptionNotes_i18n: { "en": ["English"] }
  // Regex: assumptionNotes:\s*\[([^\]]+)\],\s*assumptionNotes_i18n:\s*\{\s*"en"\s*:\s*\[([^\]]+)\]\s*\}
  const notesRegex = /assumptionNotes:\s*\[([\s\S]*?)\],\s*assumptionNotes_i18n:\s*\{\s*"en"\s*:\s*\[([\s\S]*?)\]\s*\}/g;
  content = content.replace(notesRegex, (match, turkishVal, englishVal) => {
    return `assumptionNotes: [${englishVal}], assumptionNotes_i18n: { "en": [${englishVal}] }`;
  });

  // Translate units
  for (const [tr, en] of Object.entries(unitTranslations)) {
    const unitRegex = new RegExp(`unit:\\s*"${tr}"`, 'g');
    content = content.replace(unitRegex, `unit: "${en}"`);
  }

  // Strip Turkish tool title comments like "Tool #20 — Tasima Mode"
  // Let's just remove the Turkish title part of comments that say "Tool #..."
  const commentRegex = /\/\*\*\s*\n\s*\*\s*Tool #\d+ — [^\n]+\n\s*\*\//g;
  content = content.replace(commentRegex, '');
  
  // also fix // Tool #... comments
  const singleCommentRegex = /\/\/\s*Tool #\d+ — [^\n]+/g;
  content = content.replace(singleCommentRegex, '');

  if (content !== originalContent) {
    writeFileSync(filePath, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Destroyed Turkish strings in ${changedFiles} files.`);
