"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Library,
  Receipt,
  User,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const MENU_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Approval Queue",
    href: "/dashboard/admin/approval-queue",
    icon: ClipboardCheck,
  },
  { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: Users },
  {
    label: "Manage All Books",
    href: "/dashboard/admin/manage-books",
    icon: Library,
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: Receipt,
  },
];

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isPending && !session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Mobile toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden inline-flex items-center gap-2 text-sm font-medium text-default-600 border border-default-200 rounded-md px-3 py-2 self-start"
      >
        {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        Menu
      </button>

      {/* Sidebar */}
      <aside
        className={`md:w-64 shrink-0 ${isSidebarOpen ? "block" : "hidden"} md:block`}
      >
        <div className="rounded-2xl border border-default-200 p-5 sticky top-24">
          {/* Profile */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-default-100">
            {session?.user?.image ? (
              <div className="relative h-11 w-11 rounded-full overflow-hidden shrink-0">
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-11 w-11 rounded-full bg-default-100 flex items-center justify-center shrink-0">
                <User size={18} className="text-default-400" />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-sm line-clamp-1">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-xs text-default-500 line-clamp-1">
                {session?.user?.email}
              </p>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-default-600 hover:bg-default-100 hover:text-primary"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </NextLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
