export const dynamic = "force-dynamic";
export const revalidate = 3600;

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { LandingPageContent } from "@/components/landing/LandingPageContent";
import { ScrollFade } from "@/components/landing/ScrollFade";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildHomeJsonLd } from "@/lib/features/semantic/build-home-jsonld";
import { createPageMetadata } from "@/lib/infrastructure/metadata";
import "@/styles/landing-page-accessibility.css";
import "@/styles/landing-page-proportion.css";
import "@/styles/landing-page-sections.css";
import "@/styles/landing-page-responsive.css";

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: "Industrial calculators for cost, risk, production and engineering decisions.",
    description:
      "SectorCalc turns industrial operating inputs into decision-ready calculations for cost, risk, downtime, pricing, capacity, quality, energy and investment decisions.",
    path: "/",
    locale: "en",
  });
}

export default function HomePage() {
  return (
    <PageLayout hideFooterCta>
      <SemanticJsonLd data={buildHomeJsonLd("en")} />
      <ScrollFade>
        <LandingPageContent />
      </ScrollFade>
    </PageLayout>
  );
}
