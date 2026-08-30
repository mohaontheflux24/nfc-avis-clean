import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe, priceIdForPlan } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { plan = "starter", merchantId: requestedMerchantId } = await req.json();
  const role = (session.user as any).role;
  const merchantId = role === "ADMIN" ? requestedMerchantId : (session.user as any).merchantId;
  if (!merchantId) return NextResponse.json({ error: "Commerce manquant" }, { status: 400 });

  const merchant = await prisma.merchant.findUnique({ where: { id: merchantId }, include: { subscription: true } });
  if (!merchant) return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });

  const stripe = getStripe();
  let customerId = merchant.subscription?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      name: merchant.name,
      email: merchant.contactEmail ?? undefined,
      metadata: { merchantId: merchant.id, merchantSlug: merchant.slug },
    });
    customerId = customer.id;
  }

  const price = priceIdForPlan(plan);
  if (!price) return NextResponse.json({ error: `Prix Stripe non configuré pour ${plan}` }, { status: 500 });

  await prisma.subscription.upsert({
    where: { merchantId },
    update: { stripeCustomerId: customerId, plan, stripePriceId: price },
    create: { merchantId, stripeCustomerId: customerId, plan, stripePriceId: price },
  });

  const origin = new URL(req.url).origin;
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    billing_address_collection: "required",
    tax_id_collection: { enabled: true },
    customer_update: { address: "auto", name: "auto" },
    success_url: `${origin}/dashboard?billing=success`,
    cancel_url: `${origin}/dashboard?billing=cancel`,
    metadata: { merchantId, plan },
    subscription_data: { metadata: { merchantId, plan } },
  });

  return NextResponse.json({ url: checkout.url });
}
