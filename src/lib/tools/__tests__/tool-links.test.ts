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

  test("full-loop sheet-metal slug uses revenue premium route", () => {
    expect(resolvePremiumToolHref("sheet-metal-quote-risk-tool")).toBe(
      "/tools/premium/sheet-metal-quote-risk-tool",
    );

    const tool = getRevenueToolByPaidSlug("sheet-metal-quote-risk-tool");
    expect(tool).not.toBeNull();
    expect(getPremiumToolHref(tool!)).toBe("/tools/premium/sheet-metal-quote-risk-tool");
  });

  test("full-loop hvac slug uses revenue premium route", () => {
    expect(resolvePremiumToolHref("hvac-project-margin-guard")).toBe(
      "/tools/premium/hvac-project-margin-guard",
    );

    const tool = getRevenueToolByPaidSlug("hvac-project-margin-guard");
    expect(tool).not.toBeNull();
    expect(getPremiumToolHref(tool!)).toBe("/tools/premium/hvac-project-margin-guard");
  });

  test("schema-mapped premium slugs still use premium-schema route", () => {
    expect(resolvePremiumToolHref("cnc-quote-risk-analyzer")).toBe(
      "/tools/premium-schema/cnc-oee-loss",
    );
  });
});
