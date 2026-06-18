#!/usr/bin/env npx tsx
/**
 * Generate messages/pseudo.json from en.json for leak hunting in development.
 * Run: npm run i18n:pseudo
 * Dev: NEXT_PUBLIC_PSEUDO_LOCALE=1 npm run dev
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pseudoLocalizeMessages } from "../src/lib/i18n/pseudo-localize-messages";

const ROOT = process.cwd();
const EN_PATH = join(ROOT, "messages", "en.json");
const OUT_PATH = join(ROOT, "messages", "pseudo.json");

const en = JSON.parse(readFileSync(EN_PATH, "utf8")) as Record<string, unknown>;
const pseudo = pseudoLocalizeMessages(en);

writeFileSync(OUT_PATH, `${JSON.stringify(pseudo, null, 2)}\n`, "utf8");
console.log(`✅ Pseudo-localization written to ${OUT_PATH}`);
