import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const merchantId = session?.user?.merchantId;
  if (!merchantId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const reviews = await prisma.review.findMany({ where: { merchantId }, orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ reviews });
}
