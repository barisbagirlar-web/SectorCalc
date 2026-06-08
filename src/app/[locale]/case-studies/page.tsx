import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { listCaseStudies } from "@/lib/case-studies/case-study-registry";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Sector Case Studies — Representative Scenarios",
    description:
      "Representative sector scenarios showing how SectorCalc tools structure inputs and surface loss types. Not verified customer outcomes.",
    path: "/case-studies",
    locale: locale as AppLocale,
  });
}

export default async function CaseStudiesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const studies = listCaseStudies();

  return (
    <PageLayout>
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <p className="sc-craft-eyebrow">Proof layer</p>
          <h1 className="sc-craft-headline">Representative case studies</h1>
          <p className="sc-craft-lead max-w-3xl">
            Synthetic scenarios that show problem framing, tool inputs, and loss types — labeled
            representative, never as verified client savings.
          </p>
        </Container>
      </section>
      <section className="sc-craft-section overflow-x-hidden">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((entry) => (
              <CaseStudyCard
                key={entry.slug}
                entry={entry}
                href={`/case-studies/${entry.slug}`}
              />
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
