import Stripe from "stripe";
import type { Request, Response } from "express";
import { defineString } from "firebase-functions/params";
import { authorizeSignedInUser } from "./userAuth";
import { applyCors } from "./cors";
import { CHECKOUT_PLAN_CREDIT_PACKAGE } from "./constants";
import { resolveCreditPriceId } from "./creditStripeKeys";

const stripeSecretKey = defineString("STRIPE_SECRET_KEY", { default: "" });
const publicSiteUrl = defineString("PUBLIC_SITE_URL", {
  default: "https://sectorcalc-bf412.web.app",
});

export interface CreditPackage {
  readonly amount: number;
  readonly priceCents: number;
  readonly name: string;
}

export const CREDIT_PACKAGES: Readonly<Record<string, CreditPackage>> = {
  "1": { amount: 1, priceCents: 199, name: "1 Credit" },
  "5": { amount: 5, priceCents: 499, name: "5 Credits" },
  "15": { amount: 15, priceCents: 799, name: "15 Credits" },
  "30": { amount: 30, priceCents: 1199, name: "30 Credits" },
  "100": { amount: 100, priceCents: 2499, name: "100 Credits" },
};

function resolveConfiguredPriceId(packageId: string): string | null {
  return resolveCreditPriceId(packageId);
}

interface CreditCheckoutRequestBody {
  packageId?: string;
  locale?: string;
}

function sendJson(res: Response, status: number, body: Record<string, unknown>): void {
  res.status(status).json(body);
}

function resolveAppLocale(body: CreditCheckoutRequestBody): string {
  const raw = typeof body.locale === "string" ? body.locale.trim() : "";
  if (["en", "tr", "es", "de", "ar"].includes(raw)) {
    return raw;
  }
  return "en";
}

function resolveStripeCheckoutLocale(
  locale: string
): Stripe.Checkout.SessionCreateParams.Locale {
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

export async function handleCreateCreditCheckout(
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

  const body = (req.body ?? {}) as CreditCheckoutRequestBody;
  const packageId = typeof body.packageId === "string" ? body.packageId.trim() : "";
  const pkg = CREDIT_PACKAGES[packageId];

  if (!pkg) {
    sendJson(res, 400, { success: false, error: "Invalid credit package." });
    return;
  }

  const secretKey = stripeSecretKey.value().trim();
  if (!secretKey) {
    sendJson(res, 503, {
      success: false,
      error: "Credit checkout is not configured yet.",
    });
    return;
  }

  const locale = resolveAppLocale(body);
  const siteUrl = publicSiteUrl.value().trim().replace(/\/$/, "");
  const stripe = new Stripe(secretKey);

  try {
    const configuredPriceId = resolveConfiguredPriceId(packageId);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        configuredPriceId
          ? { price: configuredPriceId, quantity: 1 }
          : {
              price_data: {
                currency: "usd",
                product_data: { name: pkg.name },
                unit_amount: pkg.priceCents,
              },
              quantity: 1,
            },
      ],
      locale: resolveStripeCheckoutLocale(locale),
      success_url: `${localizedSitePath(siteUrl, locale, "/account/credits")}?success=true`,
      cancel_url: `${localizedSitePath(siteUrl, locale, "/account/credits")}?canceled=true`,
      client_reference_id: authResult.uid,
      metadata: {
        uid: authResult.uid,
        userId: authResult.uid,
        plan: CHECKOUT_PLAN_CREDIT_PACKAGE,
        type: CHECKOUT_PLAN_CREDIT_PACKAGE,
        packageId,
        credits: String(pkg.amount),
        createdBy: "sectorcalc",
      },
    });

    if (!session.url) {
      sendJson(res, 500, {
        success: false,
        error: "Checkout session missing URL.",
      });
      return;
    }

    sendJson(res, 200, {
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create credit checkout session.";
    sendJson(res, 500, { success: false, error: message });
  }
}
