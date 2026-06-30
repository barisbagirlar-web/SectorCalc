import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { SimpleCaseStudyForm } from "@/components/admin/SimpleCaseStudyForm";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Yeni Başarı Hikayesi (Admin)",
    description: "Schema.org destekli başarı hikayesi taslağı oluşturun.",
    path: "/admin/case-studies/new",
  }),
  robots: { index: false, follow: false },
};

export default function AdminNewCaseStudyPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Yeni başarı hikayesi"
        subtitle="Hikayeni tek metin kutusuna yapıştır; AI alanları otomatik doldursun."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container size="narrow">
          <AdminSubNav />
          <SimpleCaseStudyForm />
        </Container>
      </section>
    </PageLayout>
  );
}
