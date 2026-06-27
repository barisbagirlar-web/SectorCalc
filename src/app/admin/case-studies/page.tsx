import type { Metadata } from "next";
import { CaseStudiesEditorClient } from "@/components/admin/CaseStudiesEditorClient";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Case Study Editor (Admin)",
    description: "SectorCalc case studies preparation and output generation editor panel.",
    path: "/admin/case-studies",
  }),
  robots: { index: false, follow: false },
};

export default function AdminCaseStudiesPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Case Study Editor"
        subtitle="Panel for generating Featured Snippet-compatible Q&A content for current and upcoming field analyses."
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
