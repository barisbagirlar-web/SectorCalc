import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import { USERS_COLLECTION } from "./constants";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const stripeWebhookSecret = defineString("STRIPE_WEBHOOK_SECRET", { default: "" });

if (!admin.apps.length) {
  admin.initializeApp();
}

interface SubscriptionWritePayload {
  status: "active" | "inactive" | "canceled" | "past_due" | "trialing";
  plan: "pro";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  updatedAt: string;
}

async function writeUserSubscription(
  uid: string,
  email: string | null | undefined,
  subscription: SubscriptionWritePayload
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

function subscriptionPayloadFromStripe(
  subscription: Stripe.Subscription,
  customerId?: string
): SubscriptionWritePayload {
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : undefined;

  let status: SubscriptionWritePayload["status"] = "inactive";
  if (subscription.status === "active" || subscription.status === "trialing") {
    status = subscription.status;
  } else if (subscription.status === "past_due") {
    status = "past_due";
  } else if (subscription.status === "canceled") {
    status = "canceled";
  }

  return {
    status,
    plan: "pro",
    stripeCustomerId: customerId ?? (typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id),
    stripeSubscriptionId: subscription.id,
    currentPeriodEnd,
    updatedAt: new Date().toISOString(),
  };
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
          session.metadata?.firebaseUID ??
          session.client_reference_id ??
          undefined;
        if (!uid || !session.subscription) {
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
            typeof session.customer === "string" ? session.customer : session.customer?.id
          )
        );
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const uid = subscription.metadata?.firebaseUID;
        if (!uid) {
          break;
        }

        const payload = subscriptionPayloadFromStripe(subscription);
        if (event.type === "customer.subscription.deleted") {
          payload.status = "canceled";
        }
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
