import {getBooks} from "@/lib/server";
import BookCard from "./BookCard";
import { Chip } from "@heroui/react";
import { Sparkles } from "lucide-react";

export default async function FeaturedBooks() {
  const books = await getBooks();

  const featuredBooks = books.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <Chip
          className="rounded-full px-4 py-2 font-semibold text-sm mb-4"
          color="primary"
          variant="flat"
        >
        <Sparkles size={20} />
          <h2>Featured</h2>
        </Chip>
        <h2 className="text-3xl font-bold">Featured Books</h2>
        <p className="text-default-500 mt-2">
          Explore our latest collection of books.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {featuredBooks.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
}
