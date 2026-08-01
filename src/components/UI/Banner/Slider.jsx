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
      <section className="relative py-20 bg-[url('/hero-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}

          <div className="space-y-6  z-10">
            <h1 className="text-5xl lg:text-6xl text-white font-black leading-tight">
              Discover Your
              <span className="text-primary"> Next Favorite </span>
              Book
            </h1>

            <p className="text-white text-lg leading-8">
              Explore thousands of books from passionate readers and librarians.
              Borrow, read, review and build your personal reading journey.
            </p>

            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
                <Link href="/books">
                  <Button color="primary" radius="full" size="lg">
                    Browse Books
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                variant="tertiary"
                size="lg"
              >
               <Button color="primary" variant="tertiary" radius="full" size="lg">
                  Learn More
                </Button>
              </motion.div>
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
            {books.slice(0,10).map((book) => (
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
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
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
      </section>
      <Separator className="font-bold h-1 border-default-200" />
    </>
  );
}
