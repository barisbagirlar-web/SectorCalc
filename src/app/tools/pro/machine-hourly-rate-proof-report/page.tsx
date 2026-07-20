// SectorCalc PRO — Machine Hourly Rate Proof Report
// Dedicated page implementing the exact x1.html reference design.
// Overrides [slug] route via Next.js App Router precedence (specific > dynamic).

import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import MachineHourlyRateToolPage from "@/components/MachineHourlyRateToolPage";
import "server-only";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Machine Hourly Rate Proof Report | SectorCalc PRO",
    description:
      "Prove machine hourly rate using straight-line depreciation, maintenance, energy and fully-loaded labor — spread only across productive (non-idle) hours. Quantify the hidden idle-time premium.",
    robots: { index: true, follow: true },
    openGraph: {
      title: "Machine Hourly Rate Proof Report | SectorCalc PRO",
      description:
        "Prove machine hourly rate using straight-line depreciation, maintenance, energy and fully-loaded labor — spread only across productive (non-idle) hours.",
    },
    alternates: {
      canonical: "https://sectorcalc.com/tools/pro/machine-hourly-rate-proof-report",
      languages: {
        en: "https://sectorcalc.com/tools/pro/machine-hourly-rate-proof-report",
        "en-us": "https://sectorcalc.com/tools/pro/machine-hourly-rate-proof-report",
        "en-gb": "https://sectorcalc.com/tools/pro/machine-hourly-rate-proof-report",
        "x-default": "https://sectorcalc.com/tools/pro/machine-hourly-rate-proof-report",
      },
    },
  };
}

export default function MachineHourlyRatePage() {
  return (
    <PageLayout>
      <article>
        <MachineHourlyRateToolPage />
      </article>
    </PageLayout>
  );
}
