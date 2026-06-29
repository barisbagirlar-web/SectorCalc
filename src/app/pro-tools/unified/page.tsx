/**
 * Pro Tools Unified Page — Universal Schema v1
 *
 * Uses the UNIVERSAL_TOOLS_LIST to render ALL PRO tools dynamically
 * from their ToolSchema definitions — zero per-tool manual forms.
 */
"use client";

import { useEffect, useMemo } from "react";
import UniversalProToolRenderer from "@/components/universal-pro-tool/UniversalProToolRenderer";
import { ExpertAuthoritySection } from "@/components/content/ExpertAuthoritySection";
import { UNIVERSAL_TOOLS_LIST } from "@/lib/tools/universal-tools-registry";
import type { ToolEntry } from "@/components/universal-pro-tool/UniversalProToolRenderer";

export default function UnifiedProToolsPage() {
  // Load the scoped CSS from static folder
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/static/unified-pro-tools.css";
    link.id = "unified-pro-tools-css";
    document.head.appendChild(link);
    return () => {
      const existing = document.getElementById("unified-pro-tools-css");
      if (existing) existing.remove();
    };
  }, []);

  // Convert all universal tools to ToolEntry format
  const tools: ToolEntry[] = useMemo(() =>
    UNIVERSAL_TOOLS_LIST.map(schema => ({
      key: schema.schemaId,
      schema: schema as any, // Cast to support backward-compatible renderer
    })),
  []);

  return (
    <>
      <UniversalProToolRenderer tools={tools} initialTool={tools[0]?.key} />
      <ExpertAuthoritySection />
    </>
  );
}
