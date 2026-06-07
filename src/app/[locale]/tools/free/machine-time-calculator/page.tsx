import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { CncMachineTimeCalculator } from "@/components/tools/pilot/CncMachineTimeCalculator";
import { createPageMetadata } from "@/lib/metadata";
import { getRevenueToolByFreeSlug } from "@/lib/tools/revenue-tools";

const PILOT_FREE_SLUG = "machine-time-calculator";

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const tool = getRevenueToolByFreeSlug(PILOT_FREE_SLUG);
  if (!tool) {
    return {};
  }

  return createPageMetadata({
    title: `${tool.freeTitle} | MarginCore Pilot`,
    description: `${tool.freeValue} Naive machine-time exposure with optional Pro P90 verdict via MarginCore.`,
    path: `/tools/free/${PILOT_FREE_SLUG}`,
  });
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CncMachineTimeCalculatorPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tool = getRevenueToolByFreeSlug(PILOT_FREE_SLUG);
  if (!tool || tool.sector !== "cnc-manufacturing") {
    notFound();
  }

  return <CncMachineTimeCalculator tool={tool} />;
}
