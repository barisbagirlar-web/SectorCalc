import { NextResponse } from "next/server";
import { getAllTools } from "@/lib/features/tools/all-tools-data";

export async function GET() {
  const tools = getAllTools("en");
  
  const sectors = new Set(tools.map(t => t.sector));
  
  const calculators = tools.map(t => ({
    id: t.slug,
    title: t.name,
    sector: t.sector,
    slug: t.slug,
    tags: [t.category, t.sector]
  }));

  return NextResponse.json({
    calculators,
    sectorCount: sectors.size
  });
}
