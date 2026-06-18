#!/usr/bin/env node
import { existsSync, renameSync } from "node:fs";
import { join } from "node:path";
import {
  assertLokaliseCli,
  LOKALISE_LANG_ISO_REVERSE,
  resolveMessagesDir,
  runLokaliseCommand,
  TMS_LOCALES,
} from "./lib/i18n-lokalise.mjs";

const ROOT = process.cwd();
const DEST = resolveMessagesDir(ROOT);

assertLokaliseCli(ROOT);
console.log(`⬇️  Importing from Lokalise → ${DEST}`);

runLokaliseCommand({
  root: ROOT,
  args: [
    "file", "download", "--format", "json", "--async",
    "--original-filenames", "false",
    "--bundle-structure", "%LANG_ISO%.%FORMAT%",
    "--export-empty-as", "skip", "--dest", DEST,
  ],
});

for (const [from, to] of Object.entries(LOKALISE_LANG_ISO_REVERSE)) {
  const fromPath = join(DEST, `${from}.json`);
  const toPath = join(DEST, `${to}.json`);
  if (existsSync(fromPath) && fromPath !== toPath) {
    renameSync(fromPath, toPath);
    console.log(`   ↪ ${from}.json → ${to}.json`);
  }
}

for (const locale of TMS_LOCALES) {
  if (!existsSync(join(DEST, `${locale}.json`))) {
    console.error(`❌ Missing ${locale}.json after import`);
    process.exit(1);
  }
}
console.log("✅ Lokalise import complete.");
