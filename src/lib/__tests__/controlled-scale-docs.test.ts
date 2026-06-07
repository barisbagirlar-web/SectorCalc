import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const DOCS_ROOT = join(process.cwd(), "docs");

const CONTROLLED_SCALE_DOCS = [
  "controlled-scale-sprint.md",
  "controlled-scale-cluster-selection.md",
  "controlled-scale-modes.md",
  "paid-micro-test-runbook.md",
  "controlled-organic-distribution.md",
  "controlled-scale-sprint-report.md",
] as const;

describe("controlled scale docs", () => {
  test.each(CONTROLLED_SCALE_DOCS)("%s exists", (filename) => {
    expect(existsSync(join(DOCS_ROOT, filename))).toBe(true);
  });
});
