/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AUDIT SERVICE
 * ───────────────────────────────────────────────────────────────────────────
 * • Uses Web Crypto (globalThis.crypto.subtle) — works in browser AND Node
 * • Hash covers the FULL evidentiary set (toolId + version + inputs + results + timestamp)
 * • Hash CHAINING for tamper-evident audit trail
 *
 * Source: claude_pro_tasarim_/engine-audit.ts (verified engine design)
 * ═══════════════════════════════════════════════════════════════════════════
 */

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await globalThis.crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function canonical(obj: Record<string, number>): string {
  return Object.keys(obj).sort().map((k) => `${k}=${obj[k]}`).join('|');
}

export interface AuditComment {
  id: string;
  authorRole: 'ENGINEER' | 'REVIEWER' | 'APPROVER';
  content: string;
  timestamp: string;
}

export interface AuditRecord {
  toolId: string;
  schemaVersion: string;
  timestamp: string;
  inputs: Record<string, number>;
  results: Record<string, number>;
  uncertainty?: { measurand: string; u_c: number; U: number; k: number };
  prevHash: string;
  recordHash: string;
  comments: AuditComment[];
}

export class AuditService {
  async release(args: {
    toolId: string;
    schemaVersion: string;
    inputs: Record<string, number>;
    results: Record<string, number>;
    uncertainty?: { measurand: string; u_c: number; U: number; k: number };
    prevHash?: string;
  }): Promise<AuditRecord> {
    const timestamp = new Date().toISOString();
    const prevHash = args.prevHash ?? '';
    const payload = [
      `tool=${args.toolId}`,
      `ver=${args.schemaVersion}`,
      `ts=${timestamp}`,
      `in=${canonical(args.inputs)}`,
      `out=${canonical(args.results)}`,
      args.uncertainty ? `uc=${args.uncertainty.measurand}:${args.uncertainty.u_c}` : 'uc=',
      `prev=${prevHash}`,
    ].join('\n');
    const recordHash = await sha256Hex(payload);
    return {
      toolId: args.toolId,
      schemaVersion: args.schemaVersion,
      timestamp,
      inputs: args.inputs,
      results: args.results,
      uncertainty: args.uncertainty,
      prevHash,
      recordHash,
      comments: [],
    };
  }

  async verify(record: AuditRecord): Promise<boolean> {
    const payload = [
      `tool=${record.toolId}`,
      `ver=${record.schemaVersion}`,
      `ts=${record.timestamp}`,
      `in=${canonical(record.inputs)}`,
      `out=${canonical(record.results)}`,
      record.uncertainty ? `uc=${record.uncertainty.measurand}:${record.uncertainty.u_c}` : 'uc=',
      `prev=${record.prevHash}`,
    ].join('\n');
    return (await sha256Hex(payload)) === record.recordHash;
  }

  async verifyChain(records: AuditRecord[]): Promise<boolean> {
    let prev = '';
    for (const r of records) {
      if (r.prevHash !== prev) return false;
      if (!(await this.verify(r))) return false;
      prev = r.recordHash;
    }
    return true;
  }
}
