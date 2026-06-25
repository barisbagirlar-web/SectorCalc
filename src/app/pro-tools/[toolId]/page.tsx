/**
 * SectorCalc — Next.js Pro Tool Page
 * Dosya: app/[locale]/pro-tools/[toolId]/page.tsx
 * 
 * Rewrite pipeline çıktısını (output/PRO_XXX.json) okur ve UniversalCalculator'a besler.
 */

import { notFound } from "next/navigation";
import UniversalCalculator from "@/components/calculators/UniversalCalculator";
import fs from "fs";
import path from "path";

// JSON'ları buradan oku (pipeline çıktısı)
const TOOLS_DIR = path.join(process.cwd(), "data", "pro-tools");

function loadTool(toolId: string) {
  const filePath = path.join(TOOLS_DIR, `${toolId}.json`);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function loadAllTools(): string[] {
  if (!fs.existsSync(TOOLS_DIR)) return [];
  return fs
    .readdirSync(TOOLS_DIR)
    .filter(f => f.match(/^PRO_\d+\.json$/))
    .map(f => f.replace(".json", ""));
}

// Static params — tüm araçlar için sayfa üret
export async function generateStaticParams() {
  return loadAllTools().map(toolId => ({ toolId }));
}

// Metadata
export async function generateMetadata({ params }: { params: { toolId: string;  } }) {
  const tool = loadTool(params.toolId);
  if (!tool) return {};
  return {
    title: `${tool.tool_name} | SectorCalc Pro`,
    description: `${tool.category} — Endüstriyel hesaplama aracı. ISO/ASME/VDI referanslı validasyon ve kural motoru.`,
  };
}

// JSON-LD structured data
function buildJsonLd(tool: any) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.tool_name,
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": tool.category,
    "description": `${tool.category} hesaplama aracı. ${(tool.engine_rules?.standards || []).join(", ")} referanslı.`,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
  };
}

export default function ProToolPage({
  params,
}: {
  params: { toolId: string;  };
}) {
  const tool = loadTool(params.toolId);
  if (!tool) notFound();

  const jsonLd = buildJsonLd(tool);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ padding: "32px 16px", maxWidth: 960, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <nav style={{ fontSize: 12, color: "rgba(26,25,21,0.5)", marginBottom: 24 }}>
          <a href={`/tr/pro-tools`} style={{ color: "#BD5D3A" }}>
            Pro Araçlar
          </a>
          {" / "}
          <a
            href={`/tr/industries/${tool.category?.toLowerCase().replace(/\s+/g, "-")}`}
            style={{ color: "#BD5D3A" }}
          >
            {tool.category}
          </a>
          {" / "}
          <span>{tool.tool_name}</span>
        </nav>

        {/* Standartlar şeridi */}
        {tool.engine_rules?.standards?.length > 0 && (
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            marginBottom: 20, alignItems: "center",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(26,25,21,0.4)" }}>
              REFERANS STANDARTLAR:
            </span>
            {tool.engine_rules.standards.map((std: string, i: number) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 700,
                fontFamily: "JetBrains Mono, monospace",
                padding: "2px 8px",
                border: "1px solid rgba(26,25,21,0.20)",
                color: "rgba(26,25,21,0.6)",
              }}>
                {std}
              </span>
            ))}
          </div>
        )}

        {/* Ana hesaplayıcı */}
        <UniversalCalculator
          tool={tool}
          locale={params.locale}
        />

        {/* Alt bilgi */}
        <div style={{
          marginTop: 24, padding: "16px 0",
          borderTop: "1px solid rgba(26,25,21,0.10)",
          fontSize: 11, color: "rgba(26,25,21,0.4)",
          lineHeight: 1.6,
        }}>
          Bu hesaplayıcı{tool.engine_rules?.standards?.length > 0
            ? ` ${tool.engine_rules.standards.join(", ")} `
            : " "}
          referanslı formüller içermektedir. Sonuçlar mühendislik karar desteği amacıyla
          üretilmekte olup saha uygulamalarında yetkili mühendis onayı alınmalıdır.
          SectorCalc {tool.tool_id} — {tool.category}.
        </div>
      </main>
    </>
  );
}
