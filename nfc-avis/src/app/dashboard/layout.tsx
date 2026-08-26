import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { LayoutDashboard, MessageSquareText, Settings } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Aperçu", icon: LayoutDashboard },
  { href: "/dashboard/reviews", label: "Avis reçus", icon: MessageSquareText },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "MERCHANT") redirect("/login");

  return (
    <div className="flex min-h-[100dvh] bg-paper-200">
      <Sidebar
        items={items}
        title={session.user.merchantName || "Mon commerce"}
        subtitle="Espace commerçant"
      />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
