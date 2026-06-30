export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AcademicPublishedCaseStudyRecord } from "@/components/case-studies/academic/AcademicPublishedCaseStudyRecord";
import { AcademicRepresentativeCaseStudyRecord } from "@/components/case-studies/academic/AcademicRepresentativeCaseStudyRecord";
import {
  getCaseStudyBySlug,
  listAllCaseStudySlugs,
} from "@/lib/case-studies/case-study-registry";
import { resolveCaseStudyPageDescription } from "@/lib/case-studies/case-study-seo";
import {
  getPublishedCaseStudyBySlug,
  isPublishedCaseStudySlug,
} from "@/lib/case-studies/published-case-study-locale";
import { resolvePublishedCaseStudyBySlug } from "@/lib/case-studies/firestore-case-studies";
import { createPageMetadata } from "@/lib/metadata";
import { locales, type AppLocale } from "@/i18n/routing";
import { limitStaticParamsForPreview } from "@/lib/build/preview-static-params";
import "@/styles/academic-case-studies-database.css";

export const revalidate = 60;

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
  const published =
    getPublishedCaseStudyBySlug(slug, locale) ?? (await resolvePublishedCaseStudyBySlug(slug, locale));
  if (published) {
    return createPageMetadata({
      title: published.title,
      description: resolveCaseStudyPageDescription(published),
      path: `/case-studies/${slug}`,
      locale: locale as AppLocale,
    });
  }

  const entry = getCaseStudyBySlug(slug);
  if (!entry) {
    const tCase = await getTranslations({ locale, namespace: "caseStudies" });
    return createPageMetadata({
      title: tCase("title"),
      path: "/case-studies",
      locale: locale as AppLocale,
    });
  }
  const tCase = await getTranslations({ locale, namespace: "caseStudies" });
  return createPageMetadata({
    title: entry.title,
    description: tCase("representativeNote"),
    path: `/case-studies/${slug}`,
    locale: locale as AppLocale,
  });
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const published = await resolvePublishedCaseStudyBySlug(slug, locale);
  if (published) {
    return <AcademicPublishedCaseStudyRecord study={published} locale={locale} />;
  }

  if (isPublishedCaseStudySlug(slug)) {
    notFound();
  }

  const entry = getCaseStudyBySlug(slug);
  if (!entry) {
    notFound();
  }

  return <AcademicRepresentativeCaseStudyRecord entry={entry} locale={locale} />;
}
