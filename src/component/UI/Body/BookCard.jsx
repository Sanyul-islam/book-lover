"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, Button, Chip } from "@heroui/react";

export default function BookCard({ book }) {
  const { _id, title, author, category, image, price, publishedYear } = book;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <Card.Content>
        <div className="relative w-full h-80">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 300px"
          />

          {/* Chips on image top-right */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {category && (
              <Chip size="sm" variant="solid" color="primary">
                {category}
              </Chip>
            )}

            {publishedYear && (
              <Chip size="sm" variant="solid">
                {publishedYear}
              </Chip>
            )}
          </div>
        </div>
      </Card.Content>

      <Card.Header className="px-5 pt-3">
        <Card.Title className="line-clamp-1 text-xl">{title}</Card.Title>

        <Card.Description>By {author}</Card.Description>
      </Card.Header>

      <Card.Content className="px-5">
        {price && <p className="font-bold text-lg">${price}</p>}
      </Card.Content>

      <Card.Footer className="px-5 pb-5">
        <Button
          as={Link}
          href={`/books/${_id}`}
          color="primary"
          className="w-full"
        >
          View Details
        </Button>
      </Card.Footer>
    </Card>
  );
}
