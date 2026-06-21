#!/usr/bin/env node
/**
 * Injects i18n fields into premium schema TS files.
 * Properly handles escaped quotes (\\"), multi-line strings, all edge cases.
 * Run: node scripts/patch-premium-schema-i18n.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const DIR = join(ROOT, "src", "lib", "premium-schema", "schemas");

function i18n(text) {
  const t = (text || "").trim();
  return t ? { en: t, tr: t } : null;
}

/**
 * Find the end of a double-quoted string starting at `startPos`.
 * startPos should be the position of the opening `"`.
 * Returns the position of the closing `"` (not escaped, not inside template).
 */
function findStringEnd(content, startPos) {
  for (let i = startPos + 1; i < content.length; i++) {
    const ch = content[i];
    if (ch === "\\") {
      i++; // skip escaped character
      continue;
    }
    if (ch === '"') {
      return i; // position of closing quote
    }
  }
  return -1; // unterminated string
}

/**
 * For a given content and field key, add `key_i18n: {...}` after every
 * occurrence where `key:` is followed by a string literal and `key_i18n:` is not already present nearby.
 */
function addI18nForKey(content, key) {
  const i18nKey = key + "_i18n";
  const resultParts = [];
  let pos = 0;

  while (pos < content.length) {
    // Find next occurrence of `key:` (as word boundary)
    const keyRe = new RegExp(`\\b${key}:\\s*"`, "g");
    keyRe.lastIndex = pos;
    const match = keyRe.exec(content);
    if (!match) break;

    const keyEnd = match.index + match[0].length; // position after the opening "
    const valStart = keyEnd; // start of string content

    // Find the closing quote of the string value
    const valEnd = findStringEnd(content, valStart - 1);
    if (valEnd === -1) {
      // Unterminated string — skip this occurrence but keep content
      resultParts.push(content.slice(pos, match.index + match[0].length));
      pos = match.index + match[0].length;
      continue;
    }

    // Always advance past this match — copy content from pos to end of value
    resultParts.push(content.slice(pos, valEnd + 1));

    // Check ahead for existing i18nKey
    const ahead = content.slice(valEnd + 1, valEnd + 150);
    if (ahead.includes(i18nKey + ":")) {
      // Already has i18n — content already captured by resultParts.push above
      pos = valEnd + 1;
      continue;
    }

    const value = content.slice(valStart, valEnd);
    const i18nVal = i18n(value);
    if (!i18nVal) {
      pos = valEnd + 1;
      continue;
    }

    // Determine what follows the closing quote
    const afterQuote = content.slice(valEnd + 1);
    const afterWsMatch = afterQuote.match(/^(\s*)/);
    const wsLen = afterWsMatch ? afterWsMatch[1].length : 0;
    const nextChar = afterQuote[wsLen];
    const afterEnd = valEnd + 1 + wsLen; // position after whitespace

    // Insert i18n after the value
    if (nextChar === ",") {
      // After `",` — insert after comma: `  key_i18n: {...},`
      resultParts.push(content.slice(valEnd + 1, afterEnd + 1)); // the comma and whitespace
      resultParts.push(` ${i18nKey}: ${JSON.stringify(i18nVal)},`);
      pos = afterEnd + 1;
    } else {
      // Not a comma — insert before whatever comes next: `, key_i18n: {...}`
      resultParts.push(`, ${i18nKey}: ${JSON.stringify(i18nVal)}`);
      pos = valEnd + 1; // keep the original content after the quote
    }
  }

  resultParts.push(content.slice(pos));
  return resultParts.join("");
}

function injectAll(content) {
  const keys = [
    "name", "painStatement", "label", "helper", "expertMeaning",
    "warningMessage", "criticalMessage", "title",
  ];
  for (const key of keys) {
    content = addI18nForKey(content, key);
  }
  return content;
}

function patchFile(fp) {
  let content = readFileSync(fp, "utf8");
  let patched = injectAll(content);

  // assumptionNotes → assumptionNotes_i18n
  if (!patched.includes("assumptionNotes_i18n:")) {
    const m = patched.match(/assumptionNotes:\s*\[/);
    if (m) {
      const arrStart = m.index + m[0].length;
      // Find the matching ]
      let depth = 1;
      let arrEnd = -1;
      for (let i = arrStart; i < patched.length; i++) {
        if (patched[i] === "[" && i > arrStart) { depth++; continue; }
        if (patched[i] === '"') {
          i = findStringEnd(patched, i);
          continue;
        }
        if (patched[i] === "]") {
          depth--;
          if (depth === 0) { arrEnd = i; break; }
        }
      }
      if (arrEnd !== -1) {
        const arrContent = patched.slice(arrStart, arrEnd);
        const notes = [...arrContent.matchAll(/"([^"]+)"/g)].map((n) => n[1]);
        const arr = notes.map((s) => i18n(s)).filter(Boolean);
        if (arr.length) {
          patched = patched.slice(0, arrEnd + 1) + `,assumptionNotes_i18n:${JSON.stringify(arr)}` + patched.slice(arrEnd + 1);
        }
      }
    }
  }

  if (patched !== content) {
    writeFileSync(fp, patched, "utf8");
    return true;
  }
  return false;
}

const files = readdirSync(DIR).filter((n) => n.endsWith(".ts") && !n.endsWith(".d.ts"));
let p = 0, s = 0;
for (const f of files) {
  if (patchFile(join(DIR, f))) p++;
  else s++;
}
console.log(`Patched: ${p} premium schemas, Skipped: ${s}`);
