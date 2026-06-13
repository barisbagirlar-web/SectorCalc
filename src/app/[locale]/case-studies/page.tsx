import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { isP7First5CaseStudySlug } from "@/lib/case-studies/case-study-p7-first-5";
import {
  listCaseStudies,
  listP7FeaturedCaseStudies,
} from "@/lib/case-studies/case-study-registry";
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
  const t = await getTranslations("caseStudies");
  const featured = listP7FeaturedCaseStudies();
  const more = listCaseStudies().filter((entry) => !isP7First5CaseStudySlug(entry.slug));

  return (
    <PageLayout>
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <p className="sc-craft-eyebrow">{t("eyebrow")}</p>
          <h1 className="sc-craft-headline">{t("title")}</h1>
          <p className="sc-craft-lead max-w-3xl">{t("subtitle")}</p>
        </Container>
      </section>

      <section className="sc-craft-section sc-craft-section--alt overflow-x-hidden">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <h2 className="sc-craft-headline text-lg">{t("featuredTitle")}</h2>
          <p className="mt-2 max-w-3xl text-sm text-body-charcoal">{t("featuredSubtitle")}</p>
          <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((entry) => (
              <CaseStudyCard
                key={entry.slug}
                entry={entry}
                href={`/case-studies/${entry.slug}`}
                featured
              />
            ))}
          </div>
        </Container>
      </section>

      {more.length > 0 ? (
        <section className="sc-craft-section overflow-x-hidden">
          <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
            <h2 className="sc-craft-headline text-lg">{t("moreTitle")}</h2>
            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((entry) => (
                <CaseStudyCard
                  key={entry.slug}
                  entry={entry}
                  href={`/case-studies/${entry.slug}`}
                />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </PageLayout>
  );
}
