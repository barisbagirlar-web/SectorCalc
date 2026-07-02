/**
 * P8 - Field mode types. Local-only convenience data, never secrets or PII.
 */

export type RecentToolEntry = {
  readonly slug: string;
  readonly title: string;
  readonly href: string;
  readonly visitedAt: number;
};

export type SavedDraft = {
  readonly id: string;
  readonly toolSlug: string;
  readonly label: string;
  readonly savedAt: number;
  readonly fields: Record<string, string | number>;
};

export const FIELD_MODE_LIMITS = {
  maxRecentTools: 8,
  maxDrafts: 10,
} as const;

export const FIELD_MODE_STORAGE_KEYS = {
  recentTools: "sc.field.recentTools",
  drafts: "sc.field.drafts",
  lowBandwidth: "sc.field.lowBandwidth",
} as const;
