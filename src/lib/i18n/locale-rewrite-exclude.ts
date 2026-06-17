/** Paths that must never be rewritten to /en/* (SEO shards, static assets, etc.). */
export const LOCALE_REWRITE_EXCLUDE =
  "tr(?:/|$)|de(?:/|$)|fr(?:/|$)|es(?:/|$)|ar(?:/|$)|en(?:/|$)|admin(?:/|$)|api(?:/|$)|api-public(?:/|$)|_next(?:/|$)|img(?:/|$)|images(?:/|$)|icons(?:/|$)|sitemap(?:/|$)|.*\\.[^/]+$";
