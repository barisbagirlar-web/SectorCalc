import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { RootLocaleAutoRedirect } from "@/components/i18n/RootLocaleAutoRedirect";
import { HomepageHybrid } from "@/components/home/HomepageHybrid";
import { getHomepageSectorAreaCount } from "@/lib/home/homepage-stats";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("homepageHybrid");
  const sectorCount = getHomepageSectorAreaCount();

  return createPageMetadata({
    title: t("meta.title", { sectorCount }),
    description: t("meta.description"),
    path: "/",
  });
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageLayout>
      {locale === "en" ? <RootLocaleAutoRedirect /> : null}
      <HomepageHybrid />
    </PageLayout>
  );
}
