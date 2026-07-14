// Verify PremiumSchemaToolForm is completely removed

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

function findSourceFiles(dir: string, pattern: RegExp, results: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next" || entry === ".git") continue;
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findSourceFiles(fullPath, pattern, results);
    } else if (pattern.test(entry)) {
      results.push(fullPath);
    }
  }
  return results;
}

const sourceFiles = findSourceFiles("src", /\.(ts|tsx)$/);

describe("PremiumSchemaToolForm completely removed", () => {
  it("1. no source file imports PremiumSchemaToolForm", () => {
    const matches: string[] = [];
    for (const file of sourceFiles) {
      // Test guards may name forbidden legacy components as test data.
      if (file.includes("/__tests__/")) continue;
      const content = readFileSync(file, "utf-8");
      if (content.includes("PremiumSchemaToolForm")) {
        matches.push(file);
      }
    }
    // No source files should reference the old form
    expect(matches.length).toBe(0);
  });

  it("2. PremiumSchemaToolForm.tsx file does not exist", () => {
    const oldPaths = [
      "src/components/tools/PremiumSchemaToolForm.tsx",
      "src/components/tools/PremiumSchemaToolForm.ts",
      "src/components/tools/PremiumSchemaToolForm.jsx",
    ];
    for (const p of oldPaths) {
      expect(existsSync(p)).toBe(false);
    }
  });

  it("3. UniversalIndustrialDecisionForm exists as replacement", () => {
    expect(existsSync("src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx")).toBe(true);
  });

  it("4. UniversalIndustrialDecisionForm is used in premium tool pages", () => {
    const pages: string[] = [];
    for (const file of sourceFiles) {
      const content = readFileSync(file, "utf-8");
      if (
        file.includes("/tools/premium") ||
        file.includes("/tools/premium-schema") ||
        file.includes("/tools/generated/") ||
        file.includes("/embed/") ||
        file.includes("PremiumToolPage")
      ) {
        if (content.includes("UniversalIndustrialDecisionForm")) {
          pages.push(file);
        }
      }
    }
    expect(pages).toContain("src/components/tools/PremiumToolPage.tsx");
  });
});
