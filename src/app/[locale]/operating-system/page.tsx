import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/components/layout/PageLayout";
import { OperatingSystemPageContent } from "@/components/operating-system/OperatingSystemPageContent";
import { createPageMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return createPageMetadata({
    title: "Operating System — Tool Factory Pipeline | SectorCalc",
    description:
      "How SectorCalc builds sector tools: ontology, formula contracts, validation gates, Smart Form, trust trace, human approval, and controlled deploy.",
    path: "/operating-system",
    locale: locale as AppLocale,
  });
}

export default async function OperatingSystemPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PageLayout>
      <OperatingSystemPageContent />
    </PageLayout>
  );
}
