"use client";

import Image from "next/image";
import { Button, Chip } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "swiper/css/pagination";

const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800",
    category: "Self Growth",
  },
  {
    id: 2,
    title: "The Silent Library",
    author: "Emma Watson",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
    category: "Fantasy",
  },
  {
    id: 3,
    title: "The Alchemist",
    author: "Paulo Coelho",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800",
    category: "Adventure",
  },
  {
    id: 4,
    title: "Think Like a Monk",
    author: "Jay Shetty",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    category: "Motivation",
  },
  {
    id: 5,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800",
    category: "Finance",
  },
  {
    id: 6,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800",
    category: "Business",
  },
  {
    id: 7,
    title: "Harry Potter",
    author: "J. K. Rowling",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800",
    category: "Fantasy",
  },
  {
    id: 8,
    title: "Deep Work",
    author: "Cal Newport",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800",
    category: "Productivity",
  },
  {
    id: 9,
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800",
    category: "Adventure",
  },
  {
    id: 10,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800",
    category: "Classic",
  },
];

export default function HomeBannerSwiper() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}

        <div className="space-y-6">
          <h1 className="text-5xl lg:text-6xl font-black leading-tight">
            Discover Your
            <span className="text-primary"> Next Favorite </span>
            Book
          </h1>

          <p className="text-default-500 text-lg leading-8">
            Explore thousands of books from passionate readers and librarians.
            Borrow, read, review and build your personal reading journey.
          </p>

          <div className="flex gap-4">
            <Button color="primary" size="lg">
              Browse Books
            </Button>

            <Button variant="tertiary" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Right Swiper */}

        <Swiper
          effect="cards"
          grabCursor
          
          pagination={{
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[EffectCards, Navigation, Pagination, Autoplay]}
          className="w-[320px] h-117.5"
        >
          {books.map((book) => (
            <SwiperSlide
              key={book.id}
              className="rounded-3xl overflow-hidden bg-content1 shadow-2xl"
            >
              <div className="relative w-full h-full">
                <Image
                  src={book.image}
                  alt={book.title}
                  size="100%"
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 p-6 text-white space-y-3">
                  <Chip variant="flat" color="accent" size="sm">
                    {book.category}
                  </Chip>

                  <h2 className="text-2xl font-bold">{book.title}</h2>

                  <p className="text-white/80">{book.author}</p>

                  <Button color="primary" radius="full" size="sm">
                    Read Details
                  </Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
