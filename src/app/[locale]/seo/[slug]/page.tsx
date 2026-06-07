import type { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { CrawlIndexLinkList } from "@/components/seo/CrawlIndexLinkList";
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

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return listProgrammaticSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
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
          <div className="sc-craft-grid sc-craft-grid--2">
            <div className="sc-industrial-panel p-4">
              <h2 className="sc-pro-headline text-lg">Free calculators</h2>
              <ul className="mt-3 space-y-2">
                {page.freeToolLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="sc-crawl-index__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sc-industrial-panel p-4">
              <h2 className="sc-pro-headline text-lg">Premium analyzers</h2>
              <ul className="mt-3 space-y-2">
                {page.premiumAnalyzerLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="sc-crawl-index__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {page.industryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="sc-cta-secondary">
                {link.label}
              </Link>
            ))}
            <Link href="/pricing" className="sc-cta-primary">
              View pricing
            </Link>
          </div>
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
