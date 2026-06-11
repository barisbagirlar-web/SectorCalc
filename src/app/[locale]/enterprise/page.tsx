import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnterprisePageContent } from "@/components/enterprise/EnterprisePageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-static";
export const revalidate = 3600;

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enterprise" });
  return createPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/enterprise",
    locale: locale as AppLocale,
  });
}

export default async function EnterprisePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <EnterprisePageContent />;
}
