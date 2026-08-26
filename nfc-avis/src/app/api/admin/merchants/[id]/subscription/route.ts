import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const status = body.status as "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED" | undefined;
  const plan = body.plan ? String(body.plan) : undefined;
  const endsAt = body.endsAt ? new Date(body.endsAt) : body.endsAt === null ? null : undefined;
  const trialEndsAt = body.trialEndsAt ? new Date(body.trialEndsAt) : body.trialEndsAt === null ? null : undefined;
  const subscription = await prisma.subscription.upsert({
    where: { merchantId: params.id },
    create: { merchantId: params.id, plan: plan || "starter", status: status || "ACTIVE", endsAt: endsAt ?? null, trialEndsAt: trialEndsAt ?? null },
    update: { plan, status, endsAt, trialEndsAt },
  });
  return NextResponse.json({ subscription });
}
