import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PublishedCaseStudyCard } from "@/components/case-studies/PublishedCaseStudyCard";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { listPublishedCaseStudies } from "@/lib/case-studies/published-case-study-locale";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudies" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/case-studies",
    locale: locale as AppLocale,
  });
}

export default async function CaseStudiesIndexPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudies");
  const published = listPublishedCaseStudies(locale);

  return (
    <PageLayout>
      <section className="sc-craft-section sc-craft-section--white sc-craft-section--border">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <p className="sc-craft-eyebrow">{t("eyebrow")}</p>
          <h1 className="sc-craft-headline">{t("publishedTitle")}</h1>
          <p className="sc-craft-lead max-w-3xl">{t("publishedSubtitle")}</p>
        </Container>
      </section>

      <section className="sc-craft-section sc-craft-section--alt overflow-x-hidden">
        <Container size="wide" className="sc-craft-container sc-craft-container--wide min-w-0">
          <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {published.map((study) => (
              <PublishedCaseStudyCard
                key={study.slug}
                study={study}
                locale={locale}
                readTimeLabel={t("readTime", { count: study.readTime })}
              />
            ))}
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
