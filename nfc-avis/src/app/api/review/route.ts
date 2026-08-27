import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allowRequest, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!allowRequest(`review:${ip}`, 12, 10 * 60_000)) {
    return NextResponse.json({ error: "Trop de tentatives, réessaie plus tard." }, { status: 429 });
  }

  const body = await req.json();
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Note invalide" }, { status: 400 });
  }

  const normalizedCardId = String(body.cardId || "");
  if (!allowRequest(`review-card:${ip}:${normalizedCardId}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: "Trop d'avis envoyés pour cette carte." }, { status: 429 });
  }

  const card = await prisma.nfcCard.findUnique({
    where: { cardId: normalizedCardId },
    include: { merchant: true },
  });
  if (!card || (!card.merchant.active && !card.merchant.keepPublicPageWhenInactive)) {
    return NextResponse.json({ error: "Carte introuvable" }, { status: 404 });
  }

  const isPrivate = rating <= 3;
  if (isPrivate && !String(body.comment || "").trim()) {
    return NextResponse.json({ error: "Le commentaire est obligatoire." }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      merchantId: card.merchantId,
      cardId: card.id,
      rating,
      isPrivate,
      firstName: body.firstName ? String(body.firstName).trim().slice(0, 80) : null,
      comment: body.comment ? String(body.comment).trim().slice(0, 2000) : null,
      phone: body.phone ? String(body.phone).trim().slice(0, 40) : null,
    },
  });

  return NextResponse.json({ reviewId: review.id, isPrivate });
}
