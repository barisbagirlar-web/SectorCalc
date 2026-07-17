# Document Intelligence — Billing & Entitlement Model

## Overview

Maintenance BOM Recovery uses the existing SectorCalc credit system for payment. Entitlement is managed at the job level via a deterministic state machine with idempotency keys. The system is designed to prevent double charging, ensure atomic credit operations, and provide clear audit trails.

## Credit System Integration

SectorCalc operates a credit-based payment model where 1 credit = USD 1. Users hold a credit balance stored at:

```
users/{uid}/credits/balance  →  { amount: number }
```

Credit transactions are recorded in:

```
creditTransactions/{transactionId}  →  { userId, jobId, productCode, credits, type, checkoutRequestId, timestamp }
```

### Pricing

| Parameter | Value |
|-----------|-------|
| Product | Maintenance BOM Recovery — Verified BOM Job |
| Product code | `maintenance_bom_recovery_v1` |
| Public price | 149 credits |
| Credit cost | 149 credits |
| Currency | USD |

## Entitlement Lifecycle

### States

```
none ──→ reserved ──→ consumed
                │
                └──→ released ──→ compensated
```

| State | Meaning |
|-------|---------|
| `none` | No entitlement activity for this job. Default for unpaid jobs. |
| `reserved` | Credits deducted from balance but job not yet completed. Checkout initiated. |
| `consumed` | Processing completed successfully. Credits permanently spent. |
| `released` | Credits returned to user (refund or terminal failure). |
| `compensated` | Entitlement released and additional compensation applied (special case). |

### Derivation from Payment Status

```
PaymentStatus → EntitlementStatus
──────────────────────────────────
unpaid           → none
checkout_pending → reserved
paid             → consumed
refunded         → released
chargeback       → released
payment_failed   → none
```

## Entitlement Operations

### 1. Reservation (Checkout)

Triggered by `POST /jobs/{jobId}/checkout`. Server performs the following atomically in a Firestore transaction:

```
1. Read users/{uid}/credits/balance.amount
2. Assert amount >= 149
3. Update balance: amount -= 149
4. Create creditTransaction (type: "reserve", checkoutRequestId)
5. Generate checkoutRequestId: "bom-reserve-{jobId}-{timestamp}"
6. Return checkoutRequestId to caller
```

If the transaction fails (insufficient credits, concurrent modification), the entire operation rolls back. No partial deduction is possible.

**Idempotency key**: `checkoutRequestId` — unique per reservation attempt. The system checks for existing reservations before creating a new one (planned enhancement).

### 2. Consumption (Successful Completion)

Triggered internally when processing reaches `completed` status. Server:

```
1. Find the reservation creditTransaction by checkoutRequestId
2. Update transaction: type = "spend", set consumedAt and paymentTransactionId
3. Create additional spend creditTransaction record
4. Generate paymentTransactionId: "bom-consume-{jobId}-{timestamp}"
```

**Idempotency key**: `paymentTransactionId` — unique per consumption. If consumption is retried, the system checks for existing spend transactions before creating new ones.

### 3. Release (Terminal Failure / Refund)

Triggered internally when a job transitions to `failed_terminal` or `refunded`. Server atomically:

```
1. Read users/{uid}/credits/balance.amount
2. Update balance: amount += 149 (merge, not set)
3. Create creditTransaction (type: "release")
```

The release operation issues exactly one replacement entitlement token. If the same job fails again after retry, no additional release occurs — the original release token is idempotent.

### 4. Checkout Data

The public checkout response (server-generated, never trusted from client):

```typescript
{
  productCode: "maintenance_bom_recovery_v1",
  productName: "Maintenance BOM Recovery — Verified BOM Job",
  priceUsd: 149,
  creditCost: 149,
  currency: "USD",
  allowedPages: 50,
  allowedRows: 500,
  allowedFileSize: 52428800
}
```

## Idempotency Keys

