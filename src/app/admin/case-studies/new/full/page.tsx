import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { CaseStudyAdminForm } from "@/components/admin/CaseStudyAdminForm";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "New case study — Advanced (Admin)",
    description: "Create a Schema.org supported case study draft.",
    path: "/admin/case-studies/new/full",
  }),
  robots: { index: false, follow: false },
};

export default function AdminNewCaseStudyFullPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="New case study (advanced)"
        subtitle="Edit all fields manually. Save, export JSON and publish by adding to repo files."
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
