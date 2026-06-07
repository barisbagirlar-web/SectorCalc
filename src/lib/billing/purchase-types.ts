export const SINGLE_REPORT_PLAN = "single_report" as const;

export type SingleReportPlan = typeof SINGLE_REPORT_PLAN;

export interface SingleReportPurchase {
 plan: SingleReportPlan;
 toolSlug: string;
 sessionId: string;
 createdAt: string;
 status: "completed";
 amount?: number;
 currency?: string;
}

export function normalizeSingleReportPurchase(
 id: string,
 data: Record<string, unknown> | undefined
): SingleReportPurchase | null {
 if (!data || data.plan !== SINGLE_REPORT_PLAN) {
 return null;
 }

 const toolSlug = typeof data.toolSlug === "string" ? data.toolSlug.trim() : "";
 const sessionId = typeof data.sessionId === "string" ? data.sessionId : id;
 const createdAt =
 typeof data.createdAt === "string" ? data.createdAt : new Date(0).toISOString();
 const status = data.status === "completed" ? "completed" : null;

 if (!toolSlug || !status) {
 return null;
 }

 return {
 plan: SINGLE_REPORT_PLAN,
 toolSlug,
 sessionId,
 createdAt,
 status,
 amount: typeof data.amount === "number" ? data.amount : undefined,
 currency: typeof data.currency === "string" ? data.currency : undefined,
 };
}

export function hasSingleReportForTool(
 purchases: readonly SingleReportPurchase[],
 toolSlug: string
): boolean {
 return purchases.some(
 (purchase) => purchase.status === "completed" && purchase.toolSlug === toolSlug
 );
}
