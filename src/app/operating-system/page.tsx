// @ts-nocheck
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { OperatingSystemPageContent } from "@/components/operating-system/OperatingSystemPageContent";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  return createPageMetadata({
    title: "Operating System — Tool Factory Pipeline | SectorCalc",
    description:
      "How SectorCalc builds sector tools: ontology, formula contracts, validation gates, Smart Form, calculation summary mapping, human approval, and controlled deploy.",
    path: "/operating-system",
    locale: locale as "en",
  });
}

export default async function OperatingSystemPage({ params }: PageProps) {
  const locale = "en";
  

  return (
    <PageLayout>
      <OperatingSystemPageContent />
    </PageLayout>
  );
}
