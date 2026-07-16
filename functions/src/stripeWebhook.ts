import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import {
  CHECKOUT_PLAN_PRO,
  CHECKOUT_PLAN_PRO_ANNUAL,
  CHECKOUT_PLAN_SINGLE_REPORT,
  CHECKOUT_PLAN_TEAM,
  CHECKOUT_PLAN_CREDIT_PACKAGE,
  USERS_COLLECTION,
  USER_PURCHASES_SUBCOLLECTION,
} from "./constants";
import {
  markSubscriptionEntitlementPaymentFailed,
  updateSubscriptionEntitlementStatus,
  upsertCheckoutSessionEntitlement,
} from "./entitlementPersistence";
import { readSubscriptionCurrentPeriodEnd, readInvoiceSubscription } from "./stripeCompat";
import { addUserCredits } from "./creditPersistence";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const stripeWebhookSecret = defineString("STRIPE_WEBHOOK_SECRET", { default: "" });

if (!admin.apps.length) {
  admin.initializeApp();
}

type FirestoreSubscriptionStatus = "active" | "canceled" | "past_due" | "none";

type CheckoutPlan =
  | typeof CHECKOUT_PLAN_PRO
  | typeof CHECKOUT_PLAN_SINGLE_REPORT
  | typeof CHECKOUT_PLAN_PRO_ANNUAL
  | typeof CHECKOUT_PLAN_TEAM;

interface FirestoreSubscription {
  status: FirestoreSubscriptionStatus;
  plan?: CheckoutPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodEnd?: string;
  updatedAt: string;
}

function resolveUid(metadata: Stripe.Metadata | null | undefined): string | undefined {
  if (!metadata) {
    return undefined;
  }
  const uid = metadata.uid ?? metadata.userId ?? metadata.firebaseUID;
  return typeof uid === "string" && uid.length > 0 ? uid : undefined;
}

function mapStripeSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): FirestoreSubscriptionStatus {
  if (stripeStatus === "active" || stripeStatus === "trialing") {
    return "active";
  }
  if (
    stripeStatus === "past_due" ||
    stripeStatus === "unpaid" ||
    stripeStatus === "incomplete" ||
    stripeStatus === "incomplete_expired"
  ) {
    return "past_due";
  }
  if (stripeStatus === "canceled") {
    return "canceled";
  }
  return "none";
}

function resolveStripePriceId(subscription: Stripe.Subscription): string | undefined {
  const firstItem = subscription.items.data[0];
  if (!firstItem?.price?.id) {
    return undefined;
  }
  return firstItem.price.id;
}

