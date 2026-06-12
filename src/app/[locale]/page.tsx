import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { RootLocaleAutoRedirect } from "@/components/i18n/RootLocaleAutoRedirect";
import { HomepageHybrid } from "@/components/home/HomepageHybrid";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildOrganizationJsonLd } from "@/lib/semantic/build-organization-schema";
import { buildSoftwareApplicationJsonLd } from "@/lib/seo/schema-mesh";
import { buildWebsiteJsonLd } from "@/lib/semantic/build-website-schema";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

export const revalidate = 3600;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepageHybrid" });

  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/",
    locale: locale as AppLocale,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageLayout>
      <SemanticJsonLd
        data={[buildWebsiteJsonLd(locale), buildOrganizationJsonLd(locale), buildSoftwareApplicationJsonLd(locale)]}
      />
      {locale === "en" ? <RootLocaleAutoRedirect /> : null}
      <HomepageHybrid />
    </PageLayout>
  );
}
