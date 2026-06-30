import type { Metadata } from "next";
import { UserManagementClient } from "@/components/admin/UserManagementClient";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Member Management (Admin)",
    description: "Authorized admin panel for SectorCalc member management.",
    path: "/admin/users",
  }),
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Member Management"
        subtitle="Manage registered site members, edit passwords, adjust credit balances and subscription statuses, and assign admin privileges."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <UserManagementClient />
        </Container>
      </section>
    </PageLayout>
  );
}
