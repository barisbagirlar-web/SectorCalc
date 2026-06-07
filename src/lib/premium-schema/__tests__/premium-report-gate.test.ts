import { describe, expect, test } from "vitest";
import {
  FULL_ENTITLEMENT,
  PREVIEW_ENTITLEMENT,
  buildPremiumCheckoutHref,
} from "@/lib/entitlements/premium-entitlements";
import { buildDefaultSchemaInputs, runPremiumSchemaEngine } from "@/lib/premium-schema/premium-schema-engine";
import { buildPremiumReportExportPayload } from "@/lib/premium-schema/premium-report-export";
import {
  gatePremiumReportExportPayload,
  isPremiumReportExportEnabled,
  resolvePremiumCheckoutHref,
} from "@/lib/premium-schema/premium-report-gate";
import { getPremiumCalculatorSchema } from "@/lib/premium-schema/schema-registry";

describe("premium-report-gate", () => {
  const schema = getPremiumCalculatorSchema("cnc-oee-loss");

  test("locked state export false", () => {
    expect(isPremiumReportExportEnabled(PREVIEW_ENTITLEMENT)).toBe(false);
    expect(PREVIEW_ENTITLEMENT.canExportPdf).toBe(false);
    expect(PREVIEW_ENTITLEMENT.canExportCsv).toBe(false);
  });

  test("full state export true", () => {
    expect(isPremiumReportExportEnabled(FULL_ENTITLEMENT)).toBe(true);
    expect(FULL_ENTITLEMENT.canExportPdf).toBe(true);
    expect(FULL_ENTITLEMENT.canExportCsv).toBe(true);
  });

  test("preview payload hidden drivers limited", () => {
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const payload = buildPremiumReportExportPayload(schema, result, "en");
    const gated = gatePremiumReportExportPayload(payload, PREVIEW_ENTITLEMENT);

    expect(payload.hiddenDrivers.length).toBeGreaterThan(0);
    expect(gated.hiddenDrivers).toHaveLength(0);
    expect(gated.suggestedActions).toHaveLength(0);
    expect(gated.assumptions).toHaveLength(0);
    expect(gated.thresholds.length).toBeLessThanOrEqual(2);
  });

  test("full payload hidden drivers open", () => {
    expect(schema).not.toBeNull();
    if (!schema) {
      return;
    }

    const result = runPremiumSchemaEngine(schema, buildDefaultSchemaInputs(schema));
    const payload = buildPremiumReportExportPayload(schema, result, "en");
    const gated = gatePremiumReportExportPayload(payload, FULL_ENTITLEMENT);

    expect(gated.hiddenDrivers.length).toBe(payload.hiddenDrivers.length);
    expect(gated.suggestedActions.length).toBe(payload.suggestedActions.length);
    expect(gated.assumptions.length).toBe(payload.assumptions.length);
  });

  test("checkoutHref empty uses pricing fallback", () => {
    const href = resolvePremiumCheckoutHref("cnc-oee-loss");
    expect(href).toBe("/pricing?tool=cnc-oee-loss");
    expect(buildPremiumCheckoutHref("cnc-oee-loss", undefined)).toBe(href);
    expect(resolvePremiumCheckoutHref("cnc-oee-loss", "/custom-checkout")).toBe("/custom-checkout");
  });
});
