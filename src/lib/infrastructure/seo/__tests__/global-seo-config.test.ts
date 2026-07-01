/* eslint-disable */
// @ts-nocheck

import { describe, expect, test } from "vitest";
import { SITE_BASE_URL, resolveSitemapBaseUrl } from "@/lib/infrastructure/seo/global-seo-config";

describe("global-seo-config", () => {
  test("SITE_BASE_URL uses canonical host", () => {
    expect(SITE_BASE_URL).toBe("https://sectorcalc.com");
    expect(SITE_BASE_URL).not.toContain("web.app");
  });

  test("resolveSitemapBaseUrl prefers sectorcalc.com hosts from request", () => {
    const request = new Request("https://sectorcalc-bf412.web.app/sitemap.xml", {
      headers: {
        host: "sectorcalc.com",
      },
    });
    expect(resolveSitemapBaseUrl(request)).toBe("https://sectorcalc.com");
  });

  test("resolveSitemapBaseUrl normalizes apex sectorcalc.com", () => {
    const request = new Request("https://sectorcalc.com/sitemap.xml", {
      headers: {
        "x-forwarded-host": "sectorcalc.com",
      },
    });
    expect(resolveSitemapBaseUrl(request)).toBe("https://sectorcalc.com");
  });
});
