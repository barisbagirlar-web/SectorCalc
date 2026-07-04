/**
 * Free traffic infer - permanently purged. All exports return empty.
 */

export type FreeTrafficCategory = string;

export function inferFreeTrafficCategory(_slug: string): FreeTrafficCategory {
  return "other";
}
