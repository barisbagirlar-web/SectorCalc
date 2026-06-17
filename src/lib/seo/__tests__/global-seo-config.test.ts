import { describe, expect, test } from "vitest";
import { SITE_BASE_URL, resolveSitemapBaseUrl } from "@/lib/seo/global-seo-config";

describe("global-seo-config", () => {
  test("SITE_BASE_URL uses canonical www host", () => {
    expect(SITE_BASE_URL).toBe("https://www.sectorcalc.com");
    expect(SITE_BASE_URL).not.toContain("web.app");
  });

  test("resolveSitemapBaseUrl prefers sectorcalc.com hosts from request", () => {
    const request = new Request("https://sectorcalc-bf412.web.app/sitemap.xml", {
      headers: {
        host: "www.sectorcalc.com",
      },
    });
    expect(resolveSitemapBaseUrl(request)).toBe("https://www.sectorcalc.com");
  });

  test("resolveSitemapBaseUrl normalizes apex sectorcalc.com to www", () => {
    const request = new Request("https://sectorcalc.com/sitemap.xml", {
      headers: {
        "x-forwarded-host": "sectorcalc.com",
      },
    });
    expect(resolveSitemapBaseUrl(request)).toBe("https://www.sectorcalc.com");
  });
});
