import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustrialHome } from "@/components/os/IndustrialHome";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("homeDashboard");

  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/os",
    locale: locale as AppLocale,
  });
}

export default async function IndustrialOsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageLayout>
      <IndustrialHome />
    </PageLayout>
  );
}
