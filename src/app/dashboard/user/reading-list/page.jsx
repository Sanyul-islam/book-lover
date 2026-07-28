"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Skeleton } from "@heroui/react";
import { BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import getDeliveries from "@/data/getDeliveries";

export default function ReadingListPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [readingList, setReadingList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading || !session?.user?.id) return;

    let ignore = false;

    async function fetchReadingList() {
      try {
        const data = await getDeliveries(session.user.id);
        const delivered = Array.isArray(data)
          ? data.filter((d) => d.status === "Delivered")
          : [];
        if (!ignore) setReadingList(delivered);
      } catch (error) {
        console.error(error);
        if (!ignore) toast.error("Failed to load your reading list.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchReadingList();

    return () => {
      ignore = true;
    };
  }, [sessionLoading, session]);

  if (sessionLoading || loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-9 w-56 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Reading List</h1>

      {readingList.length === 0 ? (
        <p className="text-default-500">
          Books you&apos;ve received will show up here once delivered.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {readingList.map((item) => (
            <NextLink
              key={item._id}
              href={item.bookId ? `/books/${item.bookId}` : "#"}
              className="group"
            >
              <div className="relative h-56 rounded-xl overflow-hidden shadow-sm">
                {item.bookImage ? (
                  <Image
                    src={item.bookImage}
                    alt={item.bookTitle}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width:768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="h-full w-full bg-default-100 flex items-center justify-center">
                    <BookOpen className="text-default-300" size={32} />
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-medium line-clamp-1">
                {item.bookTitle}
              </p>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}
