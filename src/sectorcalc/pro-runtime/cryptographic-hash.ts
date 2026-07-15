import "server-only";

import { createHash } from "node:crypto";

function canonicalize(value: unknown, seen: WeakSet<object>): unknown {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Cannot hash a non-finite number.");
    }
    return Object.is(value, -0) ? 0 : value;
  }

  if (typeof value === "bigint") return value.toString(10);
  if (typeof value === "undefined") return null;

  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item, seen));
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    if (seen.has(objectValue)) {
      throw new Error("Cannot hash a circular object graph.");
    }
    seen.add(objectValue);
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(objectValue).sort()) {
      const child = objectValue[key];
      if (typeof child === "function" || typeof child === "symbol") continue;
      result[key] = canonicalize(child, seen);
    }
    seen.delete(objectValue);
    return result;
  }

  return String(value);
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value, new WeakSet<object>()));
}

export function sha256String(value: string): string {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

export function sha256Json(value: unknown): string {
  return sha256String(canonicalJson(value));
}
