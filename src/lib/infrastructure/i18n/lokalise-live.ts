/**
 * Server-side Lokalise live message fetch (web OTA equivalent).
 * Uses LOKALISE_TOKEN + LOKALISE_PROJECT_ID — not the public OTA SDK token.
 */

import { isSupportedLocale, type SupportedLocale } from "@/lib/infrastructure/i18n/locale-config";
import { isTmsEnabled, isTmsLivePullEnabled } from "@/config/tms";

const LOKALISE_API = "https://api.lokalise.com/api2";
const LIVE_CACHE_TTL_MS = 5 * 60 * 1000;

type LiveCacheEntry = {
  readonly expiresAt: number;
  readonly messages: Record<string, unknown>;
};

const liveCache = new Map<string, LiveCacheEntry>();

function resolveApiToken(): string | null {
  return process.env.LOKALISE_TOKEN?.trim() || null;
}

function resolveProjectId(): string | null {
  return process.env.LOKALISE_PROJECT_ID?.trim() || null;
}

function lokaliseHeaders(token: string): HeadersInit {
  return {
    "X-Api-Token": token,
    "Content-Type": "application/json",
  };
}

async function startFileDownload(
  projectId: string,
  token: string,
  locale: SupportedLocale,
): Promise<string> {
  const response = await fetch(`${LOKALISE_API}/projects/${projectId}/files/download`, {
    method: "POST",
    headers: lokaliseHeaders(token),
    body: JSON.stringify({
      format: "json",
      original_filenames: false,
      bundle_structure: "%LANG_ISO%.%FORMAT%",
      export_empty_as: "skip",
      filter_langs: [locale],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Lokalise download start failed (${response.status})`);
  }

  const payload = (await response.json()) as {
    process?: { process_id?: string };
  };

  const processId = payload.process?.process_id;
  if (!processId) {
    throw new Error("Lokalise download process_id missing");
  }

  return processId;
}

async function waitForBundleUrl(
  projectId: string,
  token: string,
  processId: string,
): Promise<string> {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    const response = await fetch(
      `${LOKALISE_API}/projects/${projectId}/processes/${processId}`,
      {
        headers: lokaliseHeaders(token),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Lokalise process poll failed (${response.status})`);
    }

    const payload = (await response.json()) as {
      process?: {
        status?: string;
        details?: { bundle_url?: string };
      };
    };

    const status = payload.process?.status;
    const bundleUrl = payload.process?.details?.bundle_url;

    if (status === "finished" && bundleUrl) {
      return bundleUrl;
    }

    if (status === "failed") {
      throw new Error("Lokalise download process failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  throw new Error("Lokalise download timed out");
}

async function downloadLocaleJson(
  bundleUrl: string,
  locale: SupportedLocale,
): Promise<Record<string, unknown>> {
  const response = await fetch(bundleUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Lokalise bundle download failed (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const jsonText = await extractLocaleJsonFromZip(buffer, locale);
  return JSON.parse(jsonText) as Record<string, unknown>;
}

export async function extractLocaleJsonFromZip(
  zipBuffer: Buffer,
  locale: SupportedLocale,
): Promise<string> {
  const { spawnSync } = await import("node:child_process");
  const { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");

  const tempDir = mkdtempSync(join(tmpdir(), "sectorcalc-lokalise-"));
  const zipPath = join(tempDir, "bundle.zip");

  try {
    writeFileSync(zipPath, zipBuffer);
    const unzip = spawnSync("unzip", ["-q", zipPath, "-d", tempDir], { encoding: "utf8" });
    if (unzip.status !== 0) {
      throw new Error("Failed to unzip Lokalise bundle (is `unzip` installed?)");
    }

    const candidates = [
      join(tempDir, `${locale}.json`),
      ...readdirSync(tempDir)
        .filter((name) => name === `${locale}.json` || name.endsWith(`/${locale}.json`))
        .map((name) => join(tempDir, name)),
    ];

    for (const filePath of candidates) {
      try {
        return readFileSync(filePath, "utf8");
      } catch {
        // try next candidate
      }
    }

    throw new Error(`Locale file ${locale}.json not found in Lokalise bundle`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

export async function fetchLiveLocaleMessages(
  locale: string,
): Promise<Record<string, unknown> | null> {
  if (!isTmsEnabled() || !isTmsLivePullEnabled()) {
    return null;
  }

  if (!isSupportedLocale(locale)) {
    return null;
  }

  const token = resolveApiToken();
  const projectId = resolveProjectId();
  if (!token || !projectId) {
    return null;
  }

  const cached = liveCache.get(locale);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.messages;
  }

  try {
    const processId = await startFileDownload(projectId, token, locale);
    const bundleUrl = await waitForBundleUrl(projectId, token, processId);
    const messages = await downloadLocaleJson(bundleUrl, locale);

    liveCache.set(locale, {
      messages,
      expiresAt: Date.now() + LIVE_CACHE_TTL_MS,
    });

    return messages;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[i18n] Lokalise live pull skipped for "${locale}": ${message}`);
    return null;
  }
}

export function clearLiveLocaleCache(): void {
  liveCache.clear();
}
