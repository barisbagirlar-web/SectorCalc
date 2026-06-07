import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const DOCS_ROOT = join(process.cwd(), "docs");

const MONETIZATION_SPRINT_DOCS = [
  "product-roadmap-freeze.md",
  "monetization-sprint-30-day-plan.md",
  "monetization-decision-gates.md",
  "backlog-intake-template.md",
  "revenue-sprint-dashboard.md",
  "cursor-scope-control.md",
] as const;

describe("monetization sprint docs", () => {
  test.each(MONETIZATION_SPRINT_DOCS)("%s exists", (filename) => {
    expect(existsSync(join(DOCS_ROOT, filename))).toBe(true);
  });
});
