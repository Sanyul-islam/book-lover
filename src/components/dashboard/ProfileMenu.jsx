"use client";

import { useRouter } from "next/navigation";
import { Avatar, Dropdown } from "@heroui/react";
import { ChevronDown, UserRound, Settings, LogOut, Home } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfileMenu({ user }) {
  const router = useRouter();

  const name = user?.name || "User";
  const email = user?.email;
  const role = user?.role || "Admin";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button
          type="button"
          aria-label="Open profile menu"
          className="flex shrink-0 items-center gap-2.5 rounded-full border border-default-200 bg-background py-1 pl-1 pr-3 transition hover:bg-default-100"
        >
          <Avatar size="sm">
            <Avatar.Image src={user?.image || undefined} alt={name} />
            <Avatar.Fallback>{name.charAt(0).toUpperCase()}</Avatar.Fallback>
          </Avatar>

          <div className="hidden text-left leading-tight sm:block">
            <p className="max-w-32 truncate text-sm font-semibold">{name}</p>
            <p className="text-xs capitalize text-default-500">{role}</p>
          </div>

          <ChevronDown size={16} className="hidden text-default-500 sm:block" />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Popover>
        <div className="border-b border-default-200 px-4 py-3">
          <p className="truncate text-sm font-semibold">{name}</p>
          {email && (
            <p className="truncate text-xs text-default-500">{email}</p>
          )}
        </div>

        <Dropdown.Menu aria-label="Profile menu">
          <Dropdown.Item
            id="home"
            textValue="Home"
            onAction={() => router.push("/")}
          > <Home size={16} />
            Home
          </Dropdown.Item>
          {/* <Dropdown.Item
            id="profile"
            textValue="My Profile"
            onAction={() => router.push("/dashboard/profile")}
          >
            <UserRound size={16} />
            My Profile
          </Dropdown.Item>

          <Dropdown.Item
            id="settings"
            textValue="Settings"
            onAction={() => router.push("/dashboard/settings")}
          >
            <Settings size={16} />
            Settings
          </Dropdown.Item> */}

          <Dropdown.Item
            id="logout"
            textValue="Logout"
            onAction={handleLogout}
            className="text-danger"
          >
            <LogOut size={16} />
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
