/**
 * IndexNow key verification — serves `/{INDEXNOW_KEY}.txt` via next.config rewrite.
 * Configure INDEXNOW_KEY in hosting env (Firebase). Local dev may use public/{key}.txt.
 */

export function GET(): Response {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(`${key}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
