import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { LiveKpiReviewClient } from "@/components/admin/LiveKpiReviewClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Live KPI Review (Admin)",
    description:
      "Aggregate traffic, calculator usage, premium intent, and revenue signals for SectorCalc.",
    path: "/admin/kpi",
  }),
  robots: { index: false, follow: false },
};

export default function AdminLiveKpiPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Live KPI Review"
        subtitle="Traffic, calculator usage, premium intent and revenue signals."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <LiveKpiReviewClient />
        </Container>
      </section>
    </PageLayout>
  );
}
