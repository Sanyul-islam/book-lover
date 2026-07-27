export async function getBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch books");
  }

  return res.json();
}

export async function getBook(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch book");
  }

  return res.json();
}

export async function getBookReviews(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/books/${id}/reviews`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return [];
  }

  return res.json();
}