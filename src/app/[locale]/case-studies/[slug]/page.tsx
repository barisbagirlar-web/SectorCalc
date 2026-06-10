import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CaseStudyDetail } from "@/components/case-studies/CaseStudyDetail";
import { CaseStudyProofPanel } from "@/components/case-studies/CaseStudyProofPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import {
  getCaseStudyBySlug,
  listCaseStudySlugs,
} from "@/lib/case-studies/case-study-registry";
import { createPageMetadata } from "@/lib/metadata";
import { locales, type AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const slugs = listCaseStudySlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
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
