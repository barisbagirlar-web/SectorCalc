import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import { SITE } from "@/config/site";
import {
  getAllLeanCalcParams,
  resolveLeanCalcEntry,
} from "@/lib/features/tools/lean-calc-registry";
import { buildLeanCalcGraph } from "@/lib/infrastructure/seo/lean-schema";
import LeanCalculatorClient from "@/components/calculators/lean/LeanCalculatorClient";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams(): Array<{ concept: string; metric: string }> {
  return getAllLeanCalcParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ concept: string; metric: string }>;
}): Promise<Metadata> {
  const { concept, metric } = await params;
  const entry = resolveLeanCalcEntry(concept, metric);
  if (!entry) {
    return { title: "Not Found" };
  }

  const seoTitle = `${entry.title} | SectorCalc Lean`;
  const canonicalUrl = `${SITE.url}${entry.path}`;

  return {
    title: seoTitle,
    description: entry.description,
    metadataBase: new URL(SITE.url),
    robots: { index: true, follow: true },
    openGraph: {
      title: seoTitle,
      description: entry.description,
      url: canonicalUrl,
      siteName: SITE.siteName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: entry.description,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        "en-us": canonicalUrl,
        "en-gb": canonicalUrl,
        "x-default": canonicalUrl,
      },
    },
  };
}

export default async function LeanCalcPage({
  params,
}: {
  params: Promise<{ concept: string; metric: string }>;
}) {
  const { concept, metric } = await params;
  const entry = resolveLeanCalcEntry(concept, metric);

  if (!entry) {
    notFound();
  }

  const jsonLd = buildLeanCalcGraph({ entry });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LeanCalculatorClient entry={entry} />
    </>
  );
}
