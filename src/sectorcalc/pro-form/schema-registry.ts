import "server-only";

import { createHash } from "node:crypto";

import type { SuperV4Schema } from "./contract-types";

function canonicalizeJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(canonicalizeJson);
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, nestedValue]) => nestedValue !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nestedValue]) => [key, canonicalizeJson(nestedValue)]),
    );
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    throw new TypeError("Schema hashing rejects NaN and infinite numeric values.");
  }
  return value;
}

export interface SchemaRecord {
  tool_id: string;
  tool_key: string;
  schema_version: string;
  schema_hash: string;
  approval_status: "DRAFT" | "ACTIVE" | "DEPRECATED" | "REJECTED";
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  public_schema_json: SuperV4Schema;
}

export interface SchemaRegistryOptions {
  /** In-memory cache TTL in ms. Default 300000 (5 min). */
  cacheTtlMs?: number;
}

/**
 * Schema registry — loads approved schemas by tool_id + schema_version.
 * In production this reads from PostgreSQL jsonb or equivalent versioned store.
 * Current implementation: in-memory registry with stub schema loading.
 */
export class SchemaRegistry {
  private cache = new Map<string, { record: SchemaRecord; expiresAt: number }>();
  private options: Required<SchemaRegistryOptions>;

  constructor(options: SchemaRegistryOptions = {}) {
    this.options = {
      cacheTtlMs: options.cacheTtlMs ?? 300000,
    };
  }

  private cacheKey(toolId: string, schemaVersion: string): string {
    return `${toolId}::${schemaVersion}`;
  }

  /**
   * Register a schema in the registry.
   * Called during offline schema generation / CI pipeline.
   */
  register(record: SchemaRecord): void {
    const key = this.cacheKey(record.tool_id, record.schema_version);
    this.cache.set(key, {
      record,
      expiresAt: Date.now() + this.options.cacheTtlMs,
    });
  }

  /**
   * Fetch an approved active schema.
   * Returns null if not found or not ACTIVE.
   */
  fetchActive(toolId: string, schemaVersion: string): SchemaRecord | null {
    const key = this.cacheKey(toolId, schemaVersion);
    const entry = this.cache.get(key);

    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    if (entry.record.approval_status !== "ACTIVE") return null;

    return entry.record;
  }

  /** Fetch any schema regardless of approval status (admin only). */
  fetchAny(toolId: string, schemaVersion: string): SchemaRecord | null {
    const key = this.cacheKey(toolId, schemaVersion);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.record;
  }

  /** Compute a deterministic schema hash from JSON string. */
  static computeSchemaHash(schema: SuperV4Schema): string {
    const canonicalJson = JSON.stringify(canonicalizeJson(schema));
    return `sha256:${createHash("sha256").update(canonicalJson, "utf8").digest("hex")}`;
  }

  /** Clear entire cache. */
  clear(): void {
    this.cache.clear();
  }
}

/** Singleton registry instance. */
export const schemaRegistry = new SchemaRegistry();
