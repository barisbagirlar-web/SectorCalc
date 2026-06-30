import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { CaseStudiesAdminClient } from "@/components/admin/CaseStudiesAdminClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Case Studies (Admin)",
    description: "Manage published case study content and browser-side authoring drafts.",
    path: "/admin/case-studies",
  }),
  robots: { index: false, follow: false },
};

export default function AdminCaseStudiesPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Case Studies"
        subtitle="Review live success stories and author new drafts. Publishing updates static repo files — no runtime API writes."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <CaseStudiesAdminClient />
        </Container>
      </section>
    </PageLayout>
  );
}
