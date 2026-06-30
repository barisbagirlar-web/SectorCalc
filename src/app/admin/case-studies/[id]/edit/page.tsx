import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { CaseStudyAdminForm } from "@/components/admin/CaseStudyAdminForm";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    ...createPageMetadata({
      title: `Edit Case Study ${id} (Admin)`,
      description: "Edit a case study draft or export updates for static publish.",
      path: `/admin/case-studies/${id}/edit`,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditCaseStudyPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Başarı hikayesini düzenle"
        subtitle={`${decodeURIComponent(id)} düzenleniyor. Canlı hikayeler public sayfada ancak repo commit ve deploy sonrası güncellenir.`}
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container size="narrow">
          <AdminSubNav />
          <CaseStudyAdminForm mode="edit" studyId={decodeURIComponent(id)} />
        </Container>
      </section>
    </PageLayout>
  );
}
