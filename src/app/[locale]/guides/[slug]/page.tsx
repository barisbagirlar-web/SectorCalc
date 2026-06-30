export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { GuideAuthorByline } from "@/components/guides/GuideAuthorByline";
import { FeaturedAnswerBlock } from "@/components/seo/FeaturedAnswerBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import type { AppLocale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import {
  getAuthorityGuideBySlug,
  listAuthorityGuideSlugs,
  type AuthorityGuide,
} from "@/lib/content/authority-guides";
import {
  getAuthorityGuideRoutePath,
  getIndustryPathForGuide,
  getSeoHubSlugForGuide,
} from "@/lib/content/authority-links";
import { getFreeTrafficToolBySlugLocalized } from "@/lib/features/tools/free-traffic-catalog";
import { getPremiumSchemaBySlug } from "@/lib/features/premium-schema/schemas/index";
import {
  buildBreadcrumbJsonLd,
  buildFAQJsonLd,
  buildItemListJsonLd,
  sanitizeJsonLd,
  type JsonLdRecord,
} from "@/lib/infrastructure/seo/schema-mesh";
import { GUIDE_REFERENCE_AUTHOR, guideReferenceAuthorJsonLdId } from "@/config/guide-reference-author";
import { buildLocalizedUrl } from "@/lib/infrastructure/seo/sitemap-manifest";
import { siteUrl } from "@/config/site";
import { getToolHref } from "@/lib/features/tools/paths";
import { limitStaticParamsForPreview } from "@/lib/infrastructure/build/preview-static-params";

interface GuidePageParams {
  slug: string;
}

interface GuideRouteParams extends GuidePageParams {
  locale: string;
}

export const dynamicParams = true;

export async function generateStaticParams(): Promise<GuidePageParams[]> {
  const params = listAuthorityGuideSlugs().map((slug) => ({ slug }));
  return limitStaticParamsForPreview(params, {
    family: "guides",
    slugKey: "slug",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<GuideRouteParams>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const guide = getAuthorityGuideBySlug(slug);
  if (!guide) {
    return {};
  }

  return createPageMetadata({
    title: guide.seoTitle,
    description: guide.seoDescription,
    path: getAuthorityGuideRoutePath(guide.slug),
    locale: locale as AppLocale,
  });
}

function buildGuideJsonLd(guide: AuthorityGuide, locale: string, homeLabel: string, guidesLabel: string): JsonLdRecord[] {
  const freeItems = guide.relatedFreeToolSlugs
    .map((slug) => {
      const tool = getFreeTrafficToolBySlugLocalized(slug, locale);
      if (!tool) {
        return null;
      }
      return { name: tool.title, path: getToolHref("free", tool.slug) };
    })
    .filter((item): item is { name: string; path: string } => item !== null);

  const premiumItems = guide.relatedPremiumSchemaSlugs
    .map((slug) => {
      const schema = getPremiumSchemaBySlug(slug);
      if (!schema) {
        return null;
      }
      return { name: schema.name, path: `/tools/premium-schema/${schema.id}` };
    })
    .filter((item): item is { name: string; path: string } => item !== null);

  const graphs: JsonLdRecord[] = [
    buildBreadcrumbJsonLd(
      [
        { name: homeLabel, path: "/" },
        { name: guidesLabel, path: "/guides" },
        { name: guide.title, path: getAuthorityGuideRoutePath(guide.slug) },
      ],
      locale,
    ),
    sanitizeJsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.h1,
      name: guide.title,
      description: guide.seoDescription,
      url: buildLocalizedUrl(getAuthorityGuideRoutePath(guide.slug), locale as AppLocale, siteUrl),
      inLanguage: locale,
      author: {
        "@type": "Person",
        "@id": guideReferenceAuthorJsonLdId(),
        name: GUIDE_REFERENCE_AUTHOR.name,
        url: GUIDE_REFERENCE_AUTHOR.externalProfileUrl,
      },
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      mainEntityOfPage: buildLocalizedUrl(getAuthorityGuideRoutePath(guide.slug), locale as AppLocale, siteUrl),
    }) as JsonLdRecord,
    buildItemListJsonLd(freeItems, `${guide.title} — free calculators`, locale),
    buildItemListJsonLd(premiumItems, `${guide.title} — premium calculators`, locale),
  ];

  const faq = buildFAQJsonLd(guide.faq);
  if (faq) {
    graphs.push(faq);
  }

  return graphs;
}

