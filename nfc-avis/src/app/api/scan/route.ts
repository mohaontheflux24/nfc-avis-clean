import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { cardId } = await req.json();
  const card = await prisma.nfcCard.findUnique({ where: { cardId: String(cardId || "") }, include: { merchant: true } });
  if (!card || (!card.merchant.active && !card.merchant.keepPublicPageWhenInactive)) {
    return NextResponse.json({ error: "Carte introuvable" }, { status: 404 });
  }
  await prisma.scanEvent.create({ data: { merchantId: card.merchantId, cardId: card.id } });
  return NextResponse.json({ ok: true });
}
