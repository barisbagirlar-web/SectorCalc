export type SchemaNode = Record<string, unknown>;

function flattenText(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

export function collectSchemaNodes(value: unknown, out: SchemaNode[] = []): SchemaNode[] {
  if (Array.isArray(value)) {
    for (const item of value) collectSchemaNodes(item, out);
    return out;
  }
  if (!value || typeof value !== 'object') return out;
  const node = value as SchemaNode;
  out.push(node);
  for (const child of Object.values(node)) collectSchemaNodes(child, out);
  return out;
}

export function assertVisibleSchemaClaims(html: string, schema: unknown): void {
  const visible = flattenText(html);
  for (const node of collectSchemaNodes(schema)) {
    for (const key of ['name', 'description'] as const) {
      const claim = node[key];
      if (typeof claim !== 'string') continue;
      const normalized = claim.replace(/\s+/g, ' ').trim().toLowerCase();
      if (normalized.length >= 12 && !visible.includes(normalized)) {
        throw new Error(`INVISIBLE_SCHEMA_CLAIM ${key}=${claim}`);
      }
    }
  }
}

export function assertSingleOrganization(schemaBlocks: unknown[], canonicalOrganizationId: string): void {
  const organizations = schemaBlocks.flatMap((block) => collectSchemaNodes(block)).filter((node) => {
    const type = node['@type'];
    return type === 'Organization' || (Array.isArray(type) && type.includes('Organization'));
  });
  const ids = organizations.map((node) => node['@id']).filter((id): id is string => typeof id === 'string');
  const rootIds = ids.filter((id) => id === canonicalOrganizationId);
  if (rootIds.length !== 1) throw new Error(`ORGANIZATION_ROOT_COUNT expected=1 actual=${rootIds.length}`);
  const foreignRoots = new Set(ids.filter((id) => id.endsWith('/#organization') && id !== canonicalOrganizationId));
  if (foreignRoots.size) throw new Error(`ORGANIZATION_ROOT_DRIFT ${[...foreignRoots].join(',')}`);
}

export function validateBreadcrumbOrder(items: Array<{ position?: number; item?: string }>): void {
  if (items.length === 0) return;
  items.forEach((item, index) => {
    if (item.position !== index + 1) throw new Error(`BREADCRUMB_POSITION expected=${index + 1} actual=${item.position}`);
    if (!item.item || !item.item.startsWith('https://sectorcalc.com')) throw new Error(`BREADCRUMB_CANONICAL_INVALID ${item.item ?? ''}`);
  });
}
