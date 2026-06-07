import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    optimizePackageImports: ["lucide-react", "@heroicons/react"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en",
        permanent: false,
      },
      {
        source:
          "/:path((?!en|tr|es|de|ar|admin|_next|api|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
        destination: "/en/:path",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
