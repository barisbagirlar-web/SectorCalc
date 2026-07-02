type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { OperatingSystemPageContent } from "@/components/operating-system/OperatingSystemPageContent";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations({ locale, namespace: "operatingSystemPage" });
  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/operating-system",
    locale: locale as AppLocale,
  });
}

export default async function OperatingSystemPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);

  return (
    <PageLayout>
      <OperatingSystemPageContent />
    </PageLayout>
  );
}
