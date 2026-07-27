"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Chip,
  Input,
  InputGroup,
  Label,
  Link,
  ListBox,
  Select,
  Skeleton,
  TextField,
} from "@heroui/react";

import Image from "next/image";
import NextLink from "next/link";
import { BookOpen, Search } from "lucide-react";

const categories = [
  "All",
  "Fiction",
  "Technology",
  "History",
  "Science",
  "Self Development",
  "Finance",
  "Fantasy",
];

const sortOptions = [
  { key: "default", label: "Default" },
  { key: "low", label: "Delivery Fee Low" },
  { key: "high", label: "Delivery Fee High" },
  { key: "title", label: "Title A-Z" },
];

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [sort, setSort] = useState("default");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`);

        const data = await res.json();

        setBooks(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  const filteredBooks = books
    .filter((book) => {
      const searchMatch = book.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch = category === "All" || book.category === category;

      return searchMatch && categoryMatch;
    })
    .sort((a, b) => {
      if (sort === "low") {
        return a.deliveryFee - b.deliveryFee;
      }

      if (sort === "high") {
        return b.deliveryFee - a.deliveryFee;
      }

      if (sort === "title") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}

      <div className="text-center mb-10">
        <Chip variant="soft" color="accent" className="mb-4">
          <BookOpen size={16} />
          <Chip.Label>Browse Books</Chip.Label>
        </Chip>

        <h1 className="text-4xl font-bold">Explore Our Book Collection</h1>

        <p className="text-default-500 mt-3">
          Search, filter and discover your next favorite book.
        </p>
      </div>

      {/* Filters */}

      <div className="grid md:grid-cols-3 gap-5 mb-10">
        <TextField>
          <Label>Search</Label>
          <InputGroup>
            <InputGroup.Prefix>
              <Search size={16} className="text-muted" />
            </InputGroup.Prefix>
            <InputGroup.Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </TextField>

        <Select
          className="w-full"
          placeholder="Category"
          value={category}
          onChange={(value) => setCategory(value)}
        >
          <Label>Category</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {categories.map((item) => (
                <ListBox.Item key={item} id={item} textValue={item}>
                  {item}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="w-full"
          placeholder="Sort"
          value={sort}
          onChange={(value) => setSort(value)}
        >
          <Label>Sort</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {sortOptions.map((item) => (
                <ListBox.Item
                  key={item.key}
                  id={item.key}
                  textValue={item.label}
                >
                  {item.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {/* Skeleton */}

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-72 rounded-xl" />

              <div className="p-4 space-y-3">
                <Skeleton className="h-5 rounded-lg" />

                <Skeleton className="h-4 rounded-lg" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}

      {!loading && filteredBooks.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">No books found</h2>

          <p className="text-default-500 mt-2">
            Try changing your search or filters.
          </p>
        </div>
      )}

      {/* Books */}

      {!loading && filteredBooks.length > 0 && (
        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
          "
        >
          {filteredBooks.map((book) => (
            <Card
              key={book._id}
              className="
                    overflow-hidden
                    hover:shadow-xl
                    transition-all
                  "
            >
              <Card.Header className="relative h-72 p-0">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 50vw, 25vw"
                />

                {!book.available && (
                  <Chip
                    color="danger"
                    variant="primary"
                    className="absolute top-3 right-3"
                  >
                    <Chip.Label>Unavailable</Chip.Label>
                  </Chip>
                )}
              </Card.Header>

              <Card.Content className="p-4">
                <h2 className="font-bold line-clamp-1">{book.title}</h2>

                <p className="text-sm text-default-500">{book.category}</p>

                <p className="font-semibold mt-3">
                  Delivery Fee: ${book.deliveryFee}
                </p>
              </Card.Content>

              <Card.Footer className="p-4 pt-0">
                <Link
                 href={`/books/${book._id}`}
                  className="button button--primary w-full justify-center"
                >
                  View Details
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
