import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITEMAP_CACHE_CONTROL } from "@/lib/seo/generate-sitemap-xml";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  try {
    const filePath = join(process.cwd(), "public", "sitemap.xml");
    const xml = readFileSync(filePath, "utf8");

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": SITEMAP_CACHE_CONTROL,
      },
    });
  } catch (error) {
    console.error("sitemap.xml static read failed:", error);
    return new Response("Not Found", { status: 404 });
  }
}
