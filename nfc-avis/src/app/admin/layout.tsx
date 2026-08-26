import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { Building2, LayoutDashboard } from "lucide-react";

const items = [
  { href: "/admin", label: "Commerces", icon: Building2 },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return (
    <div className="flex min-h-[100dvh] bg-paper-200">
      <Sidebar items={items} title="Administration" subtitle="Tous les commerces" />
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 sm:py-10">{children}</div>
      </div>
    </div>
  );
}
