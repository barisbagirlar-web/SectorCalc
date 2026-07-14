/**
 * Unit Tests: Payment-to-Job Reconciliation Ledger
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  assertJobConsumptionInvariant,
  assertNoDoubleCharge,
  assertDiagnosticNoCharge,
  reconcilePaymentTransactions,
  detectOrphanPayments,
} from "@/lib/document-intelligence/contracts/payment-reconciliation";
import type { QuerySnapshot } from "firebase-admin/firestore";

/* ── Firestore Mock ──────────────────────────────────────────── */

const EMPTY_SNAPSHOT = {
  docs: [],
  empty: true,
  size: 0,
  forEach: () => {},
} as unknown as QuerySnapshot;

/**
 * Create a chainable Firestore query mock.
 *
 * - `.where()`, `.orderBy()`, `.limit()` return `this` (the query).
 * - `.doc()` returns a separate object whose `.get()` resolves to a
 *   DocumentSnapshot-like object (with `.exists` and `.data()`).
 * - `.get()` resolves to a QuerySnapshot-like object.
 */
function createQuery() {
  const docSnap = {
    exists: false,
    id: "",
    data: () => ({}),
  };

  const query = {
    where: vi.fn(() => query),
    orderBy: vi.fn(() => query),
    limit: vi.fn(() => query),
    doc: vi.fn(() => ({
      get: vi.fn().mockResolvedValue(docSnap),
    })),
    get: vi.fn().mockResolvedValue(EMPTY_SNAPSHOT),
  };
  return query;
}

const mockFirestore = {
  collection: vi.fn(() => createQuery()),
};

