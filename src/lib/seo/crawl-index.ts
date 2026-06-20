import { listPublicFreeTrafficTools } from "@/lib/tools/free-traffic-catalog";
import { getOrderedFreeTrafficCategories } from "@/lib/tools/free-traffic-categories";
import { buildPremiumSchemaCatalogGroups } from "@/lib/premium-schema/premium-schema-catalog";
import { listProgrammaticSeoSlugs, PROGRAMMATIC_SEO_PAGES } from "@/lib/seo/programmatic-seo-pages";
import { INDUSTRIES } from "@/data/industries";
import { hasCanonicalToolCatalog } from "@/lib/tools/canonical-tool-slugs";
import type { CrawlIndexGroup } from "@/components/seo/CrawlIndexLinkList";

export function buildFreeToolsCrawlGroups(): readonly CrawlIndexGroup[] {
  const categories = getOrderedFreeTrafficCategories();

  return categories
    .map((category) => ({
      label: category.id.replace(/-/g, " "),
      links: listPublicFreeTrafficTools()
        .filter((tool) => tool.category === category.id)
        .map((tool) => ({
          href: `/tools/generated/${tool.slug}`,
          label: tool.title,
        })),
    }))
    .filter((group) => group.links.length > 0);
}

export function buildPremiumToolsCrawlGroups(locale = "en"): readonly CrawlIndexGroup[] {
  return buildPremiumSchemaCatalogGroups(locale).map((group) => ({
    label: group.label,
    links: group.items.map((item) => ({
      href: item.href,
      label: item.title,
    })),
  }));
}

export function buildIndustriesCrawlGroups(): readonly CrawlIndexGroup[] {
  if (!hasCanonicalToolCatalog()) {
    return [];
  }

  return [
    {
      label: "Industry Calculators",
      links: INDUSTRIES.map((industry) => ({
        href: industry.href,
        label: industry.name,
      })),
    },
  ];
}

export function buildSeoHubCrawlGroups(): readonly CrawlIndexGroup[] {
  return [
    {
      label: "SEO hubs",
      links: PROGRAMMATIC_SEO_PAGES.map((page) => ({
        href: `/seo/${page.slug}`,
        label: page.title,
      })),
    },
  ];
}

export function buildCoreHubCrawlGroups(): readonly CrawlIndexGroup[] {
  return [
    {
      label: "Core pages",
      links: [
        { href: "/free-tools", label: "Free Calculators" },
        { href: "/pro-tools", label: "Premium Calculators" },
        { href: "/categories", label: "Categories" },
        { href: "/industries", label: "Industry Calculators" },
        { href: "/pricing", label: "Pricing" },
        { href: "/beta-partner", label: "Beta partner" },
        ...listProgrammaticSeoSlugs().map((slug) => ({
          href: `/seo/${slug}`,
          label: slug.replace(/-/g, " "),
        })),
      ],
    },
  ];
}
