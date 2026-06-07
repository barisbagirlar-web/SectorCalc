import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { CAMPAIGN_CLUSTERS } from "@/lib/campaigns/campaign-clusters";
import { SECTORCALC_EVENTS } from "@/lib/analytics/event-taxonomy";
import { getSitemapManifest } from "@/lib/seo/sitemap-manifest";

const DOCS_ROOT = join(process.cwd(), "docs");

function readDoc(name: string): string {
  const path = join(DOCS_ROOT, name);
  expect(existsSync(path)).toBe(true);
  return readFileSync(path, "utf8");
}

describe("week-1 optimization readiness", () => {
  test("campaign clusters var", () => {
    expect(CAMPAIGN_CLUSTERS.length).toBeGreaterThan(0);
    expect(
      CAMPAIGN_CLUSTERS.every(
        (cluster) => cluster.landingHref.startsWith("/") && cluster.utmCampaign.length > 0,
      ),
    ).toBe(true);
  });

  test("conversion event names var", () => {
    const required = [
      "seo_landing_cta_click",
      "free_tool_open",
      "free_tool_calculate",
      "free_to_premium_click",
      "premium_analyzer_open",
      "premium_unlock_click",
      "pricing_view",
      "pricing_cta_click",
      "beta_partner_submit",
      "report_export_click",
    ] as const;

    for (const name of required) {
      expect(SECTORCALC_EVENTS[name]).toBe(name);
    }
  });

  test("sitemap manifest var", () => {
    const manifest = getSitemapManifest();
    expect(manifest.length).toBeGreaterThan(0);
    expect(manifest.some((item) => item.path === "/pricing")).toBe(true);
  });

  test("tier-1 URL dokümanı var", () => {
    const matrix = readDoc("week-1-priority-url-matrix.md");
    expect(matrix).toContain("/tools/free/oee-calculator");
    expect(matrix).toContain("/tools/premium-schema/cnc-oee-loss");
    expect(matrix).toContain("Tier 1");
    expect(matrix).toContain("Tier 2");
    expect(matrix).toContain("Tier 3");
  });

  test("week-1 report template var", () => {
    const template = readDoc("week-1-report-template.md");
    expect(template).toContain("# SectorCalc Week-1 Report");
    expect(template).toContain("Indexing status");
    expect(template).toContain("Next week priorities");
  });
});
