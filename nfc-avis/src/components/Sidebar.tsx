"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Building2, LayoutDashboard, LogOut, MessageSquareText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  Building2,
  LayoutDashboard,
  MessageSquareText,
  Settings,
};

type IconName = keyof typeof icons;

type SidebarItem = {
  href: string;
  label: string;
  icon: IconName;
};

export default function Sidebar({ items, title, subtitle }: { items: SidebarItem[]; title: string; subtitle: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-white p-5 md:block">
      <div className="mb-8">
        <p className="font-display text-lg font-semibold text-ink-900">{title}</p>
        <p className="text-xs text-slate-450">{subtitle}</p>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = icons[item.icon];
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
          return (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm", active ? "bg-ink-900 text-white" : "text-slate-450 hover:bg-black/[0.03] hover:text-ink-900")}>
              <Icon size={17} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <button onClick={() => signOut({ callbackUrl: "/login" })} className="mt-8 flex items-center gap-2 text-sm text-slate-450 hover:text-ink-900">
        <LogOut size={16} /> Déconnexion
      </button>
    </aside>
  );
}
