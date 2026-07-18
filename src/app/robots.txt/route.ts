import { generateRobotsTxt } from "@/lib/infrastructure/seo/robots-txt";

export function GET(): Response {
  const body = generateRobotsTxt();
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
