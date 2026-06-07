import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

const DOCS_ROOT = join(process.cwd(), "docs");

const LAUNCH_COMMAND_CENTER_DOCS = [
  "final-launch-command-center.md",
  "quick-launch-checklist.md",
  "launch-incident-response.md",
] as const;

function readDoc(name: string): string {
  const path = join(DOCS_ROOT, name);
  expect(existsSync(path)).toBe(true);
  return readFileSync(path, "utf8");
}

describe("final launch command center docs", () => {
  test.each(LAUNCH_COMMAND_CENTER_DOCS)("%s exists", (filename) => {
    expect(existsSync(join(DOCS_ROOT, filename))).toBe(true);
  });

  test("command center contains READY verdict options", () => {
    const content = readDoc("final-launch-command-center.md");
    expect(content).toContain("READY");
    expect(content).toContain("READY WITH MINOR ISSUES");
    expect(content).toContain("NOT READY");
  });

  test("command center contains BLOCKER matrix", () => {
    const content = readDoc("final-launch-command-center.md");
    expect(content).toContain("BLOCKER");
    expect(content).toContain("MAJOR");
    expect(content).toContain("MINOR");
  });

  test("command center contains Cursor intervention protocol", () => {
    const content = readDoc("final-launch-command-center.md");
    expect(content).toContain("Cursor intervention protocol");
    expect(content).toContain("Cursor may only do");
    expect(content).toContain("Cursor must not do");
  });
});
