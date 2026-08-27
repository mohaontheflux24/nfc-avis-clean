import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isSubscriptionUsable } from "@/lib/subscription";
import ReviewFlow from "./review-flow";

export const dynamic = "force-dynamic";

export default async function CardPage({ params }: { params: { cardId: string } }) {
  const card = await prisma.nfcCard.findUnique({
    where: { cardId: params.cardId },
    include: { merchant: { include: { subscription: true } } },
  });

  if (!card) notFound();
  const { merchant } = card;
  if (!merchant.active && !merchant.keepPublicPageWhenInactive) notFound();

  if (!isSubscriptionUsable(merchant)) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-paper-200 px-5">
        <div className="card-surface max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-medium text-ink-900">Page temporairement indisponible</h1>
          <p className="mt-3 text-sm text-slate-450">
            Le service d&apos;avis de {merchant.name} est actuellement suspendu.
          </p>
        </div>
      </main>
    );
  }

  return (
    <ReviewFlow
      cardId={card.cardId}
      merchantId={merchant.id}
      merchantName={merchant.name}
      logoUrl={merchant.logoUrl}
      googleReviewUrl={merchant.googleReviewUrl}
      primaryColor={merchant.primaryColor}
      accentColor={merchant.accentColor}
    />
  );
}
