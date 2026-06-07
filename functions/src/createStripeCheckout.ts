import * as admin from "firebase-admin";
import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import { authorizeSignedInUser } from "./userAuth";
import { applyCors } from "./cors";
import {
  CHECKOUT_PLAN_PRO,
  CHECKOUT_PLAN_PRO_ANNUAL,
  CHECKOUT_PLAN_SINGLE_REPORT,
  CHECKOUT_PLAN_TEAM,
  USERS_COLLECTION,
} from "./constants";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const stripePriceMonthly = defineString("STRIPE_PRICE_MONTHLY", { default: "" });
const stripePriceSingleVerdict = defineString("STRIPE_PRICE_SINGLE_VERDICT", {
  default: "",
});
const stripePriceProAnnual = defineString("STRIPE_PRICE_PRO_ANNUAL", { default: "" });
const stripePriceTeam = defineString("STRIPE_PRICE_TEAM", { default: "" });
const publicSiteUrl = defineString("PUBLIC_SITE_URL", {
  default: "https://sectorcalc-bf412.web.app",
});

const DEFAULT_PREMIUM_TOOL_SLUG = "cnc-quote-risk-analyzer";

type CheckoutPlan =
  | typeof CHECKOUT_PLAN_PRO
  | typeof CHECKOUT_PLAN_SINGLE_REPORT
  | typeof CHECKOUT_PLAN_PRO_ANNUAL
  | typeof CHECKOUT_PLAN_TEAM;

if (!admin.apps.length) {
  admin.initializeApp();
}

function sendJson(
  res: Response,
  status: number,
  body: Record<string, unknown>
): void {
  res.status(status).json(body);
}

interface CheckoutRequestBody {
  toolSlug?: string;
  locale?: string;
  plan?: CheckoutPlan;
  returnPath?: string;
}

function resolveSafeReturnPath(returnPath?: string): string {
  const trimmed = typeof returnPath === "string" ? returnPath.trim() : "";
  if (
    trimmed.length === 0 ||
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("://")
  ) {
    return "/pricing";
  }
  return trimmed;
}

function buildCheckoutSuccessUrl(
  siteUrl: string,
  locale: string,
  plan: string,
  returnPath: string
): string {
  const base = localizedSitePath(siteUrl, locale, "/checkout/success");
  const params = new URLSearchParams({
    plan,
    return: returnPath,
  });
  return `${base}?session_id={CHECKOUT_SESSION_ID}&${params.toString()}`;
}

function buildCheckoutCancelUrl(
  siteUrl: string,
  locale: string,
  returnPath: string
): string {
  const base = localizedSitePath(siteUrl, locale, "/checkout/cancel");
  return `${base}?return=${encodeURIComponent(returnPath)}`;
}

function resolveExplicitToolSlug(body: CheckoutRequestBody): string | undefined {
  if (typeof body.toolSlug === "string" && body.toolSlug.trim().length > 0) {
    return body.toolSlug.trim();
  }
  return undefined;
}

function resolveToolSlugForMetadata(body: CheckoutRequestBody): string {
  return resolveExplicitToolSlug(body) ?? DEFAULT_PREMIUM_TOOL_SLUG;
}

function resolveCheckoutPlan(body: CheckoutRequestBody): CheckoutPlan {
  if (body.plan === CHECKOUT_PLAN_SINGLE_REPORT) {
    return CHECKOUT_PLAN_SINGLE_REPORT;
  }
  if (body.plan === CHECKOUT_PLAN_PRO_ANNUAL) {
    return CHECKOUT_PLAN_PRO_ANNUAL;
  }
  if (body.plan === CHECKOUT_PLAN_TEAM) {
    return CHECKOUT_PLAN_TEAM;
  }
  return CHECKOUT_PLAN_PRO;
}

function resolveAppLocale(body: CheckoutRequestBody): string {
  const raw = typeof body.locale === "string" ? body.locale.trim() : "";
  if (["en", "tr", "es", "de", "ar"].includes(raw)) {
    return raw;
  }
  return "en";
}

function resolveStripeCheckoutLocale(locale: string): Stripe.Checkout.SessionCreateParams.Locale {
  const map: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
    en: "en",
    tr: "tr",
    es: "es",
    de: "de",
  };
  return map[locale] ?? "auto";
}

