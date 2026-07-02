import { NextResponse } from "next/server";
import { getGeneratedToolSchema } from "@/lib/features/generated-tools/schema-loader";
import { getLocaleTextDirection } from "@/lib/infrastructure/i18n/locale-config";
import { resolveApiPublicLocale } from "@/lib/core/validation/api-public-messages";
import {
  buildBotMdDocument,
  buildBotMdNotFound,
} from "@/lib/core/validation/build-bot-md-document";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await context.params;
  const url = new URL(req.url);
  const locale = resolveApiPublicLocale({
    queryLocale: url.searchParams.get("locale"),
    acceptLanguage: req.headers.get("accept-l_anguage"),
  });

  const schema = getGeneratedToolSchema(slug);
  if (!schema) {
    return new NextResponse(buildBotMdNotFound(slug, locale), {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Language": locale,
        "Content-Direction": getLocaleTextDirection(locale),
      },
    });
  }

  const markdown = buildBotMdDocument({ slug, locale, schema });

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Language": locale,
      "Content-Direction": getLocaleTextDirection(locale),
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
