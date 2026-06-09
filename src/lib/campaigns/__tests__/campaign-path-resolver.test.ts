import { describe, expect, test } from "vitest";
import { resolveCampaignIdForPath } from "@/lib/campaigns/campaign-path-resolver";

describe("campaign-path-resolver", () => {
  test("resolves SEO hub landing paths", () => {
    expect(resolveCampaignIdForPath("/seo/manufacturing-cost-calculators")).toBe(
      "manufacturing-hidden-loss",
    );
    expect(resolveCampaignIdForPath("/seo/logistics-route-calculators")).toBe(
      "logistics-route-cost",
    );
  });

  test("resolves industry landing paths", () => {
    expect(resolveCampaignIdForPath("/industries/restaurant")).toBe("restaurant-food-margin");
  });

  test("resolves free tool deep links", () => {
    expect(resolveCampaignIdForPath("/tools/free/oee-calculator")).toBe(
      "manufacturing-hidden-loss",
    );
    expect(resolveCampaignIdForPath("/tools/free/food-cost-calculator")).toBe(
      "restaurant-food-margin",
    );
  });

  test("resolves premium schema deep links", () => {
    expect(resolveCampaignIdForPath("/tools/premium-schema/cnc-oee-loss")).toBe(
      "manufacturing-hidden-loss",
    );
  });

  test("returns undefined for unrelated paths", () => {
    expect(resolveCampaignIdForPath("/pricing")).toBeUndefined();
    expect(resolveCampaignIdForPath("/about")).toBeUndefined();
  });
});