function localizedSitePath(siteUrl: string, locale: string, path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/${locale}${normalized}`;
}

async function getExistingCustomerId(uid: string): Promise<string | undefined> {
  const db = admin.firestore();
  const userSnap = await db.collection(USERS_COLLECTION).doc(uid).get();
  const customerId = userSnap.data()?.subscription?.stripeCustomerId;
  return typeof customerId === "string" ? customerId : undefined;
}

async function createSubscriptionSession(
  stripe: Stripe,
  authResult: { uid: string; email: string },
  body: CheckoutRequestBody,
  plan: typeof CHECKOUT_PLAN_PRO | typeof CHECKOUT_PLAN_PRO_ANNUAL | typeof CHECKOUT_PLAN_TEAM,
  priceId: string
): Promise<Stripe.Checkout.Session> {
  const toolSlug = resolveToolSlugForMetadata(body);
  const locale = resolveAppLocale(body);
  const siteUrl = publicSiteUrl.value().trim().replace(/\/$/, "");
  const existingCustomerId = await getExistingCustomerId(authResult.uid);
  const returnPath = resolveSafeReturnPath(body.returnPath);

  const metadata: Record<string, string> = {
    uid: authResult.uid,
    toolSlug,
    plan,
    locale,
    returnPath,
  };

  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    locale: resolveStripeCheckoutLocale(locale),
    success_url: buildCheckoutSuccessUrl(siteUrl, locale, plan, returnPath),
    cancel_url: buildCheckoutCancelUrl(siteUrl, locale, returnPath),
    client_reference_id: authResult.uid,
    customer: existingCustomerId,
    customer_email: existingCustomerId ? undefined : authResult.email,
    metadata,
    subscription_data: {
      metadata,
    },
  });
}

async function createSingleReportPaymentSession(
  stripe: Stripe,
  authResult: { uid: string; email: string },
  body: CheckoutRequestBody
): Promise<Stripe.Checkout.Session> {
  const toolSlug = resolveToolSlugForMetadata(body);
  const locale = resolveAppLocale(body);
  const priceId = stripePriceSingleVerdict.value().trim();
  const siteUrl = publicSiteUrl.value().trim().replace(/\/$/, "");
  const existingCustomerId = await getExistingCustomerId(authResult.uid);
  const returnPath = resolveSafeReturnPath(body.returnPath);

  const metadata: Record<string, string> = {
    uid: authResult.uid,
    plan: CHECKOUT_PLAN_SINGLE_REPORT,
    toolSlug,
    locale,
    returnPath,
  };

  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    locale: resolveStripeCheckoutLocale(locale),
    success_url: buildCheckoutSuccessUrl(
      siteUrl,
      locale,
      CHECKOUT_PLAN_SINGLE_REPORT,
      returnPath
    ),
    cancel_url: buildCheckoutCancelUrl(siteUrl, locale, returnPath),
    client_reference_id: authResult.uid,
    customer: existingCustomerId,
    customer_email: existingCustomerId ? undefined : authResult.email,
    metadata,
  });
}

export async function handleCreateStripeCheckout(
  req: Request,
  res: Response
): Promise<void> {
  if (applyCors(req, res)) {
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { success: false, error: "Method not allowed." });
    return;
  }

  const authResult = await authorizeSignedInUser(req);
  if (!authResult.ok) {
    sendJson(res, authResult.status, { success: false, error: authResult.error });
    return;
  }

  if (!authResult.email) {
    sendJson(res, 400, { success: false, error: "Account email is required for checkout." });
    return;
  }

  const body = (req.body ?? {}) as CheckoutRequestBody;
  const plan = resolveCheckoutPlan(body);
  const secretKey = stripeSecretKey.value().trim();

  if (!secretKey) {
    sendJson(res, 503, {
      success: false,
      error: "Checkout is not configured yet.",
    });
    return;
  }

  const stripe = new Stripe(secretKey);

  try {
    if (plan === CHECKOUT_PLAN_SINGLE_REPORT) {
      const singlePriceId = stripePriceSingleVerdict.value().trim();
      if (!singlePriceId) {
        sendJson(res, 503, {
          success: false,
          error: "Single Verdict checkout is not configured yet.",
        });
        return;
      }

      const session = await createSingleReportPaymentSession(
        stripe,
        { uid: authResult.uid, email: authResult.email },
        body
      );

      if (!session.url) {
        sendJson(res, 500, {
          success: false,
          error: "Checkout session missing URL.",
        });
        return;
      }

      sendJson(res, 200, { success: true, checkoutUrl: session.url });
      return;
    }

    const priceByPlan: Record<
      typeof CHECKOUT_PLAN_PRO | typeof CHECKOUT_PLAN_PRO_ANNUAL | typeof CHECKOUT_PLAN_TEAM,
      string
    > = {
      [CHECKOUT_PLAN_PRO]: stripePriceMonthly.value().trim(),
      [CHECKOUT_PLAN_PRO_ANNUAL]: stripePriceProAnnual.value().trim(),
      [CHECKOUT_PLAN_TEAM]: stripePriceTeam.value().trim(),
    };

    const priceId = priceByPlan[plan].trim();
    if (!priceId) {
      sendJson(res, 503, {
        success: false,
        error: "Checkout is not configured yet.",
      });
      return;
    }

    const session = await createSubscriptionSession(
      stripe,
      { uid: authResult.uid, email: authResult.email },
      body,
      plan,
      priceId
    );

    if (!session.url) {
      sendJson(res, 500, {
        success: false,
        error: "Checkout session missing URL.",
      });
      return;
    }

    sendJson(res, 200, { success: true, checkoutUrl: session.url });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create checkout session.";
    sendJson(res, 500, { success: false, error: message });
  }
}
