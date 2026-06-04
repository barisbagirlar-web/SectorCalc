import type { Metadata } from "next";
import { LeadIntentsClient } from "@/components/admin/LeadIntentsClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Lead Intents (Admin)",
    description: "Authenticated admin panel for SectorCalc lead pipeline.",
    path: "/admin/leads",
  }),
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Lead Intents"
        subtitle="Premium CTA, pricing, export ve sample report kaynaklı lead talepleri. Giriş yapmış admin hesabı gerekir."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <LeadIntentsClient />
        </Container>
      </section>
    </PageLayout>
  );
}
