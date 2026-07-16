import * as admin from "firebase-admin";
import type Stripe from "stripe";
import { readSubscriptionCurrentPeriodEnd } from "./stripeCompat";
import {
  CHECKOUT_PLAN_PRO,
  CHECKOUT_PLAN_PRO_ANNUAL,
  CHECKOUT_PLAN_SINGLE_REPORT,
  CHECKOUT_PLAN_TEAM,
  PREMIUM_ENTITLEMENTS_COLLECTION,
} from "./constants";

type EntitlementPlan = "single_report" | "pro" | "team";
type EntitlementStatus = "active" | "expired" | "canceled" | "pending";

interface PremiumEntitlementWrite {
  id: string;
  userId: string;
  stripeCustomerId?: string;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  plan: EntitlementPlan;
  status: EntitlementStatus;
  premiumSlug?: string;
  reportLimit?: number;
  reportsUsed?: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  source: "stripe_checkout";
}

function readStripeId(value: string | { id: string } | null | undefined): string | undefined {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") {
    return value.id;
  }
  return undefined;
}

function mapCheckoutPlanToEntitlementPlan(plan: string | undefined): EntitlementPlan | null {
  switch (plan) {
    case CHECKOUT_PLAN_SINGLE_REPORT:
      return "single_report";
    case CHECKOUT_PLAN_TEAM:
      return "team";
    case CHECKOUT_PLAN_PRO:
    case CHECKOUT_PLAN_PRO_ANNUAL:
      return "pro";
    default:
      return null;
  }
}

function mapPlanIdToEntitlementPlan(planId: string | undefined): EntitlementPlan | null {
  switch (planId) {
    case "single_report":
      return "single_report";
    case "pro_monthly":
      return "pro";
    case "team_monthly":
      return "team";
    default:
      return null;
  }
}

export function resolveEntitlementPlanFromMetadata(
  metadata: Stripe.Metadata | null | undefined
): EntitlementPlan | null {
  const entitlementLevel = metadata?.entitlementLevel;
  if (
    entitlementLevel === "single_report" ||
    entitlementLevel === "pro" ||
    entitlementLevel === "team"
  ) {
    return entitlementLevel;
  }

  const fromPlanId = mapPlanIdToEntitlementPlan(metadata?.planId);
  if (fromPlanId) {
    return fromPlanId;
  }

  return mapCheckoutPlanToEntitlementPlan(metadata?.plan);
}

function resolvePremiumSlug(metadata: Stripe.Metadata | null | undefined): string | undefined {
  const raw = metadata?.premiumSlug ?? metadata?.toolSlug;
  if (typeof raw !== "string") {
    return undefined;
  }
  const trimmed = raw.trim();
  if (trimmed.length < 2 || trimmed.length > 80) {
    return undefined;
  }
  if (!/^[a-z0-9-]+$/.test(trimmed)) {
    return undefined;
  }
  return trimmed;
}

function entitlementDocIdForStripeSession(sessionId: string): string {
  return `stripe_session_${sessionId}`;
}

function entitlementDocIdForStripeSubscription(subscriptionId: string): string {
  return `stripe_sub_${subscriptionId}`;
}

function mapStripeSubscriptionStatusToEntitlementStatus(
  stripeStatus: Stripe.Subscription.Status
): EntitlementStatus {
  if (stripeStatus === "active" || stripeStatus === "trialing") {
    return "active";
  }
  if (stripeStatus === "canceled") {
    return "canceled";
  }
  if (
    stripeStatus === "past_due" ||
    stripeStatus === "unpaid" ||
    stripeStatus === "incomplete" ||
    stripeStatus === "incomplete_expired"
  ) {
    return "pending";
  }
  return "expired";
}

async function mergeEntitlementWrite(
  docId: string,
  payload: PremiumEntitlementWrite
): Promise<void> {
  const db = admin.firestore();
  const ref = db.collection(PREMIUM_ENTITLEMENTS_COLLECTION).doc(docId);
  const existing = await ref.get();
  const existingData = existing.data();

  const createdAt =
    typeof existingData?.createdAt === "string" ? existingData.createdAt : payload.createdAt;
  const reportsUsed =
    typeof existingData?.reportsUsed === "number" ? existingData.reportsUsed : payload.reportsUsed;

  await ref.set(
    {
      ...payload,
      createdAt,
      reportsUsed,
      updatedAt: payload.updatedAt,
    },
    { merge: true }
  );
}

