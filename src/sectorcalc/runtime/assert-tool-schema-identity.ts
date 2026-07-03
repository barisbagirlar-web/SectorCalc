/**
 * assert-tool-schema-identity.ts — V5.3.1 Schema Identity Invariant
 *
 * Central identity assertion that prevents cross-tool schema contamination.
 * Called at every entry point where a schema enters the runtime:
 *   - Route/page resolve
 *   - Execute API
 *   - Form initialization
 *
 * Any mismatch blocks render/execution. No silent repair.
 */

export interface ToolSchemaIdentityCheckInput {
  routeToolKey: string;
  requestToolKey?: string | null;
  schemaToolKey: string;
  schemaToolId: string;
  metadataToolKey?: string | null;
}

export interface ToolSchemaIdentityCheckResult {
  ok: boolean;
  reason: string | null;
}

export function assertToolSchemaIdentity(
  input: ToolSchemaIdentityCheckInput,
): ToolSchemaIdentityCheckResult {
  const routeToolKey = input.routeToolKey.trim();
  const schemaToolKey = input.schemaToolKey.trim();
  const requestToolKey = input.requestToolKey?.trim() ?? routeToolKey;
  const metadataToolKey = input.metadataToolKey?.trim() ?? schemaToolKey;

  if (!routeToolKey || !schemaToolKey || !requestToolKey || !metadataToolKey) {
    return { ok: false, reason: "Missing tool identity field" };
  }

  if (routeToolKey !== schemaToolKey) {
    return {
      ok: false,
      reason: `Route tool key does not match schema tool key: ${routeToolKey} !== ${schemaToolKey}`,
    };
  }

  if (requestToolKey !== schemaToolKey) {
    return {
      ok: false,
      reason: `Request tool key does not match schema tool key: ${requestToolKey} !== ${schemaToolKey}`,
    };
  }

  if (metadataToolKey !== schemaToolKey) {
    return {
      ok: false,
      reason: `Metadata tool key does not match schema tool key: ${metadataToolKey} !== ${schemaToolKey}`,
    };
  }

  return { ok: true, reason: null };
}

/**
 * Frozen copy guard: returns a frozen clone of the schema so no downstream
 * code can mutate the shared cache copy.
 */
export function freezeSchemaGuard<T extends object>(schema: T): T {
  return Object.freeze(JSON.parse(JSON.stringify(schema)));
}
