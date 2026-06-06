import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import {
  CHECKOUT_PLAN_SINGLE_REPORT,
  USERS_COLLECTION,
  USER_PURCHASES_SUBCOLLECTION,
} from "./constants";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const stripeWebhookSecret = defineString("STRIPE_WEBHOOK_SECRET", { default: "" });

if (!admin.apps.length) {
  admin.initializeApp();
}

type FirestoreSubscriptionStatus = "active" | "canceled" | "past_due" | "none";

interface FirestoreSubscription {
  status: FirestoreSubscriptionStatus;
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
  const uid = metadata.uid ?? metadata.firebaseUID;
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

function subscriptionPayloadFromStripe(
  subscription: Stripe.Subscription,
  customerId?: string
): FirestoreSubscription {
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : undefined;

  return {
    status: mapStripeSubscriptionStatus(subscription.status),
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
}

async function writeSingleReportPurchase(
  uid: string,
  session: Stripe.Checkout.Session
): Promise<void> {
  const toolSlug =
    typeof session.metadata?.toolSlug === "string" &&
    session.metadata.toolSlug.trim().length > 0
      ? session.metadata.toolSlug.trim()
      : "cnc-quote-risk-analyzer";

  const purchase: SingleReportPurchase = {
    plan: CHECKOUT_PLAN_SINGLE_REPORT,
    toolSlug,
    sessionId: session.id,
    createdAt: new Date().toISOString(),
    status: "completed",
  };

  const db = admin.firestore();
  await db
    .collection(USERS_COLLECTION)
    .doc(uid)
    .collection(USER_PURCHASES_SUBCOLLECTION)
    .doc(session.id)
    .set(purchase, { merge: true });
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
              : session.customer?.id
          )
        );
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = resolveUid(subscription.metadata);
        if (!uid) {
          break;
        }
        await writeUserSubscription(uid, undefined, subscriptionPayloadFromStripe(subscription));
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = resolveUid(subscription.metadata);
        if (!uid) {
          break;
        }
        const payload = subscriptionPayloadFromStripe(subscription);
        payload.status = "canceled";
        await writeUserSubscription(uid, undefined, payload);
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
