import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { UniversalIndustrialDecisionForm } from "@/sectorcalc/pro-form";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { listFreeToolSchemaSlugs } from "@/sectorcalc/runtime/free-schema-loader";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  return listFreeToolSchemaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = resolveApprovedToolSchema(slug);
  if (!result.ok) return {};
  return {
    title: result.schema.tool_name + " | SectorCalc Free Tools",
    description: result.schema.tool_name + " — " + result.schema.primary_operation.replace(/_/g, " ") + ". Risk level: " + result.schema.risk_level + ".",
  };
}

export default async function FreeToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = resolveApprovedToolSchema(slug);
  if (!result.ok) notFound();
  const schema = result.schema;
  const identityCheck = assertToolSchemaIdentity({ routeToolKey: slug, schemaToolKey: schema.tool_key, schemaToolId: schema.tool_id });
  if (!identityCheck.ok) notFound();
  return (
    <PageLayout>
      <article aria-label={schema.tool_name} className="sc-v531-shell">
        <UniversalIndustrialDecisionForm schema={schema} toolKey={slug} executeEndpoint="/api/tool-execute" initialProfileMode="engineering" accessTier="FREE" />
      </article>
    </PageLayout>
  );
}
