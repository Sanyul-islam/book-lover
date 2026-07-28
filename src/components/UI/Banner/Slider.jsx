"use client";

import Image from "next/image";
import { Button, Chip, Separator } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/navigation";
import "swiper/css/pagination";
import getBooks from "@/data/getBooks";
import Link from "next/link";

const books = await getBooks();

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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  <Link href={`/books/${book._id}`}>
                    <Button color="primary" radius="full" size="sm">
                      Read Details
                    </Button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Separator className="mt-5 border-default-200" />
    </section>
  );
}
