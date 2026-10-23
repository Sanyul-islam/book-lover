"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Library,
  Truck,
  User,
  Menu,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const MENU_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard/librarian",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Add Book",
    href: "/dashboard/librarian/add-book",
    icon: PlusCircle,
  },
  {
    label: "Manage Inventory",
    href: "/dashboard/librarian/manage-inventory",
    icon: Library,
  },
  {
    label: "Manage Deliveries",
    href: "/dashboard/librarian/manage-deliveries",
    icon: Truck,
  },
];

export default function LibrarianDashboardLayout({ children }) {
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
        <div className="rounded-2xl border border-default-200 p-5 h-[calc(100vh-2rem)] fixed top-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Go to homepage"
              className="flex items-center"
            >
              <Image
                src="/navbar-logo.png"
                alt="Book Lover"
                width={180}
                height={80}
                className="h-auto w-auto mt-2"
                priority
              />
            </Link>
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
