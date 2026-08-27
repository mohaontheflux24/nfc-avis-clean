import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allowRequest, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (!allowRequest(`google-click:${ip}`, 20, 10 * 60_000)) {
      return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
    }

    const { cardId, reviewId } = await req.json();
    const normalizedCardId = String(cardId || "");
    if (!normalizedCardId) {
      return NextResponse.json({ error: "cardId manquant" }, { status: 400 });
    }

    const card = await prisma.nfcCard.findUnique({
      where: { cardId: normalizedCardId },
      include: { merchant: true },
    });

    if (!card || (!card.merchant.active && !card.merchant.keepPublicPageWhenInactive)) {
      return NextResponse.json({ error: "Carte introuvable" }, { status: 404 });
    }

    let safeReviewId: string | null = null;
    if (reviewId) {
      const review = await prisma.review.findFirst({
        where: { id: String(reviewId), merchantId: card.merchantId, cardId: card.id },
        select: { id: true },
      });
      safeReviewId = review?.id || null;
    }

    await prisma.googleClickEvent.create({
      data: { merchantId: card.merchantId, reviewId: safeReviewId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
