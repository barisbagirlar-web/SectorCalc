# Timestamp Authority Audit — Section 84

**Date:** 2026-07-14
**Scope:** All files under `src/app/document-intelligence/` and `src/components/document-intelligence/`
**Purpose:** Identify client-generated timestamps used for authoritative events (payment state, entitlement, job transition, retention, deletion).

---

## Summary

**Status: CLIENT-AUTHORITATIVE TIMESTAMPS FOUND — mock data generators in client components produce server-authoritative fields.**

The directory `src/components/document-intelligence/` does not exist — zero files to audit.

All findings are in `src/app/document-intelligence/`. Both files containing client-side `new Date()` / `Date.now()` patterns are marked `"use client"`.

---

## Finding 1 — `maintenance-bom-recovery/jobs/[jobId]/page.tsx`

**File type:** Client component (`"use client"` at line 18)

### Instance 1a — `makeMockSummary()` (line 173)
```typescript
generatedAt: new Date().toISOString(),
```
The mock summary generator assigns a client-side timestamp to the `generatedAt` field, which in production represents the authoritative server completion timestamp.

### Instance 1b — `makeMockOutputManifest()` (line 212)
```typescript
generatedAt: new Date().toISOString(),
```
Same pattern: the output manifest's `generatedAt` is set from the client clock. In production this must reflect the exact server-side output generation time for retention-deadline computation and audit.

### Instance 1c — `makeMockJobDetail()` — `createdAt` (line 230)
```typescript
createdAt: new Date(Date.now() - 3600000).toISOString(),
```
Job `createdAt` is derived from the client clock. In production this drives SLA tracking and retention policies.

### Instance 1d — `makeMockJobDetail()` — `updatedAt` (line 231)
```typescript
updatedAt: new Date().toISOString(),
```
Job `updatedAt` is set from the client clock. This field is used for staleness checks and transition ordering.

### Instance 1e — `makeMockJobDetail()` — `expiresAt` (line 232–233)
```typescript
expiresAt: isCompletedStatus(status)
  ? new Date(Date.now() + 7 * 86400000).toISOString()
  : null,
```
Retention deadline is computed from the client clock. This is the highest-risk pattern — if this were real production code, retention enforcement would use an unreliable clock source.

### Instance 1f — `renderRetentionNotice()` — display countdown (line 553)
```typescript
const expiresMs = new Date(expiresAt).getTime() - Date.now();
```
**Acceptable for display only.** This reads a server-provided `expiresAt` value and computes remaining time for the UI countdown. It is not authoritative — the actual retention enforcement must happen server-side. No remediation required.

---

## Finding 2 — `maintenance-bom-recovery/jobs/[jobId]/review/page.tsx`

**File type:** Client component (`"use client"` at line 14)

### Instance 2a — mock summary `generatedAt` (line 263)
```typescript
generatedAt: new Date().toISOString(),
```
Same mock pattern as Finding 1a. The review page's mock summary assigns `generatedAt` from the client clock.

---

## Risk Assessment

| Risk | Instance(s) | Severity |
|---|---|---|
| Retention deadline computed from client clock | 1e | **Critical** (if ever promoted from mock) |
| Job lifecycle timestamps from client clock | 1c, 1d | **High** (if ever promoted from mock) |
| Output manifest time from client clock | 1b, 2a | **High** (if ever promoted from mock) |
| Summary generation time from client clock | 1a | **Medium** (if ever promoted from mock) |
| UI countdown from server-provided value | 1f | **None** (display only) |

---

## Remediation

1. The mock data generators (`makeMockSummary`, `makeMockOutputManifest`, `makeMockJobDetail`) must not serve as a template for production code.
2. Production API routes (`src/app/api/document-intelligence/`) and server actions must inject timestamps via `serverNow()` from `src/lib/document-intelligence/security/timestamp-enforcer.ts`.
3. All `createdAt`, `updatedAt`, `expiresAt`, `generatedAt` fields in production payloads must originate from server-side clock reads, never from `new Date()` in client code.
4. Client components must treat timestamp fields as opaque display values only — no client-side computation of authoritative state from timestamps.

---

## Files Examined (with zero findings)

- `src/app/document-intelligence/page.tsx` — Server component, no `use client`, no `new Date()` / `Date.now()` usage.
- `src/app/document-intelligence/maintenance-bom-recovery/page.tsx` — Server component, no `use client`, no timestamp generation.
- `src/app/document-intelligence/maintenance-bom-recovery/new/page.tsx` — Client component (`"use client"` at line 8), no `new Date()` / `Date.now()` / `toISOString()` usage.
- `src/components/document-intelligence/` — Directory does not exist; no files to audit.