export default async function AuthorityGuidePage({
  params,
}: {
  params: Promise<GuideRouteParams>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const tGuides = await getTranslations({ locale, namespace: "seoPage" });

  const guide = getAuthorityGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  const jsonLd = buildGuideJsonLd(guide, locale, tGuides("breadcrumbHome"), tGuides("breadcrumbGuides"));
  const seoHubSlug = getSeoHubSlugForGuide(guide);
  const industryPath = getIndustryPathForGuide(guide);

  return (
    <PageLayout>
      <JsonLd data={jsonLd} />
      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container min-w-0">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-body-charcoal">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="underline underline-offset-2 hover:text-premium-velvet">
                  {tGuides("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/seo/${seoHubSlug}`} className="underline underline-offset-2 hover:text-premium-velvet">
                  {tGuides("breadcrumbGuides")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-premium-velvet">{guide.title}</li>
            </ol>
          </nav>
          <p className="sc-pro-eyebrow">{tGuides("authorityGuideEyebrow")}</p>
          <h1 className="sc-pro-title">{guide.h1}</h1>
          <GuideAuthorByline locale={locale as AppLocale} />
        </Container>
      </section>

      <section className="sc-pro-section">
        <Container className="sc-pro-container min-w-0">
          <FeaturedAnswerBlock question={guide.featuredQuestion} answer={guide.featuredAnswer} />
        </Container>
      </section>

      {guide.sections.map((section) => (
        <section key={section.heading} className="sc-pro-section sc-pro-section--alt">
          <Container className="sc-pro-container min-w-0">
            <h2 className="sc-pro-headline text-lg">{section.heading}</h2>
            <p className="mt-3 text-sm leading-relaxed text-body-charcoal">{section.body}</p>
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-body-charcoal">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </Container>
        </section>
      ))}

      <section className="sc-pro-section sc-pro-section--border">
        <Container className="sc-pro-container min-w-0">
          <h2 className="sc-pro-headline text-lg">{tGuides("relatedFreeCalculators")}</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {guide.relatedFreeToolSlugs.map((toolSlug) => {
              const tool = getFreeTrafficToolBySlugLocalized(toolSlug, locale);
              if (!tool) {
                return null;
              }
              return (
                <li key={toolSlug}>
                  <Link
                    href={getToolHref("free", tool.slug)}
                    className="sc-crawl-index__link text-sm"
                  >
                    {tool.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="sc-pro-section">
        <Container className="sc-pro-container min-w-0">
          <h2 className="sc-pro-headline text-lg">{tGuides("relatedPremiumCalculators")}</h2>
          <ul className="mt-3 flex flex-wrap gap-3">
            {guide.relatedPremiumSchemaSlugs.map((premiumSlug) => {
              const schema = getPremiumSchemaBySlug(premiumSlug);
              if (!schema) {
                return null;
              }
              return (
                <li key={premiumSlug}>
                  <Link
                    href={`/tools/premium-schema/${schema.id}`}
                    className="sc-crawl-index__link text-sm"
                  >
                    {schema.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="sc-pro-section sc-pro-section--alt">
        <Container className="sc-pro-container min-w-0">
          <h2 className="sc-pro-headline text-lg">{tGuides("exploreFurther")}</h2>
          <ul className="mt-3 flex flex-wrap gap-3 text-sm">
            <li>
              <Link href={`/seo/${seoHubSlug}`} className="sc-crawl-index__link">
                {tGuides("seoHub")}
              </Link>
            </li>
            <li>
              <Link href="/categories" className="sc-crawl-index__link">
                {tGuides("categories")}
              </Link>
            </li>
            <li>
              <Link href={industryPath} className="sc-crawl-index__link">
                {tGuides("industryPage")}
              </Link>
            </li>
            <li>
              <Link href="/industries" className="sc-crawl-index__link">
                {tGuides("allIndustries")}
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="sc-crawl-index__link">
                {tGuides("pricing")}
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      {guide.faq.length > 0 ? (
        <section className="sc-pro-section sc-pro-section--border">
          <Container className="sc-pro-container min-w-0">
            <h2 className="sc-pro-headline text-lg">{tGuides("faq")}</h2>
            <dl className="mt-4 space-y-4">
              {guide.faq.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-premium-velvet">{item.question}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-body-charcoal">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      <section className="sc-pro-section sc-pro-section--alt sc-pro-section--border">
        <Container className="sc-pro-container min-w-0">
          <div className="flex flex-wrap gap-3">
            <Link href="/free-tools" className="sc-cta-primary min-h-[44px] inline-flex items-center px-4">
              {tGuides("startFree")}
            </Link>
            <Link
              href="/pro-tools"
              className="sc-craft-card__cta min-h-[44px] inline-flex items-center px-4"
            >
              {tGuides("viewPremium")}
            </Link>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-body-charcoal">
            {tGuides("legalFooter")}
          </p>
        </Container>
      </section>
    </PageLayout>
  );
}
