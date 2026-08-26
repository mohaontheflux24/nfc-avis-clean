import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { merchantId, reviewId } = await req.json();
    if (!merchantId) {
      return NextResponse.json({ error: "merchantId manquant" }, { status: 400 });
    }

    await prisma.googleClickEvent.create({
      data: { merchantId, reviewId: reviewId || null },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
