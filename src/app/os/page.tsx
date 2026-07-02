export const dynamic = "force-dynamic";
import { getLocale, getTranslations } from "@/lib/i18n-stub";

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustrialHome } from "@/components/os/IndustrialHome";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations("homepageHybrid");

  return createPageMetadata({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/os",
    locale: locale as "en",
  });
}

export default async function IndustrialOsPage({ params }: PageProps) {
  const locale = "en";
  

  return (
    <PageLayout>
      <IndustrialHome />
    </PageLayout>
  );
}
