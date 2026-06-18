#!/usr/bin/env node
import { join } from "node:path";
import { existsSync, statSync } from "node:fs";
import {
  assertLokaliseCli,
  ensureLokaliseProjectLanguages,
  listTmsLocaleFiles,
  resolveLokaliseLangIso,
  resolveMessagesDir,
  runLokaliseCommand,
} from "./lib/i18n-lokalise.mjs";

const ROOT = process.cwd();
const MESSAGES_DIR = resolveMessagesDir(ROOT);
const POLL_TIMEOUT = process.env.LOKALISE_UPLOAD_POLL_TIMEOUT?.trim() || "20m";

assertLokaliseCli(ROOT);
await ensureLokaliseProjectLanguages(ROOT);

console.log(`⬆️  Exporting to Lokalise (poll timeout: ${POLL_TIMEOUT})`);
for (const locale of listTmsLocaleFiles(MESSAGES_DIR)) {
  const filePath = join(MESSAGES_DIR, `${locale}.json`);
  const langIso = resolveLokaliseLangIso(locale);
  const sizeMb = (statSync(filePath).size / (1024 * 1024)).toFixed(1);
  console.log(`   → ${locale}.json (${sizeMb} MB) → ${langIso}`);
  runLokaliseCommand({
    root: ROOT,
    args: [
      "file", "upload", "--file", filePath, "--lang-iso", langIso,
      "--replace-modified", "--detect-icu-plurals", "--distinguish-by-file",
      "--poll", "--poll-timeout", POLL_TIMEOUT,
    ],
  });
}
console.log("✅ Lokalise export complete.");
