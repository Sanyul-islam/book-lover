"use client";

import Link from "next/link";
import { Button, Card } from "@heroui/react";
import { BookOpen, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-default-50 to-primary-50 dark:from-background dark:via-default-100 dark:to-default-50 px-4">
      <Card className="max-w-xl w-full p-10 text-center shadow-2xl border border-default-200 rounded-3xl">
        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
          <SearchX size={52} strokeWidth={1.8} />
        </div>

        {/* 404 */}
        <h1 className="mt-2 text-7xl md:text-8xl font-extrabold text-primary">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl font-bold">Oops! Page Not Found</h2>

        {/* Message */}
        <p className="mt-4 text-default-500 leading-7">
          Looks like the page you&apos;re looking for has been moved, deleted,
          or never existed.
        </p>

        <p className="mt-2 text-default-500">
          Let&apos;s get you back to discovering amazing books.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button color="primary" size="lg">
              <Home size={18} /> Back to Home
            </Button>
          </Link>

          <Link href="/browse-books">
            <Button variant="tertiary" size="lg">
              <BookOpen size={18} /> Browse Books
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-default-400">
          Book Lover • Your next favorite book is waiting for you.
        </p>
      </Card>
    </section>
  );
}
