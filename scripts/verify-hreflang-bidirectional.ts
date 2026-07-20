#!/usr/bin/env tsx
import { SUB_SITEMAPS, type SubSitemapMeta, buildSubSitemapXml, createSitemapLastmodResolver } from "../src/lib/infrastructure/seo/sitemap-index-generator";
import { getSitemapSourceLastModified } from "../src/lib/infrastructure/seo/resolve-sitemap-lastmod";

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

interface HreflangAnnotation {
  canonicalUrl: string;
  alternates: Array<{ locale: string; href: string }>;
}

function parseSitemapHreflangs(xml: string): HreflangAnnotation[] {
  const results: HreflangAnnotation[] = [];
  const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  for (const block of urlBlocks) {
    const body = block[1];
    const locMatch = body.match(/<loc>(.*?)<\/loc>/);
    if (!locMatch) continue;
    const canonicalUrl = normalizeUrl(locMatch[1]);
    const altMatches = [
      ...body.matchAll(
        /<xhtml:link\s+rel="alternate"\s+hreflang="([^"]+)"\s+href="([^"]+)"/g,
      ),
    ];
    const alternates = altMatches.map((m) => ({
      locale: m[1],
      href: normalizeUrl(m[2]),
    }));
    if (alternates.length > 0) {
      results.push({ canonicalUrl, alternates });
    }
  }
  return results;
}

function buildCanonicalUrlSet(annotations: HreflangAnnotation[]): Set<string> {
  const urls = new Set<string>();
  for (const ann of annotations) {
    urls.add(normalizeUrl(ann.canonicalUrl));
  }
  return urls;
}

function main(): void {
  console.log("Hreflang Bidirectional Validation Gate");
  console.log("=".repeat(60));

  const fallback = getSitemapSourceLastModified();
  const caseStudyMap = new Map<string, Date>();
  const resolveLastmod = createSitemapLastmodResolver(caseStudyMap);

  const sitemapXmls = SUB_SITEMAPS.map((sub: SubSitemapMeta) => ({
    filename: sub.filename,
    xml: buildSubSitemapXml(sub.type, resolveLastmod),
  }));

  const allAnnotations: HreflangAnnotation[] = [];
  for (const { xml } of sitemapXmls) {
    allAnnotations.push(...parseSitemapHreflangs(xml));
  }

  console.log(`  Sub-sitemaps: ${sitemapXmls.length}`);
  console.log(`  Annotated URLs: ${allAnnotations.length}`);

  const canonicalSet = buildCanonicalUrlSet(allAnnotations);
  console.log(`  Unique canonicals: ${canonicalSet.size}`);

  const violations: string[] = [];

  for (const ann of allAnnotations) {
    for (const alt of ann.alternates) {
      const normalizedAltHref = normalizeUrl(alt.href);

      if (!canonicalSet.has(normalizedAltHref)) {
        violations.push(
          `[MISSING] ${ann.canonicalUrl} -> hreflang="${alt.locale}" -> ${normalizedAltHref} not in sitemap`,
        );
        continue;
      }

      const targetAnn = allAnnotations.find(
        (a) => normalizeUrl(a.canonicalUrl) === normalizedAltHref,
      );

      if (targetAnn) {
        const reciprocal = targetAnn.alternates.some(
          (ra) => normalizeUrl(ra.href) === normalizeUrl(ann.canonicalUrl),
        );
        if (!reciprocal) {
          violations.push(
            `[ONE-WAY] ${ann.canonicalUrl} -> ${normalizedAltHref} (no reciprocal)`,
          );
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error(`\n[BLOCKED] ${violations.length} hreflang bidirectional violations:\n`);
    for (const v of violations.slice(0, 10)) {
      console.error(`  \u2717 ${v}`);
    }
    console.error("");
    process.exit(1);
  }

  console.log("\n[PASS] Hreflang bidirectional validation:");
  console.log(`  All ${allAnnotations.length} annotations have valid reciprocal links`);
  console.log(`  Zero broken hreflang rings`);
  console.log("");
  process.exit(0);
}

main();
