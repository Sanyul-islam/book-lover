"use client";

import { Card, Chip, Avatar } from "@heroui/react";
import { MessageCircleHeart, Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Ahmed",
    role: "Book Lover",
    image: "https://i.pravatar.cc/150?img=32",
    review:
      "Amazing collection! I found many books that I love. The quality and service are excellent.",
  },
  {
    name: "David Smith",
    role: "Regular Reader",
    image: "https://i.pravatar.cc/150?img=12",
    review:
      "Fast delivery and excellent service. This is my favorite place to buy books.",
  },
  {
    name: "Nadia Karim",
    role: "Book Enthusiast",
    image: "https://i.pravatar.cc/150?img=24",
    review:
      "The best place for book lovers. Great collection and smooth experience.",
  },
  {
    name: "Arif Hasan",
    role: "Story Explorer",
    image: "https://i.pravatar.cc/150?img=15",
    review:
      "I love the variety of books available here. Every visit helps me discover something new.",
  },
  {
    name: "Emily Wilson",
    role: "Avid Reader",
    image: "https://i.pravatar.cc/150?img=47",
    review:
      "Beautiful platform for readers. Easy browsing, great recommendations, and amazing service.",
  },
];

export default function Reviews() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <Chip
          className="rounded-full px-4 py-2 font-semibold text-sm mb-4"
          color="primary"
          variant="flat"
        >
          <div className="flex items-center gap-2">
            <MessageCircleHeart size={16} />
            Reviews
          </div>
        </Chip>

        <h2 className="text-3xl md:text-4xl font-bold">What Readers Say</h2>

        <p className="text-default-500 mt-3 max-w-xl mx-auto">
          See what our community of readers thinks about their experience.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((item) => (
          <Card
            key={item.name}
            className="p-6 border border-default-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* User */}
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-default-200">
              <Avatar>
                <Avatar.Image
                  src={item.image}
                  name={item.name}
                  size="lg"
                  className="ring-2 ring-primary/20"
                />
              </Avatar>

              <div>
                <h3 className="font-semibold text-base">{item.name}</h3>

                <p className="text-sm text-default-500">{item.role}</p>
              </div>
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  className="fill-warning text-warning"
                />
              ))}
            </div>

            {/* Review */}
            <p className="text-default-600 leading-7 italic flex-1">
              &quot;{item.review}&quot;
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
