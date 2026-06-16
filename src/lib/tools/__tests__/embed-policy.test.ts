import { describe, expect, test } from "vitest";
import {
  shouldAllowToolPageFraming,
  shouldOfferToolEmbed,
} from "@/lib/tools/embed-policy";

describe("embed-policy", () => {
  test("offers embed UI only for free tier", () => {
    expect(shouldOfferToolEmbed("free")).toBe(true);
    expect(shouldOfferToolEmbed("premium")).toBe(false);
  });

  test("allows framing for free generated and legacy free routes", () => {
    expect(shouldAllowToolPageFraming("/tools/generated/oee-calculator")).toBe(true);
    expect(shouldAllowToolPageFraming("/tr/tools/generated/oee-calculator")).toBe(true);
    expect(shouldAllowToolPageFraming("/tools/free/oee-calculator")).toBe(true);
  });

  test("blocks framing for premium and premium-schema routes", () => {
    expect(shouldAllowToolPageFraming("/tools/premium/shop-rate-hourly-cost-calculator")).toBe(
      false,
    );
    expect(
      shouldAllowToolPageFraming("/tr/tools/premium-schema/oee-equipment-effectiveness-calculator"),
    ).toBe(false);
  });
});
