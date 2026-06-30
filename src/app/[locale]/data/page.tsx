export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import type { AppLocale } from "@/i18n/routing";
import { buildCncBenchmarkDatasetJsonLd } from "@/lib/features/semantic/build-dataset-jsonld";

type PageProps = { params: Promise<{ locale: string }> };

const DATASET_ROW_COUNT = 24;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "seoAuthority" });

  return createPageMetadata({
    title: t("dataPageMetaTitle"),
    description: t("dataPageMetaDescription"),
    path: "/data",
    locale: locale as AppLocale,
  });
}

export default async function DataPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seoAuthority");

  const datasetJsonLd = buildCncBenchmarkDatasetJsonLd({
    name: t("datasetCncName"),
    description: t("datasetCncDescription"),
    locale,
  });

  return (
    <PageLayout>
      <JsonLd data={datasetJsonLd} />
      <section className="bg-white py-16 sm:py-24">
        <Container size="wide">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
              {t("dataPageHeading")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-text-secondary">{t("dataPageLead")}</p>

            <article className="mt-10 rounded-2xl border border-border-subtle p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-text-primary">{t("datasetCncName")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t("datasetCncDescription")}
              </p>
              <p className="mt-2 text-xs text-text-secondary">
                {t("datasetRowsLabel", { count: DATASET_ROW_COUNT })}
              </p>
              <p className="mt-2 text-xs text-text-secondary">{t("datasetLicenseNote")}</p>
              <a
                href="/data/cnc-benchmark-2024.csv"
                download
                className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-deep-navy px-5 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                {t("datasetDownloadLabel")}
              </a>
            </article>
          </div>
        </Container>
      </section>
    </PageLayout>
  );
}
