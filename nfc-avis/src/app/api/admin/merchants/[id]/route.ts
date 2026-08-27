import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

async function isAdmin() {
  const s = await getServerSession(authOptions);
  return s?.user?.role === "ADMIN";
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const merchant = await prisma.merchant.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, email: true, role: true, createdAt: true } },
      cards: true,
      subscription: true,
    },
  });
  if (!merchant) return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });
  const [scans, reviewsCount, clicks, privateCount, ratingAgg, recentReviews] = await Promise.all([
    prisma.scanEvent.count({ where: { merchantId: params.id } }),
    prisma.review.count({ where: { merchantId: params.id } }),
    prisma.googleClickEvent.count({ where: { merchantId: params.id } }),
    prisma.review.count({ where: { merchantId: params.id, isPrivate: true } }),
    prisma.review.aggregate({ where: { merchantId: params.id }, _avg: { rating: true } }),
    prisma.review.findMany({ where: { merchantId: params.id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  return NextResponse.json({
    merchant,
    stats: {
      scans,
      reviewsCount,
      clicks,
      privateCount,
      averageRating: ratingAgg._avg.rating ? Number(ratingAgg._avg.rating.toFixed(2)) : 0,
      conversionRate: reviewsCount ? Math.round((clicks / reviewsCount) * 100) : 0,
      recentReviews,
    },
  });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const merchant = await prisma.merchant.update({
    where: { id: params.id },
    data: {
      name: body.name,
      logoUrl: body.logoUrl || null,
      googleReviewUrl: body.googleReviewUrl,
      whatsappNumber: body.phone ?? body.whatsappNumber ?? null,
      contactEmail: body.email ?? body.contactEmail ?? null,
      primaryColor: body.primaryColor,
      accentColor: body.accentColor,
      active: typeof body.active === "boolean" ? body.active : undefined,
      keepPublicPageWhenInactive:
        typeof body.keepPublicPageWhenInactive === "boolean" ? body.keepPublicPageWhenInactive : undefined,
      merchantCanEditName:
        typeof body.merchantCanEditName === "boolean" ? body.merchantCanEditName : undefined,
    },
  });
  return NextResponse.json({ merchant });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await prisma.merchant.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
