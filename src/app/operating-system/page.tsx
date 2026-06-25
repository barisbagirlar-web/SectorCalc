import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { OperatingSystemPageContent } from "@/components/operating-system/OperatingSystemPageContent";
import { createPageMetadata } from "@/lib/metadata";

const LOCALE = "en";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Operating System — Tool Factory Pipeline | SectorCalc",
    description:
      "How SectorCalc builds sector tools: ontology, formula contracts, validation gates, Smart Form, calculation summary mapping, human approval, and controlled deploy.",
    path: "/operating-system",
    locale: LOCALE as "en",
  });
}

export default async function OperatingSystemPage() {
  return (
    <PageLayout>
      <OperatingSystemPageContent />
    </PageLayout>
  );
}
