import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const merchantId = String(body.merchantId || "");
  const cardId = String(body.cardId || "").trim().toLowerCase();
  const label = String(body.label || "Carte NFC").trim();
  if (!merchantId || !cardId) return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  const exists = await prisma.nfcCard.findUnique({ where: { cardId } });
  if (exists) return NextResponse.json({ error: "Cet identifiant de carte existe déjà." }, { status: 409 });
  const card = await prisma.nfcCard.create({ data: { merchantId, cardId, label } });
  return NextResponse.json({ card }, { status: 201 });
}
