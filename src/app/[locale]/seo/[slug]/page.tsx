import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
import { SeoHubCampaignActions } from "@/components/campaign/SeoHubCampaignActions";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { buildSeoHubCrawlGroups } from "@/lib/seo/crawl-index";
import {
  buildSeoHubJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo/schema-mesh";
import {
  getProgrammaticSeoPageBySlug,
  listProgrammaticSeoSlugs,
} from "@/lib/seo/programmatic-seo-pages";
import {
  getPremiumToolSeoLandingBySlug,
  listPremiumToolSeoLandingSlugs,
} from "@/lib/seo/premium-tool-seo-landings";
import { PremiumToolSeoLandingView } from "@/components/seo/PremiumToolSeoLanding";
import { fillPremiumSeoTemplate } from "@/lib/seo/premium-tool-seo-context";
import { getLocalizedRevenueToolTitle } from "@/data/revenue-tools-i18n";
import { getLocalizedPremiumSchema } from "@/data/premium-schema-i18n";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return []; // HACK: bypass huge SSG build for fast Firebase deploy
  return [...listProgrammaticSeoSlugs(), ...listPremiumToolSeoLandingSlugs()]
    .slice()
    .sort()
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;

  const premiumLanding = getPremiumToolSeoLandingBySlug(slug, locale);
  if (premiumLanding) {
    const t = await getTranslations({ locale, namespace: "premiumSeo" });
    const localizedToolName =
      premiumLanding.source === "revenue"
        ? getLocalizedRevenueToolTitle(
            premiumLanding.slug,
            "paid",
            locale,
            premiumLanding.toolName,
          )
        : (getLocalizedPremiumSchema(premiumLanding.slug, locale)?.title ??
          premiumLanding.toolName);
    const tokens = {
      tool: localizedToolName,
      ...premiumLanding.context,
    };
    const fill = (key: string) =>
      fillPremiumSeoTemplate(t.raw(key) as string, tokens);
    return createPageMetadata({
      title: fill("metaTitle"),
      description: fill("metaDescription"),
      path: premiumLanding.seoHref,
      locale: locale as AppLocale,
    });
  }

  const page = getProgrammaticSeoPageBySlug(slug);
  if (!page) {
    return {};
  }

  return createPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/seo/${page.slug}`,
    locale: locale as AppLocale,
  });
}

export default async function ProgrammaticSeoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const premiumLanding = getPremiumToolSeoLandingBySlug(slug, locale);
  if (premiumLanding) {
    return <PremiumToolSeoLandingView landing={premiumLanding} locale={locale} />;
  }

  const page = getProgrammaticSeoPageBySlug(slug);
  if (!page) {
    notFound();
  }

  const relatedPages = page.relatedHubSlugs
    .map((relatedSlug) => getProgrammaticSeoPageBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const jsonLd = [
    buildBreadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: page.title, path: `/seo/${page.slug}` },
      ],
      locale
    ),
    ...buildSeoHubJsonLd(page, locale),
  ];

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <p className="sc-pro-eyebrow">SectorCalc guides</p>
          <h1 className="sc-pro-title">{page.title}</h1>
          <p className="sc-pro-lead">{page.intro}</p>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container">
          <h2 className="sc-pro-headline text-lg">What this page helps you calculate</h2>
          <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{page.helpsYouCalculate}</p>
        </Container>
      </section>

      <section className="sc-pro-section">
        <Container className="sc-pro-container">
          <FeaturedAnswerBlock
            question={page.featuredQuestion}
            answer={page.featuredAnswer}
            bullets={page.featuredBullets}
          />
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container">
          <SeoHubCampaignActions
            freeToolLinks={page.freeToolLinks}
            premiumAnalyzerLinks={page.premiumAnalyzerLinks}
            industryLinks={page.industryLinks}
          />
        </Container>
      </section>

      {page.faq.length > 0 ? (
        <section className="sc-pro-section">
          <Container className="sc-pro-container">
            <h2 className="sc-pro-headline text-lg">FAQ</h2>
            <dl className="mt-4 space-y-4">
              {page.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-premium-velvet">{item.question}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-body-charcoal">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      {relatedPages.length > 0 ? (
        <section className="sc-pro-section sc-pro-section--alt">
          <Container className="sc-pro-container">
            <h2 className="sc-pro-headline text-lg">Related guides</h2>
            <ul className="mt-3 flex flex-wrap gap-3">
              {relatedPages.map((related) => (
                <li key={related.slug}>
                  <Link href={`/seo/${related.slug}`} className="sc-crawl-index__link">
                    {related.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container">
          <CrawlIndexLinkList title="SEO hub index" groups={buildSeoHubCrawlGroups()} />
        </Container>
      </section>
    </PageLayout>
  );
}
