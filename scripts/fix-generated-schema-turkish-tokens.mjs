#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const schemasDir = path.join(rootDir, 'generated', 'schemas');

// Input ID replacements: [oldId, newId] — longest first to avoid partial matches
const inputIdReplacements = [
  ['krediTutari', 'creditAmount'],
  ['mevcutHisse', 'currentShares'],
  ['yeniHisse', 'newShares'],
  ['K_Faktoru',   'K_Factor'],
  ['yogunluk',    'density'],
  ['kalinlik',    'thickness'],
  ['suratme',     'driving'],
  ['ilerleme',    'feed'],
  ['kredi',       'credit'],
];
const idMap = new Map(inputIdReplacements);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Replace old input IDs with new ones inside formula strings.
 * Uses word boundaries so that e.g. "kredi" does not match inside "krediTutari".
 */
function replaceIdsInString(str) {
  let result = str;
  for (const [oldId, newId] of inputIdReplacements) {
    result = result.replace(new RegExp(`\\b${escapeRegex(oldId)}\\b`, 'g'), newId);
  }
  return result;
}

function processSchema(schema) {
  // ── 1. outputs.primary ──
  if (schema.outputs && schema.outputs.primary === 'sonuc') {
    schema.outputs.primary = 'result';
  }

  // ── 2. outputs.dataConfidenceAdjusted ──
  if (schema.outputs && schema.outputs.dataConfidenceAdjusted === 'sonuc') {
    schema.outputs.dataConfidenceAdjusted = 'result';
  }

  // ── 3. outputs.breakdown keys: rename "sonuc" → "result" ──
  if (schema.outputs && schema.outputs.breakdown && typeof schema.outputs.breakdown === 'object') {
    if ('sonuc' in schema.outputs.breakdown) {
      schema.outputs.breakdown.result = schema.outputs.breakdown.sonuc;
      delete schema.outputs.breakdown.sonuc;
    }
  }

  // ── 4. outputs.breakdownUnits keys: rename "sonuc" → "result" ──
  if (schema.outputs && schema.outputs.breakdownUnits && typeof schema.outputs.breakdownUnits === 'object') {
    if ('sonuc' in schema.outputs.breakdownUnits) {
      schema.outputs.breakdownUnits.result = schema.outputs.breakdownUnits.sonuc;
      delete schema.outputs.breakdownUnits.sonuc;
    }
  }

  // ── 5. Clean up i18n sub-fields under outputs ──
  // Remove breakdown_i18n entirely (contains non-English text in "en" values)
  if (schema.outputs) {
    delete schema.outputs.breakdown_i18n;
  }

  // ── 6. sector ──
  if (schema.sector && typeof schema.sector === 'string') {
    if (/insaat/i.test(schema.sector)) {
      schema.sector = 'Construction';
    } else if (/workletme|isletme/i.test(schema.sector)) {
      schema.sector = 'Business';
    }
  }

  // ── 7. Rename input IDs ──
  if (schema.inputs && Array.isArray(schema.inputs)) {
    for (const input of schema.inputs) {
      if (input.id && idMap.has(input.id)) {
        input.id = idMap.get(input.id);
      }
    }
  }

  // ── 8. Remove *_i18n fields from each input object ──
  if (schema.inputs && Array.isArray(schema.inputs)) {
    for (const input of schema.inputs) {
      for (const key of Object.keys(input)) {
        if (key.endsWith('_i18n')) {
          delete input[key];
        }
      }
    }
  }

  // ── 9. Clean formula strings (replace old ID references) ──
  if (schema.formulas && typeof schema.formulas === 'object') {
    for (const [key, value] of Object.entries(schema.formulas)) {
      if (typeof value === 'string') {
        schema.formulas[key] = replaceIdsInString(value);
      }
    }
  }

  // ── 10. Remove toolName_i18n / title_i18n top-level fields ──
  delete schema.toolName_i18n;
  delete schema.title_i18n;

  // ── 11. Remove short_i18n / long_i18n from about.description ──
  if (schema.about && schema.about.description) {
    delete schema.about.description.short_i18n;
    delete schema.about.description.long_i18n;
  }

  return schema;
}

// ─── Walk & process ──────────────────────────────────────────────
const subDirs = fs.readdirSync(schemasDir);
let processed = 0;
let errors = 0;

for (const subDir of subDirs) {
  const subPath = path.join(schemasDir, subDir);
  if (!fs.statSync(subPath).isDirectory()) continue;

  const files = fs.readdirSync(subPath).filter(f => f.endsWith('-schema.json'));

  for (const file of files) {
    const filePath = path.join(subPath, file);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const schema = JSON.parse(raw);
      const cleaned = processSchema(schema);
      fs.writeFileSync(filePath, JSON.stringify(cleaned, null, 2) + '\n');
      processed++;
    } catch (e) {
      console.error(`ERROR ${filePath}: ${e.message}`);
      errors++;
    }
  }
}

console.log(`\nDone. Processed: ${processed} files, Errors: ${errors}`);
