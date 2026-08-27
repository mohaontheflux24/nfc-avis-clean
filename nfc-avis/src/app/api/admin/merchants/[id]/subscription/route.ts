import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = new Set(["TRIAL", "ACTIVE", "PAST_DUE", "CANCELED"]);
const allowedPlans = new Set(["starter", "pro", "premium"]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const merchant = await prisma.merchant.findUnique({ where: { id: params.id } });
  if (!merchant) return NextResponse.json({ error: "Commerce introuvable" }, { status: 404 });

  const body = await req.json();
  const status = body.status ? String(body.status) : undefined;
  const plan = body.plan ? String(body.plan).toLowerCase() : undefined;

  if (status && !allowedStatuses.has(status)) {
    return NextResponse.json({ error: "Statut d'abonnement invalide" }, { status: 400 });
  }
  if (plan && !allowedPlans.has(plan)) {
    return NextResponse.json({ error: "Formule invalide" }, { status: 400 });
  }

  const parseDate = (value: unknown) => {
    if (value === null) return null;
    if (value === undefined || value === "") return undefined;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? "invalid" : date;
  };

  const endsAt = parseDate(body.endsAt);
  const trialEndsAt = parseDate(body.trialEndsAt);
  if (endsAt === "invalid" || trialEndsAt === "invalid") {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const subscription = await prisma.subscription.upsert({
    where: { merchantId: params.id },
    create: {
      merchantId: params.id,
      plan: plan || "starter",
      status: (status as any) || "ACTIVE",
      endsAt: endsAt ?? null,
      trialEndsAt: trialEndsAt ?? null,
    },
    update: {
      plan,
      status: status as any,
      endsAt,
      trialEndsAt,
    },
  });

  return NextResponse.json({ subscription });
}
