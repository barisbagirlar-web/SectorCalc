#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const scanRoots = [
  "src",
  "data",
  "public",
  "scripts",
  "generated",
  "references",
].map((entry) => path.join(repoRoot, entry));

const excludedDirectoryNames = new Set([
  ".git",
  ".next",
  "node_modules",
  "coverage",
  "dist",
  "out",
  "build",
  ".turbo",
  ".vercel",
  ".firebase",
  "archive",
  "archives",
]);

const excludedFileNames = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
]);

const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".jsonl",
  ".yaml",
  ".yml",
  ".md",
  ".mdx",
  ".txt",
  ".css",
  ".scss",
  ".html",
  ".xml",
  ".csv",
  ".env.example",
]);

const maxFileBytes = 5 * 1024 * 1024;

const unicodePattern = /[\u00c7\u00e7\u011e\u011f\u0130\u0131\u00d6\u00f6\u015e\u015f\u00dc\u00fc]/u;

const encodedHardTerms = [
  "bXVoZW5kaXMsbXVoZW5kaXNpLG11aGVuZGlzbGlrLGRhbmlzbWFuaSx1em1hbmkseWFwaXNhbCxpc3RhdGlzdGlrY2ksbWFyYW5n",
  "b3osZW1sYWssZGVnZXJsZW1lLHlhdGlyaW0sbWFsaXlldCxrYXBhc2l0ZSx2ZXJpbSxvcmFuLGFkZXQsYmlyaW0saGFjaW0sYmFz",
  "aW5jLHNpY2FrbGlrLHVyZXRpbSxpbWFsYXQsaXNjaWxpayxtYWx6ZW1lLHN0b2ssYWxhY2FrLGJvcmMsdmVyZXNpeWUsdG9ybmFj",
  "aSxmcmV6ZWNpLGtheW5ha2NpLHRhbWlyY2ksdGVzaXNhdGNpLGluc2FhdCxjZWxpayxndW5lcyxydXpnYXIsY2V2cmUsc3VyZHVy",
  "dWxlYmlsaXJsaWssaGlkcm9saWssZGVtaXJ5b2x1LHNpbnlhbGl6YXN5b24sb2RlbWUsbXVzdGVyaSx0ZWRhcmlrY2ksc2F0aXMs",
  "c2lwYXJpcyxnaXJkaSxjaWt0aSxzb251YyxrYXlpdCxrdWxsYW5pY2ksaGVzYXBsYSx1enVubHVrLHlhcmljYXAsZ2VuaXNsaWss",
  "eXVrc2VrbGlrLGFnaXJsaWssa3V0bGUsZWdpbSxidXJrdWxtYSxidXJ1bG1hLHNlaGltLGRpa2RvcnRnZW4sdWNnZW4sY29rZ2Vu",
  "LGtvc2UsZWtzZW4sZ2VyaWxpbSxkaXJlbmMsa3V2dmV0LGd1Yyx0aXRyZXNpbSxjb3p1bnVybHVrLGthdHNheWksZGVuZXksbnVt",
  "dW5lLG9ybmVrLGJhc2xhbmdpYyxiaXRpcyxrb2xvbixraXJpcyxkb3NlbWUsdGVtZWwsZHV2YXIsY2F0aSxkb25hdGksYmV0b24s",
  "YWhzYXAsZGlzbGkscnVsbWFuLGthc25hayxrYXlpcyxwYXJjYSx1cnVuLGtvbmRhbnNhdG9yLHRyYW5zZm9ybWF0b3Isc2Fyaixk",
  "b25lbSxraXJhLGRlZ2VyLGJ1dGNlLG1pa3Rhcix0b3BsYW0sb3J0YWxhbWE=",
].join("");

const hardTerms = Buffer.from(encodedHardTerms, "base64")
  .toString("utf8")
  .split(",")
  .map((term) => term.trim().toLowerCase())
  .filter(Boolean);

