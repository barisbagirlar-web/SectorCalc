type AppLocale = "en";
export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "@/lib/i18n-stub";
import { PageLayout } from "@/components/layout/PageLayout";
import { PricingPageContent } from "@/components/pricing/PricingPageContent";
import { PricingPageTracker } from "@/components/campaign/PricingPageTracker";
import { createPageMetadata } from "@/lib/infrastructure/metadata";

export const revalidate = 3600;

type PageProps = { params: Promise<{  }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = "en";
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "pricing_v2" });

  return createPageMetadata({
    title: "Pricing for Sector Calculators and Decision Reports | SectorCalc",
    description: "Free sector checks, premium decision reports, sector packs, and Pro workspace. Pay only for what you calculate.",
    path: "/pricing",
    locale: locale as AppLocale,
  });
}

function PricingSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading pricing"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem 1.5rem",
      }}
    >
      <div
        style={{
          height: "2rem",
          width: "25%",
          background: "#E0DDD4",
          borderRadius: "6px",
          marginBottom: "0.75rem",
        }}
        className="skeleton-pulse"
      />
      <div
        style={{
          height: "1rem",
          width: "45%",
          background: "#E0DDD4",
          borderRadius: "4px",
          marginBottom: "2.5rem",
        }}
        className="skeleton-pulse"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "350px",
              background: "#F0EEE6",
              borderRadius: "12px",
              border: "1px solid #E0DDD4",
            }}
            className="skeleton-pulse"
          />
        ))}
      </div>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .skeleton-pulse {
          animation: skeletonPulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default async function PricingPage({ params }: PageProps) {
  const locale = "en";
  setRequestLocale(locale);

  return (
    <PageLayout>
      <div className="public-demo-page">
        <Suspense fallback={null}>
          <PricingPageTracker />
        </Suspense>
        <Suspense fallback={<PricingSkeleton />}>
          <PricingPageContent />
        </Suspense>
      </div>
    </PageLayout>
  );
}
