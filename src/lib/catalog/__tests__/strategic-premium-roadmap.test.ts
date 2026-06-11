import { describe, expect, test } from "vitest";
import {
  buildStrategicPremiumRoadmapCards,
  resolveMappedLiveToolHref,
} from "@/lib/catalog/strategic-premium-roadmap";

describe("strategic-premium-roadmap", () => {
  test("resolveMappedLiveToolHref routes known free slugs", () => {
    expect(resolveMappedLiveToolHref("oee-calculator")).toBe("/tools/free/oee-calculator");
    expect(resolveMappedLiveToolHref("product-margin-calculator")).toBe(
      "/tools/free/product-margin-calculator",
    );
  });

  test("resolveMappedLiveToolHref routes premium schema slugs", () => {
    expect(resolveMappedLiveToolHref("quote-price-profit-margin-calculator")).toBe(
      "/tools/premium-schema/quote-price-profit-margin-calculator",
    );
  });

  test("buildStrategicPremiumRoadmapCards exposes href only for live items", () => {
    const cards = buildStrategicPremiumRoadmapCards("en");
    expect(cards).toHaveLength(23);

    for (const card of cards) {
      if (card.status === "live") {
        expect(card.href).toMatch(/^\/tools\//);
      } else {
        expect(card.href).toBeNull();
      }
    }
  });
});
