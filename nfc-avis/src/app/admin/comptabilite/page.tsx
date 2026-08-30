import { getAccountingSummary, euros } from "@/lib/accounting";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AccountingPage() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const summary = await getAccountingSummary(from, to);
  const recentInvoices = await prisma.invoice.findMany({ orderBy: { issuedAt: "desc" }, take: 10, include: { merchant: true } });

  const cards = [
    ["Ventes HTVA", euros(summary.salesExVat)],
    ["TVA collectée", euros(summary.vatCollected)],
    ["TVA déductible", euros(summary.vatDeductible)],
    ["TVA estimée à payer", euros(summary.vatDueEstimate)],
    ["Encaissements", euros(summary.cashReceived)],
    ["Frais Stripe", euros(summary.stripeFees)],
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-ink-900">Comptabilité automatique</h1>
        <p className="mt-2 text-sm text-ink-500">Mois en cours — calculs indicatifs à vérifier avant toute déclaration officielle.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm text-ink-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-ink-900">Dernières factures</h2>
        <div className="mt-4 space-y-3">
          {recentInvoices.length === 0 ? <p className="text-sm text-ink-500">Aucune facture pour le moment.</p> : recentInvoices.map((inv) => (
            <div key={inv.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 pb-3 text-sm last:border-0">
              <div><p className="font-medium text-ink-900">{inv.merchant.name}</p><p className="text-ink-500">{inv.number || inv.stripeInvoiceId || inv.id}</p></div>
              <div className="text-right"><p className="font-medium">{euros(inv.totalCents)}</p><p className="text-ink-500">Stripe: {inv.status} · Peppol: {inv.peppolStatus || "en attente"}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
