import fs from "fs";
import path from "path";
import { getRevenueToolByFreeSlug, getRevenueToolByPremiumSlug } from "@/lib/features/tools/revenue-tools";

let cachedMergedJson: any[] | null = null;

export function loadMergedProTools() {
  if (!cachedMergedJson) {
    const filePath = path.join(process.cwd(), "data", "pro-tools", "_merged.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    cachedMergedJson = JSON.parse(raw);
  }
  return cachedMergedJson;
}

function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getProToolSchemaBySlug(slug: string, tier: "free" | "premium") {
  const tool = tier === "free" ? getRevenueToolByFreeSlug(slug) : getRevenueToolByPremiumSlug(slug);
  if (!tool) return null;

  const targetTitle = tier === "free" ? tool.freeTitle : tool.paidTitle;
  const merged = loadMergedProTools();
  
  if (!merged) return null;

  let schema = merged.find((s: any) => s.tool_name.toLowerCase() === targetTitle.toLowerCase());
  
  if (!schema) {
    // Fuzzy match
    const normalizedTarget = normalize(targetTitle);
    schema = merged.find((s: any) => {
      const sName = normalize(s.tool_name);
      return sName.includes(normalizedTarget) || normalizedTarget.includes(sName);
    });
  }

  return schema || null;
}
