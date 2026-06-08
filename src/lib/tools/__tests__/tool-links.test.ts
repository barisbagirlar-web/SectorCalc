/**
 * Premium/free tool href resolution tests.
 */

import { describe, expect, test } from "vitest";
import {
  getRevenueToolByPaidSlug,
  getRevenueToolByPremiumRouteSlug,
} from "@/lib/tools/revenue-tools";
import { FULL_LOOP_RUNTIME_SLUGS } from "@/lib/formula-governance/runtime-validation/full-loop-runtime-registry";
import {
  getPremiumToolHref,
  resolvePremiumToolHref,
} from "@/lib/tools/tool-links";

describe("tool-links — premium hrefs", () => {
  test("full-loop slugs use revenue premium route", () => {
    for (const slug of FULL_LOOP_RUNTIME_SLUGS) {
      expect(resolvePremiumToolHref(slug)).toBe(`/tools/premium/${slug}`);
    }
  });

  test("full-loop welding slug resolves from revenue tool", () => {
    const tool = getRevenueToolByPaidSlug("welding-bid-risk-analyzer");
    expect(tool).not.toBeNull();
    expect(getPremiumToolHref(tool!)).toBe("/tools/premium/welding-bid-risk-analyzer");
  });

  test("full-loop funnel slugs use governance premium routes", () => {
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

  test("funnel premium route slugs resolve to paired revenue tools", () => {
    const electrical = getRevenueToolByPremiumRouteSlug("electrical-labor-estimator");
    expect(electrical?.paidSlug).toBe("panel-shop-margin-verdict");
    expect(electrical?.freeSlug).toBe("electrical-labor-estimator");

    const printJob = getRevenueToolByPremiumRouteSlug("print-job-cost-check");
    expect(printJob?.paidSlug).toBe("signage-bid-safe-price-tool");

    const lawnCare = getRevenueToolByPremiumRouteSlug("lawn-care-cost-check");
    expect(lawnCare?.paidSlug).toBe("landscaping-contract-profit-tool");
  });

  test("schema-mapped premium slugs still use premium-schema route", () => {
    expect(resolvePremiumToolHref("cnc-quote-risk-analyzer")).toBe(
      "/tools/premium-schema/cnc-oee-loss",
    );
    expect(resolvePremiumToolHref("panel-shop-margin-verdict")).toBe(
      "/tools/premium-schema/electrical-panel-rework-cost",
    );
  });
});
