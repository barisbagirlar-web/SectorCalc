import type { Metadata } from "next";
import { CaseStudiesEditorClient } from "@/components/admin/CaseStudiesEditorClient";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Vaka Çalışması Editörü (Yönetici)",
    description: "SectorCalc vaka çalışmaları (case studies) hazırlama ve çıktı üretme editör paneli.",
    path: "/admin/case-studies",
  }),
  robots: { index: false, follow: false },
};

export default function AdminCaseStudiesPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Yönetici"
        title="Vaka Çalışması Editörü"
        subtitle="Mevcut ve yeni eklenecek saha analizleri için Featured Snippet uyumlu Q&A içerik üretme paneli."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <CaseStudiesEditorClient />
        </Container>
      </section>
    </PageLayout>
  );
}
