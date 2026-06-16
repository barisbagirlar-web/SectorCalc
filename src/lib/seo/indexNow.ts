import {
  getIndexNowSubmissionUrls,
  submitIndexNowBatches,
  submitIndexNowManifest,
} from "@/lib/seo/indexnow-submit";

export type { IndexNowPayload } from "@/lib/seo/indexnow-submit";

/** Push URL list to IndexNow (Bing, Yandex, etc.) with automatic batching. */
export async function pingIndexNow(urlList: string[]): Promise<{ ok: boolean; status?: number }> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key || urlList.length === 0) {
    return { ok: false };
  }

  const host =
    process.env.SITE_HOST?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    "sectorcalc.com";

  const summary = await submitIndexNowBatches(host, key, urlList);
  const lastBatch = summary.batches.at(-1);
  return { ok: summary.ok, status: lastBatch?.status };
}

/** Single URL convenience wrapper. */
export async function pingIndexNowUrl(url: string): Promise<{ ok: boolean; status?: number }> {
  return pingIndexNow([url]);
}

/** Submit manifest-driven URLs (respects INDEXNOW_MODE, default all six locales). */
export async function pingIndexNowManifest(): Promise<{ ok: boolean; totalUrls: number }> {
  const summary = await submitIndexNowManifest();
  return { ok: summary.ok, totalUrls: summary.totalUrls };
}

export { getIndexNowSubmissionUrls, submitIndexNowManifest };
