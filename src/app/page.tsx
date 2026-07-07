export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import { getFreeToolCount } from "@/lib/features/tools/tool-counts";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  if (locale !== "en") notFound();

  return createPageMetadata({
    title: "Industrial Calculators for Cost, Quality, Engineering Risk and Production Decisions",
    description: "SectorCalc helps engineers, technicians, production teams, workshops and managers calculate cost, risk, downtime, FMEA RPN, OEE, quotes, energy loss and engineering diagnostics with review-ready decision reports.",
    path: "/",
    locale: "en",
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = "en";
  if (locale !== "en") notFound();

  const freeCount = getFreeToolCount();

  return (
    <PageLayout hideFooterCta={true}>
      <SemanticJsonLd data={buildHomeJsonLd(locale)} />
      <LandingPageContent freeCount={freeCount} />
    </PageLayout>
  );
}
