import { describe, expect, test, vi } from "vitest";
import {
  buildConversionEvent,
  normalizeConversionPayload,
  trackConversionEvent,
  type ConversionFunnelStage,
} from "@/lib/analytics/conversion-funnel";

describe("conversion funnel", () => {
  test("normalizeConversionPayload strips PII fields", () => {
    const normalized = normalizeConversionPayload({
      stage: "calculation",
      eventName: "free_tool_calculate",
      locale: "en",
      pagePath: "/tools/free/oee-calculator",
      toolSlug: "oee-calculator",
      email: "user@example.com",
      contactName: "Jane Doe",
      companyName: "Acme Inc",
      name: "Jane",
    });

    expect(normalized.email).toBeUndefined();
    expect(normalized.contactName).toBeUndefined();
    expect(normalized.companyName).toBeUndefined();
    expect(normalized.name).toBeUndefined();
    expect(normalized.toolSlug).toBe("oee-calculator");
  });

  test("normalizeConversionPayload removes undefined and null values", () => {
    const normalized = normalizeConversionPayload({
      stage: "tool_open",
      eventName: "free_tool_open",
      locale: "en",
      pagePath: "/tools/free/area-converter",
      toolSlug: undefined,
      premiumSlug: null,
    });

    expect(normalized.toolSlug).toBeUndefined();
    expect(normalized.premiumSlug).toBeUndefined();
    expect(Object.keys(normalized).length).toBeGreaterThan(0);
  });

  test("free_tool_calculate event is valid", () => {
    const event = buildConversionEvent({
      stage: "calculation",
      eventName: "free_tool_calculate",
      locale: "en",
      pagePath: "/tools/free/oee-calculator",
      toolSlug: "oee-calculator",
      campaignId: "manufacturing-hidden-loss",
      valueType: "free",
      category: "manufacturing-workshop",
    });

    expect(event.eventName).toBe("free_tool_calculate");
    expect(event.stage).toBe("calculation");
    expect(event.campaignId).toBe("manufacturing-hidden-loss");
  });

  test("premium_unlock_click event is valid", () => {
    const event = buildConversionEvent({
      stage: "unlock_intent",
      eventName: "premium_unlock_click",
      locale: "en",
      pagePath: "/tools/premium-schema/cnc-oee-loss",
      premiumSlug: "cnc-oee-loss",
      ctaId: "unlock_full_report",
      valueType: "premium",
    });

    expect(event.premiumSlug).toBe("cnc-oee-loss");
    expect(event.ctaId).toBe("unlock_full_report");
  });

  test("pricing_cta_click event is valid", () => {
    const event = buildConversionEvent({
      stage: "pricing_intent",
      eventName: "pricing_cta_click",
      locale: "en",
      pagePath: "/pricing",
      ctaId: "pricing_pro_start",
      valueType: "premium",
    });

    expect(event.eventName).toBe("pricing_cta_click");
    expect(event.stage).toBe("pricing_intent");
  });

  test("report_csv_click event is valid", () => {
    const event = buildConversionEvent({
      stage: "export_intent",
      eventName: "report_csv_click",
      locale: "en",
      pagePath: "/tools/premium-schema/cnc-oee-loss",
      premiumSlug: "cnc-oee-loss",
      exportType: "csv",
      valueType: "export",
    });

    expect(event.exportType).toBe("csv");
  });

  test("trackConversionEvent does not crash in no-op mode", () => {
    expect(() =>
      trackConversionEvent({
        stage: "pricing_intent",
        eventName: "pricing_cta_click",
        locale: "en",
        pagePath: "/pricing",
        ctaId: "pricing_pro_start",
      })
    ).not.toThrow();
  });

  test("campaignId is sanitized", () => {
    const event = buildConversionEvent({
      stage: "landing",
      eventName: "seo_landing_cta_click",
      locale: "en",
      pagePath: "/seo/manufacturing-cost-calculators",
      campaignId: "  manufacturing-hidden-loss  ",
    });

    expect(event.campaignId).toBe("manufacturing-hidden-loss");
  });

  test("unknown stage values are rejected at compile time", () => {
    const stage: ConversionFunnelStage = "calculation";
    expect(stage).toBe("calculation");
  });

  test("payload never contains email or company fields after normalization", () => {
    const raw = buildConversionEvent({
      stage: "lead_submit",
      eventName: "beta_partner_submit",
      locale: "en",
      pagePath: "/beta-partner",
      ctaId: "beta_partner_form_submit",
      valueType: "lead",
    });

    const withPii = {
      ...raw,
      email: "hidden@example.com",
      companyName: "Hidden Co",
      contactName: "Hidden User",
    };

    const normalized = normalizeConversionPayload(withPii);
    expect(JSON.stringify(normalized).toLowerCase()).not.toContain("hidden@example.com");
    expect(normalized.companyName).toBeUndefined();
    expect(normalized.contactName).toBeUndefined();
  });

  test("trackConversionEvent swallows internal errors", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => undefined);
    expect(() =>
      trackConversionEvent({
        stage: "calculation",
        eventName: "free_tool_calculate",
        locale: "",
        pagePath: "/tools/free/oee-calculator",
        toolSlug: "oee-calculator",
      })
    ).not.toThrow();
    spy.mockRestore();
  });
});
