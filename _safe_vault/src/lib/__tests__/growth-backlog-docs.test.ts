import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const DOCS_ROOT = join(process.cwd(), "docs");

const GROWTH_BACKLOG_DOCS = [
  "post-launch-growth-backlog.md",
  "growth-backlog-scoring-model.md",
  "growth-backlog-intake-form.md",
  "post-launch-backlog-items.md",
  "sprint-selection-rules.md",
] as const;

describe("growth backlog docs", () => {
  test.each(GROWTH_BACKLOG_DOCS)("%s exists", (filename) => {
    expect(existsSync(join(DOCS_ROOT, filename))).toBe(true);
  });
});
