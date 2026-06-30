import { INDEXNOW_KEY_WELL_KNOWN_PATH } from "@/config/organization-trust";
import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import {
  buildIndexableFullUrl,
  getIndexableUrlManifest,
  normalizeSiteHost,
  type IndexableUrlPriority,
} from "@/lib/seo/indexable-url-manifest";

const INDEXNOW_LOCALE_SET = new Set<string>(SUPPORTED_LOCALES);

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** IndexNow API limit — stay under 10_000 with margin. */
export const INDEXNOW_MAX_URLS_PER_BATCH = 9_500;

export type IndexNowSubmitMode = "en-tr" | "priority" | "all";

export type IndexNowPayload = {
  readonly host: string;
  readonly key: string;
  readonly keyLocation: string;
  readonly urlList: readonly string[];
};

export type IndexNowBatchResult = {
  readonly ok: boolean;
  readonly batchIndex: number;
  readonly batchCount: number;
  readonly urlCount: number;
  readonly status?: number;
  readonly responseText?: string;
};

export type IndexNowSubmitSummary = {
  readonly ok: boolean;
  readonly host: string;
  readonly keyLocation: string;
  readonly mode: IndexNowSubmitMode;
  readonly totalUrls: number;
  readonly batchCount: number;
  readonly batches: readonly IndexNowBatchResult[];
};

function chunkUrls(urls: readonly string[], size: number): string[][] {
  const chunks: string[][] = [];
  for (let index = 0; index < urls.length; index += size) {
    chunks.push(urls.slice(index, index + size));
  }
  return chunks;
}

export function resolveIndexNowKeyLocation(host: string, key: string): string {
  const normalizedHost = normalizeSiteHost(host);
  return `https://${normalizedHost}/${key}.txt`;
}

export function resolveIndexNowWellKnownKeyLocation(host: string): string {
  const normalizedHost = normalizeSiteHost(host);
  return `https://${normalizedHost}${INDEXNOW_KEY_WELL_KNOWN_PATH}`;
}

export function resolveIndexNowSubmitMode(raw: string | undefined): IndexNowSubmitMode {
  const mode = raw?.trim().toLowerCase();
  if (mode === "all" || mode === "priority" || mode === "en-tr") {
    return mode;
  }
  return "all";
}

function matchesPriority(priority: IndexableUrlPriority, mode: IndexNowSubmitMode): boolean {
  if (mode === "all" || mode === "en-tr") {
    return true;
  }
  return priority === "critical" || priority === "high";
}

function matchesLocale(locale: string, mode: IndexNowSubmitMode): boolean {
  if (mode === "priority") {
    return INDEXNOW_LOCALE_SET.has(locale);
  }
  if (mode === "all") {
    return INDEXNOW_LOCALE_SET.has(locale);
  }
  return locale === "en" || locale === "tr";
}

export function getIndexNowSubmissionUrls(
  host: string,
  mode: IndexNowSubmitMode = "all",
): readonly string[] {
  const normalizedHost = normalizeSiteHost(host);
  const urls = getIndexableUrlManifest()
    .filter((item) => matchesLocale(item.locale, mode) && matchesPriority(item.priority, mode))
    .map((item) => buildIndexableFullUrl(item.path, normalizedHost));

  return [...new Set(urls)];
}

export function buildIndexNowPayload(
  host: string,
  key: string,
  urlList: readonly string[],
): IndexNowPayload {
  const normalizedHost = normalizeSiteHost(host);
  return {
    host: normalizedHost,
    key,
    keyLocation: resolveIndexNowKeyLocation(normalizedHost, key),
    urlList,
  };
}

export async function verifyIndexNowKeyFile(
  keyLocation: string,
  key: string,
): Promise<{ ok: boolean; status?: number }> {
  try {
    const response = await fetch(keyLocation, {
      method: "GET",
      headers: { Accept: "text/plain" },
    });
    if (!response.ok) {
      return { ok: false, status: response.status };
    }
    const body = (await response.text()).trim();
    return { ok: body === key.trim(), status: response.status };
  } catch {
    return { ok: false };
  }
}

