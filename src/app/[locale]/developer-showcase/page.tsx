import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/ui/Container";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildDeveloperShowcaseSchema } from "@/lib/semantic/build-developer-showcase-schema";
import { buildOrganizationJsonLd } from "@/lib/semantic/build-organization-schema";
import { buildWebsiteJsonLd } from "@/lib/semantic/build-website-schema";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { siteUrl } from "@/config/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "developerShowcase" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/developer-showcase",
    locale: locale as AppLocale,
  });
}

export default async function DeveloperShowcasePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "developerShowcase" });

  const jsonLd = [
    buildWebsiteJsonLd(locale),
    buildOrganizationJsonLd(locale),
    buildDeveloperShowcaseSchema(locale),
  ];

  return (
    <PageLayout>
      <SemanticJsonLd data={jsonLd} />
      <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("eyebrow")}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700">{t("intro")}</p>
        </Container>
      </section>

      <section className="py-10">
        <Container className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
            <h2 className="text-lg font-semibold text-slate-900">{t("semantic.title")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{t("semantic.body")}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>{t("semantic.item1")}</li>
              <li>{t("semantic.item2")}</li>
              <li>{t("semantic.item3")}</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">{t("resources.title")}</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={`${siteUrl}/llms.txt`} className="font-medium text-blue-700 hover:underline">
                  llms.txt
                </a>
              </li>
              <li>
                <a href={`${siteUrl}/ai.txt`} className="font-medium text-blue-700 hover:underline">
                  ai.txt
                </a>
              </li>
              <li>
                <Link href="/calculator-library" className="font-medium text-blue-700 hover:underline">
                  {t("resources.library")}
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate-500">{t("resources.note")}</p>
          </article>
        </Container>
      </section>
    </PageLayout>
  );
}
