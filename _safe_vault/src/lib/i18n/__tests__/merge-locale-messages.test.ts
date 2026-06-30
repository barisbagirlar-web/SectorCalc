import { describe, expect, test } from "vitest";
import {
  collectMissingTranslationKeys,
  mergeLocaleMessages,
} from "@/lib/i18n/merge-locale-messages";
import { buildLocaleCatalogSmokeRoutes } from "@/lib/i18n/locale-catalog-routes";

describe("merge-locale-messages", () => {
  test("mergeLocaleMessages keeps English fallback for missing nested keys", () => {
    const merged = mergeLocaleMessages(
      { campaign: { title: "English title", lead: "English lead" } },
      { campaign: { title: "Localized title" } },
    );

    expect(merged).toEqual({
      campaign: {
        title: "Localized title",
        lead: "English lead",
      },
    });
  });

  test("collectMissingTranslationKeys lists absent leaf keys", () => {
    const missing = collectMissingTranslationKeys(
      { campaign: { title: "English title", lead: "English lead" } },
      { campaign: { title: "Localized title" } },
      "tr",
    );

    expect(missing).toEqual([{ path: "campaign.lead", locale: "tr" }]);
  });
});

describe("locale-catalog-routes", () => {
  test("buildLocaleCatalogSmokeRoutes covers all supported locales", () => {
    const routes = buildLocaleCatalogSmokeRoutes();

    expect(routes).toContain("/free-tools");
    expect(routes).toContain("/tr/free-tools");
    expect(routes).toContain("/ar/free-tools");
    expect(routes).toContain("/de/free-tools");
    expect(routes).toContain("/fr/free-tools");
    expect(routes).toContain("/es/free-tools");
    expect(routes.length).toBe(24);
  });
});
