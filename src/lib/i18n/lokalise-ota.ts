/**
 * Lokalise OTA SDK bundle fetch (mobile-style OTA; optional for web).
 * Prefer lokalise-live.ts for Next.js server runtime.
 */

import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-config";
import { isTmsEnabled, resolveLokaliseProjectId, resolveOtaApiToken } from "@/config/tms";

const OTA_API = "https://ota.lokalise.com";
const OTA_APP_VERSION = process.env.LOKALISE_OTA_APP_VERSION?.trim() || "1.0.0";
const OTA_FRAMEWORK = "flutter_sdk";

export async function fetchOtaBundleUrl(
  transVersion = 0,
): Promise<{ url: string; version: number } | null> {
  if (!isTmsEnabled()) {
    return null;
  }

  const projectId = resolveLokaliseProjectId();
  const otaToken = resolveOtaApiToken();
  if (!projectId || !otaToken) {
    return null;
  }

  const params = new URLSearchParams({
    appVersion: OTA_APP_VERSION,
    transVersion: String(transVersion),
  });

  const response = await fetch(
    `${OTA_API}/v3/lokalise/projects/${projectId}/frameworks/${OTA_FRAMEWORK}?${params.toString()}`,
    {
      headers: {
        "x-ota-api-token": otaToken,
      },
      cache: "no-store",
    },
  );

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Lokalise OTA bundle request failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    data?: { url?: string; version?: number };
  };

  if (!payload.data?.url || payload.data.version === undefined) {
    throw new Error("Lokalise OTA bundle response missing url/version");
  }

  return { url: payload.data.url, version: payload.data.version };
}

export async function fetchOtaLocaleMessages(
  locale: string,
): Promise<Record<string, unknown> | null> {
  if (!isSupportedLocale(locale)) {
    return null;
  }

  const bundle = await fetchOtaBundleUrl(0);
  if (!bundle) {
    return null;
  }

  const { extractLocaleJsonFromZip } = await import("@/lib/i18n/lokalise-live");
  const response = await fetch(bundle.url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Lokalise OTA bundle download failed (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const jsonText = await extractLocaleJsonFromZip(buffer, locale as SupportedLocale);
  return JSON.parse(jsonText) as Record<string, unknown>;
}
