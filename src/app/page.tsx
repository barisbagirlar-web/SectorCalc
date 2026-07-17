export const dynamic = "force-dynamic";
export const revalidate = 3600;

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import "@/styles/landing-page-accessibility.css";
import "@/styles/landing-page-proportion.css";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Your next industrial decision is 4 minutes away | SectorCalc",
    description:
      "310 standards-backed calculation models for manufacturing, engineering, finance. ISO, ASME, VDI, DIN references. Decision-ready reports with sensitivity analysis.",
    path: "/",
    locale: "en",
  });
}

export default function HomePage() {
  return (
    <PageLayout hideFooterCta>
      <SemanticJsonLd data={buildHomeJsonLd("en")} />
      <LandingPageContent />
    </PageLayout>
  );
}