vi.mock("@/lib/infrastructure/firebase/admin", () => ({
  getAdminFirestore: vi.fn(() => mockFirestore),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockFirestore.collection = vi.fn(() => createQuery());
});

/* ── Helpers ─────────────────────────────────────────────────── */

/**
 * Set up Firestore so that "creditTransactions" and "jobs" collections
 * return the specified transaction docs and optional job document.
 */
function mockReconcile(
  txDocs: Record<string, unknown>[],
  job: { id: string; data: Record<string, unknown> } | null,
) {
  const txQuery = createQuery();
  txQuery.get.mockResolvedValue({
    docs: txDocs.map((d) => {
      const { id, ...rest } = d;
      return { id: (id as string) ?? "tx", data: () => rest };
    }),
    empty: txDocs.length === 0,
    size: txDocs.length,
    forEach: () => {},
  } as unknown as QuerySnapshot);

  const jobsQuery = createQuery();
  // Override the doc().get() path for the jobs collection
  if (job) {
    jobsQuery.doc = vi.fn(() => ({
      get: vi.fn().mockResolvedValue({
        exists: true,
        id: job.id,
        data: () => job.data,
      }),
    }));
  }

  mockFirestore.collection.mockImplementation((name: string) => {
    if (name === "jobs") return jobsQuery;
    return txQuery;
  });
}

/** Set up Firestore so "creditTransactions" returns the given docs. */
function mockTxDocs(docs: Record<string, unknown>[]) {
  const txQuery = createQuery();
  txQuery.get.mockResolvedValue({
    docs: docs.map((d) => ({
      id: (d.id as string) ?? "tx",
      data: () => {
        const rest = { ...d };
        delete rest.id;
        return rest;
      },
    })),
    empty: docs.length === 0,
    size: docs.length,
    forEach: () => {},
  } as unknown as QuerySnapshot);
  mockFirestore.collection.mockImplementation((name: string) => {
    if (name === "creditTransactions") return txQuery;
    return createQuery();
  });
}

/* ── assertJobConsumptionInvariant ───────────────────────────── */

describe("assertJobConsumptionInvariant", () => {
  it("returns true for valid state with distinct non-empty IDs", () => {
    expect(assertJobConsumptionInvariant("job_001", "exec_abc")).toBe(true);
  });

  it("throws when jobId is empty", () => {
    expect(() => assertJobConsumptionInvariant("", "exec_abc")).toThrow(
      "CONTRACT_VIOLATION",
    );
  });

  it("throws when jobId is whitespace-only", () => {
    expect(() => assertJobConsumptionInvariant("   ", "exec_abc")).toThrow(
      "CONTRACT_VIOLATION",
    );
  });

  it("throws when processingExecutionId is empty", () => {
    expect(() => assertJobConsumptionInvariant("job_001", "")).toThrow(
      "CONTRACT_VIOLATION",
    );
  });

  it("throws when processingExecutionId is whitespace-only", () => {
    expect(() => assertJobConsumptionInvariant("job_001", "   ")).toThrow(
      "CONTRACT_VIOLATION",
    );
  });

  it("throws when jobId and processingExecutionId are equal", () => {
    expect(() => assertJobConsumptionInvariant("same_id", "same_id")).toThrow(
      "must be distinct",
    );
  });
});

/* ── assertNoDoubleCharge ────────────────────────────────────── */

describe("assertNoDoubleCharge", () => {
  it("returns true for a non-duplicate checkout (zero transactions)", async () => {
    mockTxDocs([]);
    const result = await assertNoDoubleCharge("chk_001");
    expect(result).toBe(true);
  });

  it("returns true when exactly one spend transaction exists", async () => {
    mockTxDocs([{ id: "tx_1" }]);
    const result = await assertNoDoubleCharge("chk_001");
    expect(result).toBe(true);
  });

  it("returns false when multiple spend transactions exist for the same checkoutRequestId", async () => {
    mockTxDocs([{ id: "tx_1" }, { id: "tx_2" }]);
    const result = await assertNoDoubleCharge("chk_001");
    expect(result).toBe(false);
  });

  it("throws when checkoutRequestId is empty", async () => {
    await expect(assertNoDoubleCharge("")).rejects.toThrow("CONTRACT_VIOLATION");
  });

  it("throws when checkoutRequestId is whitespace-only", async () => {
    await expect(assertNoDoubleCharge("   ")).rejects.toThrow("CONTRACT_VIOLATION");
  });

  it("throws when Firestore admin returns null", async () => {
    const { getAdminFirestore } = await import("@/lib/infrastructure/firebase/admin");
    (getAdminFirestore as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
    await expect(assertNoDoubleCharge("chk_001")).rejects.toThrow(
      "CONTRACT_VIOLATION",
    );
  });
});

/* ── assertDiagnosticNoCharge ────────────────────────────────── */

describe("assertDiagnosticNoCharge", () => {
  it("returns true for diagnostic_failed status", async () => {
    const result = await assertDiagnosticNoCharge("diagnostic_failed");
    expect(result).toBe(true);
  });

  it("returns true for rejected status", async () => {
    const result = await assertDiagnosticNoCharge("rejected");
    expect(result).toBe(true);
  });

  it("returns true for any other status (invariant does not apply)", async () => {
    const result = await assertDiagnosticNoCharge("diagnostic_eligible");
    expect(result).toBe(true);
  });

  it("returns true for empty string (edge case)", async () => {
    const result = await assertDiagnosticNoCharge("");
    expect(result).toBe(true);
  });

  it("returns true for diagnostic_passed status", async () => {
    const result = await assertDiagnosticNoCharge("diagnostic_passed");
    expect(result).toBe(true);
  });
});

/* ── reconcilePaymentTransactions ────────────────────────────── */

describe("reconcilePaymentTransactions", () => {
  it("derives balanced status when job has matching payment and entitlement", async () => {
    mockReconcile(
      [
        {
          id: "tx_001",
          userId: "user_1",
          jobId: "job_001",
          type: "spend",
          timestamp: "2026-07-14T12:00:00.000Z",
          paymentTransactionId: "pi_abc",
          checkoutRequestId: "chk_001",
        },
      ],
      {
        id: "job_001",
        data: { status: "processing", paymentStatus: "paid", entitlementStatus: "consumed" },
      },
    );

    const entries = await reconcilePaymentTransactions(
      "user_1",
      "2026-07-13T00:00:00.000Z",
      "2026-07-15T00:00:00.000Z",
    );

    expect(entries).toHaveLength(1);
    expect(entries[0].reconciliationStatus).toBe("balanced");
    expect(entries[0].jobStatus).toBe("processing");
  });

  it("derives paid_job_stuck when paid job is at awaiting_payment", async () => {
    mockReconcile(
      [
        {
          id: "tx_002",
          userId: "user_1",
          jobId: "job_002",
          type: "spend",
          timestamp: "2026-07-14T13:00:00.000Z",
          paymentTransactionId: "pi_def",
          checkoutRequestId: "chk_002",
        },
      ],
      {
        id: "job_002",
        data: { status: "awaiting_payment", paymentStatus: "paid", entitlementStatus: "consumed" },
      },
    );

    const entries = await reconcilePaymentTransactions(
      "user_1",
      "2026-07-13T00:00:00.000Z",
      "2026-07-15T00:00:00.000Z",
    );

    expect(entries).toHaveLength(1);
    expect(entries[0].reconciliationStatus).toBe("paid_job_stuck");
    expect(entries[0].notes).toContain("awaiting_payment");
  });

  it("derives refunded_but_active when refunded job is still processing", async () => {
    mockReconcile(
      [
        {
          id: "tx_003",
          userId: "user_1",
          jobId: "job_003",
          type: "spend",
          timestamp: "2026-07-14T14:00:00.000Z",
          paymentTransactionId: "pi_ghi",
          checkoutRequestId: "chk_003",
        },
      ],
      {
        id: "job_003",
        data: { status: "processing", paymentStatus: "refunded", entitlementStatus: "consumed" },
      },
    );

    const entries = await reconcilePaymentTransactions(
      "user_1",
      "2026-07-13T00:00:00.000Z",
      "2026-07-15T00:00:00.000Z",
    );

    expect(entries).toHaveLength(1);
    expect(entries[0].reconciliationStatus).toBe("refunded_but_active");
  });

  it("derives consumed_without_job when transaction references a non-existent job", async () => {
    mockReconcile(
      [
        {
          id: "tx_004",
          userId: "user_1",
          jobId: "job_missing",
          type: "spend",
          timestamp: "2026-07-14T15:00:00.000Z",
          paymentTransactionId: "pi_jkl",
          checkoutRequestId: "chk_004",
        },
      ],
      null,
    );

    const entries = await reconcilePaymentTransactions(
      "user_1",
      "2026-07-13T00:00:00.000Z",
      "2026-07-15T00:00:00.000Z",
    );

    expect(entries).toHaveLength(1);
    expect(entries[0].reconciliationStatus).toBe("consumed_without_job");
    expect(entries[0].jobId).toBe("job_missing");
  });

  it("derives entitlement_without_payment when entitlement consumed but not paid", async () => {
    mockReconcile(
      [
        {
          id: "tx_005",
          userId: "user_1",
          jobId: "job_005",
          type: "spend",
          timestamp: "2026-07-14T16:00:00.000Z",
          paymentTransactionId: "pi_mno",
          checkoutRequestId: "chk_005",
        },
      ],
      {
        id: "job_005",
        data: { status: "processing", paymentStatus: "unpaid", entitlementStatus: "consumed" },
      },
    );

    const entries = await reconcilePaymentTransactions(
      "user_1",
      "2026-07-13T00:00:00.000Z",
      "2026-07-15T00:00:00.000Z",
    );

    expect(entries).toHaveLength(1);
    expect(entries[0].reconciliationStatus).toBe("entitlement_without_payment");
  });

  it("returns empty array when no transactions exist in the date window", async () => {
    mockReconcile([], null);
    const entries = await reconcilePaymentTransactions(
      "user_no_tx",
      "2026-07-13T00:00:00.000Z",
      "2026-07-15T00:00:00.000Z",
    );
    expect(entries).toHaveLength(0);
  });
});

/* ── detectOrphanPayments ────────────────────────────────────── */

describe("detectOrphanPayments", () => {
  it("handles empty results gracefully when no spend/reserve transactions exist", async () => {
    mockTxDocs([]);
    const entries = await detectOrphanPayments("user_empty");
    expect(entries).toHaveLength(0);
  });

  it("returns orphan entries when a spend transaction references a non-existent job", async () => {
    const txQuery = createQuery();
    txQuery.get.mockResolvedValue({
      docs: [
        {
          id: "tx_orphan_1",
          data: () => ({
            userId: "user_1",
            jobId: "job_nonexistent",
            type: "spend",
            paymentTransactionId: "pi_orphan",
          }),
        },
      ],
      empty: false,
      size: 1,
      forEach: () => {},
    } as unknown as QuerySnapshot);

    const jobsQuery = createQuery();
    jobsQuery.get.mockResolvedValue({
      docs: [],
      empty: true,
      size: 0,
      forEach: () => {},
    } as unknown as QuerySnapshot);

    let callIndex = 0;
    mockFirestore.collection.mockImplementation(() => {
      callIndex++;
      return callIndex === 1 ? txQuery : jobsQuery;
    });

    const entries = await detectOrphanPayments("user_1");
    expect(entries).toHaveLength(1);
    expect(entries[0].reconciliationStatus).toBe("consumed_without_job");
    expect(entries[0].jobId).toBe("job_nonexistent");
  });

  it("does not report jobs that exist in the jobs collection", async () => {
    const txQuery = createQuery();
    txQuery.get.mockResolvedValue({
      docs: [
        {
          id: "tx_ok",
          data: () => ({
            userId: "user_1",
            jobId: "job_exists",
            type: "spend",
            paymentTransactionId: "pi_ok",
          }),
        },
      ],
      empty: false,
      size: 1,
      forEach: () => {},
    } as unknown as QuerySnapshot);

    const jobsQuery = createQuery();
    jobsQuery.get.mockResolvedValue({
      docs: [{ id: "job_exists" }],
      empty: false,
      size: 1,
      forEach: () => {},
    } as unknown as QuerySnapshot);

    let callIndex = 0;
    mockFirestore.collection.mockImplementation(() => {
      callIndex++;
      return callIndex === 1 ? txQuery : jobsQuery;
    });

    const entries = await detectOrphanPayments("user_1");
    expect(entries).toHaveLength(0);
  });
});
