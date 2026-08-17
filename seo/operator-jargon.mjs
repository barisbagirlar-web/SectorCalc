/** Private operator phrases that must never appear in public production content. */
export const OPERATOR_JARGON = Object.freeze([
  'SEO bait',
  'SEO-bait',
  'built for retrieval',
  'Google should cite',
  'LLMs should cite',
  'How should LLMs cite',
  'query fan-out',
  'queries this page owns',
  'answer-engine optimization',
  'money parity',
  'money-parity',
  'SEO gateway',
  'indexable landing',
  'citation bait',
]);

export const OPERATOR_JARGON_RE = new RegExp(
  OPERATOR_JARGON.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'i',
);

export const PUBLIC_SCAN_GLOBS = Object.freeze([
  'index.html',
  'pricing.html',
  'tools.html',
  'pro.html',
  'account.html',
  'login.html',
  'public/**/*.html',
  'public/**/*.txt',
  'public/**/*.xml',
  'public/**/*.md',
  'public/**/*.json',
]);

export const INTERNAL_ALLOW_PREFIXES = Object.freeze([
  'docs/',
  'scripts/seo/',
  'tests/',
  'data/seo/',
  'seo/',
]);
