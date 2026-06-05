import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminAuthPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Admin Girişi",
    description: "SectorCalc admin paneli için e-posta ile giriş.",
    path: "/login",
  }),
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <PageLayout>
      <PageHero
        title="Admin Girişi"
        subtitle="Sign in with an authorized admin account to access the lead management panel."
      />
      <section className="py-12">
        <Container size="narrow">
          <AdminLoginForm />
        </Container>
      </section>
    </PageLayout>
  );
}