| Key | Format | Scope |
|-----|--------|-------|
| `checkoutRequestId` | `bom-reserve-{jobId}-{timestamp}` | Reservation uniqueness per checkout attempt |
| `paymentTransactionId` | `bom-consume-{jobId}-{timestamp}` | Consumption uniqueness per completed job |
| `processingExecutionId` | `exec-{jobId}-{timestamp}` | Processing execution uniqueness (avoids duplicate worker runs) |
| `outputGenerationId` | UUIDv4 (generated per output manifest) | Output artifact set uniqueness |

## Billing Invariants

### I1: Single Charge Per Completed Job

A job in `completed` status must have exactly one associated spend transaction. The `paymentStatus` must be `paid` and `entitlementStatus` must be `consumed`.

### I2: No Charge on Diagnostic Failure

Jobs that never reach `paid` status (rejected at diagnostic, never checked out, checkout failed) must have zero credit impact. The diagnostic flow is always free.

### I3: No Double Charge on Retry

If a job transitions to `failed_retryable` and is re-executed, the original reservation is reused. No new reservation occurs. The `processingExecutionId` changes but the `checkoutRequestId` remains the same.

### I4: Atomic Reservation

Credit reservation must be atomic — either the full 149 credits are deducted and the transaction is recorded, or nothing happens. No partial deduction is allowed even under concurrent access.

### I5: Released Credits Are Returnable

When credits are released (terminal failure, refund), the full 149 credits must be added back to the user's balance. The release transaction must be recorded in the credit transactions audit trail.

### I6: No Credit Creation

The entitlement module must never create credits. It may only deduct (reservation/spend) or return (release) existing credits from the balance. Credit creation is an admin-only operation outside this module's scope.

## Audit Trail

Every credit operation produces a transaction record in `creditTransactions`:

| Field | Description |
|-------|-------------|
| `userId` | Owner UID |
| `jobId` | Associated job |
| `productCode` | `maintenance_bom_recovery_v1` |
| `credits` | Always 149 |
| `type` | `reserve` | `spend` | `release` |
| `checkoutRequestId` | Idempotency key for reserve |
| `paymentTransactionId` | Idempotency key for spend |
| `timestamp` | ISO 8601 |

## State Machine Integration

The entitlement lifecycle is driven by the job state machine. Transitions that trigger entitlement operations:

| Job State Transition | Entitlement Action |
|----------------------|-------------------|
| `diagnostic_eligible` → `awaiting_payment` | None (user sees checkout option) |
| `awaiting_payment` → `paid` | Reserve credits (checkout) |
| `paid` → `queued` | None (already reserved) |
| `generating_outputs` → `completed` | Consume entitlement |
| Any state → `failed_terminal` | Release entitlement (if previously reserved) |
| Any state → `refunded` | Release entitlement (if previously consumed) |

## Error Codes

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| `INSUFFICIENT_CREDITS` | User balance < 149 | 402 |
| `ENTITLEMENT_CONFLICT` | Entitlement state mismatch for operation | 409 |
| `PAYMENT_INFRASTRUCTURE_NOT_BOUND` | Firestore not available | 500 |
| `RESERVATION_FAILED` | Transaction failed | 500 |
| `CONSUMPTION_FAILED` | Spend record creation failed | 500 |
| `RELEASE_FAILED` | Credit return failed | 500 |

## Test Coverage

| Invariant | Test File | Status |
|-----------|-----------|--------|
| Credit cost = 149 | `entitlement.test.ts` | PASS |
| Checkout data correct | `entitlement.test.ts` | PASS |
| Entitlement derivation (all 6 paths) | `entitlement.test.ts` | PASS |
| Price integrity invariant (I1, I6) | `entitlement.test.ts` | PASS |
| Diagnostic never charges (I2) | Integration tbd | NOT_PROVEN |
| No double charge on retry (I3) | Integration tbd | NOT_PROVEN |
| Atomic reservation (I4) | Integration tbd | NOT_PROVEN |

## Exclusions (v1)

- No Paddle payment gateway integration. Credit balance is the only payment method.
- No automatic refund processing. Refunds are currently admin-initiated state transitions.
- No invoice generation. Credit transactions serve as the audit trail.
- No promotional credits or discount codes.
