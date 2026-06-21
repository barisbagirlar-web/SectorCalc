/**
 * Over-the-air translation updates from Lokalise (server-side).
 * Falls back to null so callers use messages/*.json from disk.
 */

import { isSupportedLocale, type SupportedLocale } from "@/lib/i18n/locale-config";
import { resolveLokaliseLangIso } from "@/lib/i18n/lokalise-lang-iso";
import {
  isTmsEnabled,
  isTmsLivePullEnabled,
  resolveLokaliseApiToken,
  resolveLokaliseProjectId,
} from "@/config/tms";

const LOKALISE_API = "https://api.lokalise.com/api2";
const CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry = {
  readonly expiresAt: number;
  readonly messages: Record<string, unknown>;
};

const messageCache = new Map<string, CacheEntry>();

function isStaticBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function readCache(locale: string): Record<string, unknown> | null {
  const cached = messageCache.get(locale);
  if (!cached || cached.expiresAt <= Date.now()) {
    return null;
  }
  return cached.messages;
}

function writeCache(locale: string, messages: Record<string, unknown>): void {
  messageCache.set(locale, { messages, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function extractLocaleJsonFromZip(
  zipBuffer: Buffer,
  locale: SupportedLocale,
): Promise<string> {
  const { spawnSync } = await import("node:child_process");
  const { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");

  const langIso = resolveLokaliseLangIso(locale);
  const tempDir = mkdtempSync(join(tmpdir(), "sectorcalc-lokalise-"));
  const zipPath = join(tempDir, "bundle.zip");

  try {
    writeFileSync(zipPath, zipBuffer);
    const unzip = spawnSync("unzip", ["-q", zipPath, "-d", tempDir], { encoding: "utf8" });
    if (unzip.status !== 0) {
      throw new Error("Failed to unzip Lokalise bundle");
    }

    const candidates = [
      join(tempDir, `${locale}.json`),
      join(tempDir, `${langIso}.json`),
      ...readdirSync(tempDir)
        .filter((name) => name.endsWith(".json"))
        .map((name) => join(tempDir, name)),
    ];

    for (const filePath of candidates) {
      try {
        return readFileSync(filePath, "utf8");
      } catch {
        // try next
      }
    }

    throw new Error(`No JSON for locale "${locale}" in Lokalise bundle`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function fetchViaLokaliseApi(locale: SupportedLocale): Promise<Record<string, unknown> | null> {
  const token = resolveLokaliseApiToken();
  const projectId = resolveLokaliseProjectId();
  if (!token || !projectId) {
    return null;
  }

  const langIso = resolveLokaliseLangIso(locale);
  const startResponse = await fetch(`${LOKALISE_API}/projects/${projectId}/files/download`, {
    method: "POST",
    headers: { "X-Api-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify({
      format: "json",
      original_filenames: false,
      bundle_structure: "%LANG_ISO%.%FORMAT%",
      export_empty_as: "skip",
      filter_langs: [langIso],
    }),
    cache: "no-store",
  });

  if (!startResponse.ok) {
    throw new Error(`Lokalise download start failed (${startResponse.status})`);
  }

  const startPayload = (await startResponse.json()) as {
    process?: { process_id?: string };
  };
  const processId = startPayload.process?.process_id;
  if (!processId) {
    throw new Error("Lokalise download process_id missing");
  }

  const deadline = Date.now() + 120_000;
  let bundleUrl: string | null = null;

  while (Date.now() < deadline) {
    const pollResponse = await fetch(`${LOKALISE_API}/projects/${projectId}/processes/${processId}`, {
      headers: { "X-Api-Token": token },
      cache: "no-store",
    });

    if (!pollResponse.ok) {
      throw new Error(`Lokalise process poll failed (${pollResponse.status})`);
    }

    const pollPayload = (await pollResponse.json()) as {
      process?: { status?: string; details?: { bundle_url?: string } };
    };

    if (pollPayload.process?.status === "finished" && pollPayload.process.details?.bundle_url) {
      bundleUrl = pollPayload.process.details.bundle_url;
      break;
    }

    if (pollPayload.process?.status === "failed") {
      throw new Error("Lokalise download process failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  if (!bundleUrl) {
    throw new Error("Lokalise download timed out");
  }

  const bundleResponse = await fetch(bundleUrl, { cache: "no-store" });
  if (!bundleResponse.ok) {
    throw new Error(`Lokalise bundle fetch failed (${bundleResponse.status})`);
  }

  const buffer = Buffer.from(await bundleResponse.arrayBuffer());
  const jsonText = await extractLocaleJsonFromZip(buffer, locale);
  return JSON.parse(jsonText) as Record<string, unknown>;
}

/**
 * Fetch latest translations for a locale from Lokalise (REST live pull).
 * Returns null when TMS is off, credentials are missing, or fetch fails.
 *
 * Uses the REST API (async download + poll) — the correct approach for web.
 * The OTA SDK path (lokalise-ota.ts) was removed because it used flutter_sdk
 * framework which is incompatible with Next.js web apps.
 */
export async function getOTATranslations(
  locale: string,
): Promise<Record<string, unknown> | null> {
  if (isStaticBuildPhase()) {
    return null;
  }

  if (!isTmsEnabled() || !isTmsLivePullEnabled()) {
    return null;
  }

  if (!isSupportedLocale(locale)) {
    return null;
  }

  const cached = readCache(locale);
  if (cached) {
    return cached;
  }

  try {
    const messages = await fetchViaLokaliseApi(locale);
    if (messages) {
      writeCache(locale, messages);
      return messages;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[i18n:ota] Lokalise API pull failed for "${locale}": ${message}`);
  }

  return null;
}

export function clearOtaMessageCache(): void {
  messageCache.clear();
}
