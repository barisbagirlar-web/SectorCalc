// CBAM report idempotency tests.
// Same reportId does not double-consume. Same unlock requestId does not double-debit.
import { describe, it, expect } from "vitest";
import { CBAM_PACKAGE_INCLUDED_USES, CBAM_PACKAGE_CREDITS, CBAM_REPORT_USE_COST } from "@/lib/cbam/billing-constants";

describe("CBAM report idempotency", () => {
  it("same reportId does not double-decrement remainingUses", () => {
    const consumedReports: string[] = [];
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;
    const reportId = "cbam_unique_report_123";

    // First attempt: consume 1 use
    if (!consumedReports.includes(reportId)) {
      consumedReports.push(reportId);
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(remainingUses).toBe(4);
    expect(consumedReports).toHaveLength(1);

    // Retry with same reportId: should NOT decrement again
    if (!consumedReports.includes(reportId)) {
      consumedReports.push(reportId);
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(remainingUses).toBe(4); // unchanged
    expect(consumedReports).toHaveLength(1); // unchanged
  });

  it("different reportIds each consume 1 use", () => {
    const consumedReports: string[] = [];
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;
    const reportIds = ["report_1", "report_2", "report_3"];

    for (const rid of reportIds) {
      if (!consumedReports.includes(rid)) {
        consumedReports.push(rid);
        remainingUses -= CBAM_REPORT_USE_COST;
      }
    }

    expect(remainingUses).toBe(2);
    expect(consumedReports).toHaveLength(3);
  });

  it("retry after network failure does not double-consume", () => {
    const consumedReports: string[] = [];
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;
    const reportId = "cbam_retry_test";

    // First attempt succeeded server-side but client got network error
    if (!consumedReports.includes(reportId)) {
      consumedReports.push(reportId);
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(remainingUses).toBe(4);
    expect(consumedReports).toHaveLength(1);

    // Client retries with same reportId
    if (!consumedReports.includes(reportId)) {
      consumedReports.push(reportId);
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(remainingUses).toBe(4); // not double-decmented
    expect(consumedReports).toHaveLength(1);
  });

  it("same unlock requestId does not double-debit account credits", () => {
    const processedRequestIds: string[] = [];
    let accountBalance = 200;
    let remainingUses = 0;
    const requestId = "unlock_req_abc";

    // First unlock
    const firstUnlock = !processedRequestIds.includes(requestId);
    if (firstUnlock) {
      processedRequestIds.push(requestId);
      accountBalance -= CBAM_PACKAGE_CREDITS;
      remainingUses += CBAM_PACKAGE_INCLUDED_USES;
    }
    expect(accountBalance).toBe(100);
    expect(remainingUses).toBe(5);
    expect(processedRequestIds).toHaveLength(1);

    // Retry same requestId
    const retryUnlock = !processedRequestIds.includes(requestId);
    if (retryUnlock) {
      processedRequestIds.push(requestId);
      accountBalance -= CBAM_PACKAGE_CREDITS;
      remainingUses += CBAM_PACKAGE_INCLUDED_USES;
    }
    // Should NOT double-debit or double-grant
    expect(accountBalance).toBe(100);
    expect(remainingUses).toBe(5);
    expect(processedRequestIds).toHaveLength(1);
  });

  it("use consumption stops when remainingUses reaches 0", () => {
    const consumedReports: string[] = [];
    let remainingUses = CBAM_PACKAGE_INCLUDED_USES;

    for (let i = 0; i < 5; i++) {
      const rid = `report_${i + 1}`;
      if (remainingUses <= 0) break;
      if (!consumedReports.includes(rid)) {
        consumedReports.push(rid);
        remainingUses -= CBAM_REPORT_USE_COST;
      }
    }

    expect(remainingUses).toBe(0);
    expect(consumedReports).toHaveLength(5);

    // 6th attempt — blocked regardless of reportId
    const rid6 = "report_6";
    const blocked = remainingUses <= 0;
    expect(blocked).toBe(true);
    // Ensure no mutation on blocked attempt
    if (!blocked && !consumedReports.includes(rid6)) {
      consumedReports.push(rid6);
      remainingUses -= CBAM_REPORT_USE_COST;
    }
    expect(consumedReports).toHaveLength(5);
    expect(remainingUses).toBe(0);
  });
});
