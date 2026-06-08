/**
 * Premium/free tool href resolution tests.
 */

import { describe, expect, test } from "vitest";
import { getRevenueToolByPaidSlug } from "@/lib/tools/revenue-tools";
import {
  getPremiumToolHref,
  resolvePremiumToolHref,
} from "@/lib/tools/tool-links";

describe("tool-links — premium hrefs", () => {
  test("full-loop welding slug uses revenue premium route", () => {
    expect(resolvePremiumToolHref("welding-bid-risk-analyzer")).toBe(
      "/tools/premium/welding-bid-risk-analyzer",
    );

    const tool = getRevenueToolByPaidSlug("welding-bid-risk-analyzer");
    expect(tool).not.toBeNull();
    expect(getPremiumToolHref(tool!)).toBe("/tools/premium/welding-bid-risk-analyzer");
  });

  test("schema-mapped premium slugs still use premium-schema route", () => {
    expect(resolvePremiumToolHref("cnc-quote-risk-analyzer")).toBe(
      "/tools/premium-schema/cnc-oee-loss",
    );
  });
});
