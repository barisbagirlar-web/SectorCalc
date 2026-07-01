#!/usr/bin/env node
/**
 * Strip all Turkish content from premium schema files.
 * - Replaces Turkish `label:` values with English from `label_i18n.en`
 * - Strips `tr:` keys from all i18n objects
 * - Fixes Turkish `painStatement:`, `name:`, `title:`, `label:` (non-i18n) fields
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = path.resolve(__dirname, '../src/lib/features/premium-schema/schemas');

// Turkish-only characters (not shared with German)
const TR_CHARS = /[ıİşŞçÇğĞ]/;

/**
 * Extract the English value from label_i18n or name_i18n object
 */
function extractEnglishI18n(line) {
  const m = line.match(/(?:label|name|painStatement|title|warningMessage|criticalMessage|expertMeaning|reportTemplateTitle|headMessage)?_i18n:\s*\{[^}]*"en":"([^"]+)"/);
  return m ? m[1] : null;
}

/**
 * Check if a line has Turkish content in a non-i18n field
 */
function hasTurkishDefaultLabel(line) {
  // Only check label:, name:, painStatement: that are NOT _i18n
  if (line.includes('_i18n:')) return false;
  if (line.includes('"en":') || line.includes('"tr":') || line.includes('"de":')) return false;
  // Check if it has a simple label: or name: or painStatement: field with Turkish text
  const fieldMatch = line.match(/^\s*(label|name|painStatement):\s*"([^"]*)"/);
  if (!fieldMatch) return false;
  const value = fieldMatch[2];
  return TR_CHARS.test(value);
}

/**
 * Process a single schema file
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Strip tr: keys from i18n objects (and fix the JSON)
    if (line.includes('"tr":')) {
      // Remove ,"tr":"..." patterns
      const newLine = line.replace(/,"tr":"[^"]*"/g, '')
                          .replace(/"tr":"[^"]*",?\s*/g, '');
      if (newLine !== line) {
        changed = true;
        newLines.push(newLine);
        continue;
      }
    }

    // 2. Replace Turkish DEFAULT label/name/painStatement with English from _i18n
    if (hasTurkishDefaultLabel(line)) {
      // Look ahead for the _i18n field (could be on the same line or next few lines)
      let combined = line;
      let lookahead = 0;
      for (let j = 1; j <= 3 && i + j < lines.length; j++) {
        const nextLine = lines[i + j].trim();
        if (nextLine.startsWith('//') || nextLine === '') continue;
        if (nextLine.includes('_i18n:')) {
          combined += nextLine;
          lookahead = j;
          break;
        }
        if (nextLine.match(/^\s*(type|unit|required|smartDefault|validation|helper|expertMeaning|format|options|sectorSlug|category):/)) {
          break;
        }
      }

      const engValue = extractEnglishI18n(combined);
      if (engValue && !TR_CHARS.test(engValue)) {
        // English value is clean - replace the Turkish default label
        const fieldMatch = line.match(/^(\s*(label|name|painStatement):\s*)"[^"]*"/);
        if (fieldMatch) {
          const newLine = line.replace(/^(\s*(label|name|painStatement):\s*)"[^"]*"/, `$1"${engValue}"`);
          if (newLine !== line) {
            changed = true;
            newLines.push(newLine);
            continue;
          }
        }
      }
    }

    newLines.push(line);
  }

  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    return true;
  }
  return false;
}

// Main
const files = fs.readdirSync(SCHEMA_DIR).filter(f => f.endsWith('.ts'));
let fixed = 0;
for (const file of files) {
  const filePath = path.join(SCHEMA_DIR, file);
  if (processFile(filePath)) {
    console.log(`Fixed: ${file}`);
    fixed++;
  }
}
console.log(`\nTotal files modified: ${fixed}/${files.length}`);
