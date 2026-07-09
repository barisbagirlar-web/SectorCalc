// SectorCalc V5.3.1 — PRO Calculator Detail Page
// Root-only route. Renders UniversalIndustrialDecisionForm for any PRO tool
// OR ProExecutionFormV2 for PRO V2 slugs.
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
import { isProV2Slug } from "@/sectorcalc/pro-v2/proV2Slugs";
import { WELD_FIELD_CONTRACT, WELD_HIDDEN_FIELDS } from "@/sectorcalc/pro-v2/proWeldFieldContract";
import { ProV2Wrapper } from "@/sectorcalc/pro-v2/ProV2Wrapper";
import "server-only";
/* Eager: prevent Next.js from loading this CSS as a lazy preload chunk */
import "@/sectorcalc/pro-form/universal-industrial-decision-form.css";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return ACTIVE_PRO_TOOL_SLUGS.map((slug) => ({ slug }));
}

interface ProToolRouteParams {
  slug: string;
}

// PRO V2 contract map — extend as more tools are migrated
const PRO_V2_CONTRACTS: Record<string, { groups: typeof WELD_FIELD_CONTRACT.groups; hidden: typeof WELD_HIDDEN_FIELDS }> = {
  "weld-procedure-cost-consumable-estimation-suite": {
    groups: WELD_FIELD_CONTRACT.groups,
    hidden: WELD_HIDDEN_FIELDS,
  },
};

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
    openGraph: {
      title: seoTitle,
      description: publicDesc,
    },
  };
}

export default async function ProToolDetailPage({
  params,
  searchParams,
}: {
  params: Promise<ProToolRouteParams>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const debugRuntime = sp.debugRuntime === "1";

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

  // ── PRO V2 route ──────────────────────────────────────────────
  if (isProV2Slug(slug)) {
    const contract = PRO_V2_CONTRACTS[slug];
    if (!contract) {
      notFound();
    }
    return (
      <PageLayout>
        <article aria-label={schema.tool_name}>
          <ProV2Wrapper
            toolKey={slug}
            toolName={schema.tool_name}
            groups={contract.groups}
            hiddenFields={contract.hidden}
            executeEndpoint="/api/pro-calculator/execute"
            debugRuntime={debugRuntime}
          />
        </article>
      </PageLayout>
    );
  }

  // ── Standard PRO route ────────────────────────────────────────
  return (
    <PageLayout>
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
