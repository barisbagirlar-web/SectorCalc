import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CaseStudyDetail } from "@/components/case-studies/CaseStudyDetail";
import { CaseStudyProofPanel } from "@/components/case-studies/CaseStudyProofPanel";
import { PublishedCaseStudyDetail } from "@/components/case-studies/PublishedCaseStudyDetail";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import {
  getCaseStudyBySlug,
  listAllCaseStudySlugs,
} from "@/lib/case-studies/case-study-registry";
import {
  getPublishedCaseStudyBySlug,
  isPublishedCaseStudySlug,
} from "@/lib/case-studies/published-case-study-locale";
import { createPageMetadata } from "@/lib/metadata";
import { locales, type AppLocale } from "@/i18n/routing";
import { limitStaticParamsForPreview } from "@/lib/build/preview-static-params";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const slugs = listAllCaseStudySlugs();
  const params = locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
  return limitStaticParamsForPreview(params, {
    family: "case-studies",
    slugKey: "slug",
    localeKey: "locale",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const published = getPublishedCaseStudyBySlug(slug, locale);
  if (published) {
    return createPageMetadata({
      title: published.title,
      description: published.subtitle,
      path: `/case-studies/${slug}`,
      locale: locale as AppLocale,
    });
  }

  const entry = getCaseStudyBySlug(slug);
  if (!entry) {
    return createPageMetadata({ title: "Case study", path: "/case-studies", locale: locale as AppLocale });
  }
  return createPageMetadata({
    title: `${entry.title} — Representative Scenario`,
    description: entry.problem,
    path: `/case-studies/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (isPublishedCaseStudySlug(slug)) {
    const published = getPublishedCaseStudyBySlug(slug, locale);
    if (!published) {
      notFound();
    }

    return (
      <PageLayout>
        <section className="sc-craft-section overflow-x-hidden">
          <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
            <PublishedCaseStudyDetail study={published} locale={locale} />
          </Container>
        </section>
      </PageLayout>
    );
  }

  const entry = getCaseStudyBySlug(slug);
  if (!entry) {
    notFound();
  }

  return (
    <PageLayout>
      <section className="sc-craft-section overflow-x-hidden">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <div className="mb-6">
            <CaseStudyProofPanel entry={entry} />
          </div>
          <CaseStudyDetail entry={entry} />
        </Container>
      </section>
    </PageLayout>
  );
}
