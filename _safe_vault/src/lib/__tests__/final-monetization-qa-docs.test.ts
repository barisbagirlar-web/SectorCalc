import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const DOCS_ROOT = join(process.cwd(), "docs");

const FINAL_MONETIZATION_QA_DOCS = [
  "final-monetization-qa.md",
  "monetization-blocker-matrix.md",
  "stripe-test-checkout-runbook.md",
  "entitlement-qa-checklist.md",
  "final-monetization-verdict.md",
] as const;

describe("final monetization QA docs", () => {
  test.each(FINAL_MONETIZATION_QA_DOCS)("%s exists", (filename) => {
    expect(existsSync(join(DOCS_ROOT, filename))).toBe(true);
  });
});
