import { execSync } from "node:child_process";

function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL détectée : synchronisation du schéma Prisma…");
  run("npx prisma db push --skip-generate");
} else {
  console.warn("DATABASE_URL absente : build sans synchronisation de base de données.");
}

run("npx prisma generate");
run("npx next build");
