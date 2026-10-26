"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  Users,
  Library,
  Receipt,
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
  {
    label: "Manage Users",
    href: "/dashboard/admin/manage-users",
    icon: Users,
  },
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

  // Redirect users who are not authenticated.
  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Prevent protected content from rendering before authentication is checked.
  if (isPending || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <p className="text-sm text-default-500">Checking authentication...</p>
      </div>
    );
  }

  // Close the mobile menu when a navigation link is clicked.
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-default-200 bg-background px-4 py-3 md:hidden">
        <NextLink href="/" aria-label="Go to homepage">
          <Image
            src="/navbar-logo.png"
            alt="Book Lover"
            width={140}
            height={50}
            priority
            className="h-auto w-auto max-w-35"
          />
        </NextLink>

        <button
          type="button"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={isSidebarOpen}
          aria-controls="admin-sidebar"
          className="inline-flex items-center justify-center rounded-lg border border-default-200 p-2 text-default-600 transition hover:bg-default-100"
        >
          {isSidebarOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Fixed sidebar */}
      <aside
        id="admin-sidebar"
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh w-72 max-w-[85vw] flex-col
          overflow-y-auto border-r border-default-200
          bg-background p-4
          transition-transform duration-200 ease-in-out
          md:w-64 md:max-w-none
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Desktop logo */}
        <div className="mb-8 hidden px-2 pt-2 md:block">
          <NextLink href="/" aria-label="Go to homepage">
            <Image
              src="/navbar-logo.png"
              alt="Book Lover"
              width={170}
              height={65}
              priority
              className="h-auto w-auto max-w-full"
            />
          </NextLink>
        </div>

        {/* Mobile sidebar heading */}
        <div className="mb-6 flex items-center justify-between md:hidden">
          <span className="text-lg font-semibold">Admin Dashboard</span>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close menu"
            className="rounded-lg p-2 text-default-600 transition hover:bg-default-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Admin navigation" className="flex-1 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                aria-current={isActive ? "page" : undefined}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-3
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-default-600 hover:bg-default-100 hover:text-primary"
                  }
                `}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </NextLink>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="min-w-0 p-4 sm:p-6 md:ml-64 md:p-8">{children}</main>
    </div>
  );
}
