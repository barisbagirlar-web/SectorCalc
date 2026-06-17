import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { CaseStudyAdminForm } from "@/components/admin/CaseStudyAdminForm";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "New Case Study (Admin)",
    description: "Create a new case study draft for static publish workflow.",
    path: "/admin/case-studies/new",
  }),
  robots: { index: false, follow: false },
};

export default function AdminNewCaseStudyPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="New case study"
        subtitle="Author English content first. Save exports JSON for commit to data.ts and locale files."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container size="narrow">
          <AdminSubNav />
          <CaseStudyAdminForm mode="create" />
        </Container>
      </section>
    </PageLayout>
  );
}
