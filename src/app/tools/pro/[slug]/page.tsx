// SectorCalc V5.3.1 — PRO Calculator Detail Page
// Root-only route. Renders UniversalIndustrialDecisionForm for any PRO tool.
// No locale prefix. Pure technical English.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { UniversalIndustrialDecisionForm } from "@/sectorcalc/pro-form";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { listProToolSchemaSlugs } from "@/sectorcalc/runtime/pro-schema-loader";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  return listProToolSchemaSlugs().map((slug) => ({ slug }));
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
  const title = `${schema.tool_name} | SectorCalc PRO`;
  const description = `${schema.tool_name} — ${schema.primary_operation.replace(/_/g, " ")}. Risk level: ${schema.risk_level}. Deterministic industrial decision-support calculator.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
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

  return (
    <PageLayout>
      <article aria-label={schema.tool_name} className="sc-v531-shell">
        <UniversalIndustrialDecisionForm
          schema={schema}
          toolKey={slug}
          executeEndpoint="/api/pro-calculator/execute"
          initialProfileMode="engineering"
        />
      </article>
    </PageLayout>
  );
}
