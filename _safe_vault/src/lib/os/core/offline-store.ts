/**
 * Offline-First readiness — audit queue (local persistence).
 * Smart Module: for sectors with offline_mode active.
 */

import type { FormulaInputs } from "@/lib/os/core/formulas";
import type { SectorRegistryKey } from "@/lib/os/registry/sectors";

const OFFLINE_QUEUE_KEY = "sectorcalc:os:offline-audit-queue";

export interface OfflineAuditRecord {
  id: string;
  sectorId: SectorRegistryKey;
  inputs: FormulaInputs;
  createdAt: string;
}

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readQueue(): OfflineAuditRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OfflineAuditRecord[]) : [];
  } catch {
    return [];
  }
}

function writeQueue(records: OfflineAuditRecord[]): void {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(records));
}

export const OfflineStore = {
  enqueue(record: Omit<OfflineAuditRecord, "id" | "createdAt">): OfflineAuditRecord {
    const entry: OfflineAuditRecord = {
      ...record,
      id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `offline-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    writeQueue([...readQueue(), entry]);
    return entry;
  },

  list(): OfflineAuditRecord[] {
    return readQueue();
  },

  dequeue(id: string): OfflineAuditRecord | null {
    const queue = readQueue();
    const match = queue.find((item) => item.id === id) ?? null;
    writeQueue(queue.filter((item) => item.id !== id));
    return match;
  },

  clear(): void {
    if (!canUseStorage()) {
      return;
    }
    window.localStorage.removeItem(OFFLINE_QUEUE_KEY);
  },
} as const;
