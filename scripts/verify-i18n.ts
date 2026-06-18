#!/usr/bin/env npx tsx
/**
 * Build gate: fail when any non-English locale is missing keys or has empty values.
 * English (en.json) is the canonical catalog — messages/*.json come from Lokalise pull.
 */

import { join } from "node:path";
import {
  collectBlockingLocaleMessageIssues,
  formatLocaleMessageIssues,
} from "../src/lib/i18n/verify-locale-messages";

const MESSAGES_DIR = join(process.cwd(), "messages");

function main(): void {
  const issues = collectBlockingLocaleMessageIssues(MESSAGES_DIR);

  if (issues.length === 0) {
    console.log("✅ [verify-i18n] All locale message keys are complete.");
    process.exit(0);
  }

  console.error(`🛑 [verify-i18n] ${issues.length} translation gap(s) — build blocked.`);
  console.error(formatLocaleMessageIssues(issues));
  console.error("Fix in Lokalise, then: npm run i18n:import && npm run i18n:verify");
  process.exit(1);
}

main();
