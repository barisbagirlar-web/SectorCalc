// SectorCalc V5.3.1 — PRO Calculator Detail Page
// Root-only route. Renders UniversalIndustrialDecisionForm for any PRO tool.
// No locale prefix. Pure technical English.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { resolveApprovedToolSchema } from "@/sectorcalc/runtime/resolve-approved-tool-schema";
import { ProToolSessionWrapper } from "@/sectorcalc/pro-form/ProToolSessionWrapper";
import { toClientRenderableSchema } from "@/sectorcalc/pro-form/to-client-renderable-schema";
import { MachineHourlyRateBespokeForm } from "@/sectorcalc/pro-form/bespoke/MachineHourlyRateBespokeForm";
import { assertToolSchemaIdentity } from "@/sectorcalc/runtime/assert-tool-schema-identity";
import { ACTIVE_PRO_TOOL_SLUGS } from "@/sectorcalc/runtime/active-tool-allowlist";
import { getBarisToolCategory } from "@/sectorcalc/formulas/pro-v531/baris-readiness-data";
import { ProToolAssistedDossier } from "@/components/pro-commerce/ProToolAssistedDossier";
import { ProToolPaywallGate } from "@/components/pro-commerce/ProToolPaywallGate";
import { getPublicToolTitle, getPublicProMetaDescription } from "@/sectorcalc/public/public-tool-copy-adapter";
import { getDisplayCategoryLabel } from "@/sectorcalc/pro-form/display-labels";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildToolPageGraph } from "@/lib/infrastructure/seo/tool-page-graph";
import { getGeneratedToolLastUpdatedIso } from "@/lib/features/generated-tools/resolve-tool-updated-at";
import { SITE } from "@/config/site";
import "server-only";
/* Eager: prevent Next.js from loading this CSS as a lazy preload chunk */
import "@/sectorcalc/pro-form/universal-industrial-decision-form.css";
import "@/sectorcalc/pro-report/pro-report-panel.css";
import "@/styles/pro-report.css";

// Hard-404 architecture (SSOT with /tools/free/[slug]): only allowlisted
// slugs are statically generated; every other slug returns a real HTTP 404
// at the routing layer. `force-dynamic` is intentionally NOT set — it would
// force dynamic rendering and bypass the static 404 enforcement of
// `dynamicParams = false`. Paywall gating runs client-side (ProToolPaywallGate
// is a "use client" component), so request-time server rendering is not needed.
export const dynamicParams = false;

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
  const canonicalUrl = `${SITE.url}/tools/pro/${slug}`;

  return {
    title: seoTitle,
    description: publicDesc,
    robots: { index: true, follow: true },
    openGraph: {
      title: seoTitle,
      description: publicDesc,
      url: canonicalUrl,
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

  const articleAccessibilityProps = { "aria-label": schema.tool_name };

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

  // Bespoke design pilot: a single, isolated visual skin for exactly this one tool,
  // wired to the real schema/formula/report system (see MachineHourlyRateBespokeForm.tsx
  // for the correctness contract). Every other tool below still renders the x1 universal
  // form, completely untouched by this branch.
  if (slug === "machine-hourly-rate-proof-report") {
    return (
      <PageLayout>
        <article {...articleAccessibilityProps}>
          <ProToolPaywallGate toolName={slug}>
            <MachineHourlyRateBespokeForm schema={schema} toolKey={slug} />
          </ProToolPaywallGate>
        </article>
      </PageLayout>
    );
  }

  const category = getDisplayCategoryLabel(schema.category);

  return (
    <PageLayout>
      <article {...articleAccessibilityProps} className="pro-shell">
        <ProToolPaywallGate toolName={slug}>
          <ProToolSessionWrapper
            schema={toClientRenderableSchema(schema)}
            toolKey={slug}
            executeEndpoint="/api/pro-calculator/execute"
            initialProfileMode="engineering"
            presentationMode="PRO_AUDIT"
          />
        </ProToolPaywallGate>
      </article>
      <JsonLd
        data={buildToolPageGraph({
          slug,
          toolName: schema.tool_name,
          sectorName: category,
          tier: "pro",
          description: getPublicProMetaDescription(schema.tool_key, schema.tool_name, category),
          featureList: [],
          faq: [],
          methodology: "ISO 22400-2 + ECMI Cost Model v3.2",
          lastUpdated: getGeneratedToolLastUpdatedIso(slug) ?? undefined,
        })}
      />
    </PageLayout>
  );
}
