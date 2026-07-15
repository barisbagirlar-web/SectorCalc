// SectorCalc SuperV4 V5.3 — Schema Registry
// Versioned approved schema store with hash binding for runtime verification.

import "server-only";

import type { SuperV4Schema } from "./contract-types";
import { sha256Json } from "@/sectorcalc/pro-runtime/cryptographic-hash";

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

  register(record: SchemaRecord): void {
    if (record.schema_hash !== SchemaRegistry.computeSchemaHash(record.public_schema_json)) {
      throw new Error(`Schema hash mismatch for ${record.tool_key}.`);
    }
    const key = this.cacheKey(record.tool_id, record.schema_version);
    this.cache.set(key, {
      record,
      expiresAt: Date.now() + this.options.cacheTtlMs,
    });
  }

  fetchActive(toolId: string, schemaVersion: string): SchemaRecord | null {
    const key = this.cacheKey(toolId, schemaVersion);
    const entry = this.cache.get(key);

    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    if (entry.record.approval_status !== "ACTIVE") return null;
    if (
      entry.record.schema_hash !==
      SchemaRegistry.computeSchemaHash(entry.record.public_schema_json)
    ) {
      this.cache.delete(key);
      return null;
    }

    return entry.record;
  }

  fetchAny(toolId: string, schemaVersion: string): SchemaRecord | null {
    const key = this.cacheKey(toolId, schemaVersion);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    if (
      entry.record.schema_hash !==
      SchemaRegistry.computeSchemaHash(entry.record.public_schema_json)
    ) {
      this.cache.delete(key);
      return null;
    }
    return entry.record;
  }

  static computeSchemaHash(schema: SuperV4Schema): string {
    return sha256Json(schema);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const schemaRegistry = new SchemaRegistry();
