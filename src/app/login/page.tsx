export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";

import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminAuthPanel";
import { CustomerSignInFromNextParam } from "@/components/billing/CustomerSignInPanel";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { createPageMetadata } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ admin?: string; next?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  const t = await getTranslations();
  return {
    ...createPageMetadata({
      title: "title",
      description: "subtitle",
      path: "/login",
      locale: locale as "en",
    }),
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params, searchParams }: PageProps) {
  const locale = "en";
  const { admin } = await searchParams;
  

  const t = await getTranslations();
  const isAdminView = admin === "true";

  return (
    <PageLayout>
      <PageHero
        title={isAdminView ? "adminTitle" : "title"}
        subtitle={isAdminView ? "adminSubtitle" : "subtitle"}
      />
      <section className="py-12">
        <Container size="narrow">
          {isAdminView ? (
            <AdminLoginForm />
          ) : (
            <Suspense fallback={null}>
              <CustomerSignInFromNextParam />
            </Suspense>
          )}
        </Container>
      </section>
    </PageLayout>
  );
}
