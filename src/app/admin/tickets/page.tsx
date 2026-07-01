import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { TicketListClient } from "@/components/admin/TicketListClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Support Tickets (Admin)",
    description: "Manage customer support tickets — view, filter, reply and update status.",
    path: "/admin/tickets",
  }),
  robots: { index: false, follow: false },
};

export default function AdminTicketsPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Support Tickets"
        subtitle="View and manage customer support requests. Filter by status, priority or search by subject and email."
      />
      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <TicketListClient />
        </Container>
      </section>
    </PageLayout>
  );
}
