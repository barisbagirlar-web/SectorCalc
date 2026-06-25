import { generatedTools } from "@/tools/generated/index";

export const PRO_TOOLS_DATA: Record<string, any> = {};

for (const tool of generatedTools) {
  // We want the slug to be the paidSlug (or freeSlug)
  const slug = tool.paidSlug || tool.freeSlug;
  PRO_TOOLS_DATA[tool.id] = {
    tool_id: slug,
    tool_name: tool.toolName,
    category: tool.sector || "Endüstriyel",
  };
}
