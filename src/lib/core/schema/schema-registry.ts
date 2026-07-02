import {
  loadSchemaWithTranslation,
  loadAllSchemasWithTranslation,
} from "./schema-loader";
import fs from "fs";
import path from "path";

// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA REGISTRY (Singleton + Cache)
// ─────────────────────────────────────────────────────────────────────────────

type SchemaCacheKey = string; // "${dirPath}/${schemaId}"

class SchemaRegistry {
  private cache = new Map<SchemaCacheKey, unknown>();
  private loadedDirs = new Set<string>();

  /**
   * Load a single schema by ID with caching.
   * Automatically translates Turkish → English at load time.
   */
  getSchema<T = Record<string, unknown>>(
    schemaId: string,
    dirPath: string = "generated/schemas",
  ): T {
    const cacheKey = `${dirPath}/${schemaId}`;

    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      return cached as T;
    }

    // Try with and without -schema suffix
    const jsonPath = `${dirPath}/${schemaId}.json`;
    const schemaPathWithSuffix = `${dirPath}/${schemaId}-schema.json`;

    // Check which file exists (prefer -schema.json convention)
    const absolutePathSimple = path.join(process.cwd(), jsonPath);
    const absolutePathWithSuffix = path.join(process.cwd(), schemaPathWithSuffix);

    let schemaPath: string;
    if (fs.existsSync(absolutePathWithSuffix)) {
      schemaPath = schemaPathWithSuffix;
    } else if (fs.existsSync(absolutePathSimple)) {
      schemaPath = jsonPath;
    } else {
      throw new Error(
        `Schema not found: ${schemaId} in ${dirPath} (tried ${jsonPath} and ${schemaPathWithSuffix})`,
      );
    }

    const schema = loadSchemaWithTranslation<T>(schemaPath);
    this.cache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Load all schemas from a directory with caching.
   */
  getAllSchemas<T = Record<string, unknown>>(
    dirPath: string = "generated/schemas",
  ): Record<string, T> {
    if (this.loadedDirs.has(dirPath) && this.cache.size > 0) {
      const result: Record<string, T> = {};
      for (const [key, value] of this.cache.entries()) {
        if (key.startsWith(dirPath)) {
          const schemaId = key.replace(`${dirPath}/`, "");
          result[schemaId] = value as T;
        }
      }
      return result;
    }

    const schemas = loadAllSchemasWithTranslation(dirPath) as Record<
      string,
      T
    >;
    for (const [id, schema] of Object.entries(schemas)) {
      this.cache.set(`${dirPath}/${id}`, schema);
    }

    this.loadedDirs.add(dirPath);
    return schemas;
  }

  /**
   * Get a schema by its full JSON path (for non-standard locations).
   */
  getSchemaByPath<T = Record<string, unknown>>(jsonPath: string): T {
    const cacheKey = `path:${jsonPath}`;

    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      return cached as T;
    }

    const schema = loadSchemaWithTranslation<T>(jsonPath);
    this.cache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Clear the entire cache (for hot reload / dev mode).
   */
  clearCache(): void {
    this.cache.clear();
    this.loadedDirs.clear();
  }

  /**
   * Get cache statistics.
   */
  getStats(): { cachedSchemas: number; loadedDirs: string[] } {
    return {
      cachedSchemas: this.cache.size,
      loadedDirs: [...this.loadedDirs],
    };
  }
}

// Singleton instance - import this everywhere
export const schemaRegistry = new SchemaRegistry();

// For testing / DI
export function createSchemaRegistry(): SchemaRegistry {
  return new SchemaRegistry();
}
