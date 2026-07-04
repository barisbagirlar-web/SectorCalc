/**
 * Generated tool export name helpers.
 * Maps a slug to the canonical export name used in generated calculator modules.
 */
export function generatedCalculateExport(slug: string): string {
  const camelSlug = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return `${camelSlug}Calculate`;
}

export function generatedInputSchemaExport(slug: string): string {
  const camelSlug = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return `${camelSlug}InputSchema`;
}

export function toSafeVarName(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^(\d)/, "_$1");
}
