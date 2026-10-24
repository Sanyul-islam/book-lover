"use client";

import Link from "next/link";
import { Card } from "@heroui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function CategoryRow({ items, reverse = false }) {
  // Duplicate the list so loop mode always has enough slides to fill the screen
  const slides = [...items, ...items];

  return (
    <Swiper
      modules={[Autoplay]}
      loop
      slidesPerView="auto"
      spaceBetween={20}
      speed={5000}
      allowTouchMove={false}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        reverseDirection: reverse,
      }}
      className="category-swiper my-5"
    >
      {slides.map((category, i) => (
        <SwiperSlide key={`${category.name}-${i}`} className="w-44!">
          <Link href={`/books?category=${encodeURIComponent(category.name)}`}>
            <Card className="cursor-pointer rounded-2xl border border-default-200 transition-all duration-300 hover:border-primary hover:shadow-lg">
              <Card.Content className="flex flex-col items-center justify-center gap-3 py-8">
                <div className="text-primary">{category.icon}</div>
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </Card.Content>
            </Card>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