const hardTermSet = new Set(hardTerms);

const findings = [];

function toRepoRelative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function shouldSkipDirectory(directoryPath) {
  const name = path.basename(directoryPath);
  return excludedDirectoryNames.has(name);
}

function shouldSkipFile(filePath) {
  const name = path.basename(filePath);
  if (excludedFileNames.has(name)) return true;

  const extension = path.extname(filePath).toLowerCase();
  if (textExtensions.has(extension)) return false;

  const normalizedName = name.toLowerCase();
  if (normalizedName.endsWith(".env.example")) return false;

  return true;
}

function splitIdentifierTokens(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .normalize("NFKC")
    .toLowerCase()
    .split(/[^a-z0-9]+/u)
    .filter(Boolean);
}

function findHardTerms(value) {
  const tokens = splitIdentifierTokens(value);
  const matched = [];

  for (const token of tokens) {
    if (hardTermSet.has(token)) {
      matched.push(token);
    }
  }

  return [...new Set(matched)];
}

function recordFinding(kind, filePath, lineNumber, token, preview) {
  findings.push({
    kind,
    file: toRepoRelative(filePath),
    lineNumber,
    token,
    preview: preview.trim().slice(0, 220),
  });
}

function scanPathName(filePath) {
  const relativePath = toRepoRelative(filePath);

  const unicodeMatch = relativePath.match(unicodePattern);
  if (unicodeMatch) {
    recordFinding("PATH_UNICODE", filePath, 0, unicodeMatch[0], relativePath);
  }

  const matchedTerms = findHardTerms(relativePath);
  for (const token of matchedTerms) {
    recordFinding("PATH_ASCII_TOKEN", filePath, 0, token, relativePath);
  }
}

function scanFileContent(filePath) {
  const stat = fs.statSync(filePath);
  if (stat.size > maxFileBytes) return;

  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return;
  }

  const lines = content.split(/\r?\n/u);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineNumber = index + 1;

    const unicodeMatch = line.match(unicodePattern);
    if (unicodeMatch) {
      recordFinding("CONTENT_UNICODE", filePath, lineNumber, unicodeMatch[0], line);
    }

    const matchedTerms = findHardTerms(line);
    for (const token of matchedTerms) {
      recordFinding("CONTENT_ASCII_TOKEN", filePath, lineNumber, token, line);
    }
  }
}

function walk(entryPath) {
  if (!fs.existsSync(entryPath)) return;

  const stat = fs.statSync(entryPath);

  scanPathName(entryPath);

  if (stat.isDirectory()) {
    if (shouldSkipDirectory(entryPath)) return;

    const entries = fs.readdirSync(entryPath);
    for (const entry of entries) {
      walk(path.join(entryPath, entry));
    }

    return;
  }

  if (!stat.isFile()) return;
  if (shouldSkipFile(entryPath)) return;

  scanFileContent(entryPath);
}

for (const root of scanRoots) {
  walk(root);
}

if (findings.length > 0) {
  console.error("");
  console.error("ZERO_TURKISH_BUILD_GUARD=FAIL");
  console.error(`Findings: ${findings.length}`);
  console.error("");
  console.error("Build blocked because Turkish characters or Turkish-derived tokens were found.");
  console.error("");

  for (const finding of findings.slice(0, 120)) {
    const location =
      finding.lineNumber > 0
        ? `${finding.file}:${finding.lineNumber}`
        : finding.file;

    console.error(
      `[${finding.kind}] ${location} -> ${finding.token} :: ${finding.preview}`,
    );
  }

  if (findings.length > 120) {
    console.error("");
    console.error(`Only first 120 findings printed. Remaining: ${findings.length - 120}`);
  }

  console.error("");
  process.exit(1);
}

console.log("ZERO_TURKISH_BUILD_GUARD=PASS");
console.log("No Turkish Unicode characters or Turkish-derived tokens found in active build surfaces.");
