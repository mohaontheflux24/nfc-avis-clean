import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({ setupAvailable: userCount === 0 });
  } catch (error) {
    console.error("Setup status error", error);
    return NextResponse.json(
      { error: "Base de données indisponible. Vérifie DATABASE_URL." },
      { status: 503 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json(
        { error: "La configuration initiale a déjà été effectuée." },
        { status: 409 }
      );
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
    }
    if (password.length < 10) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 10 caractères." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Setup error", error);
    return NextResponse.json(
      { error: "Impossible de créer le compte administrateur." },
      { status: 500 }
    );
  }
}
