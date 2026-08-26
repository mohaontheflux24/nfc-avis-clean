import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ReviewFlow from "./review-flow";

export const dynamic = "force-dynamic";

export default async function CardPage({
  params,
}: {
  params: { cardId: string };
}) {
  const card = await prisma.nfcCard.findUnique({
    where: { cardId: params.cardId },
    include: { merchant: true },
  });

  if (!card) notFound();

  const { merchant } = card;

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
