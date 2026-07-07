export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  if (locale !== "en") notFound();
  return createPageMetadata({
    title: "Industrial calculators for cost, risk, downtime, and production decisions.",
    description: "SectorCalc helps industrial teams calculate cost, risk, downtime, pricing, capacity, and engineering decisions before mistakes become expensive.",
    path: "/",
    locale: "en",
  });
}

export default async function HomePage({ params }: PageProps) {
  const locale = "en";
  if (locale !== "en") notFound();
  return (
    <PageLayout hideFooterCta={true}>
      <SemanticJsonLd data={buildHomeJsonLd(locale)} />
      <LandingPageContent />
    </PageLayout>
  );
}
