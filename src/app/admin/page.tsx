import type { Metadata } from "next";
import { SuperAdminDashboard } from "@/components/admin/SuperAdminDashboard";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Super Admin Dashboard",
    description: "Comprehensive admin dashboard with system overview, key metrics, and module access for SectorCalc.",
    path: "/admin",
  }),
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Super Admin Dashboard"
        subtitle="Central command center — system metrics, lead pipeline, user management, support, and content administration."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <SuperAdminDashboard />
        </Container>
      </section>
    </PageLayout>
  );
}
