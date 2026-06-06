import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminAuthPanel";
import { CustomerSignInFromNextParam } from "@/components/billing/CustomerSignInPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Sign in",
    description: "Sign in to SectorCalc — admin panel or SectorCalc Pro access.",
    path: "/login",
  }),
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <PageLayout>
      <PageHero
        title="Sign in"
        subtitle="Admin sign-in for the lead panel, or Google sign-in below when returning from premium tools or pricing."
      />
      <section className="py-12">
        <Container size="narrow">
          <AdminLoginForm />
          <Suspense fallback={null}>
            <CustomerSignInFromNextParam />
          </Suspense>
        </Container>
      </section>
    </PageLayout>
  );
}
