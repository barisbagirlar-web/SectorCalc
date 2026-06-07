import { describe, expect, test } from "vitest";
import {
  SEO_REFRESH_PRIORITY,
  getTierOneRefreshItems,
} from "@/lib/seo/seo-refresh-priority";

describe("seo-refresh-priority", () => {
  test("SEO_REFRESH_PRIORITY is not empty", () => {
    expect(SEO_REFRESH_PRIORITY.length).toBeGreaterThan(0);
  });

  test("tier 1 contains at least 10 items", () => {
    expect(getTierOneRefreshItems().length).toBeGreaterThanOrEqual(10);
  });

  test("each item path starts with slash", () => {
    SEO_REFRESH_PRIORITY.forEach((item) => {
      expect(item.path.startsWith("/")).toBe(true);
    });
  });

  test("each item targetQuery is non-empty", () => {
    SEO_REFRESH_PRIORITY.forEach((item) => {
      expect(item.targetQuery.trim().length).toBeGreaterThan(0);
    });
  });

  test("tier 1 includes OEE guide", () => {
    const paths = getTierOneRefreshItems().map((item) => item.path);
    expect(paths).toContain("/guides/what-is-oee-and-how-to-calculate-it");
  });

  test("tier 1 includes area converter free tool", () => {
    const paths = getTierOneRefreshItems().map((item) => item.path);
    expect(paths).toContain("/tools/free/area-converter");
  });

  test("tier 1 includes cnc-oee-loss premium analyzer", () => {
    const paths = getTierOneRefreshItems().map((item) => item.path);
    expect(paths).toContain("/tools/premium-schema/cnc-oee-loss");
  });
});
