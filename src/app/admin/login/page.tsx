import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminAuthPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Admin sign in",
    description: "Authorized admin sign-in for the SectorCalc lead panel.",
    path: "/admin/login",
  }),
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Admin"
        title="Admin sign in"
        subtitle="Sign in with an account that has the admin claim. Access is limited to authorized personnel."
      />
      <section className="py-12">
        <Container size="narrow">
          <AdminLoginForm />
        </Container>
      </section>
    </PageLayout>
  );
}
