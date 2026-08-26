import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { defaultTrialEnd } from "@/lib/subscription";
import { generateTemporaryPassword, slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const merchants = await prisma.merchant.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, subscription: true, _count: { select: { scans: true, reviews: true, clicks: true, cards: true } } },
  });
  return NextResponse.json({ merchants });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const googleReviewUrl = String(body.googleReviewUrl || "").trim();
  const logoUrl = body.logoUrl ? String(body.logoUrl).trim() : null;
  const primaryColor = body.primaryColor || "#14141c";
  const accentColor = body.accentColor || "#c9a15a";

  if (!name || !email || !googleReviewUrl) {
    return NextResponse.json({ error: "Nom, email et lien Google Avis obligatoires." }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });

  const baseSlug = slugify(name) || "commerce";
  let slug = baseSlug;
  let n = 2;
  while (await prisma.merchant.findUnique({ where: { slug } })) slug = `${baseSlug}-${n++}`;

  const temporaryPassword = generateTemporaryPassword();
  const password = await bcrypt.hash(temporaryPassword, 12);

  const merchant = await prisma.$transaction(async (tx) => {
    const created = await tx.merchant.create({
      data: {
        name,
        slug,
        contactEmail: email,
        whatsappNumber: phone || null,
        googleReviewUrl,
        logoUrl,
        primaryColor,
        accentColor,
        active: true,
        keepPublicPageWhenInactive: true,
        subscription: {
          create: {
            plan: "starter",
            status: "TRIAL",
            trialEndsAt: defaultTrialEnd(),
          },
        },
      },
    });

    await tx.user.create({ data: { email, password, role: "MERCHANT", merchantId: created.id } });
    await tx.nfcCard.create({ data: { merchantId: created.id, cardId: slug, label: "Carte principale" } });
    return created;
  });

  return NextResponse.json({ merchant, temporaryPassword, publicPath: `/r/${slug}` }, { status: 201 });
}
