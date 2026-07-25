"use client";

import { Card, Avatar, Chip } from "@heroui/react";
import { Trophy } from "lucide-react";
import Image from "next/image";

const librarians = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=32",
    completed: 148,
  },
  {
    id: 2,
    name: "Michael Brown",
    avatar: "https://i.pravatar.cc/150?img=12",
    completed: 132,
  },
  {
    id: 3,
    name: "Emily Wilson",
    avatar: "https://i.pravatar.cc/150?img=24",
    completed: 119,
  },
];

export default function TopLibrarians() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Heading */}
      <div className="text-center mb-8">
        <Chip color="primary" variant="flat" radius="full">
          <Trophy size={14} /> Top Providers
        </Chip>

        <h2 className="text-3xl font-bold mt-3">Top Librarians</h2>

        <p className="text-default-500 mt-2">
          Meet our most trusted librarians.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-4">
        {librarians.map((librarian) => (
          <Card
            key={librarian.id}
            className="w-56 rounded-xl border border-default-200 shadow-xl hover:shadow-md transition-all duration-300"
          >
            <Image
              src={librarian.avatar}
              alt={librarian.name}
              width={224}
              height={224}
              className="w-full h-56 object-cover rounded-md"
            />
            <Card.Content className="flex flex-col items-center gap-3 p-5">
              <div className="text-center">
                <h3 className="text-base font-semibold">{librarian.name}</h3>

                <p className="text-xs text-default-500">Senior Librarian</p>
              </div>

              <Chip size="sm" color="success" variant="flat" radius="full">
                {librarian.completed} Deliveries
              </Chip>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
