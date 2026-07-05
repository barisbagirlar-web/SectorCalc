// SectorCalc V5.4 Core — Free Tool Detail Page
// Only allowlisted Free tools render. All others return 404 (quarantined).
// See: src/sectorcalc/runtime/active-tool-allowlist.ts

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { UniversalIndustrialDecisionForm } from "@/sectorcalc/pro-form";
import { ProToolSessionWrapper } from "@/sectorcalc/pro-form/ProToolSessionWrapper";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { ACTIVE_FREE_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  return ACTIVE_FREE_TOOL_SLUGS.map((slug) => ({ slug }));
}

interface FreeToolRouteParams {
  slug: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = resolveApprovedToolSchema(slug);

  if (!result.ok) {
    return {};
  }

  const schema = result.schema;
  const title = `${schema.tool_name} | SectorCalc FREE`;
  const description = `${schema.tool_name} — ${schema.primary_operation.replace(/_/g, " ")}. Free industrial decision-support calculator.`;

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

export default async function FreeToolDetailPage({
  params,
}: {
  params: Promise<FreeToolRouteParams>;
}) {
  const { slug } = await params;

  // Resolve via canonical schema resolver (allowlist-gated)
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
        <ProToolSessionWrapper
          schema={schema}
          toolKey={slug}
          executeEndpoint="/api/tool-execute"
          initialProfileMode="engineering"
        />
      </article>
    </PageLayout>
  );
}
