import { describe, expect, test } from "vitest";
import { calculateFreeTrafficTool } from "@/lib/tools/free-traffic-calculators";
import { FREE_TRAFFIC_TOOLS, listFreeTrafficSlugs } from "@/lib/tools/free-traffic-catalog";

const PREMIUM_LEAK_TERMS = [
  "DO NOT ACCEPT UNDER",
  "Minimum safe price",
  "P90",
  "final verdict",
  "PDF",
  "saved report",
] as const;

function collectResultStrings(
  result: ReturnType<typeof calculateFreeTrafficTool>,
): string[] {
  return [
    result.headline,
    result.primaryLabel,
    result.primaryValue,
    result.explanation,
    result.legalNote,
    ...result.secondaryValues.flatMap((row) => [row.label, row.value]),
  ];
}

function defaultValuesForTool(slug: string): Record<string, number | string> {
  const tool = FREE_TRAFFIC_TOOLS.find((t) => t.slug === slug);
  if (!tool) {
    return {};
  }
  const values: Record<string, number | string> = {};
  for (const input of tool.inputs) {
    if (input.type === "select") {
      values[input.key] = input.defaultValue ?? input.options?.[0]?.value ?? "";
      continue;
    }
    values[input.key] =
      input.defaultValue !== undefined ? input.defaultValue : input.min !== undefined ? input.min : 1;
  }
  return values;
}

describe("free-traffic-calculators", () => {
  test("FREE_TRAFFIC_TOOLS length === 100", () => {
    expect(FREE_TRAFFIC_TOOLS.length).toBe(100);
    expect(listFreeTrafficSlugs().length).toBe(100);
  });

  test("every slug is unique", () => {
    const slugs = listFreeTrafficSlugs();
    expect(new Set(slugs).size).toBe(100);
  });

  test("every tool has inputs, seoTitle and seoDescription", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      expect(tool.inputs.length).toBeGreaterThanOrEqual(1);
      expect(tool.seoTitle.trim().length).toBeGreaterThan(0);
      expect(tool.seoDescription.trim().length).toBeGreaterThan(0);
      for (const input of tool.inputs) {
        expect(input.unit.length).toBeGreaterThan(0);
      }
    }
  });

  test("all 100 tools return a result from calculateFreeTrafficTool", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultValuesForTool(tool.slug));
      expect(result.primaryValue.length).toBeGreaterThan(0);
      expect(result.headline.length).toBeGreaterThan(0);
    }
  });

  test("area-converter m2 to ft2 — 1 m² ≈ 10.7639 ft²", () => {
    const result = calculateFreeTrafficTool("area-converter", {
      value: 1,
      fromUnit: "m2",
    });
    const ft2 = result.secondaryValues.find((row) =>
      row.label.toLowerCase().includes("ft"),
    );
    expect(ft2).toBeDefined();
    const numeric = Number.parseFloat(ft2?.value.replace(/,/g, "") ?? "0");
    expect(numeric).toBeCloseTo(10.7639, 2);
  });

  test("area-converter hectare to acre — 1 ha ≈ 2.471 acres", () => {
    const result = calculateFreeTrafficTool("area-converter", {
      value: 1,
      fromUnit: "hectare",
    });
    const acre = result.secondaryValues.find((row) =>
      row.label.toLowerCase().includes("acre"),
    );
    expect(acre).toBeDefined();
    const numeric = Number.parseFloat(acre?.value.replace(/,/g, "") ?? "0");
    expect(numeric).toBeCloseTo(2.471, 2);
  });

  test("loan rate 0 does not produce Infinity", () => {
    const result = calculateFreeTrafficTool("loan-payment-calculator", {
      principal: 12000,
      annualRate: 0,
      months: 24,
    });
    const joined = collectResultStrings(result).join(" ");
    expect(joined).not.toMatch(/\bInfinity\b/i);
    expect(joined).not.toMatch(/\bNaN\b/);
    expect(result.primaryValue).toMatch(/\$/);
  });

  test("break-even contribution <= 0 does not produce Infinity", () => {
    const result = calculateFreeTrafficTool("break-even-calculator", {
      fixedCost: 1000,
      unitPrice: 5,
      variableCost: 10,
    });
    const joined = collectResultStrings(result).join(" ");
    expect(joined).not.toMatch(/\bInfinity\b/i);
    expect(joined).not.toMatch(/\bNaN\b/);
  });

  test("temperature converter celsius to fahrenheit", () => {
    const result = calculateFreeTrafficTool("temperature-converter", {
      value: 0,
      fromUnit: "celsius",
    });
    const fahrenheit = result.secondaryValues.find((row) =>
      row.label.toLowerCase().includes("fahrenheit"),
    );
    expect(fahrenheit?.value).toBe("32");
  });

  test("free results do not contain premium leak terms", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultValuesForTool(tool.slug));
      const joined = collectResultStrings(result).join(" ").toLowerCase();
      for (const term of PREMIUM_LEAK_TERMS) {
        expect(joined).not.toContain(term.toLowerCase());
      }
    }
  });

  test("no NaN or Infinity in result strings", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultValuesForTool(tool.slug));
      const joined = collectResultStrings(result).join(" ");
      expect(joined).not.toMatch(/\bNaN\b/);
      expect(joined).not.toMatch(/\bInfinity\b/i);
    }
  });
});