export async function upsertCheckoutSessionEntitlement(
  uid: string,
  session: Stripe.Checkout.Session,
  subscription?: Stripe.Subscription
): Promise<void> {
  const entitlementPlan = resolveEntitlementPlanFromMetadata(session.metadata);
  if (!entitlementPlan) {
    console.warn("stripeWebhook: unknown plan — skipping entitlement write", {
      sessionId: session.id,
      plan: session.metadata?.plan,
      planId: session.metadata?.planId,
    });
    return;
  }

  if (session.metadata?.createdBy && session.metadata.createdBy !== "sectorcalc") {
    console.warn("stripeWebhook: invalid createdBy — skipping entitlement write", {
      sessionId: session.id,
    });
    return;
  }

  const metadataUserId = session.metadata?.userId ?? session.metadata?.uid;
  if (metadataUserId && metadataUserId !== uid) {
    console.warn("stripeWebhook: userId mismatch — skipping entitlement write", {
      sessionId: session.id,
    });
    return;
  }

  const now = new Date().toISOString();
  const premiumSlug = resolvePremiumSlug(session.metadata);
  const subscriptionId = readStripeId(session.subscription);
  const rawCurrentPeriodEnd = readSubscriptionCurrentPeriodEnd(subscription);
  const currentPeriodEnd = rawCurrentPeriodEnd
    ? new Date(rawCurrentPeriodEnd * 1000).toISOString()
    : undefined;

  const sessionPayload: PremiumEntitlementWrite = {
    id: entitlementDocIdForStripeSession(session.id),
    userId: uid,
    stripeCustomerId: readStripeId(session.customer),
    stripeSessionId: session.id,
    stripeSubscriptionId: subscriptionId,
    stripePaymentIntentId: readStripeId(session.payment_intent),
    plan: entitlementPlan,
    status: "active",
    premiumSlug: entitlementPlan === "single_report" ? premiumSlug : undefined,
    reportLimit: entitlementPlan === "single_report" ? 1 : undefined,
    reportsUsed: 0,
    createdAt: now,
    updatedAt: now,
    expiresAt: entitlementPlan === "single_report" ? undefined : currentPeriodEnd,
    source: "stripe_checkout",
  };

  await mergeEntitlementWrite(sessionPayload.id, sessionPayload);

  if (subscriptionId) {
    const subscriptionPayload: PremiumEntitlementWrite = {
      id: entitlementDocIdForStripeSubscription(subscriptionId),
      userId: uid,
      stripeCustomerId: readStripeId(session.customer),
      stripeSessionId: session.id,
      stripeSubscriptionId: subscriptionId,
      plan: entitlementPlan,
      status: "active",
      createdAt: now,
      updatedAt: now,
      expiresAt: currentPeriodEnd,
      source: "stripe_checkout",
    };
    await mergeEntitlementWrite(subscriptionPayload.id, subscriptionPayload);
  }
}

export async function updateSubscriptionEntitlementStatus(
  uid: string,
  subscription: Stripe.Subscription
): Promise<void> {
  const entitlementPlan = resolveEntitlementPlanFromMetadata(subscription.metadata);
  if (!entitlementPlan) {
    console.warn("stripeWebhook: unknown subscription plan — skipping entitlement update", {
      subscriptionId: subscription.id,
    });
    return;
  }

  const now = new Date().toISOString();
  const status = mapStripeSubscriptionStatusToEntitlementStatus(subscription.status);
  const rawCurrentPeriodEnd = readSubscriptionCurrentPeriodEnd(subscription);
  const currentPeriodEnd = rawCurrentPeriodEnd
    ? new Date(rawCurrentPeriodEnd * 1000).toISOString()
    : undefined;

  const payload: PremiumEntitlementWrite = {
    id: entitlementDocIdForStripeSubscription(subscription.id),
    userId: uid,
    stripeCustomerId: readStripeId(subscription.customer),
    stripeSubscriptionId: subscription.id,
    plan: entitlementPlan,
    status,
    createdAt: now,
    updatedAt: now,
    expiresAt: currentPeriodEnd,
    source: "stripe_checkout",
  };

  await mergeEntitlementWrite(payload.id, payload);
}

export async function markSubscriptionEntitlementPaymentFailed(
  subscriptionId: string
): Promise<void> {
  const db = admin.firestore();
  const ref = db
    .collection(PREMIUM_ENTITLEMENTS_COLLECTION)
    .doc(entitlementDocIdForStripeSubscription(subscriptionId));
  const existing = await ref.get();
  if (!existing.exists) {
    return;
  }

  await ref.set(
    {
      status: "pending",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}
