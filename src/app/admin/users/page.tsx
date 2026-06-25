import type { Metadata } from "next";
import { UserManagementClient } from "@/components/admin/UserManagementClient";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Üye Yönetimi (Yönetici)",
    description: "SectorCalc üye yönetimi için yetkilendirilmiş yönetici paneli.",
    path: "/admin/users",
  }),
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Yönetici"
        title="Üye Yönetimi"
        subtitle="Kayıtlı site üyelerini yönetin, şifreleri düzenleyin, kredi bakiyelerini, abonelik durumlarını ayarlayın ve yönetici yetkileri atayın."
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
