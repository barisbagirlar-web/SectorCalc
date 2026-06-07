import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const DOCS_ROOT = join(process.cwd(), "docs");

const STOP_MEASURE_DECIDE_DOCS = [
  "stop-measure-decide.md",
  "final-decision-tree.md",
  "stop-rules.md",
  "measurement-cadence.md",
  "next-sprint-selector.md",
  "final-status.md",
] as const;

describe("stop measure decide docs", () => {
  test.each(STOP_MEASURE_DECIDE_DOCS)("%s exists", (filename) => {
    expect(existsSync(join(DOCS_ROOT, filename))).toBe(true);
  });
});
