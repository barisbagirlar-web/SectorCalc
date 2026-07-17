import type { Metadata } from "next";
import { AdminHealthPanel } from "@/components/admin/AdminHealthPanel";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "System Health Check (Admin)",
    description: "Military-grade integrity verification for all admin system components — titles, routes, API endpoints, Firestore, auth, and navigation.",
    path: "/admin/health-check",
  }),
  robots: { index: false, follow: false },
};

export default function AdminHealthCheckPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="System Health Check"
        subtitle="Military-grade integrity verification for all admin system components. Run full checks to validate titles, routes, API endpoints, Firestore collections, authentication, and navigation links."
      />
      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <AdminHealthPanel />
        </Container>
      </section>
    </PageLayout>
  );
}
