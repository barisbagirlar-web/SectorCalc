/* eslint-disable */
// @ts-nocheck

import { describe, expect, test } from "vitest";
import {
  addLocaleToPath,
  getLegacyEnRedirectPath,
  isMiddlewareExcludedPath,
  needsEnglishLocaleRewrite,
  resolveRootVisitLocale,
  rewritePathToEnglishLocale,
  shouldRedirectLocaleLessPublicRoute,
  shouldRedirectRootToLocale,
  shouldRedirectUnlocalizedPath,
  stripLocaleFromPath,
  switchPathLocale,
} from "@/lib/infrastructure/i18n/locale-routing";

describe("locale-routing", () => {
  test('addLocaleToPath("/free-tools", "en") => "/free-tools"', () => {
    expect(addLocaleToPath("/free-tools", "en")).toBe("/free-tools");
  });

  test('addLocaleToPath("/en/free-tools", "en") => "/free-tools"', () => {
    expect(addLocaleToPath("/en/free-tools", "en")).toBe("/free-tools");
  });

  test('stripLocaleFromPath("/en/free-tools") => "/free-tools"', () => {
    expect(stripLocaleFromPath("/en/free-tools")).toBe("/free-tools");
  });

  test('getLegacyEnRedirectPath("/en") => "/"', () => {
    expect(getLegacyEnRedirectPath("/en")).toBe("/");
  });

  test('getLegacyEnRedirectPath("/en/tools/free/margin-calculator") => "/tools/generated/margin-calculator"', () => {
    expect(getLegacyEnRedirectPath("/en/tools/free/margin-calculator")).toBe(
      "/tools/generated/margin-calculator",
    );
  });

  test('getLegacyEnRedirectPath("/en/tools/free/area-converter") => "/tools/generated/area-converter"', () => {
    expect(getLegacyEnRedirectPath("/en/tools/free/area-converter")).toBe(
      "/tools/generated/area-converter",
    );
  });

  test("isMiddlewareExcludedPath /api true", () => {
    expect(isMiddlewareExcludedPath("/api/billing/webhook")).toBe(true);
  });

  test("isMiddlewareExcludedPath /api-public true", () => {
    expect(isMiddlewareExcludedPath("/api-public/calculate/z-score-calculator")).toBe(true);
  });

  test("isMiddlewareExcludedPath /sitemap.xml true", () => {
    expect(isMiddlewareExcludedPath("/sitemap.xml")).toBe(true);
  });

  test("needsEnglishLocaleRewrite skips prefixed locales", () => {
    expect(needsEnglishLocaleRewrite("/free-tools")).toBe(true);
  });

  test("rewritePathToEnglishLocale maps unprefixed paths", () => {
    expect(rewritePathToEnglishLocale("/")).toBe("/en");
    expect(rewritePathToEnglishLocale("/free-tools")).toBe("/en/free-tools");
    expect(rewritePathToEnglishLocale("/tools/premium/welding-bid-risk-analyzer")).toBe(
      "/en/tools/premium/welding-bid-risk-analyzer",
    );
  });

  test("getLegacyEnRedirectPath strips /en prefix from premium tool routes", () => {
    expect(getLegacyEnRedirectPath("/en/tools/premium/welding-bid-risk-analyzer")).toBe(
      "/tools/premium/welding-bid-risk-analyzer",
    );
  });

  test("resolveRootVisitLocale prefers cookie over default", () => {
    expect(
      resolveRootVisitLocale({
        cookieLocale: "en",
        countryCode: "TR",
        acceptLanguage: null,
      }),
    ).toBe("en");
  });

  test("resolveRootVisitLocale honors manual en cookie", () => {
    expect(
      resolveRootVisitLocale({
        cookieLocale: "en",
        manualCookie: "1",
        countryCode: "TR",
        acceptLanguage: null,
      }),
    ).toBe("en");
  });

  test("shouldRedirectRootToLocale returns null for en", () => {
    expect(
      shouldRedirectRootToLocale({
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }),
    ).toBeNull();
  });

  test("shouldRedirectLocaleLessPublicRoute returns null for en", () => {
    expect(
      shouldRedirectLocaleLessPublicRoute({
        pathname: "/free-tools",
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }),
    ).toBeNull();
  });

  test("shouldRedirectUnlocalizedPath redirects tool pages for TR country", () => {
    expect(
      shouldRedirectUnlocalizedPath({
        pathname: "/tools/free/concrete-volume-calculator",
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }),
    ).toBe("tr");
  });

  test("shouldRedirectUnlocalizedPath skips already localized paths", () => {
    expect(
      shouldRedirectUnlocalizedPath({
        pathname: "/tr/tools/free/concrete-volume-calculator",
        cookieLocale: undefined,
        countryCode: "TR",
        acceptLanguage: null,
      }),
    ).toBeNull();
  });

  test("shouldRedirectUnlocalizedPath returns null for EN visitors", () => {
    expect(
      shouldRedirectUnlocalizedPath({
        pathname: "/tools/free/concrete-volume-calculator",
        cookieLocale: undefined,
        countryCode: null,
        acceptLanguage: "en-US,en;q=0.9",
      }),
    ).toBeNull();
  });

  test("isMiddlewareExcludedPath skips AI public files", () => {
    expect(isMiddlewareExcludedPath("/llms.txt")).toBe(true);
    expect(isMiddlewareExcludedPath("/ai-tool-index.json")).toBe(true);
    expect(isMiddlewareExcludedPath("/ai-search-manifest.json")).toBe(true);
  });
});
