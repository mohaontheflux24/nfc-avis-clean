import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendPeppolInvoice } from "@/lib/peppol";

export const runtime = "nodejs";

function invoiceStatus(status?: string | null) {
  if (status === "paid") return "PAID" as const;
  if (status === "void") return "VOID" as const;
  if (status === "uncollectible") return "UNCOLLECTIBLE" as const;
  if (status === "open") return "OPEN" as const;
  return "DRAFT" as const;
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const signature = headers().get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Webhook Stripe non configuré" }, { status: 400 });

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), signature, secret);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const obj: any = event.data.object;

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const merchantId = obj.metadata?.merchantId;
    if (merchantId) {
      const status = event.type === "customer.subscription.deleted" ? "CANCELED" : obj.status === "active" || obj.status === "trialing" ? "ACTIVE" : obj.status === "past_due" || obj.status === "unpaid" ? "PAST_DUE" : "TRIAL";
      await prisma.subscription.upsert({
        where: { merchantId },
        update: { stripeSubscriptionId: obj.id, stripeCustomerId: String(obj.customer), status, endsAt: obj.current_period_end ? new Date(obj.current_period_end * 1000) : null },
        create: { merchantId, stripeSubscriptionId: obj.id, stripeCustomerId: String(obj.customer), status },
      });
    }
  }

  if (event.type === "invoice.created" || event.type === "invoice.finalized" || event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
    const subscriptionId = typeof obj.subscription === "string" ? obj.subscription : obj.subscription?.id;
    const sub = subscriptionId ? await prisma.subscription.findFirst({ where: { stripeSubscriptionId: subscriptionId } }) : null;
    const customerSub = sub ?? await prisma.subscription.findFirst({ where: { stripeCustomerId: String(obj.customer) } });
    if (customerSub) {
      const subtotal = obj.total_excluding_tax ?? obj.subtotal_excluding_tax ?? obj.subtotal ?? 0;
      const total = obj.total ?? 0;
      const vat = Math.max(0, total - subtotal);
      const saved = await prisma.invoice.upsert({
        where: { stripeInvoiceId: obj.id },
        update: { number: obj.number ?? undefined, status: event.type === "invoice.payment_failed" ? "OPEN" : invoiceStatus(obj.status), subtotalCents: subtotal, vatCents: vat, totalCents: total, dueAt: obj.due_date ? new Date(obj.due_date * 1000) : null, paidAt: obj.status_transitions?.paid_at ? new Date(obj.status_transitions.paid_at * 1000) : null },
        create: { merchantId: customerSub.merchantId, stripeInvoiceId: obj.id, number: obj.number ?? undefined, status: event.type === "invoice.payment_failed" ? "OPEN" : invoiceStatus(obj.status), subtotalCents: subtotal, vatCents: vat, totalCents: total, currency: String(obj.currency ?? "eur").toUpperCase(), issuedAt: obj.created ? new Date(obj.created * 1000) : new Date(), dueAt: obj.due_date ? new Date(obj.due_date * 1000) : null, paidAt: obj.status_transitions?.paid_at ? new Date(obj.status_transitions.paid_at * 1000) : null },
      });

      if (event.type === "invoice.paid" && saved.peppolStatus !== "sent") {
        const merchant = await prisma.merchant.findUnique({ where: { id: customerSub.merchantId } });
        const customer: any = await stripe.customers.retrieve(String(obj.customer));
        if (merchant && !customer.deleted) {
          const taxIds = await stripe.customers.listTaxIds(customer.id, { limit: 10 });
          const vatNumber = taxIds.data.find((x: any) => x.type === "eu_vat")?.value;
          try {
            const sent = await sendPeppolInvoice({
              invoiceNumber: obj.number ?? saved.id,
              issueDate: new Date((obj.created ?? Math.floor(Date.now()/1000)) * 1000).toISOString().slice(0, 10),
              dueDate: obj.due_date ? new Date(obj.due_date * 1000).toISOString().slice(0, 10) : undefined,
              currency: String(obj.currency ?? "eur").toUpperCase(),
              seller: { name: process.env.NEXT_PUBLIC_LEGAL_NAME || "NFC Avis", vatNumber: process.env.NEXT_PUBLIC_VAT_NUMBER, companyNumber: process.env.NEXT_PUBLIC_COMPANY_NUMBER, address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS },
              buyer: { name: customer.name || merchant.name, vatNumber, peppolId: customer.metadata?.peppolId, email: customer.email || merchant.contactEmail || undefined },
              lines: [{ description: `Abonnement NFC Avis - ${customerSub.plan}`, quantity: 1, unitPriceCents: subtotal, vatRate: subtotal > 0 ? Math.round((vat / subtotal) * 10000) / 100 : 0 }],
            });
            await prisma.invoice.update({ where: { id: saved.id }, data: { peppolStatus: sent.status, peppolMessageId: sent.messageId ?? null } });
          } catch (e) {
            console.error("Peppol send failed", e);
            await prisma.invoice.update({ where: { id: saved.id }, data: { peppolStatus: "error" } });
          }
        }
      }
    }
  }

  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    const invoiceId = typeof obj.invoice === "string" ? obj.invoice : obj.invoice?.id;
    const invoice = invoiceId ? await prisma.invoice.findUnique({ where: { stripeInvoiceId: invoiceId } }) : null;
    if (invoice) {
      let fee = 0;
      let chargeId: string | undefined;
      if (event.type === "payment_intent.succeeded" && obj.latest_charge) {
        chargeId = typeof obj.latest_charge === "string" ? obj.latest_charge : obj.latest_charge.id;
        try {
          const charge: any = await stripe.charges.retrieve(chargeId, { expand: ["balance_transaction"] });
          fee = typeof charge.balance_transaction === "object" ? charge.balance_transaction.fee ?? 0 : 0;
        } catch {}
      }
      const amount = obj.amount_received ?? obj.amount ?? 0;
      await prisma.payment.upsert({
        where: { stripePaymentIntentId: obj.id },
        update: { status: event.type === "payment_intent.succeeded" ? "SUCCEEDED" : "FAILED", amountCents: amount, feeCents: fee, netCents: Math.max(0, amount - fee), stripeChargeId: chargeId, paidAt: event.type === "payment_intent.succeeded" ? new Date() : null },
        create: { merchantId: invoice.merchantId, invoiceId: invoice.id, stripePaymentIntentId: obj.id, stripeChargeId: chargeId, status: event.type === "payment_intent.succeeded" ? "SUCCEEDED" : "FAILED", amountCents: amount, feeCents: fee, netCents: Math.max(0, amount - fee), currency: String(obj.currency ?? "eur").toUpperCase(), paidAt: event.type === "payment_intent.succeeded" ? new Date() : null },
      });
    }
  }

  return NextResponse.json({ received: true });
}
