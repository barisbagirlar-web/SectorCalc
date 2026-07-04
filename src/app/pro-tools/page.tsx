// SectorCalc V5.3.1 — PRO Tools Catalog Page
// Root-only route. Lists all 135 PRO calculators.
// No locale prefix. Pure technical English.

import type { Metadata } from "next";
import Link from "next/link";
import { getAllProToolSchemas, getProSchemaCount } from "@/sectorcalc/runtime/pro-schema-loader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PRO Industrial Calculators | SectorCalc",
  description:
    "Access 135 PRO industrial calculators for structural, manufacturing, energy, quality, logistics, and food service decision support. Deterministic, auditable, server-side execution.",
  robots: { index: true, follow: true },
};

interface CategoryGroup {
  category: string;
  tools: Array<{
    toolKey: string;
    toolName: string;
    toolId: string;
    riskLevel: string;
    primaryOperation: string;
    proofPack: boolean;
  }>;
}

function groupByCategory(): CategoryGroup[] {
  const tools = getAllProToolSchemas();
  const groupMap = new Map<string, CategoryGroup>();

  for (const { toolKey, schema } of tools) {
    const cat = schema.category || "General";
    if (!groupMap.has(cat)) {
      groupMap.set(cat, { category: cat, tools: [] });
    }
    groupMap.get(cat)!.tools.push({
      toolKey,
      toolName: schema.tool_name,
      toolId: schema.tool_id,
      riskLevel: schema.risk_level,
      primaryOperation: schema.primary_operation,
      proofPack: (schema.proof_pack?.enabled ?? false) as boolean,
    });
  }

  return [...groupMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([_, group]) => ({
      ...group,
      tools: group.tools.sort((a, b) => a.toolName.localeCompare(b.toolName)),
    }));
}

export default function ProToolsPage() {
  const count = getProSchemaCount();
  const categories = groupByCategory();

  return (
    <main
      className="sc-v531-shell"
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#F0EEE6",
        minHeight: "100vh",
        color: "#1A1915",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "2rem",
            fontWeight: 700,
            color: "#1A1915",
            marginBottom: "0.5rem",
          }}
        >
          PRO Industrial Calculators
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "rgba(26, 25, 21, 0.7)",
            lineHeight: 1.6,
          }}
        >
          {count} deterministic, auditable calculators across industrial engineering domains.
          Server-side execution. No exact formula exposure. Decision-support only.
        </p>
      </header>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "2rem",
        }}
      >
        {categories.map((cat) => (
          <a
            key={cat.category}
            href={`#category-${encodeURIComponent(cat.category.replace(/\s+/g, "-"))}`}
            style={{
              padding: "0.35rem 0.75rem",
              fontSize: "0.8rem",
              background: "rgba(26, 25, 21, 0.06)",
              borderRadius: "4px",
              color: "#1A1915",
              textDecoration: "none",
              border: "1px solid rgba(26, 25, 21, 0.10)",
              whiteSpace: "nowrap",
            }}
          >
            {cat.category} ({cat.tools.length})
          </a>
        ))}
      </div>

      {categories.map((cat) => (
        <section
          key={cat.category}
          id={`category-${encodeURIComponent(cat.category.replace(/\s+/g, "-"))}`}
          style={{ marginBottom: "2.5rem" }}
        >
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontSize: "1.35rem",
              fontWeight: 600,
              color: "#1A1915",
              marginBottom: "0.75rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid rgba(26, 25, 21, 0.10)",
            }}
          >
            {cat.category}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {cat.tools.map((tool) => (
              <Link
                key={tool.toolKey}
                href={`/tools/pro/${tool.toolKey}`}
                style={{
                  textDecoration: "none",
                  display: "block",
                  padding: "1rem",
                  background: "#FAF9F5",
                  border: "1px solid rgba(26, 25, 21, 0.10)",
                  borderRadius: "6px",
                  color: "#1A1915",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#BD5D3A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(26, 25, 21, 0.10)";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "0.4rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: tool.riskLevel === "CRITICAL" ? "#BD5D3A" : "rgba(26, 25, 21, 0.6)",
                    }}
                  >
                    {tool.toolId} · {tool.riskLevel}
                  </span>
                  {tool.proofPack && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        padding: "0.15rem 0.4rem",
                        background: "rgba(189, 93, 58, 0.1)",
                        borderRadius: "3px",
                        color: "#BD5D3A",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Proof Pack
                    </span>
                  )}
                </div>
                <h3
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1A1915",
                    marginBottom: "0.25rem",
                    lineHeight: 1.4,
                  }}
                >
                  {tool.toolName}
                </h3>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(26, 25, 21, 0.6)",
                    lineHeight: 1.4,
                  }}
                >
                  {tool.primaryOperation.replace(/_/g, " ")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(26, 25, 21, 0.10)",
          fontSize: "0.78rem",
          color: "rgba(26, 25, 21, 0.5)",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        <p>
          SectorCalc PRO calculators provide decision-support screening only.
          Results do not constitute certified engineering, legal, financial, or regulatory advice.
          Always verify critical values against approved source documentation and qualified professional review.
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <Link href="/" style={{ color: "#BD5D3A", textDecoration: "underline" }}>
            SectorCalc Home
          </Link>
        </p>
      </footer>
    </main>
  );
}
