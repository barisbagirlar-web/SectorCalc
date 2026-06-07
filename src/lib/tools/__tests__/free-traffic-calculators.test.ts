import { describe, expect, test } from "vitest";
import { calculateFreeTrafficTool, containsPremiumLeakText, hasDedicatedTrafficCalculator } from "@/lib/tools/free-traffic-calculators";
import {
  FREE_TRAFFIC_TOOLS,
  listFreeTrafficSlugs,
  listRelatedTrafficTools,
} from "@/lib/tools/free-traffic-catalog";
import {
  getFreeToolRoutePath,
  listAllFreeToolSlugs,
  listTrafficOnlyFreeSlugs,
} from "@/lib/tools/free-traffic-routes";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";

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

const SITEMAP_LOCALE_COUNT = 5;

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
      expect(tool.title.trim().length).toBeGreaterThan(0);
      expect(tool.description.trim().length).toBeGreaterThan(0);
      expect(tool.seoTitle.trim().length).toBeGreaterThan(0);
      expect(tool.seoDescription.trim().length).toBeGreaterThan(0);
      for (const input of tool.inputs) {
        expect(input.label.trim().length).toBeGreaterThan(0);
        expect(input.helper.trim().length).toBeGreaterThan(0);
        expect(input.unit.length).toBeGreaterThan(0);
      }
    }
  });

  test("every tool has related calculators in the same category", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      expect(listRelatedTrafficTools(tool).length).toBeGreaterThan(0);
    }
  });

  test("all 100 tools have active dedicated calculators", () => {
    for (const slug of listFreeTrafficSlugs()) {
      expect(hasDedicatedTrafficCalculator(slug)).toBe(true);
    }
  });

  test("related premium slugs resolve to revenue paid tools", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      if (!tool.relatedPremiumSlug) {
        continue;
      }
      expect(getRevenueToolByPaidSlug(tool.relatedPremiumSlug)).not.toBeNull();
    }
  });

  test("sitemap route list includes all 100 traffic catalog slugs", () => {
    const allFreeSlugs = new Set(listAllFreeToolSlugs());
    for (const slug of listFreeTrafficSlugs()) {
      expect(allFreeSlugs.has(slug)).toBe(true);
      expect(getFreeToolRoutePath(slug)).toBe(`/tools/free/${slug}`);
    }
    expect(listTrafficOnlyFreeSlugs().length).toBeGreaterThan(0);
    expect(allFreeSlugs.size).toBeGreaterThanOrEqual(100);
  });

  test("SEO route count scales with locales", () => {
    const trafficRouteCount = listFreeTrafficSlugs().length * SITEMAP_LOCALE_COUNT;
    expect(trafficRouteCount).toBe(100 * SITEMAP_LOCALE_COUNT);
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

  test("time-duration-calculator — 10:30 to 12:00 is 90 minutes", () => {
    const result = calculateFreeTrafficTool("time-duration-calculator", {
      startHour: 10,
      startMinute: 30,
      endHour: 12,
      endMinute: 0,
    });
    const minutesRow = result.secondaryValues.find((row) =>
      row.label.toLowerCase().includes("minute"),
    );
    expect(minutesRow?.value).toBe("90");
  });

  test("time-duration-calculator — 22:00 to 01:00 wraps to 180 minutes", () => {
    const result = calculateFreeTrafficTool("time-duration-calculator", {
      startHour: 22,
      startMinute: 0,
      endHour: 1,
      endMinute: 0,
    });
    const minutesRow = result.secondaryValues.find((row) =>
      row.label.toLowerCase().includes("minute"),
    );
    expect(minutesRow?.value).toBe("180");
  });

  test("free results do not contain premium leak terms", () => {
    for (const tool of FREE_TRAFFIC_TOOLS) {
      const result = calculateFreeTrafficTool(tool.slug, defaultValuesForTool(tool.slug));
      const joined = collectResultStrings(result).join(" ");
      expect(containsPremiumLeakText(joined)).toBe(false);
      for (const term of PREMIUM_LEAK_TERMS) {
        expect(joined.toLowerCase()).not.toContain(term.toLowerCase());
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
