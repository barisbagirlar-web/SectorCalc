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
 subtitle="Lead requests from premium CTAs, pricing, export flows and sample reports. Authorized admin sign-in required."
 />

 <section className="bg-off-white py-10 md:py-14">
 <Container>
 <LeadIntentsClient />
 </Container>
 </section>
 </PageLayout>
 );
}
