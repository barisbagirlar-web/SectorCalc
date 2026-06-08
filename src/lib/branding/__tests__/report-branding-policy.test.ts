import { describe, expect, test } from "vitest";
import {
  isBrandingAllowedForPlan,
  sanitizeBrandingProfile,
} from "@/lib/branding/report-branding-policy";

describe("report branding policy", () => {
  test("enterprise profile requires enterprise plan", () => {
    const profile = {
      organizationName: "Acme Ops",
      allowedPlan: "enterprise" as const,
      watermarkMode: "custom_footer" as const,
    };
    expect(isBrandingAllowedForPlan(profile, "business")).toBe(false);
    expect(isBrandingAllowedForPlan(profile, "enterprise")).toBe(true);
  });

  test("business plan gets default when enterprise-only branding requested", () => {
    const result = sanitizeBrandingProfile(
      {
        organizationName: "Acme Ops",
        allowedPlan: "enterprise",
        logoUrl: "http://insecure.example/logo.png",
      },
      "business",
    );
    expect(result.organizationName).toBe("SectorCalc");
    expect(result.logoUrl).toBeUndefined();
  });

  test("https logo allowed for business plan on business profile", () => {
    const result = sanitizeBrandingProfile(
      {
        organizationName: "Acme Ops",
        allowedPlan: "business",
        logoUrl: "https://cdn.example/logo.png",
      },
      "business",
    );
    expect(result.logoUrl).toBe("https://cdn.example/logo.png");
  });
});
