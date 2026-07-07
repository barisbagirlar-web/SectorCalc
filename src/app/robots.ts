import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/dashboard/", "/checkout/", "/account/"],
      },
    ],
    sitemap: "https://sectorcalc.com/sitemap.xml",
  };
}
