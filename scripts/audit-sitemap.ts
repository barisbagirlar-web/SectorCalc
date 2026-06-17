import { SUPPORTED_LOCALES } from "@/lib/i18n/locale-config";
import { SITE_BASE_URL } from "@/lib/seo/global-seo-config";
import { generateSitemapUrlsetXml } from "@/lib/seo/generate-sitemap-xml";
import {
  buildLocaleSitemapUrlRecords,
  countLocaleSitemapUrls,
  getSitemapIndexEntries,
} from "@/lib/seo/locale-sitemap";
import { buildLocalizedUrl, getSitemapManifest } from "@/lib/seo/sitemap-manifest";

const MAX_URLS_PER_SITEMAP = 50_000;
const MAX_SITEMAP_BYTES = 50 * 1024 * 1024;
const MIN_EXPECTED_URLS_PER_LOCALE = 4_000;

type AuditIssue = {
  readonly level: "error" | "warn";
  readonly message: string;
};

const issues: AuditIssue[] = [];

function record(level: AuditIssue["level"], message: string): void {
  issues.push({ level, message });
}

async function auditLocale(locale: (typeof SUPPORTED_LOCALES)[number]): Promise<void> {
  const records = await buildLocaleSitemapUrlRecords(locale);
  const count = records.length;
  const xml = generateSitemapUrlsetXml(records);
  const bytes = Buffer.byteLength(xml, "utf8");

  if (count < MIN_EXPECTED_URLS_PER_LOCALE) {
    record("warn", `${locale}: only ${count} URLs (expected >= ${MIN_EXPECTED_URLS_PER_LOCALE})`);
  }

  if (count > MAX_URLS_PER_SITEMAP) {
    record("error", `${locale}: ${count} URLs exceeds ${MAX_URLS_PER_SITEMAP} limit`);
  }

  if (bytes > MAX_SITEMAP_BYTES) {
    record("error", `${locale}: ${bytes} bytes exceeds 50MB limit`);
  }

  const urlSet = new Set<string>();
  for (const entry of records) {
    if (urlSet.has(entry.url)) {
      record("error", `${locale}: duplicate URL ${entry.url}`);
    }
    urlSet.add(entry.url);

    if (entry.url.includes("/en/") || entry.url.endsWith("/en")) {
      record("error", `${locale}: invalid /en/ prefix in ${entry.url}`);
    }

    if (entry.url.includes("/admin") || entry.url.includes("/api/")) {
      record("error", `${locale}: excluded path in sitemap ${entry.url}`);
    }

    if (!entry.alternates?.length) {
      record("warn", `${locale}: missing hreflang alternates for ${entry.url}`);
      continue;
    }

    const hasXDefault = entry.alternates.some((link) => link.hreflang === "x-default");
    if (!hasXDefault) {
      record("warn", `${locale}: missing x-default hreflang for ${entry.url}`);
    }
  }

  const hub = records.find((entry) => entry.url === buildLocalizedUrl("/free-tools", locale, SITE_BASE_URL));
  if (!hub?.alternates?.length) {
    record("error", `${locale}: /free-tools missing hreflang cluster`);
  }

  console.log(`  ${locale}: ${count} URLs, ${(bytes / 1024).toFixed(1)} KB`);
}

async function main(): Promise<void> {
  console.log("Sitemap audit");
  console.log(`  base: ${SITE_BASE_URL}`);
  console.log(`  manifest paths: ${getSitemapManifest().length}`);

  if (SITE_BASE_URL.includes("web.app")) {
    record("error", "SITE_BASE_URL must not use Firebase default domain (set NEXT_PUBLIC_SITE_URL)");
  }

  if (!SITE_BASE_URL.includes("www.sectorcalc.com")) {
    record("error", `SITE_BASE_URL must use canonical www host (got ${SITE_BASE_URL})`);
  }

  const indexEntries = await getSitemapIndexEntries();
  if (indexEntries.length !== SUPPORTED_LOCALES.length) {
    record(
      "error",
      `index lists ${indexEntries.length} shards, expected ${SUPPORTED_LOCALES.length}`,
    );
  }

  for (const locale of SUPPORTED_LOCALES) {
    await auditLocale(locale);
    const cachedCount = await countLocaleSitemapUrls(locale);
    if (cachedCount === 0) {
      record("error", `${locale}: cached shard is empty`);
    }
  }

  for (const entry of indexEntries) {
    if (!entry.url.startsWith(SITE_BASE_URL)) {
      record("error", `index shard URL must use SITE_BASE_URL: ${entry.url}`);
    }
    if (!entry.url.endsWith(".xml")) {
      record("error", `index shard URL must end with .xml: ${entry.url}`);
    }
  }

  const errors = issues.filter((issue) => issue.level === "error");
  const warnings = issues.filter((issue) => issue.level === "warn");

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of warnings.slice(0, 20)) {
      console.log(`  ⚠ ${warning.message}`);
    }
    if (warnings.length > 20) {
      console.log(`  … and ${warnings.length - 20} more`);
    }
  }

  if (errors.length > 0) {
    console.error("\nErrors:");
    for (const error of errors) {
      console.error(`  ✗ ${error.message}`);
    }
    process.exit(1);
  }

  console.log("\n✓ Sitemap audit passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
