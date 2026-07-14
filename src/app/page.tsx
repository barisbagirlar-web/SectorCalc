export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = "en";
  if (locale !== "en") notFound();
  return createPageMetadata({
    title: "Industrial calculators and decision-ready engineering reports.",
    description: "Turn operating data into auditable calculations, sensitivity analysis, and decision-ready reports for manufacturing, maintenance, pricing, quality, energy, and investment.",
    path: "/",
    locale: "en",
  });
}

export default async function HomePage() {
  const locale = "en";
  if (locale !== "en") notFound();
  return (
    <PageLayout>
      <SemanticJsonLd data={buildHomeJsonLd(locale)} />
      <LandingPageContent />
    </PageLayout>
  );
}
