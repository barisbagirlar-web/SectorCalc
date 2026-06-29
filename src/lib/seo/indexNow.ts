import { SITE } from "@/config/site";

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function resolveHost(): string {
  try {
    return new URL(SITE.url).host;
  } catch {
    return SITE.domain;
  }
}

/** Push URL list to IndexNow (Bing, Yandex, etc.) for aggressive indexing. */
export async function pingIndexNow(urlList: string[]): Promise<{ ok: boolean; status?: number }> {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return { ok: false };
  }

  if (urlList.length === 0) {
    return { ok: false };
  }

  const host = resolveHost();
  const payload: IndexNowPayload = {
    host,
    key,
    keyLocation: `${SITE.url}/${key}.txt`,
    urlList,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return { ok: response.ok, status: response.status };
}

/** Single URL convenience wrapper. */
export async function pingIndexNowUrl(url: string): Promise<{ ok: boolean; status?: number }> {
  return pingIndexNow([url]);
}
