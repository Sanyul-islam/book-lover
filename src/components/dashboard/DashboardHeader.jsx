"use client";

import { Skeleton } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import ProfileMenu from "./ProfileMenu";

export default function DashboardHeader({ title, subtitle }) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="hidden md:flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-default-500">{subtitle}</p>}
      </div>

      {isPending ? (
        <Skeleton className="h-10 w-40 rounded-full" />
      ) : (
        <ProfileMenu user={session?.user} />
      )}
    </div>
  );
}
