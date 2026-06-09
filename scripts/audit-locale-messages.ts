#!/usr/bin/env npx tsx
/**
 * Report message keys that fall back to English per locale.
 * Does not fail the build by default — use AUDIT_LOCALE_MESSAGES_STRICT=1 to exit 1 on gaps.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  collectMissingTranslationKeys,
  formatMissingTranslationReport,
} from "../src/lib/i18n/merge-locale-messages";
import { SUPPORTED_LOCALES, ROOT_LOCALE } from "../src/lib/i18n/locale-config";

const MESSAGES_DIR = join(process.cwd(), "messages");
const STRICT = process.env.AUDIT_LOCALE_MESSAGES_STRICT === "1";

function loadMessages(locale: string): Record<string, unknown> {
  const filePath = join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(readFileSync(filePath, "utf8")) as Record<string, unknown>;
}

function main(): void {
  const enMessages = loadMessages(ROOT_LOCALE);
  const allMissing: ReturnType<typeof collectMissingTranslationKeys> = [];

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === ROOT_LOCALE) {
      continue;
    }

    const localeMessages = loadMessages(locale);
    allMissing.push(...collectMissingTranslationKeys(enMessages, localeMessages, locale));
  }

  const report = formatMissingTranslationReport(allMissing);

  console.log("Locale messages audit");
  console.log(`English fallback keys: ${allMissing.length}`);

  if (report) {
    console.log(report);
  } else {
    console.log("All non-English locales fully cover English message keys.");
  }

  if (STRICT && allMissing.length > 0) {
    process.exit(1);
  }
}

main();
