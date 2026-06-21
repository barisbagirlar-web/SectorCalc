#!/usr/bin/env node
/**
 * Push generated tool titles to Lokalise as per-locale flat JSON files.
 * Transforms nested { slug: { locale: text } } → { "slug.title": text } per locale.
 * Uses --distinguish-by-file to keep keys separate from messages/*.json keys.
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  assertLokaliseCli,
  ensureLokaliseProjectLanguages,
  resolveLokaliseLangIso,
  runLokaliseCommand,
  TMS_LOCALES,
} from "./lib/i18n-lokalise.mjs";

const ROOT = process.cwd();
const TITLES_PATH = join(ROOT, "src/data/generated-tool-titles-i18n.generated.json");
const TITLES = JSON.parse(readFileSync(TITLES_PATH, "utf8"));
const POLL_TIMEOUT = process.env.LOKALISE_UPLOAD_POLL_TIMEOUT?.trim() || "30m";

assertLokaliseCli(ROOT);
await ensureLokaliseProjectLanguages(ROOT);

const tmpDir = mkdtempSync(join(tmpdir(), "sectorcalc-tool-titles-"));
const fileCounts = {};

console.log(`⬆️  Exporting ${Object.keys(TITLES).length} tool titles to Lokalise (poll timeout: ${POLL_TIMEOUT})`);

for (const locale of TMS_LOCALES) {
  // Flatten: { "slug1.title": "text", "slug2.title": "text", ... }
  const flat = {};
  let count = 0;
  for (const [slug, locales] of Object.entries(TITLES)) {
    const value = locales[locale]?.trim();
    if (value) {
      flat[`${slug}.title`] = value;
      count++;
    }
  }
  if (count === 0) {
    console.log(`   ⤷ ${locale}: 0 titles (skipping)`);
    continue;
  }

  const filePath = join(tmpDir, `${locale}-tool-titles.json`);
  writeFileSync(filePath, JSON.stringify(flat, null, 2), "utf8");
  fileCounts[locale] = count;

  const langIso = resolveLokaliseLangIso(locale);
  console.log(`   → ${locale}: ${count} titles → ${langIso}`);

  runLokaliseCommand({
    root: ROOT,
    args: [
      "file", "upload", "--file", filePath, "--lang-iso", langIso,
      "--replace-modified", "--distinguish-by-file",
      "--poll", "--poll-timeout", POLL_TIMEOUT,
    ],
  });
}

rmSync(tmpDir, { recursive: true, force: true });

const total = Object.values(fileCounts).reduce((a, b) => a + b, 0);
console.log(`✅ Lokalise tool titles export complete (${total} entries across ${Object.keys(fileCounts).length} locales).`);
