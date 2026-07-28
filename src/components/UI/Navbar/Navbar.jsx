"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dropdown, Avatar, Label, Button } from "@heroui/react";
import { BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";

export default function NavbarComponent() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const role = session?.user?.role || "user";

  const dashboardHref =
    role === "librarian"
      ? "/dashboard/librarian"
      : role === "admin"
        ? "/dashboard/admin"
        : "/dashboard/user";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Books", href: "/books" },
  ];

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed.");
      console.error(error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-default-200 bg-background/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="items-center gap-8 hidden md:flex">
            <Link href="/" className="flex items-center h-auto w-auto gap-2">
              <Image
                className="text-primary h-auto w-auto mt-2"
                width={180}
                height={80}
                src="/navbar-logo.png"
                alt="Book Lover Logo"
              />
            </Link>
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-default-600 hover:bg-default-100 md:hidden focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition text-sm font-medium ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-default-600 hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {session && (
                <Link
                  href={dashboardHref}
                  className={`transition text-sm font-medium ${
                    pathname.startsWith("/dashboard")
                      ? "text-primary font-semibold"
                      : "text-default-600 hover:text-primary"
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-8 md:hidden">
            <Link href="/" className="flex items-center gap-2">
              <Image
                className="text-primary h-auto w-auto mt-2.5"
                width={180}
                height={80}
                src="/navbar-logo.png"
                alt="Book Lover Logo"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitch />
            {!session ? (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            ) : (
              <Dropdown>
                <Dropdown.Trigger asChild>
                  <span
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer focus:outline-none"
                  >
                    <Avatar className="ring-2 ring-blue-500 hover:opacity-80 transition-all">
                      <Avatar.Image
                        size="sm"
                        alt={session.user.name}
                        src={session.user.image}
                      />
                      <Avatar.Fallback>
                        {session.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </Avatar.Fallback>
                    </Avatar>
                  </span>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                  <Dropdown.Menu
                    onAction={(key) =>
                      key === "logout" ? handleLogout() : router.push(key)
                    }
                    aria-label="User Actions"
                  >
                    <Dropdown.Item
                      key="dashboard"
                      id={dashboardHref}
                      textValue="Dashboard"
                    >
                      <Label className="font-medium cursor-pointer">
                        {session.user.name}
                      </Label>
                    </Dropdown.Item>
                    <Dropdown.Item
                      key="logout"
                      id="logout"
                      textValue="Logout"
                      variant="danger"
                    >
                      <Label className="text-danger cursor-pointer">
                        Logout
                      </Label>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-default-200 bg-background px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-default-600 hover:bg-default-50 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {session && (
            <Link
              href={dashboardHref}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname.startsWith("/dashboard")
                  ? "bg-primary/10 text-primary"
                  : "text-default-600 hover:bg-default-50 hover:text-primary"
              }`}
            >
              Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-default-100">
            {!session ? (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full rounded-md bg-danger/10 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/20 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
