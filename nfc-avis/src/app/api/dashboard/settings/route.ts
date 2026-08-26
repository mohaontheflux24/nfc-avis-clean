import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function currentMerchantId() {
  const session = await getServerSession(authOptions);
  return session?.user?.merchantId || null;
}

export async function GET() {
  const merchantId = await currentMerchantId();
  if (!merchantId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const merchant = await prisma.merchant.findUnique({ where: { id: merchantId }, include: { cards: true, subscription: true } });
  if (!merchant) return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
  return NextResponse.json({ merchant });
}

export async function PATCH(req: Request) {
  const merchantId = await currentMerchantId();
  if (!merchantId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const current = await prisma.merchant.findUnique({ where: { id: merchantId } });
  if (!current) return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
  const body = await req.json();
  const merchant = await prisma.merchant.update({
    where: { id: merchantId },
    data: {
      name: current.merchantCanEditName && body.name ? String(body.name).trim() : undefined,
      logoUrl: body.logoUrl !== undefined ? body.logoUrl || null : undefined,
      googleReviewUrl: body.googleReviewUrl !== undefined ? String(body.googleReviewUrl).trim() : undefined,
      whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber || null : body.phone !== undefined ? body.phone || null : undefined,
      contactEmail: body.contactEmail !== undefined ? body.contactEmail || null : body.email !== undefined ? body.email || null : undefined,
      primaryColor: body.primaryColor || undefined,
      accentColor: body.accentColor || undefined,
    },
  });
  return NextResponse.json({ merchant });
}
