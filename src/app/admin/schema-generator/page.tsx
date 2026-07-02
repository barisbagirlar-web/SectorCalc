import type { Metadata } from "next";
import { SchemaGeneratorClient } from "@/components/admin/SchemaGeneratorClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Schema Generator (Admin)",
    description: "Author premium analyzer schemas from safe formula blocks.",
    path: "/admin/schema-generator",
  }),
  robots: { index: false, follow: false },
};

export default function AdminSchemaGeneratorPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Schema Generator"
        subtitle="Build premium analyzer schemas from safe formula blocks. Draft only - developer review required before production."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <SchemaGeneratorClient />
        </Container>
      </section>
    </PageLayout>
  );
}
