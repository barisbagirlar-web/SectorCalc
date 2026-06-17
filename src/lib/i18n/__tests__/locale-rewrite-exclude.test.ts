import { describe, expect, test } from "vitest";
import { LOCALE_REWRITE_EXCLUDE } from "@/lib/i18n/locale-rewrite-exclude";

const CATCH_ALL_REWRITE = new RegExp(
  `^(?:/((?!${LOCALE_REWRITE_EXCLUDE}).*))(?:/)?$`,
);

function isCatchAllRewriteTarget(pathname: string): boolean {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return CATCH_ALL_REWRITE.test(normalized);
}

describe("locale rewrite exclude", () => {
  test("sitemap shard paths are excluded from /en catch-all rewrite", () => {
    expect(isCatchAllRewriteTarget("/sitemap/en")).toBe(false);
    expect(isCatchAllRewriteTarget("/sitemap/tr")).toBe(false);
    expect(isCatchAllRewriteTarget("/sitemap/en.xml")).toBe(false);
  });

  test("api-public routes are excluded from /en catch-all rewrite", () => {
    expect(isCatchAllRewriteTarget("/api-public/calculate/oee-downtime-calculator")).toBe(false);
    expect(isCatchAllRewriteTarget("/api-public/bot-md/oee-downtime-calculator")).toBe(false);
  });

  test("api-public machine routes are excluded from /en catch-all rewrite", () => {
    expect(isCatchAllRewriteTarget("/api-public/calculate/z-score-calculator")).toBe(false);
    expect(isCatchAllRewriteTarget("/api-public/bot-md/z-score-calculator")).toBe(false);
  });

  test("normal marketing paths still rewrite to /en", () => {
    expect(isCatchAllRewriteTarget("/free-tools")).toBe(true);
    expect(isCatchAllRewriteTarget("/premium-tools/lean-production")).toBe(true);
  });
});
