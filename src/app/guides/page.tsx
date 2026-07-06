// SectorCalc — Guides Hub Page
// Root-only route. Lists all authority guides.
// Same data source as /guides/[slug].
// No locale prefix. Pure technical English.

import type { Metadata } from "next";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import {
  AUTHORITY_GUIDES,
  type AuthorityGuide,
  type AuthorityGuideCategory,
} from "@/lib/content/authority-guides";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  sanitizeJsonLd,
  type JsonLdRecord,
} from "@/lib/infrastructure/seo/schema-mesh";
import { GUIDE_REFERENCE_AUTHOR } from "@/config/guide-reference-author";
import { siteUrl } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Industrial Calculator Guides | SectorCalc",
  description:
    "Learn how to calculate manufacturing cost, OEE, scrap rate, construction overrun, route cost, food cost, energy cost, and more. Step-by-step guides with free calculators.",
  robots: { index: true, follow: true },
};

// ─── Category labels ──────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<AuthorityGuideCategory, string> = {
  manufacturing: "Manufacturing",
  construction: "Construction",
  logistics: "Logistics",
  "food-retail": "Food & Retail",
  "energy-carbon": "Energy & Carbon",
  agriculture: "Agriculture",
  "finance-business": "Finance & Business",
  conversion: "Unit Conversion",
};

const CATEGORY_ORDER: AuthorityGuideCategory[] = [
  "manufacturing",
  "construction",
  "logistics",
  "food-retail",
  "energy-carbon",
  "conversion",
];

// ─── Group guides by category ─────────────────────────────────────────────

function groupGuidesByCategory(): Map<AuthorityGuideCategory, AuthorityGuide[]> {
  const map = new Map<AuthorityGuideCategory, AuthorityGuide[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const guide of AUTHORITY_GUIDES) {
    const group = map.get(guide.category);
    if (group) {
      group.push(guide);
    } else {
      map.set(guide.category, [guide]);
    }
  }
  return map;
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────

function buildGuidesHubJsonLd(): JsonLdRecord[] {
  return [
    buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guides", path: "/guides" },
    ]),
    buildItemListJsonLd(
      AUTHORITY_GUIDES.map((g) => ({
        name: g.title,
        path: `/guides/${g.slug}`,
      })),
      "SectorCalc Guides",
    ),
    sanitizeJsonLd({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "SectorCalc Guides",
      description:
        "Step-by-step industrial calculation guides with free calculators and premium analyzers.",
      url: `${siteUrl}/guides`,
      inLanguage: "en",
      author: {
        "@type": "Person",
        name: GUIDE_REFERENCE_AUTHOR.name,
        url: GUIDE_REFERENCE_AUTHOR.externalProfileUrl,
      },
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      mainEntityOfPage: `${siteUrl}/guides`,
    }) as JsonLdRecord,
  ];
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function GuidesHubPage() {
  const grouped = groupGuidesByCategory();
  const guideCount = AUTHORITY_GUIDES.length;
  const jsonLd = buildGuidesHubJsonLd();

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container min-w-0">
          <p className="sc-pro-eyebrow">Reference Library</p>
          <h1 className="sc-pro-title">SectorCalc Guides</h1>
          <p className="mt-3 text-sm leading-relaxed text-body-charcoal max-w-prose">
            {guideCount > 0
              ? `Step-by-step guides explaining how to calculate key industrial metrics — manufacturing cost, OEE, scrap rate, construction overrun, route cost, food cost, energy cost, carbon exposure and area conversion. Each guide links to free calculators for quick estimates and premium analyzers for deeper decision support.`
              : `Reference guides for common industrial calculations.`}
          </p>
        </Container>
      </section>

      {guideCount === 0 ? (
        <section className="sc-pro-section">
          <Container className="sc-pro-container min-w-0">
            <p className="text-sm text-body-charcoal">
              Guides are being prepared. Check back soon.
            </p>
          </Container>
        </section>
      ) : (
        Array.from(grouped.entries())
          .filter(([_, guides]) => guides.length > 0)
          .map(([category, guides]) => (
            <section
              key={category}
              className="sc-pro-section sc-pro-section--alt"
            >
              <Container className="sc-pro-container min-w-0">
                <h2 className="sc-pro-headline text-lg">
                  {CATEGORY_LABELS[category] ?? category}
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {guides.map((guide) => (
                    <li key={guide.slug}>
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="sc-crawl-index__link text-sm"
                      >
                        {guide.title}
                      </Link>
                      <p className="mt-0.5 text-xs leading-relaxed text-body-charcoal">
                        {guide.seoDescription}
                      </p>
                    </li>
                  ))}
                </ul>
              </Container>
            </section>
          ))
      )}

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container min-w-0">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/free-tools"
              className="sc-cta-primary min-h-[44px] inline-flex items-center px-4"
            >
              Browse Free Calculators
            </Link>
            <Link
              href="/pricing"
              className="sc-craft-card__cta min-h-[44px] inline-flex items-center px-4"
            >
              View Premium Tools
            </Link>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
