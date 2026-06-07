import { describe, expect, test } from "vitest";
import {
  addLocaleToPath,
  getLegacyEnRedirectPath,
  isMiddlewareExcludedPath,
  needsEnglishLocaleRewrite,
  rewritePathToEnglishLocale,
  stripLocaleFromPath,
} from "@/lib/i18n/locale-routing";

describe("locale-routing", () => {
  test('addLocaleToPath("/free-tools", "en") => "/free-tools"', () => {
    expect(addLocaleToPath("/free-tools", "en")).toBe("/free-tools");
  });

  test('addLocaleToPath("/free-tools", "tr") => "/tr/free-tools"', () => {
    expect(addLocaleToPath("/free-tools", "tr")).toBe("/tr/free-tools");
  });

  test('addLocaleToPath("/tr/free-tools", "en") => "/free-tools"', () => {
    expect(addLocaleToPath("/tr/free-tools", "en")).toBe("/free-tools");
  });

  test('stripLocaleFromPath("/tr/free-tools") => "/free-tools"', () => {
    expect(stripLocaleFromPath("/tr/free-tools")).toBe("/free-tools");
  });

  test('stripLocaleFromPath("/en/free-tools") => "/free-tools"', () => {
    expect(stripLocaleFromPath("/en/free-tools")).toBe("/free-tools");
  });

  test('getLegacyEnRedirectPath("/en") => "/"', () => {
    expect(getLegacyEnRedirectPath("/en")).toBe("/");
  });

  test('getLegacyEnRedirectPath("/en/tools/free/area-converter") => "/tools/free/area-converter"', () => {
    expect(getLegacyEnRedirectPath("/en/tools/free/area-converter")).toBe(
      "/tools/free/area-converter",
    );
  });

  test("isMiddlewareExcludedPath /api true", () => {
    expect(isMiddlewareExcludedPath("/api/billing/webhook")).toBe(true);
  });

  test("isMiddlewareExcludedPath /sitemap.xml true", () => {
    expect(isMiddlewareExcludedPath("/sitemap.xml")).toBe(true);
  });

  test('addLocaleToPath("/en/free-tools", "tr") => "/tr/free-tools"', () => {
    expect(addLocaleToPath("/en/free-tools", "tr")).toBe("/tr/free-tools");
  });

  test('addLocaleToPath("/en/free-tools", "en") => "/free-tools"', () => {
    expect(addLocaleToPath("/en/free-tools", "en")).toBe("/free-tools");
  });

  test("needsEnglishLocaleRewrite true for root English paths", () => {
    expect(needsEnglishLocaleRewrite("/free-tools")).toBe(true);
    expect(needsEnglishLocaleRewrite("/tools/free/area-converter")).toBe(true);
    expect(needsEnglishLocaleRewrite("/tr/free-tools")).toBe(false);
    expect(needsEnglishLocaleRewrite("/en/free-tools")).toBe(false);
  });

  test("rewritePathToEnglishLocale maps unprefixed paths", () => {
    expect(rewritePathToEnglishLocale("/")).toBe("/en");
    expect(rewritePathToEnglishLocale("/free-tools")).toBe("/en/free-tools");
  });
});
