import { describe, expect, it } from "vitest";
import fc from "fast-check";

import { SchemaRegistry } from "@/sectorcalc/pro-form/schema-registry";
import type { SuperV4Schema } from "@/sectorcalc/pro-form/contract-types";

function asSchema(value: unknown): SuperV4Schema {
  return value as SuperV4Schema;
}

describe("canonical schema hash properties", () => {
  it("is invariant under object key insertion order", () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.stringMatching(/^[a-z][a-z0-9_]{0,11}$/),
          fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null)),
          { maxKeys: 30 },
        ),
        (record) => {
          const reversed = Object.fromEntries(Object.entries(record).reverse());
          expect(SchemaRegistry.computeSchemaHash(asSchema(record))).toBe(
            SchemaRegistry.computeSchemaHash(asSchema(reversed)),
          );
        },
      ),
      { numRuns: 500, seed: 531_700 },
    );
  });

  it("rejects non-JSON finite-number violations", () => {
    fc.assert(
      fc.property(fc.constantFrom(Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY), (value) => {
        expect(() => SchemaRegistry.computeSchemaHash(asSchema({ nested: { value } }))).toThrow(
          "rejects NaN and infinite",
        );
      }),
      { numRuns: 30, seed: 531_701 },
    );
  });
});
