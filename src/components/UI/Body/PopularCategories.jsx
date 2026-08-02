"use client";

import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import {
  BookOpen,
  Atom,
  GraduationCap,
  Heart,
  Landmark,
  Globe,
  Sparkles,
  ScrollText,
  Library,
} from "lucide-react";
import { motion } from "motion/react";

const categories = [
  {
    name: "Fiction",
    icon: <BookOpen size={28} />,
    color: "primary",
  },
  {
    name: "Sci-Fi",
    icon: <Atom size={28} />,
    color: "secondary",
  },
  {
    name: "Academic",
    icon: <GraduationCap size={28} />,
    color: "success",
  },
  {
    name: "Romance",
    icon: <Heart size={28} />,
    color: "danger",
  },
  {
    name: "History",
    icon: <Landmark size={28} />,
    color: "warning",
  },
  {
    name: "Biography",
    icon: <ScrollText size={28} />,
    color: "primary",
  },
  {
    name: "Travel",
    icon: <Globe size={28} />,
    color: "success",
  },
  {
    name: "Fantasy",
    icon: <Sparkles size={28} />,
    color: "secondary",
  },
];

export default function PopularCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Heading */}
      <div className="text-center mb-10">
        <Chip
          className="rounded-full px-4 py-2 font-semibold text-sm"
          color="primary"
          variant="flat"
        >
          <Library size={20} />
          <h2>Categories</h2>
        </Chip>

        <h2 className="text-3xl md:text-4xl font-bold mt-4">
          Popular Categories
        </h2>

        <p className="text-default-500 mt-2">
          Explore books from your favorite genres.
        </p>
      </div>

      {/* Categories */}
      <div className="relative overflow-hidden m-5">
        <motion.div
          className="flex w-max gap-6"
          animate={{
            x: ["250%", "-100%"],
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.slice(0,4).map((category) => (
            <Link
              key={category.name}
              href={`/books?category=${encodeURIComponent(category.name)}`}
            >
              <Card className="cursor-pointer rounded-2xl border border-default-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                <Card.Content className="flex flex-col items-center justify-center gap-3 py-8">
                  <div className="text-primary">{category.icon}</div>

                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </Card.Content>
              </Card>
            </Link>
          ))}
      </div>
      </motion.div>
      </div>

      {/* right */}
      <div className="relative overflow-hidden m-5">
        <motion.div
          className="flex w-max gap-6"
          animate={{
            x: ["-100%", "235%"],
          }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.slice(4,8).map((category) => (
            <Link
              key={category.name}
              href={`/books?category=${encodeURIComponent(category.name)}`}
            >
              <Card className="cursor-pointer rounded-2xl border border-default-200 hover:border-primary hover:shadow-lg transition-all duration-300">
                <Card.Content className="flex flex-col items-center justify-center gap-3 py-8">
                  <div className="text-primary">{category.icon}</div>

                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </Card.Content>
              </Card>
            </Link>
          ))}
      </div>
      </motion.div>
      </div>
    </section>
  );
}
