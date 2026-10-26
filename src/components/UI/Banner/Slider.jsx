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
import { motion } from "motion/react";

const books = await getBooks();

export default function HomeBannerSwiper() {
  return (
    <>
      <section className="min-h-screen flex items-center justify-center relative isolate overflow-hidden bg-[url('/hero-bg.jpg')] bg-cover bg-center py-12 sm:py-16 lg:py-10">
        {/* Background overlay */}
        <div className="absolute inset-0 -z-10 bg-black/60" />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 md:gap-12 lg:grid-cols-2 lg:gap-16 lg:px-8">
          {/* Left Content */}
          <div className="relative z-10 space-y-5 text-center sm:space-y-6 lg:text-left">
            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Discover Your
              <span className="text-primary"> Next Favorite </span>
              Book
            </h1>

            <p className="mx-auto max-w-xl text-base leading-7 text-white/90 sm:text-lg sm:leading-8 lg:mx-0">
              Explore thousands of books from passionate readers and librarians.
              Borrow, read, review and build your personal reading journey.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/books">
                  <Button color="primary" radius="full" size="lg">
                    Browse Books
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  color="primary"
                  variant="tertiary"
                  radius="full"
                  size="lg"
                  onPress={() => {
                    document
                      .getElementById("categories")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Right Swiper */}
          <div className="relative z-10 flex w-full min-w-0 justify-center pt-2 lg:pt-0">
            <Swiper
              effect="cards"
              grabCursor
              loop={books.length > 1}
              pagination={{
                dynamicBullets: true,
                clickable: true,
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              modules={[EffectCards, Navigation, Pagination, Autoplay]}
              className="hero-book-swiper mx-auto! w-[min(78vw,280px)]! overflow-visible! pb-12! xs:!w-[300px] sm:w-[320px]! md:w-85!"
            >
              {books.slice(0, 10).map((book) => (
                <SwiperSlide
                  key={book._id}
                  className="h-92.5! overflow-hidden! rounded-3xl! bg-content1 shadow-2xl sm:h-105! md:h-112.5!"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 78vw, (max-width: 1024px) 340px, 40vw"
                      className="object-cover"
                    />

                    {/* Image overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/25 to-transparent" />

                    {/* Book Details */}
                    <div className="absolute inset-x-0 bottom-0 space-y-2 p-4 text-white sm:space-y-3 sm:p-6">
                      <Chip variant="flat" color="accent" size="sm">
                        {book.category}
                      </Chip>

                      <h2 className="line-clamp-2 text-xl font-bold sm:text-2xl">
                        {book.title}
                      </h2>

                      <p className="line-clamp-1 text-sm text-white/80 sm:text-base">
                        {book.author}
                      </p>

                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="w-fit"
                      >
                        <Link href={`/books/${book._id}`}>
                          <Button color="primary" radius="full" size="sm">
                            Read Details
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <Separator className="h-1 border-default-200 font-bold" />
    </>
  );
}
