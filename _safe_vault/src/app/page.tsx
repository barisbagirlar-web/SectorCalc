import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { NewLandingContent } from "@/components/landing/NewLandingContent";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";

  return createPageMetadata({
    title: "SectorCalc — Industrial Engineering Calculators",
    description: "Audit-proof engineering calculations built on VDI, ISO, and DIN standards. Stop guessing. Start calculating.",
    path: "/",
    locale: locale as "en",
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = "en";

  return (
    <PageLayout>
      <SemanticJsonLd data={buildHomeJsonLd(locale)} />
      <NewLandingContent />
    </PageLayout>
  );
}
