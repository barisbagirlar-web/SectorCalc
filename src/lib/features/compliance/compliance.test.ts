import { describe, expect, test } from "vitest";
import { countryToRegion, getRegionProfile } from "@/config/regions";
import { detectCountryFromHeaders } from "@/lib/features/compliance/detect-region";
import {
  applyRegionalFinancialLoss,
  applyRegionalRiskProfileOverlay,
} from "@/lib/features/compliance/compliance-engine";
import { getSectorRiskProfile } from "@/lib/features/tools/sectors/risk-profiles";

describe("Regional Compliance", () => {
  test("countryToRegion maps TR and DE; unknown falls back to EN", () => {
    expect(countryToRegion("TR")).toBe("TR");
    expect(countryToRegion("DE")).toBe("DE");
    expect(countryToRegion("US")).toBe("EN");
    expect(countryToRegion(null)).toBe("EN");
  });

  test("detectCountryFromHeaders reads Cloudflare and proxy headers", () => {
    const headers = new Headers({
      "x-vercel-ip-country": "TR",
    });
    expect(detectCountryFromHeaders(headers)).toBe("TR");
  });

  test("TR profile enables inflation; DE enables CBAM", () => {
    expect(getRegionProfile("TR").inflationCoefficient).toBeGreaterThan(1);
    expect(getRegionProfile("DE").cbamEnabled).toBe(true);
    expect(getRegionProfile("EN").cbamEnabled).toBe(false);
  });

  test("applyRegionalRiskProfileOverlay boosts CBAM for DE", () => {
    const base = getSectorRiskProfile("cnc-manufacturing");
    const de = applyRegionalRiskProfileOverlay(base, "DE");
    expect(de.cbamExposureIndex).toBeGreaterThanOrEqual(base.cbamExposureIndex);
  });

  test("applyRegionalFinancialLoss keeps TR adjustments within reasonable bounds", () => {
    const base = 10_000;
    const tr = applyRegionalFinancialLoss(base, "TR", [
      "energy_opt",
      "fiscal_multi",
      "hidden_loss",
    ]);
    expect(tr).toBeGreaterThan(base);
    expect(tr).toBeLessThan(base * 2.5);
  });
});
