import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allowRequest, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!allowRequest(`scan:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  const { cardId } = await req.json();
  const normalizedCardId = String(cardId || "");

  if (!allowRequest(`scan-card:${ip}:${normalizedCardId}`, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de scans rapprochés" }, { status: 429 });
  }

  const card = await prisma.nfcCard.findUnique({
    where: { cardId: normalizedCardId },
    include: { merchant: true },
  });

  if (!card || (!card.merchant.active && !card.merchant.keepPublicPageWhenInactive)) {
    return NextResponse.json({ error: "Carte introuvable" }, { status: 404 });
  }

  await prisma.scanEvent.create({ data: { merchantId: card.merchantId, cardId: card.id } });
  return NextResponse.json({ ok: true });
}
