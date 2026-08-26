import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const merchantId = session?.user?.merchantId;
  if (!merchantId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const url = new URL(req.url);
  const period = url.searchParams.get("period") || "30d";
  const from = period === "7d" ? subDays(new Date(), 7) : period === "30d" ? subDays(new Date(), 30) : undefined;
  const createdAt = from ? { gte: from } : undefined;

  const [scans, reviews, clicks] = await Promise.all([
    prisma.scanEvent.findMany({ where: { merchantId, createdAt }, select: { createdAt: true } }),
    prisma.review.findMany({ where: { merchantId, createdAt }, select: { rating: true, createdAt: true } }),
    prisma.googleClickEvent.findMany({ where: { merchantId, createdAt }, select: { createdAt: true } }),
  ]);

  const distribution = [1, 2, 3, 4, 5].map((rating) => ({ rating, count: reviews.filter((r) => r.rating === rating).length }));
  const averageRating = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const byDay = new Map<string, { date: string; scans: number; reviews: number }>();
  for (const s of scans) {
    const date = s.createdAt.toISOString().slice(0, 10);
    const row = byDay.get(date) || { date, scans: 0, reviews: 0 };
    row.scans++;
    byDay.set(date, row);
  }
  for (const r of reviews) {
    const date = r.createdAt.toISOString().slice(0, 10);
    const row = byDay.get(date) || { date, scans: 0, reviews: 0 };
    row.reviews++;
    byDay.set(date, row);
  }

  return NextResponse.json({
    stats: {
      scans: scans.length,
      reviewsCount: reviews.length,
      clicks: clicks.length,
      conversionRate: reviews.length ? Math.round((clicks.length / reviews.length) * 100) : 0,
      averageRating: averageRating ? Number(averageRating.toFixed(2)) : 0,
      distribution,
    },
    series: Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date)),
  });
}