/** Read existing plan from Firestore to carry forward on webhook renewals. */
async function getExistingPlan(uid: string): Promise<CheckoutPlan | undefined> {
  try {
    const db = admin.firestore();
    const snap = await db.collection(USERS_COLLECTION).doc(uid).get();
    if (!snap.exists) return undefined;
    const sub = (snap.data() as Record<string, unknown>)?.subscription as Record<string, unknown> | undefined;
    const rawPlan = typeof sub?.plan === "string" ? sub.plan : undefined;
    // Validate against known CheckoutPlan values
    if (
      rawPlan === CHECKOUT_PLAN_PRO ||
      rawPlan === CHECKOUT_PLAN_PRO_ANNUAL ||
      rawPlan === CHECKOUT_PLAN_TEAM
    ) {
      return rawPlan;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function subscriptionPayloadFromStripe(
  subscription: Stripe.Subscription,
  customerId?: string,
  plan?: CheckoutPlan
): FirestoreSubscription {
  const rawCurrentPeriodEnd = readSubscriptionCurrentPeriodEnd(subscription);
  const currentPeriodEnd = rawCurrentPeriodEnd
    ? new Date(rawCurrentPeriodEnd * 1000).toISOString()
    : undefined;

  const resolvedPlan =
    plan ??
    (subscription.metadata?.plan === CHECKOUT_PLAN_TEAM
      ? CHECKOUT_PLAN_TEAM
      : subscription.metadata?.plan === CHECKOUT_PLAN_PRO_ANNUAL
        ? CHECKOUT_PLAN_PRO_ANNUAL
        : subscription.metadata?.plan === CHECKOUT_PLAN_PRO
          ? CHECKOUT_PLAN_PRO
          : undefined);

  return {
    status: mapStripeSubscriptionStatus(subscription.status),
    plan: resolvedPlan,
    stripeCustomerId:
      customerId ??
      (typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id),
    stripeSubscriptionId: subscription.id,
    stripePriceId: resolveStripePriceId(subscription),
    currentPeriodEnd,
    updatedAt: new Date().toISOString(),
  };
}

async function writeUserSubscription(
  uid: string,
  email: string | null | undefined,
  subscription: FirestoreSubscription
): Promise<void> {
  const db = admin.firestore();
  await db.collection(USERS_COLLECTION).doc(uid).set(
    {
      email: email ?? null,
      subscription,
      updatedAt: subscription.updatedAt,
    },
    { merge: true }
  );
}

interface SingleReportPurchase {
  plan: typeof CHECKOUT_PLAN_SINGLE_REPORT;
  toolSlug: string;
  sessionId: string;
  createdAt: string;
  status: "completed";
  amount?: number;
  currency?: string;
}

async function writeSingleReportPurchase(
  uid: string,
  session: Stripe.Checkout.Session
): Promise<void> {
  const toolSlug =
    typeof session.metadata?.toolSlug === "string" &&
    session.metadata.toolSlug.trim().length > 0
      ? session.metadata.toolSlug.trim()
      : typeof session.metadata?.tool_key === "string" &&
          session.metadata.tool_key.trim().length > 0
        ? session.metadata.tool_key.trim()
        : "cnc-quote-risk-analyzer";

  const purchase: SingleReportPurchase = {
    plan: CHECKOUT_PLAN_SINGLE_REPORT,
    toolSlug,
    sessionId: session.id,
    createdAt: new Date().toISOString(),
    status: "completed",
    amount:
      typeof session.amount_total === "number" ? session.amount_total : undefined,
    currency:
      typeof session.currency === "string" ? session.currency : undefined,
  };

  const db = admin.firestore();
  const purchaseRef = db
    .collection(USERS_COLLECTION)
    .doc(uid)
    .collection(USER_PURCHASES_SUBCOLLECTION)
    .doc(session.id);

  const existing = await purchaseRef.get();
  if (existing.exists) {
    return;
  }

  await purchaseRef.set(purchase);
}

export async function handleStripeWebhook(
  req: Request,
  res: Response
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    return;
  }

  const secretKey = stripeSecretKey.value().trim();
  const webhookSecret = stripeWebhookSecret.value().trim();
  if (!secretKey || !webhookSecret) {
    res.status(503).send("Webhook not configured.");
    return;
  }

  const stripe = new Stripe(secretKey);
  const signature = req.get("stripe-signature");
  if (!signature) {
    res.status(400).send("Missing Stripe signature.");
    return;
  }

  let event: Stripe.Event;
  try {
    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody;
    if (!rawBody) {
      res.status(400).send("Missing raw request body.");
      return;
    }
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    res.status(400).send("Invalid webhook signature.");
    return;
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const uid =
          resolveUid(session.metadata) ??
          (typeof session.client_reference_id === "string"
            ? session.client_reference_id
            : undefined);

        if (!uid) {
          break;
        }

        if (
          session.mode === "payment" &&
          session.metadata?.plan === CHECKOUT_PLAN_SINGLE_REPORT
        ) {
          await writeSingleReportPurchase(uid, session);
          await upsertCheckoutSessionEntitlement(uid, session);
          break;
        }

        if (
          session.mode === "payment" &&
          (session.metadata?.plan === CHECKOUT_PLAN_CREDIT_PACKAGE ||
            session.metadata?.type === CHECKOUT_PLAN_CREDIT_PACKAGE)
        ) {
          const creditsRaw = session.metadata?.credits;
          const credits =
            typeof creditsRaw === "string" ? Number.parseInt(creditsRaw, 10) : NaN;
          if (Number.isFinite(credits) && credits > 0) {
            await addUserCredits(uid, credits, { stripeSessionId: session.id });
          }
          break;
        }

        if (
          session.mode === "payment" &&
          session.metadata?.source === "baris_pro_purchase"
        ) {
          await writeSingleReportPurchase(uid, session);
          await upsertCheckoutSessionEntitlement(uid, session);
          break;
        }

        if (!session.subscription) {
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          String(session.subscription)
        );
        await writeUserSubscription(
          uid,
          session.customer_details?.email,
          subscriptionPayloadFromStripe(
            subscription,
            typeof session.customer === "string"
              ? session.customer
              : session.customer?.id,
            session.metadata?.plan === CHECKOUT_PLAN_TEAM
              ? CHECKOUT_PLAN_TEAM
              : session.metadata?.plan === CHECKOUT_PLAN_PRO_ANNUAL
                ? CHECKOUT_PLAN_PRO_ANNUAL
                : CHECKOUT_PLAN_PRO
          )
        );
        await upsertCheckoutSessionEntitlement(uid, session, subscription);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = resolveUid(subscription.metadata);
        if (!uid) {
          break;
        }
        // Carry-forward: if Stripe metadata lacks plan, preserve existing Firestore plan
        // to prevent plan erosion on renewal (checkout.session.completed sets plan,
        // but customer.subscription.updated may not have metadata.plan).
        const existingPlan = await getExistingPlan(uid);
        await writeUserSubscription(
          uid,
          undefined,
          subscriptionPayloadFromStripe(subscription, undefined, existingPlan)
        );
        await updateSubscriptionEntitlementStatus(uid, subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = resolveUid(subscription.metadata);
        if (!uid) {
          break;
        }
        const existingPlan = await getExistingPlan(uid);
        const payload = subscriptionPayloadFromStripe(subscription, undefined, existingPlan);
        payload.status = "canceled";
        await writeUserSubscription(uid, undefined, payload);
        await updateSubscriptionEntitlementStatus(uid, subscription);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const invoiceSubscription = readInvoiceSubscription(invoice);
        const subscriptionId =
          typeof invoiceSubscription === "string"
            ? invoiceSubscription
            : invoiceSubscription?.id;
        if (subscriptionId) {
          await markSubscriptionEntitlementPaymentFailed(subscriptionId);
        }
        break;
      }
      default:
        break;
    }

    res.status(200).json({ received: true });
  } catch {
    res.status(500).send("Webhook handler failed.");
  }
}
