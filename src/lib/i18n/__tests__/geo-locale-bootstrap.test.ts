import { describe, expect, test } from "vitest";
import {
  buildGeoLocaleBootstrapScript,
  buildPrefixedLocalePath,
  isPrefixedLocalePathname,
  resolveBootstrapTargetLocale,
} from "@/lib/i18n/geo-locale-bootstrap";

describe("geo-locale-bootstrap", () => {
  test("isPrefixedLocalePathname detects tr/de/fr/es/ar", () => {
    expect(isPrefixedLocalePathname("/tr")).toBe(true);
    expect(isPrefixedLocalePathname("/tr/free-tools")).toBe(true);
    expect(isPrefixedLocalePathname("/de/tools/free/x")).toBe(true);
    expect(isPrefixedLocalePathname("/free-tools")).toBe(false);
    expect(isPrefixedLocalePathname("/")).toBe(false);
  });

  test("buildPrefixedLocalePath maps root and nested paths", () => {
    expect(buildPrefixedLocalePath("/", "tr")).toBe("/tr");
    expect(buildPrefixedLocalePath("/free-tools", "tr")).toBe("/tr/free-tools");
    expect(buildPrefixedLocalePath("/tools/generated/x", "de")).toBe("/de/tools/generated/x");
  });

  test("resolveBootstrapTargetLocale prefers country over language", () => {
    expect(
      resolveBootstrapTargetLocale({
        pathname: "/",
        manualLocale: false,
        cookieLocale: null,
        countryCode: "TR",
        navigatorLanguage: "en-us",
        timezone: null,
      }),
    ).toBe("tr");
  });

  test("resolveBootstrapTargetLocale honors manual locale choice", () => {
    expect(
      resolveBootstrapTargetLocale({
        pathname: "/",
        manualLocale: true,
        cookieLocale: "en",
        countryCode: "TR",
        navigatorLanguage: "tr-tr",
        timezone: "Europe/Istanbul",
      }),
    ).toBeNull();
  });

  test("resolveBootstrapTargetLocale uses persisted non-en cookie", () => {
    expect(
      resolveBootstrapTargetLocale({
        pathname: "/free-tools",
        manualLocale: false,
        cookieLocale: "tr",
        countryCode: null,
        navigatorLanguage: "en-us",
        timezone: null,
      }),
    ).toBe("tr");
  });

  test("resolveBootstrapTargetLocale falls back to navigator language", () => {
    expect(
      resolveBootstrapTargetLocale({
        pathname: "/pricing",
        manualLocale: false,
        cookieLocale: null,
        countryCode: null,
        navigatorLanguage: "fr-fr",
        timezone: null,
      }),
    ).toBe("fr");
  });

  test("resolveBootstrapTargetLocale falls back to Istanbul timezone", () => {
    expect(
      resolveBootstrapTargetLocale({
        pathname: "/",
        manualLocale: false,
        cookieLocale: null,
        countryCode: null,
        navigatorLanguage: "en-us",
        timezone: "Europe/Istanbul",
      }),
    ).toBe("tr");
  });

  test("resolveBootstrapTargetLocale skips prefixed paths", () => {
    expect(
      resolveBootstrapTargetLocale({
        pathname: "/tr/free-tools",
        manualLocale: false,
        cookieLocale: null,
        countryCode: "TR",
        navigatorLanguage: "tr-tr",
        timezone: "Europe/Istanbul",
      }),
    ).toBeNull();
  });

  test("buildGeoLocaleBootstrapScript includes cookie and country map", () => {
    const script = buildGeoLocaleBootstrapScript();
    expect(script).toContain("sectorcalc_locale");
    expect(script).toContain("sectorcalc_locale_manual");
    expect(script).toContain("sectorcalc_country");
    expect(script).toContain("Europe/Istanbul");
    expect(script).toContain('"TR":"tr"');
  });
});
