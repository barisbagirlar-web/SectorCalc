import type { Metadata } from "next";
import { AdminSubNav } from "@/components/admin/AdminSubNav";
import { BenchmarkDataClient } from "@/components/admin/BenchmarkDataClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Benchmark Data (Admin)",
    description: "Beta partner applications, benchmark submissions and premium report feedback.",
    path: "/admin/benchmarks",
  }),
  robots: { index: false, follow: false },
};

export default function AdminBenchmarksPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Benchmark Data"
        subtitle="Beta partner intake, anonymized benchmark submissions and premium report feedback. Read-only v1 — status actions in a future patch."
      />

      <section className="bg-off-white py-10 md:py-14">
        <Container>
          <AdminSubNav />
          <BenchmarkDataClient />
        </Container>
      </section>
    </PageLayout>
  );
}
