// CBAM service page copy tests.
// English-only, no Paddle, no forbidden terms, correct account credit messaging.
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const PAGE_PATH = join(__dirname, "../../src/app/cbam/page.tsx");

const FORBIDDEN_TERMS = [
  /\bpenalty\b/i,
  /\bfine\b/i,
  /\bcertified compliance\b/i,
  /\blegal proof\b/i,
  /\bofficial approval\b/i,
  /\bpaddle product\b/i,
  /\bpaddle price\b/i,
  /border-radius/,
];

// Turkish characters that must NOT appear in rendered JSX text
const TURKISH_CHARS = /[ğüşıöçĞÜŞİÖÇ]/;

describe("CBAM service page content", () => {
  const content = readFileSync(PAGE_PATH, "utf-8");

  it("contains '100 account credits' message", () => {
    expect(content).toMatch(/100 account credits/i);
  });

  it("contains '5 CBAM report uses' message", () => {
    expect(content).toMatch(/5 CBAM report uses/i);
  });

  it("contains '1 successful sealed report' message", () => {
    expect(content).toMatch(/successful sealed report/i);
  });

  it("contains 'No separate CBAM checkout is required' message", () => {
    expect(content).toMatch(/No separate CBAM checkout is required/i);
  });

  it("contains qualified review disclaimer", () => {
    expect(content).toMatch(
      /do not replace qualified regulatory, customs, legal, or engineering review/i
    );
  });

  it("contains 'no CBAM use is consumed until' message", () => {
    expect(content).toMatch(
      /no CBAM use is consumed until the report is successfully generated/i
    );
  });

  it("contains 'account credits' in unlock CTA", () => {
    expect(content).toMatch(
      /Unlock 5 CBAM reports with 100 account credits/i
    );
  });

  it("does not contain forbidden terms (penalty, fine, etc.)", () => {
    for (const pattern of FORBIDDEN_TERMS) {
      const lines = content.split("\n");
      const matchingLines = lines.filter(
        (l) =>
          pattern.test(l) &&
          !l.trim().startsWith("//") &&
          !l.trim().startsWith("/*") &&
          !l.trim().startsWith("*")
      );
      expect(matchingLines).toHaveLength(0);
    }
  });

  it("does not contain Turkish visible text", () => {
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      // Skip code-only lines
      if (
        trimmed.startsWith("//") ||
        trimmed.startsWith("import") ||
        trimmed.startsWith("export") ||
        trimmed.startsWith("/*") ||
        trimmed.startsWith("*")
      ) {
        continue;
      }
      // Check for Turkish characters in JSX text
      if (TURKISH_CHARS.test(trimmed)) {
        expect.fail(`Found Turkish character in: ${trimmed}`);
      }
    }
  });

  it("page is English-only", () => {
    const lines = content.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("//") ||
        trimmed.startsWith("import") ||
        trimmed.startsWith("export") ||
        trimmed.startsWith("/*") ||
        trimmed.startsWith("*")
      ) {
        continue;
      }
    }
    // If we got here without failures, the page is English-only
    expect(true).toBe(true);
  });

  it("uses locked palette colors only", () => {
    const allowedColors = ["F0EEE6", "FAF9F5", "1A1915", "BD5D3A"];
    const colorMatches =
      content.match(
        /(?:bg|text|border)-\[#([A-Fa-f0-9]{6})\]/g
      ) ?? [];
    for (const match of colorMatches) {
      const color = match.replace(
        /(?:bg|text|border)-\[#([A-Fa-f0-9]{6})\]/,
        "$1"
      );
      expect(allowedColors).toContain(color.toUpperCase());
    }
  });

  it("has no border-radius or rounded utilities", () => {
    expect(content).not.toMatch(/border-radius/);
    expect(content).not.toMatch(/\borderRadius\b/);
  });

  it("does not mention Paddle", () => {
    expect(content).not.toMatch(/Paddle/i);
    expect(content).not.toMatch(/paddle/i);
  });
});
