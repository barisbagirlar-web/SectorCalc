/**
 * Shared Lokalise CLI helpers for i18n push/pull scripts.
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const MESSAGES_DIR_NAME = "messages";
export const TMS_LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

export const LOKALISE_LANG_ISO_MAP = { fr: "fr_FR" };
export const LOKALISE_LANG_ISO_REVERSE = { fr_FR: "fr" };

export function resolveLokaliseLangIso(locale) {
  return LOKALISE_LANG_ISO_MAP[locale] ?? locale;
}

/** @param {string} root */
export function resolveMessagesDir(root) {
  return join(root, MESSAGES_DIR_NAME);
}

/** @param {string} root */
export function loadLocalEnv(root) {
  for (const filePath of [join(root, ".env.local"), join(root, ".env")]) {
    if (!existsSync(filePath)) continue;
    for (const line of readFileSync(filePath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const sep = trimmed.indexOf("=");
      if (sep === -1) continue;
      const key = trimmed.slice(0, sep).trim();
      let value = trimmed.slice(sep + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
}

export function resolveLokaliseCredentials(root) {
  loadLocalEnv(root);
  return {
    token: process.env.LOKALISE_TOKEN?.trim(),
    projectId: process.env.LOKALISE_PROJECT_ID?.trim(),
  };
}

export function resolveLokaliseCliPath(root = process.cwd()) {
  for (const candidate of [process.env.LOKALISE_CLI_PATH?.trim(), join(root, "bin", "lokalise2"), "lokalise2"]) {
    if (!candidate) continue;
    if (candidate === "lokalise2") {
      const probe = spawnSync("lokalise2", ["--version"], { encoding: "utf8" });
      if (!probe.error && probe.status === 0) return "lokalise2";
      continue;
    }
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

export function assertLokaliseCli(root = process.cwd()) {
  if (!resolveLokaliseCliPath(root)) {
    console.error("❌ lokalise2 not found. Run: npm run i18n:setup");
    process.exit(1);
  }
}

export function getLokaliseCliPath(root = process.cwd()) {
  const cliPath = resolveLokaliseCliPath(root);
  if (!cliPath) {
    console.error("❌ lokalise2 not found. Run: npm run i18n:setup");
    process.exit(1);
  }
  return cliPath;
}

export function runLokaliseCommand({ root, args, label }) {
  const { token, projectId } = resolveLokaliseCredentials(root);
  if (!token || !projectId) {
    console.error("❌ Missing LOKALISE_TOKEN or LOKALISE_PROJECT_ID in .env.local");
    process.exit(1);
  }
  if (label) console.log(label);
  const result = spawnSync(getLokaliseCliPath(root), ["--token", token, "--project-id", projectId, ...args], {
    stdio: "inherit",
    cwd: root,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

export async function ensureLokaliseProjectLanguages(root) {
  const { token, projectId } = resolveLokaliseCredentials(root);
  const projectResponse = await fetch(`https://api.lokalise.com/api2/projects/${projectId}`, {
    headers: { "X-Api-Token": token },
  });
  if (!projectResponse.ok) throw new Error(`Lokalise project read failed (${projectResponse.status})`);
  const projectPayload = await projectResponse.json();
  const existing = new Set(
    (projectPayload.project?.statistics?.languages ?? []).map((l) => l.language_iso).filter(Boolean),
  );
  const missing = TMS_LOCALES.map(resolveLokaliseLangIso).filter((iso) => !existing.has(iso));
  if (missing.length === 0) return;
  console.log(`🌐 Adding Lokalise languages: ${missing.join(", ")}`);
  const addResponse = await fetch(`https://api.lokalise.com/api2/projects/${projectId}/languages`, {
    method: "POST",
    headers: { "X-Api-Token": token, "Content-Type": "application/json" },
    body: JSON.stringify({ languages: missing.map((lang_iso) => ({ lang_iso })) }),
  });
  if (!addResponse.ok) throw new Error(`Add languages failed (${addResponse.status})`);
}

export function listTmsLocaleFiles(messagesDir) {
  return readdirSync(messagesDir)
    .filter((n) => n.endsWith(".json") && n !== "pseudo.json")
    .map((n) => n.replace(/\.json$/, ""))
    .filter((l) => TMS_LOCALES.includes(l))
    .sort((a, b) => (a === "en" ? -1 : b === "en" ? 1 : a.localeCompare(b)));
}
