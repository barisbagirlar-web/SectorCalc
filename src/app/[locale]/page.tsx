import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { IndustrialHome } from "@/components/os/IndustrialHome";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("homeDashboard");

  return createPageMetadata({
    title: t("meta.title"),
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
      <IndustrialHome />
    </PageLayout>
  );
}
