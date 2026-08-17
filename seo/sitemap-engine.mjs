import { createHash } from 'node:crypto';
import { SITEMAP_POLICY } from './sitemap-policy.mjs';

export const DEFAULT_SITEMAP_LIMITS = Object.freeze({
  maxUrls: SITEMAP_POLICY.maxUrls,
  maxBytes: SITEMAP_POLICY.maxBytes,
});

export function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function normalizeReliableLastmod(value, serverEpoch = new Date()) {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  const ceiling = new Date(serverEpoch);
  if (!Number.isFinite(ceiling.getTime())) throw new Error('invalid serverEpoch');
  const safe = parsed.getTime() > ceiling.getTime() ? ceiling : parsed;
  return safe.toISOString();
}

export function canonicalEntry(page, rootUrl, serverEpoch) {
  if (!page?.canonicalPath || typeof page.canonicalPath !== 'string') throw new Error('missing canonicalPath');
  if (/[?#]/.test(page.canonicalPath)) throw new Error(`query-or-fragment canonical: ${page.canonicalPath}`);
  if (!page.canonicalPath.startsWith('/')) throw new Error(`non-root canonical: ${page.canonicalPath}`);
  const loc = page.canonicalPath === '/' ? `${rootUrl}/` : `${rootUrl}${page.canonicalPath}`;
  const lastmod = normalizeReliableLastmod(page.lastSignificantChangeAt ?? page.modifiedAt ?? null, serverEpoch);
  return { loc, lastmod };
}

export function renderUrlset(entries) {
  const sorted = [...entries].sort((a, b) => a.loc.localeCompare(b.loc, 'en'));
  const rows = sorted.map(({ loc, lastmod }) => {
    const lm = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : '';
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lm}\n  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>\n`;
}

export function renderSitemapIndex(children) {
  const sorted = [...children].sort((a, b) => a.loc.localeCompare(b.loc, 'en'));
  const rows = sorted.map(({ loc, lastmod }) => {
    const lm = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : '';
    return `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>${lm}\n  </sitemap>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</sitemapindex>\n`;
}

export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export function chunkEntries(entries, limits = DEFAULT_SITEMAP_LIMITS) {
  if (!Array.isArray(entries) || entries.length === 0) throw new Error('EMPTY_SITEMAP');
  if (!limits || !Number.isInteger(limits.maxUrls) || !Number.isInteger(limits.maxBytes) || limits.maxUrls < 1 || limits.maxBytes < 1) {
    throw new Error('INVALID_SITEMAP_LIMITS');
  }
  const sorted = [...entries].sort((a, b) => a.loc.localeCompare(b.loc, 'en'));
  const chunks = [];
  let current = [];
  for (const entry of sorted) {
    const candidate = [...current, entry];
    const candidateXml = renderUrlset(candidate);
    if (candidate.length > limits.maxUrls || Buffer.byteLength(candidateXml, 'utf8') > limits.maxBytes) {
      if (current.length === 0) throw new Error(`single URL exceeds sitemap byte limit: ${entry.loc}`);
      chunks.push(current);
      current = [entry];
    } else {
      current = candidate;
    }
  }
  if (current.length) chunks.push(current);
  return chunks;
}

export function sitemapGroupFor(page) {
  switch (page?.role) {
    case 'calculator':
      return 'calculators';
    case 'guide':
    case 'guide-hub':
      return 'guides';
    case 'glossary':
    case 'glossary-hub':
      return 'glossary';
    case 'topic-hub':
      return 'topics';
    case 'compare':
    case 'compare-hub':
      return 'compare';
    case 'resource':
    case 'article':
    case 'blog-hub':
      return 'resources';
    default:
      return 'trust';
  }
}

export function buildRoleSitemapArtifacts(pages, rootUrl, serverEpoch = new Date()) {
  const groups = new Map();
  for (const page of pages) {
    const group = sitemapGroupFor(page);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(canonicalEntry(page, rootUrl, serverEpoch));
  }
  const files = [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'en'))
    .map(([name, entries]) => {
      const xml = renderUrlset(entries);
      return { name: `sitemaps/${name}.xml`, xml, sha256: sha256(xml), count: entries.length, group: name };
    });
  const indexXml = renderSitemapIndex(
    files.map((file) => ({ loc: `${rootUrl}/${file.name.replace(/^sitemaps\//, 'sitemaps/')}`, lastmod: null })),
  );
  return { index: { name: 'sitemap.xml', xml: indexXml, sha256: sha256(indexXml) }, files };
}

export function buildSitemapArtifacts(entries, rootUrl, limits = DEFAULT_SITEMAP_LIMITS) {
  const unique = new Set(entries.map((e) => e.loc));
  if (unique.size !== entries.length) throw new Error('DUPLICATE_SITEMAP_URL');
  const chunks = chunkEntries(entries, limits);
  if (chunks.length === 1) {
    const xml = renderUrlset(chunks[0]);
    return { index: null, files: [{ name: 'sitemap.xml', xml, sha256: sha256(xml), count: chunks[0].length }] };
  }
  const files = chunks.map((chunk, index) => {
    const name = `sitemap-pages-${String(index + 1).padStart(3, '0')}.xml`;
    const xml = renderUrlset(chunk);
    return { name, xml, sha256: sha256(xml), count: chunk.length };
  });
  const indexXml = renderSitemapIndex(files.map((file) => ({ loc: `${rootUrl}/${file.name}`, lastmod: null })));
  return { index: { name: 'sitemap.xml', xml: indexXml, sha256: sha256(indexXml) }, files };
}

export function renderImageUrlset(pages) {
  if (!Array.isArray(pages) || pages.length === 0) throw new Error('EMPTY_IMAGE_SITEMAP');
  const sorted = [...pages].sort((a, b) => a.loc.localeCompare(b.loc, 'en'));
  const rows = sorted.map(({ loc, images }) => {
    if (!Array.isArray(images) || images.length === 0) throw new Error(`image sitemap page missing images: ${loc}`);
    const imgs = images
      .map((img) => {
        if (!img?.loc) throw new Error(`image sitemap missing image loc under ${loc}`);
        const title = img.title ? `\n      <image:title>${escapeXml(img.title)}</image:title>` : '';
        return `    <image:image>\n      <image:loc>${escapeXml(img.loc)}</image:loc>${title}\n    </image:image>`;
      })
      .join('\n');
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n${imgs}\n  </url>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Image sitemap — real hosted assets only; generated from registry + on-disk OG files -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${rows}\n</urlset>\n`;
}
