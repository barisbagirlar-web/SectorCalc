import { describe, expect, test } from "vitest";
import { resolveIndustryTools } from "@/lib/industries/resolve-industry-tools";

describe("resolve-industry-tools", () => {
  test("sheet-metal returns free and premium tools with valid hrefs", () => {
    const result = resolveIndustryTools({ locale: "tr", industrySlug: "sheet-metal" });

    expect(result.hasTools).toBe(true);
    expect(result.free.length).toBeGreaterThan(0);
    expect(result.premium.length).toBeGreaterThan(0);
    expect(result.free.length).toBeLessThanOrEqual(12);
    expect(result.premium.length).toBeLessThanOrEqual(12);

    for (const tool of [...result.free, ...result.premium]) {
      expect(tool.href).toMatch(/^\/tools\//);
      expect(tool.href).not.toBe("#");
      expect(tool.title.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(0);
    }
  });

  test("premium tier excludes hash hrefs", () => {
    const result = resolveIndustryTools({ locale: "en", industrySlug: "cnc-manufacturing" });
    for (const tool of result.premium) {
      expect(tool.tier).toBe("premium");
      expect(tool.href).not.toContain("#");
    }
  });
});
