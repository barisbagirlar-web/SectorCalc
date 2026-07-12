// SectorCalc V5.3.1 — PRO Calculator Detail Page
// Root-only route. Renders UniversalIndustrialDecisionForm for any PRO tool.
// No locale prefix. Pure technical English.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { UniversalIndustrialDecisionForm } from "@/sectorcalc/pro-form";
import { ProToolSessionWrapper } from "@/sectorcalc/pro-form/ProToolSessionWrapper";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { ACTIVE_PRO_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import { getBarisToolCategory } from "@/sectorcalc/formulas/pro-v531/baris-readiness-data";
import { ProToolAssistedDossier } from "@/components/pro-commerce/ProToolAssistedDossier";
import { ProToolPaywallGate } from "@/components/pro-commerce/ProToolPaywallGate";
import { getPublicToolTitle, getPublicProMetaDescription } from "@/sectorcalc/public/public-tool-copy-adapter";
import { getDisplayCategoryLabel } from "@/sectorcalc/pro-form/display-labels";
import { SemanticJsonLd } from "@/components/semantic/SemanticJsonLd";
import { buildFAQJsonLd, buildBreadcrumbJsonLd } from "@/lib/infrastructure/seo/schema-mesh";
import "server-only";
/* Eager: prevent Next.js from loading this CSS as a lazy preload chunk */
import "@/sectorcalc/pro-form/universal-industrial-decision-form.css";
import "@/sectorcalc/pro-report/pro-report-panel.css";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  return ACTIVE_PRO_TOOL_SLUGS.map((slug) => ({ slug }));
}

interface ProToolRouteParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProToolRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = resolveApprovedToolSchema(slug);

  if (!result.ok) {
    return {};
  }

  const schema = result.schema;
  const category = getDisplayCategoryLabel(schema.category);
  const publicTitle = getPublicToolTitle(schema.tool_key, schema.tool_name);
  const publicDesc = getPublicProMetaDescription(schema.tool_key, schema.tool_name, category);
  const seoTitle = `${publicTitle} | SectorCalc PRO`;

  return {
    title: seoTitle,
    description: publicDesc,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://sectorcalc.com/tools/pro/${slug}`,
    },
    openGraph: {
      title: seoTitle,
      description: publicDesc,
      url: `https://sectorcalc.com/tools/pro/${slug}`,
    },
  };
}

export default async function ProToolDetailPage({
  params,
}: {
  params: Promise<ProToolRouteParams>;
}) {
  const { slug } = await params;

  // Resolve via canonical schema resolver
  const result = resolveApprovedToolSchema(slug);

  if (!result.ok) {
    notFound();
  }

  const schema = result.schema;

  // Identity invariant: route slug must match schema.tool_key
  const identityCheck = assertToolSchemaIdentity({
    routeToolKey: slug,
    schemaToolKey: schema.tool_key,
    schemaToolId: schema.tool_id,
  });

  if (!identityCheck.ok) {
    notFound();
  }

  // BLOCKED_SOURCE_REQUIRED and BLOCKED_RUNTIME_CONTRACT_MISMATCH tools
  // render an assisted dossier CTA instead of the calculator form
  const barisEntry = getBarisToolCategory(slug);
  const isBlockedSource = barisEntry?.category === "BLOCKED_SOURCE_REQUIRED";
  const isBlockedRuntime = barisEntry?.category === "BLOCKED_RUNTIME_CONTRACT_MISMATCH";

  if (isBlockedSource || isBlockedRuntime) {
    return (
      <PageLayout>
        <ProToolAssistedDossier toolKey={slug} toolName={schema.tool_name} />
      </PageLayout>
    );
  }

  // Structured data: FAQPage + BreadcrumbList for rich results
  const faqJsonLd = buildFAQJsonLd([
    {
      question: `How is ${schema.tool_name} calculated?`,
      answer: `${schema.tool_name} uses deterministic, server-side calculation with published engineering formulas and industry standards. All inputs are validated and unit-converted before execution.`,
    },
    {
      question: `What inputs does ${schema.tool_name} require?`,
      answer: `The tool accepts key operational and financial inputs specific to ${schema.tool_name}. Each input includes reference ranges and physical validation bounds.`,
    },
    {
      question: `Can I export the ${schema.tool_name} results?`,
      answer: `Yes. Subscribers can export a full PDF report including input assumptions, calculation results, verdict, risk drivers, and suggested actions.`,
    },
  ]);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "SectorCalc", path: "/" },
    { name: "Pro Tools", path: "/pro-tools" },
    { name: schema.tool_name, path: `/tools/pro/${slug}` },
  ]);
  const toolJsonLd: Record<string, unknown>[] = [faqJsonLd, breadcrumbJsonLd].filter(
    (item): item is Record<string, unknown> => item !== null,
  );

  return (
    <PageLayout>
      <SemanticJsonLd data={toolJsonLd} />
      <article aria-label={schema.tool_name} className="sc-v531-shell">
        <ProToolPaywallGate toolName={slug}>
          <ProToolSessionWrapper
            schema={schema}
            toolKey={slug}
            executeEndpoint="/api/pro-calculator/execute"
            initialProfileMode="engineering"
            presentationMode="PRO_AUDIT"
          />
        </ProToolPaywallGate>
      </article>
    </PageLayout>
  );
}
