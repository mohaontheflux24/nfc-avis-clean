import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY manquante");
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" as any });
  return client;
}

export function priceIdForPlan(plan: string) {
  if (plan === "pro") return process.env.STRIPE_PRICE_PRO;
  return process.env.STRIPE_PRICE_STARTER;
}