export async function submitIndexNowBatch(
  host: string,
  key: string,
  urlList: readonly string[],
): Promise<IndexNowBatchResult> {
  const payload = buildIndexNowPayload(host, key, urlList);

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const responseText = await response.text();
    return {
      ok: response.ok,
      batchIndex: 0,
      batchCount: 1,
      urlCount: urlList.length,
      status: response.status,
      responseText: responseText || undefined,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      batchIndex: 0,
      batchCount: 1,
      urlCount: urlList.length,
      responseText: message,
    };
  }
}

export async function submitIndexNowBatches(
  host: string,
  key: string,
  urlList: readonly string[],
  batchSize = INDEXNOW_MAX_URLS_PER_BATCH,
): Promise<IndexNowSubmitSummary> {
  const normalizedHost = normalizeSiteHost(host);
  const keyLocation = resolveIndexNowKeyLocation(normalizedHost, key);
  const chunks = chunkUrls(urlList, batchSize);
  const batches: IndexNowBatchResult[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index] ?? [];
    const result = await submitIndexNowBatch(normalizedHost, key, chunk);
    batches.push({
      ...result,
      batchIndex: index + 1,
      batchCount: chunks.length,
    });
    if (!result.ok) {
      break;
    }
  }

  return {
    ok: batches.every((batch) => batch.ok),
    host: normalizedHost,
    keyLocation,
    mode: "all",
    totalUrls: urlList.length,
    batchCount: chunks.length,
    batches,
  };
}

export async function submitIndexNowManifest(options?: {
  readonly host?: string;
  readonly key?: string;
  readonly mode?: IndexNowSubmitMode;
  readonly verifyKey?: boolean;
}): Promise<IndexNowSubmitSummary> {
  const key = options?.key?.trim() ?? process.env.INDEXNOW_KEY?.trim() ?? "";
  const host = normalizeSiteHost(
    options?.host ?? process.env.SITE_HOST ?? process.env.NEXT_PUBLIC_SITE_URL ?? "sectorcalc.com",
  );
  const mode = options?.mode ?? resolveIndexNowSubmitMode(process.env.INDEXNOW_MODE);

  if (!key) {
    return {
      ok: false,
      host,
      keyLocation: resolveIndexNowKeyLocation(host, ""),
      mode,
      totalUrls: 0,
      batchCount: 0,
      batches: [],
    };
  }

  const urlList = getIndexNowSubmissionUrls(host, mode);
  const keyLocation = resolveIndexNowKeyLocation(host, key);

  if (options?.verifyKey ?? process.env.INDEXNOW_VERIFY_KEY === "1") {
    const verification = await verifyIndexNowKeyFile(keyLocation, key);
    if (!verification.ok) {
      const wellKnown = resolveIndexNowWellKnownKeyLocation(host);
      const fallback = await verifyIndexNowKeyFile(wellKnown, key);
      if (!fallback.ok) {
        return {
          ok: false,
          host,
          keyLocation,
          mode,
          totalUrls: urlList.length,
          batchCount: 0,
          batches: [
            {
              ok: false,
              batchIndex: 0,
              batchCount: 0,
              urlCount: 0,
              status: verification.status,
              responseText: `IndexNow key not reachable at ${keyLocation} or ${wellKnown}`,
            },
          ],
        };
      }
    }
  }

  const chunks = chunkUrls(urlList, INDEXNOW_MAX_URLS_PER_BATCH);
  const batches: IndexNowBatchResult[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index] ?? [];
    const result = await submitIndexNowBatch(host, key, chunk);
    batches.push({
      ...result,
      batchIndex: index + 1,
      batchCount: chunks.length,
    });
    if (!result.ok) {
      break;
    }
  }

  return {
    ok: batches.length > 0 && batches.every((batch) => batch.ok),
    host,
    keyLocation,
    mode,
    totalUrls: urlList.length,
    batchCount: chunks.length,
    batches,
  };
}
