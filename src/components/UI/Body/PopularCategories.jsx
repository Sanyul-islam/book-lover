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
import CategoryRow from "./CategoryRow";

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
      <CategoryRow items={categories} />
      <CategoryRow items={categories} reverse />
    </section>
  );
}
