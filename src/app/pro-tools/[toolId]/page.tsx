import { notFound } from "next/navigation";
import ProToolClientWrapper from "@/components/calculators/ProToolClientWrapper";
import { PRO_TOOLS_MAP } from "@/lib/tools/pro-tools-registry";
import "@/styles/pro-tool-form.css";

function loadTool(toolId: string) {
  return PRO_TOOLS_MAP[toolId] || null;
}

function loadAllTools(): string[] {
  return Object.keys(PRO_TOOLS_MAP);
}

export async function generateStaticParams() {
  return loadAllTools().map(toolId => ({ toolId }));
}

export async function generateMetadata({ params }: { params: Promise<{ toolId: string; locale: string }> }) {
  const { toolId } = await params;
  const tool = loadTool(toolId);
  if (!tool) return {};
  return {
    title: `${tool.tool_name} | SectorCalc Pro`,
    description: `${tool.category} — Industrial calculation tool. ISO/ASME/VDI referenced validation and rule engine.`,
  };
}

function buildJsonLd(tool: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.tool_name,
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": tool.category,
    "description": `${tool.category} calculation tool. ${(tool.engine_rules?.standards || []).join(", ")} referenced.`,
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };
}

export default async function ProToolPage({
  params,
}: {
  params: Promise<{ toolId: string; locale: string }>;
}) {
  const { toolId, locale } = await params;
  const tool = loadTool(toolId);
  if (!tool) notFound();

  const jsonLd = buildJsonLd(tool);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ background: "#E8E6DE", minHeight: "100vh", color: "#1A1915", fontFamily: "Inter, system-ui, sans-serif" }}>
        <main style={{ padding: "28px 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
          <ProToolClientWrapper tool={tool} locale={locale} />
        </main>
      </div>
    </>
  );
}
