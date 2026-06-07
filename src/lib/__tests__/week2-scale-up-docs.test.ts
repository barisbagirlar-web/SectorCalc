import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const DOCS_ROOT = join(process.cwd(), "docs");

const WEEK2_SCALE_UP_DOCS = [
  "week-2-scale-up-plan.md",
  "week-2-cluster-scale-up-matrix.md",
  "week-2-top-tool-template.md",
  "week-2-seo-scale-up-rules.md",
  "week-2-beta-partner-outreach.md",
  "paid-ads-readiness-gate.md",
  "week-2-operating-calendar.md",
] as const;

describe("week-2 scale-up docs", () => {
  test.each(WEEK2_SCALE_UP_DOCS)("%s exists", (filename) => {
    expect(existsSync(join(DOCS_ROOT, filename))).toBe(true);
  });
});
