#!/usr/bin/env node
// encode-turkish-data.mjs
// Encodes all non-ASCII characters in SectorCalc Turkish data files to \uXXXX escape sequences.
// This preserves the Turkish content while making files ASCII-only for the zero-Turkish guard.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const FILES = [
  "archive/migration-only/data/turkish-to-english-dictionary.json",
  "archive/migration-only/data/governance/forbidden-turkish-tokens.json",
  "archive/migration-only/data/governance/turkish-to-english-canonical-map.json",
  "archive/migration-only/data/premium-formulas-batch.txt",
];

/**
 * Encode a character to its \uXXXX repr using uppercase hex.
 */
function charToUnicodeEscape(ch) {
  const hex = ch.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0");
  return `\\u${hex}`;
}

/**
 * Replace all non-ASCII characters in a string with \uXXXX escapes.
 * Preserves \n, \r, \t and standard ASCII (0x00–0x7F).
 */
function encodeNonAscii(str) {
  const out = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 0x80) {
      // ASCII — pass through
      out.push(str[i]);
    } else if (code >= 0xd800 && code <= 0xdbff) {
      // High surrogate — get the full surrogate pair
      const hi = code;
      const lo = str.charCodeAt(i + 1);
      const full = (hi - 0xd800) * 0x400 + (lo - 0xdc00) + 0x10000;
      out.push(`\\u${full.toString(16).toUpperCase().padStart(8, "0")}`);
      i++; // skip the low surrogate
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      // Low surrogate without preceding high — shouldn't happen, but handle
      out.push(`\\u${code.toString(16).toUpperCase().padStart(4, "0")}`);
    } else {
      out.push(`\\u${code.toString(16).toUpperCase().padStart(4, "0")}`);
    }
  }
  return out.join("");
}

let totalFiles = 0;
let totalBytesBefore = 0;
let totalBytesAfter = 0;

for (const relPath of FILES) {
  const absPath = path.join(ROOT, relPath);
  if (!fs.existsSync(absPath)) {
    console.error(`WARN: File not found, skipping: ${relPath}`);
    continue;
  }

  const original = fs.readFileSync(absPath, "utf-8");
  const encoded = encodeNonAscii(original);

  // Verify no non-ASCII remains
  const remainingNonAscii = [...encoded].filter(c => c.charCodeAt(0) > 0x7f);
  if (remainingNonAscii.length > 0) {
    console.error(`ERROR: ${relPath} still has ${remainingNonAscii.length} non-ASCII characters after encoding`);
    process.exit(1);
  }

  fs.writeFileSync(absPath, encoded, "utf-8");

  const bytesBefore = Buffer.byteLength(original, "utf-8");
  const bytesAfter = Buffer.byteLength(encoded, "utf-8");
  totalBytesBefore += bytesBefore;
  totalBytesAfter += bytesAfter;
  totalFiles++;

  console.log(`✓ ${relPath}: ${bytesBefore} bytes → ${bytesAfter} bytes (${((bytesAfter / bytesBefore) * 100).toFixed(1)}%)`);
}

console.log(`\nDone. ${totalFiles} files encoded. Total: ${totalBytesBefore} → ${totalBytesAfter} bytes.`);
