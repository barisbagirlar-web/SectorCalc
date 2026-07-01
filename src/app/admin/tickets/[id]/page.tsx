import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { TicketDetailClient } from "@/components/admin/TicketDetailClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    ...createPageMetadata({
      title: `Ticket ${id.slice(0, 8)} (Admin)`,
      description: `Support ticket ${id.slice(0, 8)} detail, replies and status management.`,
      path: `/admin/tickets/${id}`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function AdminTicketDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title={`Ticket #${id.slice(0, 8)}`}
        subtitle="Review ticket details, reply to the customer and update status."
      />
      <section className="bg-off-white py-10 md:py-14">
        <Container size="narrow">
          <AdminSubNav />
          <TicketDetailClient ticketId={id} />
        </Container>
      </section>
    </PageLayout>
  );
}
