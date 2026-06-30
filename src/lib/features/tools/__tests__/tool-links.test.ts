/**
 * Premium/free tool href resolution tests.
 */

import { describe, expect, test } from "vitest";
import {
  getRevenueToolByPaidSlug,
  getRevenueToolByPremiumRouteSlug,
} from "@/lib/features/tools/revenue-tools";
import {
  getPremiumToolHref,
  getPremiumSchemaToolHref,
  resolvePremiumToolHref,
} from "@/lib/features/tools/tool-links";

describe("tool-links — premium hrefs", () => {
  test("legacy revenue premium slugs resolve to premium route paths", () => {
    expect(resolvePremiumToolHref("welding-bid-risk-analyzer")).toBe(
      "/tools/premium/welding-bid-risk-analyzer",
    );
    expect(resolvePremiumToolHref("cnc-quote-risk-analyzer")).toBe(
      "/tools/premium/cnc-quote-risk-analyzer",
    );
  });

  test("legacy welding slug resolves from revenue tool when present", () => {
    const tool = getRevenueToolByPaidSlug("welding-bid-risk-analyzer");
    if (tool) {
      expect(getPremiumToolHref(tool)).toBe("/tools/premium/welding-bid-risk-analyzer");
    }
  });

  test("funnel premium route slugs resolve to premium route paths", () => {
    expect(resolvePremiumToolHref("electrical-labor-estimator")).toBe(
      "/tools/premium/electrical-labor-estimator",
    );
    expect(resolvePremiumToolHref("print-job-cost-check")).toBe(
      "/tools/premium/print-job-cost-check",
    );
    expect(resolvePremiumToolHref("lawn-care-cost-check")).toBe(
      "/tools/premium/lawn-care-cost-check",
    );
  });

  test("funnel premium route slugs resolve to paired revenue tools when registered", () => {
    const electrical = getRevenueToolByPremiumRouteSlug("electrical-labor-estimator");
    if (electrical) {
      expect(electrical.paidSlug).toBe("panel-shop-margin-verdict");
      expect(electrical.freeSlug).toBe("electrical-labor-estimator");
    }

    const printJob = getRevenueToolByPremiumRouteSlug("print-job-cost-check");
    if (printJob) {
      expect(printJob.paidSlug).toBe("signage-bid-safe-price-tool");
    }

    const lawnCare = getRevenueToolByPremiumRouteSlug("lawn-care-cost-check");
    if (lawnCare) {
      expect(lawnCare.paidSlug).toBe("landscaping-contract-profit-tool");
    }
  });

  test("schema-mapped legacy slugs resolve to premium-schema paths", () => {
    expect(resolvePremiumToolHref("auto-shop-margin-leak-detector")).toBe(
      "/tools/premium/auto-shop-margin-leak-detector",
    );
    expect(resolvePremiumToolHref("change-order-impact-analyzer")).toBe(
      "/tools/premium/change-order-impact-analyzer",
    );
    expect(resolvePremiumToolHref("menu-profit-leak-detector")).toBe(
      "/tools/premium/menu-profit-leak-detector",
    );
  });

  test("premium-schema href helper resolves schema slug path", () => {
    expect(getPremiumSchemaToolHref("auto-repair-comeback-cost")).toBe(
      "/tools/premium-schema/auto-repair-comeback-cost",
    );
  });
});
