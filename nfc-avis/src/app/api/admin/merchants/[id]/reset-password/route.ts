import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateTemporaryPassword } from "@/lib/utils";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const merchant = await prisma.merchant.findUnique({ where: { id: params.id }, include: { user: true } });
  if (!merchant?.user) return NextResponse.json({ error: "Compte commerçant introuvable" }, { status: 404 });
  const temporaryPassword = generateTemporaryPassword();
  const password = await bcrypt.hash(temporaryPassword, 12);
  await prisma.user.update({ where: { id: merchant.user.id }, data: { password } });
  return NextResponse.json({ temporaryPassword });
}
