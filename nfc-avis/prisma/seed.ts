import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@monsite.com" },
    update: {},
    create: {
      email: "admin@monsite.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const merchant = await prisma.merchant.upsert({
    where: { slug: "le-petit-cafe" },
    update: {},
    create: {
      slug: "le-petit-cafe",
      name: "Le Petit Café",
      googleReviewUrl: "https://g.page/r/exemple/review",
      whatsappNumber: "+33600000000",
      contactEmail: "contact@lepetitcafe.fr",
      primaryColor: "#14141c",
      accentColor: "#c9a15a",
    },
  });

  const merchantPassword = await bcrypt.hash("merchant1234", 10);
  await prisma.user.upsert({
    where: { email: "commercant@lepetitcafe.fr" },
    update: {},
    create: {
      email: "commercant@lepetitcafe.fr",
      password: merchantPassword,
      role: "MERCHANT",
      merchantId: merchant.id,
    },
  });

  await prisma.nfcCard.upsert({
    where: { cardId: "le-petit-cafe" },
    update: {},
    create: {
      cardId: "le-petit-cafe",
      label: "Comptoir principal",
      merchantId: merchant.id,
    },
  });

  console.log("Seed terminé.");
  console.log("Admin: admin@monsite.com / admin1234");
  console.log("Commerçant: commercant@lepetitcafe.fr / merchant1234");
  console.log("URL de test: /r/le-petit-cafe");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
