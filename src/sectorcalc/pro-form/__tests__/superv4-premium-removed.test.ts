// Verify the retired PremiumSchemaToolForm cannot return to the runtime path.

import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

function findRuntimeSourceFiles(dir: string, results: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (
      entry === "node_modules" ||
      entry === ".next" ||
      entry === ".git" ||
      entry === "__tests__"
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      findRuntimeSourceFiles(fullPath, results);
    } else if (/\.(ts|tsx)$/.test(entry)) {
      results.push(fullPath);
    }
  }

  return results;
}

const runtimeSourceFiles = findRuntimeSourceFiles("src");

function read(pathname: string): string {
  return readFileSync(pathname, "utf-8");
}

describe("PremiumSchemaToolForm completely removed", () => {
  it("has no runtime import or JSX reference to PremiumSchemaToolForm", () => {
    const matches: string[] = [];
    const importPattern = /(?:import|require\s*\()[^\n;]*PremiumSchemaToolForm/;
    const jsxPattern = /<PremiumSchemaToolForm\b/;

    for (const file of runtimeSourceFiles) {
      const content = read(file);
      if (importPattern.test(content) || jsxPattern.test(content)) {
        matches.push(file);
      }
    }

    expect(matches).toEqual([]);
  });

  it("has no retired PremiumSchemaToolForm component file", () => {
    const oldPaths = [
      "src/components/tools/PremiumSchemaToolForm.tsx",
      "src/components/tools/PremiumSchemaToolForm.ts",
      "src/components/tools/PremiumSchemaToolForm.jsx",
    ];

    for (const pathname of oldPaths) {
      expect(existsSync(pathname)).toBe(false);
    }
  });

  it("keeps UniversalIndustrialDecisionForm as the canonical renderer", () => {
    expect(existsSync("src/sectorcalc/pro-form/UniversalIndustrialDecisionForm.tsx")).toBe(true);
    expect(existsSync("src/sectorcalc/pro-form/ProToolSessionWrapper.tsx")).toBe(true);
    expect(existsSync("src/app/tools/pro/[slug]/page.tsx")).toBe(true);

    const wrapper = read("src/sectorcalc/pro-form/ProToolSessionWrapper.tsx");
    const route = read("src/app/tools/pro/[slug]/page.tsx");

    expect(wrapper).toContain(
      'import { UniversalIndustrialDecisionForm } from "./UniversalIndustrialDecisionForm"',
    );
    expect(wrapper).toContain("<UniversalIndustrialDecisionForm");
    expect(route).toContain(
      'import { ProToolSessionWrapper } from "@/sectorcalc/pro-form/ProToolSessionWrapper"',
    );
    expect(route).toContain("<ProToolSessionWrapper");
    expect(route).toContain('presentationMode="PRO_AUDIT"');
  });
});
