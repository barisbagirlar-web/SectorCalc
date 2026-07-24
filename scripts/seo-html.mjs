import { basename } from 'node:path';
import {
  ORGANIZATION_ID,
  SITE_ORIGIN,
  WEBSITE_ID,
  canonicalUrlForFile,
  pageForFile
} from './seo-registry.mjs';

const DEFAULT_DESCRIPTIONS = Object.freeze({
  'index.html': 'Deterministic industrial engineering calculators for machining, quality, reliability, fabrication and costing. Visible formulas, assumptions, warnings and reproducible audit trails.',
  'tools.html': 'Browse the live SectorCalc industrial engineering calculators for machining, bearings, tolerances, fabrication, lifting, pressure equipment, fasteners and costing.',
  'pro.html': 'SectorCalc Pro industrial calculators with deterministic Decimal calculations, engineering warnings, visible assumptions and A1-A5 audit trails.',
  'pricing.html': 'SectorCalc credit pricing for deterministic industrial engineering calculations and audited reports.',
  'sc008-pro.html': 'Statistical tolerance stack-up calculator with worst-case, RSS and seeded Monte Carlo analysis, predicted Cpk, visible assumptions and reproducible audit evidence.'
});

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&mdash;|&#8212;/g, '—')
    .replace(/&ndash;|&#8211;/g, '–');
}

function stripTags(value) {
  return decodeEntities(value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim());
}

function getTitle(html, file) {
  const raw = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return raw ? stripTags(raw) : `SectorCalc ${file}`;
}

function getDescription(html, file) {
  const match = html.match(/<meta\b[^>]*\bname=["']description["'][^>]*\bcontent=["']([^"']*)["'][^>]*>/i);
  return match?.[1] ? decodeEntities(match[1].trim()) : DEFAULT_DESCRIPTIONS[file] ?? 'Deterministic industrial engineering calculator by SectorCalc.';
}

function ensureDescription(html, description) {
  if (/<meta\b[^>]*\bname=["']description["'][^>]*>/i.test(html)) return html;
  return html.replace('</head>', `<meta name="description" content="${description.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}">\n</head>`);
}

function removeSeoTags(html) {
  return html
    .replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<meta\b[^>]*\bname=["']robots["'][^>]*>\s*/gi, '')
    .replace(/<meta\b[^>]*\bproperty=["']og:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/<meta\b[^>]*\bname=["']twitter:[^"']+["'][^>]*>\s*/gi, '')
    .replace(/<script\b[^>]*\bid=["']sectorcalc-entity-schema["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');
}

function pageName(title) {
  return title.replace(/\s*(?:—|\||-)\s*SectorCalc(?:\s+Pro)?\s*$/i, '').trim();
}

function graphFor(page, canonical, title, description) {
  const pageId = `${canonical}#webpage`;
  const organization = {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'SectorCalc',
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/sectorcalc-logo.png`
  };
  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: 'SectorCalc',
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: 'en'
  };

  if (page.kind === 'tool') {
    const appId = `${canonical}#application`;
    const breadcrumbId = `${canonical}#breadcrumb`;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        website,
        {
          '@type': 'WebPage',
          '@id': pageId,
          url: canonical,
          name: pageName(title),
          description,
          isPartOf: { '@id': WEBSITE_ID },
          mainEntity: { '@id': appId },
          publisher: { '@id': ORGANIZATION_ID },
          breadcrumb: { '@id': breadcrumbId },
          inLanguage: 'en'
        },
        {
          '@type': ['SoftwareApplication', 'WebApplication'],
          '@id': appId,
          url: canonical,
          name: pageName(title),
          description,
          applicationCategory: 'BusinessApplication',
          applicationSubCategory: 'Industrial engineering calculator',
          operatingSystem: 'Any',
          browserRequirements: 'Requires a modern web browser with JavaScript enabled',
          provider: { '@id': ORGANIZATION_ID },
          publisher: { '@id': ORGANIZATION_ID },
          inLanguage: 'en'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'SectorCalc', item: `${SITE_ORIGIN}/` },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_ORIGIN}/tools.html` },
            { '@type': 'ListItem', position: 3, name: pageName(title), item: canonical }
          ]
        }
      ]
    };
  }

  const type = page.kind === 'collection' ? 'CollectionPage' : 'WebPage';
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      {
        '@type': type,
        '@id': pageId,
        url: canonical,
        name: pageName(title),
        description,
        isPartOf: { '@id': WEBSITE_ID },
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'en'
      }
    ]
  };
}

function metadataBlock(page, canonical, title, description) {
  const schema = JSON.stringify(graphFor(page, canonical, title, description)).replace(/</g, '\\u003c');
  const escapedTitle = title.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const escapedDescription = description.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return [
    `<link rel="canonical" href="${canonical}">`,
    '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="SectorCalc">`,
    `<meta property="og:title" content="${escapedTitle}">`,
    `<meta property="og:description" content="${escapedDescription}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapedTitle}">`,
    `<meta name="twitter:description" content="${escapedDescription}">`,
    `<script id="sectorcalc-entity-schema" type="application/ld+json">${schema}</script>`
  ].join('\n');
}

export function seoHtmlPlugin() {
  return {
    name: 'sectorcalc-seo-html',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const file = basename(ctx.filename || ctx.originalUrl || '');
        const page = pageForFile(file);
        if (!page) return html;
        const canonical = canonicalUrlForFile(file);
        const title = getTitle(html, file);
        const description = getDescription(html, file);
        let output = ensureDescription(html, description);
        output = removeSeoTags(output);
        return output.replace('</head>', `${metadataBlock(page, canonical, title, description)}\n</head>`);
      }
    }
  };
}
