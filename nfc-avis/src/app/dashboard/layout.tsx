import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSubscriptionUsable } from "@/lib/subscription";
import Sidebar from "@/components/Sidebar";

const items = [
  { href: "/dashboard", label: "Aperçu", icon: "LayoutDashboard" as const },
  { href: "/dashboard/reviews", label: "Avis reçus", icon: "MessageSquareText" as const },
  { href: "/dashboard/settings", label: "Paramètres", icon: "Settings" as const },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MERCHANT" || !session.user.merchantId) redirect("/login");

  const merchant = await prisma.merchant.findUnique({
    where: { id: session.user.merchantId },
    include: { subscription: true },
  });
  if (!merchant) redirect("/login");

  const usable = isSubscriptionUsable(merchant);

  return (
    <div className="flex min-h-[100dvh] bg-paper-200">
      <Sidebar items={items} title={session.user.merchantName || "Mon commerce"} subtitle="Espace commerçant" />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-10">
          {!usable ? (
            <div className="card-surface mx-auto mt-16 max-w-xl p-8 text-center">
              <h1 className="font-display text-2xl font-medium text-ink-900">Accès au dashboard suspendu</h1>
              <p className="mt-3 text-sm text-slate-450">Ton essai ou ton abonnement n’est plus actif. Contacte l’administrateur pour réactiver ton accès.</p>
            </div>
          ) : children}
        </div>
      </div>
    </div>
  );
}
